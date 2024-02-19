import { addDoc, collection, updateDoc } from "firebase/firestore";
import React, { useState } from "react";
import { auth, db, storage } from "../firebase";
import { getDownloadURL, ref, uploadBytes } from "firebase/storage";
import {
  AttachFileButton,
  AttachFileInput,
  Form,
  SubmitButton,
  TextArea,
} from "./tweet-components";

export default function PostTweetForm() {
  const [isLoading, setLoading] = useState(false);
  const [tweet, setTweet] = useState("");
  const [file, setFile] = useState<File | null>(null);
  const onChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setTweet(e.target.value);
  };
  const onFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { files } = e.target;
    if (files && files.length === 1) {
      setFile(files[0]);
    }
  };

  const onSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const user = auth.currentUser;
    const fileMaxSize = 1 * 1024 * 1024;
    if (!user || isLoading || tweet === "" || tweet.length > 180) return;

    if (file && file.size > fileMaxSize) {
      alert("업로드 이미지의 용량는 1mb를 초과할 수 없습니다.");
      return;
    }

    try {
      setLoading(true);
      // tweet 저장
      const doc = await addDoc(collection(db, "tweets"), {
        tweet,
        createdAt: Date.now(),
        userName: user.displayName || "Anonymous",
        userId: user.uid,
      });
      console.log("doc", doc);
      //file 저장
      if (file) {
        console.log(file);
        // Returns a StorageReference for the given url.
        const locationRef = ref(storage, `tweets/${user.uid}/${doc.id}`);
        const result = await uploadBytes(locationRef, file);
        const url = await getDownloadURL(result.ref);
        await updateDoc(doc, {
          photo: url,
        });
        setFile(null);
      }
      setTweet("");
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };
  return (
    <Form onSubmit={onSubmit}>
      <TextArea
        required
        rows={5}
        maxLength={180}
        onChange={onChange}
        value={tweet}
        placeholder="무슨 일이 일어나고 있나요?"
      />
      <AttachFileButton htmlFor="file">
        {file ? "Photo Added✅" : "Add Photo"}
      </AttachFileButton>
      <AttachFileInput
        onChange={onFileChange}
        type="file"
        id="file"
        accept="image/*"
      />
      <SubmitButton
        type="submit"
        value={isLoading ? "Posting..." : "Post Tweet!"}
      />
    </Form>
  );
}
