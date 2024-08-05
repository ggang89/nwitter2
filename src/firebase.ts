
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyBmvXU-8PkSfpbG7zVSMsrO_GSBWO32u-Y",
  authDomain: "nwitter2-fc631.firebaseapp.com",
  projectId: "nwitter2-fc631",
  storageBucket: "nwitter2-fc631.appspot.com",
  messagingSenderId: "647021443845",
  appId: "1:647021443845:web:c13bc15906bc63427c556c",
};

// 1.Initialize Firebase=> config 옵션을 통해서 app을 생성하고
const app = initializeApp(firebaseConfig);


//2. Authentication 활성화=>app에 대한 인증서비스를 사용
export const auth = getAuth(app);