import { useState } from 'react';
import { auth } from '../firebase';
import { Link, useNavigate } from 'react-router-dom';
import { FirebaseError } from 'firebase/app';
import { signInWithEmailAndPassword } from 'firebase/auth';
import {
  Error,
  Form,
  Input,
  Switcher,
  Title,
  Wrapper,
  Reset,
} from '../components/AutoComponents';
import GithubButton from '../components/GithubButton';
import ResetForm from '../components/ResetForm';

export default function Login() {
  const navigate = useNavigate();
  const [isLoading, setLoading] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [reset, setReset] = useState(false);
  const onChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const {
      target: { name, value },
    } = e;
    switch (name) {
      case 'email':
        setEmail(value);
        break;
      case 'password':
        setPassword(value);
        break;
      default:
        break;
    }
  };
  const onSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (isLoading || email === '' || password === '') return;

    // const ti = async () => {
    //   setLoading(true);
    //   await setTimeout(() => {
    //     console.log('우오아');
    //   }, 2000);
    // };

    try {
      setError('');
      setLoading(true);
      await signInWithEmailAndPassword(auth, email, password);
      //create account
      // set the name of the user
      // redirect to the home page

      navigate('/');
    } catch (e) {
      if (e instanceof FirebaseError) {
        setError(e.message);
      }
      //setError
    } finally {
      setLoading(false);
    }
  };

  return (
    <Wrapper>
      <Title>Login X</Title>
      <Form onSubmit={onSubmit}>
        <Input
          name="email"
          value={email}
          placeholder="Email"
          type="email"
          onChange={onChange}
          required
        />
        <Input
          name="password"
          value={password}
          placeholder="Password"
          type="password"
          onChange={onChange}
          required
        />
        <Input type="submit" value={isLoading ? 'Loading' : 'Login Account'} />
      </Form>
      {error !== '' ? <Error>{error}</Error> : null}
      <Switcher>
        Dont't have an account?
        <Link to="/create-account"> Create One &rarr;</Link>
        <p />
        You want to Reset Password?
        <Reset
          onClick={() => {
            setReset(!reset);
          }}
        >
          Click here
        </Reset>
        {reset ? <ResetForm></ResetForm> : null}
      </Switcher>
      <GithubButton></GithubButton>
    </Wrapper>
  );
}
