# admin_flask/firebase_admin_setup.py
import firebase_admin
from firebase_admin import credentials, auth, firestore, storage

cred = credentials.Certificate(r"D:\hutech-safety-ai\backend\admin_flask\serviceAccountKey.json")
firebase_admin.initialize_app(cred, {
    'storageBucket': 'hutech-safety-ai.appspot.com'
})

db = firestore.client()
bucket = storage.bucket() 
