import { collection, onSnapshot, orderBy, query } from "firebase/firestore";
import { useEffect, useState } from "react";
import styled from "styled-components";
import { db } from "../firebase";
import Tweet from "./tweet";
import { Unsubscribe } from "firebase/auth";

export interface ITweet {
  id: string;
  photo?: string;
  tweet: string;
  userId: string;
  userName: string;
  createdAt: number;
}

const Wrapper = styled.div`
  display: flex;
  gap: 10px;
  flex-direction: column;
`;

export default function TimeLine() {
  const [tweets, setTweets] = useState<ITweet[]>([]);
  useEffect(() => {
    let unsubscribe: Unsubscribe | null = null;
    const fetchTweets = async () => {
      const tweetsQuery = query(
        collection(db, "tweets"),
        orderBy("createdAt", "desc")
      );
      /*
        const spanShot = await getDocs(tweetsQuery);
        const tweets = spanShot.docs.map((doc) => {
          const { tweet, createdAt, userId, username, photo } = doc.data();
          return { tweet, createdAt, userId, username, photo, id: doc.id };
        }); 
        */

      /* 
        onSnapshot은 특정 문서나 컬렉션, 쿼리 이벤트를 감지하여 realtime으로 이벤트콜백 함수를 실행해줄 수있다.
        이를통해 db에 들어온 쿼리를 새로고침없이 화면에 반영할 수있다.
        onSnapshot을 사용할 때는 비용을 지불해야한다.
        유저가 다른 화면을 보고있으면 작동하지 않게 해주는것이 좋다.
        useEffect의 cleanup 기능을 이용하여 컴포넌트가 언마운트될 때 (트윗 타임라인 컴포넌트 화면에서 해제될때) onSnapshot이 실행되지 않도록 할수 있다.
        */
      unsubscribe = await onSnapshot(tweetsQuery, (snapshot) => {
        const tweets = snapshot.docs.map((doc) => {
          const { tweet, createdAt, userId, userName, photo } = doc.data();
          return { tweet, createdAt, userId, userName, photo, id: doc.id };
        });
        setTweets(tweets);
      });
    };
    fetchTweets();
    // #4.5 Realtime Tweets 복습하는 게 좋을 듯 ㅠㅠ
    return () => {
      unsubscribe && unsubscribe();
    };
  }, []);
  return (
    <Wrapper>
      {tweets.map((tweet) => (
        <Tweet key={tweet.id} {...tweet} />
      ))}
    </Wrapper>
  );
}
