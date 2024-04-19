import {
  Unsubscribe,
  collection,
  limit,
  onSnapshot,
  orderBy,
  query,
} from 'firebase/firestore';
import { useEffect, useState } from 'react';
import styled from 'styled-components';
import { db } from '../firebase';
import Tweet from './Tweet';

const Wrapper = styled.div`
  display: flex;
  flex-direction: column;
  gap: 10px;
  overflow-y: scroll;
  &::-webkit-scrollbar {
    display: none;
  }
`;

export interface ITweet {
  id: string;
  photo?: string;
  tweet: string;
  userId: string;
  username: string;
  createAt: number;
}

export default function Timeline() {
  const [tweets, setTweets] = useState<ITweet[]>([]);

  useEffect(() => {
    let unsubscribe: Unsubscribe | null = null;
    const fetchTweets = async () => {
      const tweetsQuery = query(
        collection(db, 'tweets'),
        orderBy('createAt', 'desc'),
        limit(25)
      );
      // const snapshot = await getDocs(tweetsQuery);
      // const tweetss = snapshot.docs.map((doc) => {
      //   const { tweet, createAt, userId, username, photo } = doc.data();
      //   return {
      //     tweet,
      //     createAt,
      //     userId,
      //     username,
      //     photo,
      //     id: doc.id,
      //   };
      // });
      unsubscribe = onSnapshot(tweetsQuery, (snapshot) => {
        const tweetss = snapshot.docs.map((doc) => {
          const { tweet, createAt, userId, username, photo } = doc.data();
          return {
            tweet,
            createAt,
            userId,
            username,
            photo,
            id: doc.id,
          };
        });
        setTweets(tweetss);
      });
    };
    fetchTweets();
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
