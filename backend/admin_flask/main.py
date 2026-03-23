from flask import Flask, request, jsonify
from flask_cors import CORS
from firebase_admin_setup import auth, db, bucket
from datetime import datetime

app = Flask(__name__)
CORS(app)

@app.route("/api/list-users", methods=["GET"])
def list_users():
    try:
        users = []
        docs = db.collection("users").stream()
        for doc in docs:
            data = doc.to_dict()
            users.append({
                "uid": doc.id,
                "email": data.get("email"),
                "role": data.get("role", "user")
            })
        return jsonify({"users": users})
    except Exception as e:
        return jsonify({"error": str(e)}), 500



@app.route("/api/create-user", methods=["POST"])
def create_user():
    data = request.json
    email = data.get("email")
    password = data.get("password")
    role = data.get("role", "user")

    if not email or not password:
        return jsonify({"error": "Missing required fields"}), 400

    try:
        # Tạo user trong Firebase Auth
        user_record = auth.create_user(email=email, password=password)
        uid = user_record.uid
        auth.set_custom_user_claims(uid, {"admin": role == "admin"})

        # Tạo folder trong Storage
        blob = bucket.blob(f"users/{uid}/placeholder.txt")
        blob.upload_from_string("This folder is for user data.")

        # Tạo document Firestore với timestamp ngay lập tức
        db.collection("users").document(uid).set({
            "email": email,
            "role": role,
            "createdAt": datetime.utcnow()  # 🔹 Thời điểm tạo user
        })

        return jsonify({"success": True, "uid": uid})

    except Exception as e:
        return jsonify({"error": str(e)}), 500

@app.route("/api/update-role", methods=["POST"])
def update_role():
    data = request.json
    uid = data.get("uid")
    new_role = data.get("role")
    if not uid or not new_role:
        return jsonify({"error": "Missing uid or role"}), 400
    try:
        auth.set_custom_user_claims(uid, {"admin": new_role=="admin"})
        db.collection("users").document(uid).update({"role": new_role})
        return jsonify({"success": True})
    except Exception as e:
        return jsonify({"error": str(e)}), 500

@app.route("/api/delete-user", methods=["POST"])
def delete_user():
    data = request.json
    uid = data.get("uid")
    if not uid:
        return jsonify({"error": "Missing uid"}), 400
    try:
        auth.delete_user(uid)
        db.collection("users").document(uid).delete()
        blobs = bucket.list_blobs(prefix=f"users/{uid}/")
        for b in blobs: b.delete()
        return jsonify({"success": True})
    except Exception as e:
        return jsonify({"error": str(e)}), 500

if __name__ == "__main__":
    app.run(port=5000, debug=True)
