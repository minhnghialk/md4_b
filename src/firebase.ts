import { initializeApp } from "firebase/app";
import { getStorage } from "firebase/storage";
import {ref, uploadBytes, getDownloadURL } from "firebase/storage";

/* Your Config */
const firebaseConfig = {
  apiKey: "AIzaSyDX6LALIjUJ5RGx72VqdR-i5goBDvKLwkU",
  authDomain: "md4db-4a2f8.firebaseapp.com",
  projectId: "md4db-4a2f8",
  storageBucket: "md4db-4a2f8.appspot.com",
  messagingSenderId: "148022728274",
  appId: "1:148022728274:web:bc17019c2bc977da67b18b",
  measurementId: "G-GYHNL68L40"
};
/* End Config */

const app = initializeApp(firebaseConfig);
export const storage = getStorage(app);


export async function uploadFileToStorage(file: any, folderName: any, bufferData: any) {
  // nếu file là null thì không làm gì hết
  if (!file) {
    return false
  }

  let fileRef;
  let metadata;
  if (!bufferData) {
    // tên file trên file base
    fileRef = ref(storage, `${folderName}/` + file.name);
  } else {
    // tên file trên file base
    fileRef = ref(storage, `${folderName}/` + (file as any).filename);
    metadata = {
      contentType: (file as any).mimetype,
    };
  }
  let url;
  if (bufferData) {
    // upload file lên fire storage
    url = await uploadBytes(fileRef, bufferData, metadata).then(async res => {
      // khi up thành công thì tìm URL
      return await getDownloadURL(res.ref)
        .then(url => url)
        .catch(er => false)
    })
  } else {
    // upload file lên fire storage
    url = await uploadBytes(fileRef, file).then(async res => {
      // khi up thành công thì tìm URL
      return await getDownloadURL(res.ref)
        .then(url => url)
        .catch(er => false)
    })
  }


  return url
}