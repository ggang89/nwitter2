import { collection, limit, onSnapshot, orderBy, query } from "firebase/firestore";
import { useEffect,useState } from "react";
import { styled } from "styled-components";
import { db } from "../firebase";
import Tweet from "./tweet";
import { Unsubscribe } from "firebase/auth";

export interface ITweet{
  id: string;
  photo?: string;
  tweet: string;
  userId: string;
  username: string;
  createdAt: number;
}
const Wrapper=styled.div`
  display: flex;
  gap:10px;
  flex-direction: column;
  
`
export default function Timeline() {
  const [tweets, setTweets] = useState<ITweet[]>([]); 
  useEffect(() => {
    let unsubscribe: Unsubscribe | null = null;
    const fetchTweets = async () => {
      //쿼리 생성
      const tweetsQuery = query(
        collection(db, "tweets"),
        orderBy("createdAt", "desc"),
        limit(25)
      );
      // const snapshot = await getDocs(tweetsQuery);
      // const tweets = snapshot.docs.map(doc => {
      //   const { tweet, createdAt, userId, username, photo } = doc.data();
      //   return {
      //     tweet, createdAt, userId, username, photo, id: doc.id

      //   };
      // })
      unsubscribe = await onSnapshot(tweetsQuery, (snapshot) => {
         //onSnapshot함수는 unsubscribe를 반환함
        const tweets = snapshot.docs.map((doc) => {
          const { tweet, createdAt, userId, username, photo } = doc.data();
          return {
            tweet,
            createdAt,
            userId,
            username,
            photo,
            id: doc.id,
          };
        });
          setTweets(tweets);
      });
    };
    fetchTweets();
    return () => {
      unsubscribe && unsubscribe();
      //unsubscribe가 참이면 unsubscribe를 부른다
      //타임라인 컴포넌트가 사용되지 않을 때(로그아웃,이동) 호출되는 함수
    }
  }, []);
  return (
    <Wrapper>
      {tweets.map((tweet) => (
        <Tweet key={tweet.id}{...tweet} />
        
     ))}
    </Wrapper>
  )
}