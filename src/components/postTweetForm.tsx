import { addDoc, collection, updateDoc } from 'firebase/firestore';
import { useState } from 'react';
import { auth, db, storage } from '../firebase';
import { getDownloadURL, ref, uploadBytes } from 'firebase/storage';
import {
  AttachFileButton,
  AttachFileInput,
  Form,
  SubmitBtn,
  TextArea,
} from './CommitComponent';

export default function PostTweetForm() {
  const [isLoading, setLoading] = useState(false);
  const [tweet, setTweet] = useState('');
  const [file, setFile] = useState<File | null>(null);

  const onChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    if (e.target.value.length < +e.target.maxLength) {
      setTweet(e.target.value);
    } else {
      alert('그만 써..');
    }
  };

  const onFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { files } = e.target;

    if (files && files.length === 1 && files[0].size < 1 * 1024 * 1024) {
      setFile(files[0]);
    } else {
      alert('파일 사이즈 제한 또는 한개만 선택해라');
    }
  };

  const onSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const user = auth.currentUser;
    if (!user || isLoading || tweet === '' || tweet.length > 100) return;

    try {
      setLoading(true);
      const doc = await addDoc(collection(db, 'tweets'), {
        tweet: tweet,
        createAt: Date.now(),
        username: user.displayName || 'Anonymous',
        userId: user.uid,
      });
      if (file) {
        const locationRef = ref(storage, `tweets/${user.uid}/${doc.id}`);
        const result = await uploadBytes(locationRef, file);
        const url = await getDownloadURL(result.ref);
        updateDoc(doc, {
          photo: url,
        });
        setTweet('');
        setFile(null);
      }
    } catch (e) {
      console.log(e);
    }
    setLoading(false);
  };

  return (
    <Form onSubmit={onSubmit}>
      <TextArea
        required
        rows={5}
        maxLength={100}
        placeholder="What is happening?"
        onChange={onChange}
        value={tweet}
      />
      <AttachFileButton htmlFor="file">
        {file ? 'Photo added ✅ ' : 'Add photo'}
      </AttachFileButton>
      <AttachFileInput
        onChange={onFileChange}
        type="file"
        id="file"
        accept="image/*"
      />
      <SubmitBtn
        type="submit"
        value={isLoading ? 'Posting...' : 'Post Tweet'}
      />
    </Form>
  );
}
