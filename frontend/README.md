🚀 HUTECH Safety AI – Firebase Setup Guide (Web + Backend Python)
-----------------------------------------
1️⃣ Tạo Firebase Project
-----------------------------------------
Truy cập: https://console.firebase.google.com/
1. Bấm Add project / Create project
2. Nhập tên: hutech-safety-ai
3. Bấm Continue → chọn Default settings
4. Bấm Create project
-----------------------------------------
2️⃣ Thêm Firebase vào Web App
-----------------------------------------
Trong Firebase Console → Project Settings
Bấm </> Add app (Web)
Firebase sinh ra đoạn code .json đưa vào front end
-----------------------------------------
3️⃣ Tạo Service Account để dùng cho Backend
-----------------------------------------
Vào https://console.cloud.google.com/projectselector2/iam-admin/serviceaccounts?supportedpurview=project
Sau đó chọn service account => chọn project mình muốn làm => Keys => Add keys => create key => Lưu file json đó về back end 

-----------------------------------------
 Câu lệnh chạy front end
-----------------------------------------
cd d:/hutech-safety-ai
npx create-react-app frontend
cd frontend
npm install firebase axios
-----------------------------------------
5️⃣ Câu lệnh chạy back end
-----------------------------------------
cd d:/hutech-safety-ai/backend
python -m venv .venv
.venv\Scripts\activate    
pip install -r requirements.txt
uvicorn app.main:app --reload --host 0.0.0.0 --port 8000