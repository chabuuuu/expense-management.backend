import fs from "fs";
import firebase from "firebase-admin";

const serviceAccount = JSON.parse(
    fs.readFileSync("./google-key.json", "utf8")
  );

const firebaseInstance = firebase.initializeApp({
    credential: firebase.credential.cert(serviceAccount),
  });

export default firebaseInstance;