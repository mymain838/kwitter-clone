import styled from 'styled-components';
import { auth, db, storage } from '../firebase';
import React, { useEffect, useState } from 'react';
import { getDownloadURL, ref, uploadBytes } from 'firebase/storage';
import { updateProfile } from 'firebase/auth';
import {
  Unsubscribe,
  collection,
  limit,
  onSnapshot,
  orderBy,
  query,
  where,
} from 'firebase/firestore';
import { ITweet } from '../components/timeline';
import Tweet from '../components/Tweet';

const Wrapper = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 20px;
`;
const AvatarUpload = styled.label`
  width: 80px;
  overflow: hidden;
  height: 80px;
  border-radius: 50%;
  background-color: #1d9bf0;
  cursor: pointer;
  display: flex;
  justify-content: center;
  align-items: center;
  svg {
    width: 50px;
  }
`;
const AvatarImg = styled.img`
  width: 100%;
`;

const AvatarInput = styled.input`
  display: none;
`;
const Edit = styled.div`
  margin-left: 50px;
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 10px;
`;
const EditName = styled.input`
  width: 100px;
  padding: 8px;
  border-radius: 10px;
`;
const Name = styled.span`
  font-size: 22px;
`;
const Button = styled.button`
  cursor: pointer;
  padding: 5px 10px;
  border: 0;
  border-radius: 20px;
  background-color: #1b901b;
  color: white;
  &:hover {
    opacity: 0.8;
  }
  &.change {
    background-color: #1d9bf0;
  }

  font-size: 16px;
`;
const Tweets = styled.div`
  display: flex;
  flex-direction: column;
`;

export default function Profile() {
  const user = auth.currentUser;
  const [name, setName] = useState('');
  const [edit, setEdit] = useState(false);
  const [isLoading, setLoading] = useState(false);
  const [avatar, setAvatar] = useState(user?.photoURL);
  const [tweets, setTweets] = useState<ITweet[]>([]);
  const onAvatarChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const { files } = e.target;
    if (!user) return;
    if (files && files.length === 1 && files[0].size < 1024 ** 2) {
      const file = files[0];

      const locationRef = ref(storage, `avatars/${user?.uid}`);
      const result = await uploadBytes(locationRef, file);
      const avatarUrl = await getDownloadURL(result.ref);
      setAvatar(avatarUrl);
      await updateProfile(user, {
        photoURL: avatarUrl,
      });
    }
  };
  const onEdit = () => {
    setEdit(!edit);
  };
  const onNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setName(e.target.value);
  };
  const onChange = async () => {
    setLoading(true);
    try {
      if (!user) return;

      await updateProfile(user, {
        displayName: name,
      });
      setEdit(false);
    } catch (e) {
      console.log(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    let unsubscribe: Unsubscribe | null = null;
    const fetchTweets = async () => {
      const tweetQuery = query(
        collection(db, 'tweets'),
        where('userId', '==', user?.uid),
        orderBy('createAt', 'desc'),
        limit(25)
      );
      unsubscribe = onSnapshot(tweetQuery, (snapshot) => {
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
      // const snapshot = await getDocs(tweetQuery);
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
    };
    fetchTweets();
    return () => {
      unsubscribe && unsubscribe();
    };
  }, []);

  return (
    <Wrapper>
      <AvatarUpload htmlFor="avatar">
        {avatar ? (
          <AvatarImg src={avatar} />
        ) : (
          <svg
            fill="currentColor"
            viewBox="0 0 20 20"
            xmlns="http://www.w3.org/2000/svg"
            aria-hidden="true"
          >
            <path d="M10 8a3 3 0 1 0 0-6 3 3 0 0 0 0 6ZM3.465 14.493a1.23 1.23 0 0 0 .41 1.412A9.957 9.957 0 0 0 10 18c2.31 0 4.438-.784 6.131-2.1.43-.333.604-.903.408-1.41a7.002 7.002 0 0 0-13.074.003Z" />
          </svg>
        )}
      </AvatarUpload>
      <AvatarInput
        onChange={onAvatarChange}
        id="avatar"
        type="file"
        accept="image/*"
      />
      <Edit>
        {edit ? (
          <>
            <EditName onChange={onNameChange} value={name} />
            <Button className="change" onClick={onChange}>
              {isLoading ? 'Wait...' : 'Change'}
            </Button>
          </>
        ) : (
          <Name>{user?.displayName ? user.displayName : 'Anonymous'}</Name>
        )}
        <Button onClick={onEdit}>Edit</Button>
      </Edit>
      <Tweets>
        {tweets.map((tweet) => (
          <Tweet key={tweet.id} {...tweet} />
        ))}
      </Tweets>
    </Wrapper>
  );
}
