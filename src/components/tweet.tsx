import styled from "styled-components";
import { ITweet } from "./timeLine";
import { auth, db, storage } from "../firebase";
import { deleteDoc, doc, updateDoc } from "firebase/firestore";
import {
  deleteObject,
  getDownloadURL,
  ref,
  uploadBytes,
} from "firebase/storage";
import { Button } from "./tweet-button";
import { useEffect, useState } from "react";
import {
  Form,
  AttachFileButton,
  AttachFileInput,
  TextArea,
  SubmitButton,
  CancelButton,
  DeleteFileButton,
} from "./tweet-components";

const Wrapper = styled.div`
  display: grid;
  grid-template-columns: 3fr 1fr;
  padding: 20px;
  border: 1px solid rgba(255, 255, 255, 0.5);
  border-radius: 15px;
`;
const Column = styled.div``;
const Username = styled.span`
  font-weight: 600;
  font-size: 15px;
`;
const Payload = styled.p`
  margin: 10px 0px;
  font-size: 18px;
`;
const Photo = styled.img`
  width: 100px;
  height: 100px;
  border-radius: 15px;
`;

export default function Tweet({ userName, photo, tweet, userId, id }: ITweet) {
  const user = auth.currentUser;
  const [isEditMode, setEditMode] = useState(false);
  const [isLoading, setLoading] = useState(false);
  const [_tweet, setTweet] = useState("");
  const [file, setFile] = useState<File | null>(null);
  const [photoURL, setPhotoURL] = useState("");
  const [hasPhoto, setHasPhoto] = useState(false);

  useEffect(() => {
    if (photo && photo !== "") {
      setPhotoURL(photo);
      setHasPhoto(true);
    }
    if (tweet && tweet !== "") setTweet(tweet);
  }, [photo, tweet]);

  const onDelete = async () => {
    const ok = confirm("이 트윗을 삭제하시겠습니까?");
    if (!ok || user?.uid !== userId) return;
    try {
      await deleteDoc(doc(db, "tweets", id));
      if (photo) {
        const photoRef = ref(storage, `tweets/${user.uid}/${id}`);
        await deleteObject(photoRef);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };
  const onEditMode = () => {
    setEditMode(true);
  };
  const onCancel = () => {
    setEditMode(false);
  };
  const onChangeTweet = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setTweet(e.target.value);
  };
  const onFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { files } = e.target;
    console.log("files", files);
    console.log("hasPhoto", hasPhoto);
    console.log("file", file);
    if (files && files.length === 1) {
      setFile(files[0]);
      setPhotoURL("");
    }
  };
  const onDeleteFile = () => {
    const ok = confirm("이 트윗의 사진을 삭제하시겠습니까?");
    if (ok) {
      setHasPhoto(false);
      setPhotoURL("");
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
      await updateDoc(doc(db, "tweets", id), {
        tweet: _tweet,
        updateAt: Date.now(),
      });

      // 기존 파일만 삭제하는 경우
      if (photo && !hasPhoto && !file) {
        const photoRef = ref(storage, `tweets/${user.uid}/${id}`);
        await deleteObject(photoRef);
        await updateDoc(doc(db, "tweets", id), {
          photo: null,
        });
        setPhotoURL("");
      }
      // 기본 파일을 삭제하고 새로운 파일을 저장
      if (photo && file) {
        const photoRef = ref(storage, `tweets/${user.uid}/${id}`);
        await deleteObject(photoRef);
        const result = await uploadBytes(photoRef, file);
        const url = await getDownloadURL(result.ref);
        await updateDoc(doc(db, "tweets", id), {
          photo: url,
        });
        setPhotoURL(url);
      }
      // 새로운 파일만 저장
      if (!photo && file) {
        const photoRef = ref(storage, `tweets/${user.uid}/${id}`);
        const result = await uploadBytes(photoRef, file);
        const url = await getDownloadURL(result.ref);
        await updateDoc(doc(db, "tweets", id), {
          photo: url,
        });
        setPhotoURL(url);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
      setEditMode(false);
      setFile(null);
    }
  };

  return (
    <Wrapper>
      <Column>
        <Username>{userName}</Username>
        <Payload>{tweet}</Payload>
        {user?.uid === userId &&
          (!isEditMode ? (
            <>
              <Button className="delete" onClick={onDelete}>
                Delete
              </Button>
              <Button className="edit" onClick={onEditMode}>
                Edit
              </Button>
            </>
          ) : (
            <Form onSubmit={onSubmit}>
              <TextArea
                onChange={onChangeTweet}
                defaultValue={_tweet}
                rows={5}
                maxLength={180}
                required
              />
              <AttachFileButton className="photo" htmlFor={`file${id}`}>
                {file
                  ? "Photo Added✅"
                  : !hasPhoto
                  ? "Add Photo!"
                  : "Change Photo!"}
              </AttachFileButton>
              <AttachFileInput
                onChange={onFileChange}
                type="file"
                id={`file${id}`}
                accept="image/*"
              />
              {hasPhoto ? (
                <DeleteFileButton type="button" onClick={onDeleteFile}>
                  Delete Photo
                </DeleteFileButton>
              ) : null}
              <SubmitButton
                type="submit"
                value={isLoading ? "Reposting..." : "Repost Tweet!"}
              />
              <CancelButton type="button" className="cancel" onClick={onCancel}>
                Cancel
              </CancelButton>
            </Form>
          ))}
      </Column>
      <Column>
        {photoURL && photoURL !== "" ? <Photo src={photoURL} /> : null}
      </Column>
    </Wrapper>
  );
}
