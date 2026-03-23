const admin = require("firebase-admin");
const path = require("path");
const fs = require("fs");

// Try to find serviceAccountKey.json in multiple ways:
// 1) Env var SERVICE_ACCOUNT_PATH
// 2) Default relative path from this file: ../../../backend/serviceAccountKey.json
// 3) A common absolute path on your machine (Windows example you provided)
const envPath = process.env.SERVICE_ACCOUNT_PATH;
const relativeDefault = path.resolve(__dirname, "..", "..", "..", "backend", "serviceAccountKey.json");
const windowsDefault = "D:\\hutech-safety-ai\\backend\\serviceAccountKey.json";

let serviceAccountPath = envPath || relativeDefault;
if (!fs.existsSync(serviceAccountPath) && fs.existsSync(windowsDefault)) {
  serviceAccountPath = windowsDefault;
}

if (!fs.existsSync(serviceAccountPath)) {
  console.error("❌ serviceAccountKey.json not found.");
  console.error("Tried:", serviceAccountPath);
  console.error("You can set SERVICE_ACCOUNT_PATH env var to the correct path.");
  process.exit(1);
}

const serviceAccount = require(serviceAccountPath);

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
});

if (process.argv.length < 3) {
  console.error("Usage: node frontend/src/tools/setAdminClaim.js <UID> [true|false]");
  console.error("Example: node frontend/src/tools/setAdminClaim.js abc123 true");
  process.exit(1);
}

const uid = process.argv[2];
const makeAdmin = process.argv[3] !== "false"; // default true

async function run() {
  try {
    await admin.auth().setCustomUserClaims(uid, { admin: makeAdmin });
    console.log(`✅ Set admin=${makeAdmin} for uid=${uid}`);

    // Optional: print current custom claims for confirmation
    const userRecord = await admin.auth().getUser(uid);
    console.log("customClaims:", userRecord.customClaims || {});

    process.exit(0);
  } catch (err) {
    console.error("❌ Error setting custom claim:", err);
    process.exit(1);
  }
}

run();