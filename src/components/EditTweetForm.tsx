import {
  AttachFileButton,
  AttachFileInput,
  Form,
  SubmitBtn,
  TextArea,
} from './CommitComponent';
import React, { useContext, useId, useState } from 'react';
import { doc, updateDoc } from 'firebase/firestore';
import { ITweet } from './timeline';
import { db, storage } from '../firebase';
import {
  deleteObject,
  getDownloadURL,
  ref,
  uploadBytes,
} from 'firebase/storage';
import { EditContext, EditContextProps } from '../context/EditContext';

export default function EditTweetForm(props: ITweet) {
  const lid = useId();
  const cont = useContext<EditContextProps | null>(EditContext);
  const { photo, tweet, userId, id } = props;
  const [area, setArea] = useState(tweet);
  const [file, setFile] = useState<File | null>(null);
  const [isLoading, setLoading] = useState(false);
  const onChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setArea(e.target.value);
  };

  const onFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { files } = e.target;

    if (files && files.length === 1 && files[0].size < 1 * 1024 * 1024) {
      setFile(files[0]);
    } else {
      alert('1MB 이상의 파일이거나 잘못된 파일입니다.');
    }
  };
  const onSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    setLoading(true);
    e.preventDefault();
    const d = await doc(db, 'tweets', id);
    await updateDoc(d, {
      tweet: area,
    });
    if (file) {
      if (photo) {
        await deleteObject(ref(storage, `tweets/${userId}/${id}`));
      }
      const result = await uploadBytes(
        ref(storage, `tweets/${userId}/${id}`),
        file
      );
      const url = await getDownloadURL(result.ref);
      await updateDoc(d, {
        photo: url,
      });
    }
    setLoading(false);
    cont?.setEdit(!cont?.edit);
  };

  return (
    <Form onSubmit={onSubmit}>
      <TextArea
        required
        rows={5}
        maxLength={100}
        placeholder="Please Edit yout Message!"
        onChange={onChange}
        value={area}
      />
      <AttachFileButton htmlFor={lid}>
        {file ? 'Photo edited ✅ ' : 'Edit photo'}
      </AttachFileButton>
      <AttachFileInput
        onChange={onFileChange}
        type="file"
        id={lid}
        accept="image/*"
      />
      <SubmitBtn
        type="submit"
        value={isLoading ? 'Editing...' : 'Edit Tweet'}
      />
    </Form>
  );
}
