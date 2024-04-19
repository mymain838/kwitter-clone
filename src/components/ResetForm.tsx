import { sendPasswordResetEmail } from 'firebase/auth';
import { useState } from 'react';
import styled from 'styled-components';
import { auth } from '../firebase';
import { FirebaseError } from 'firebase/app';

const Form = styled.form`
  display: flex;
  flex-direction: column;
  align-items: center;
  margin: 5px;
`;

const Input = styled.input`
  border: 0;
  padding: 3px;
  padding-left: 30px;
  margin-bottom: 10px;
  border-radius: 50px;
  width: 80%;
`;

const Submit = styled.input`
  width: 50%;
  border: 0;
  padding: 5px 2px;
  border-radius: 50px;
  background-color: white;
  &:hover {
    cursor: pointer;
    opacity: 0.8;
  }
`;

const Error = styled.span`
  margin-top: 5px;
  color: red;
`;

export default function ResetForm() {
  const [value, setValue] = useState('');
  const [error, setError] = useState('');
  const [submitLoading, setSubmitLoading] = useState(false);

  const onChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setValue(e.target.value);
  };

  const onClick = async () => {
    try {
      if (submitLoading) return;
      setSubmitLoading(true);

      await sendPasswordResetEmail(auth, value);
      setError('Success Send your Email!!');
      setValue('');
      setSubmitLoading(false);
    } catch (e) {
      if (e instanceof FirebaseError) {
        setError(e.message);
        setSubmitLoading(false);
      }
    }
  };

  return (
    <Form>
      <Input
        type="email"
        placeholder="enter the Email"
        onChange={onChange}
        required
      ></Input>
      <Submit
        type="button"
        onClick={onClick}
        value={submitLoading ? 'Loading' : 'Send'}
      ></Submit>
      {error ? <Error>{error}</Error> : null}
    </Form>
  );
}
