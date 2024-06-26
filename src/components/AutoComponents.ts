import styled from 'styled-components';

export const Wrapper = styled.div`
  height: 60%;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  width: 420px;
  padding: 50px 0px;
`;

export const Title = styled.h1`
  font-size: 42px;
`;

export const Form = styled.form`
  margin-top: 50px;
  margin-bottom: 10px;
  display: flex;
  flex-direction: column;
  gap: 10px;
  width: 100%;
`;

export const Input = styled.input`
  padding: 10px 20px;
  border-radius: 50px;
  border: none;
  width: 100%;
  font-size: 16px;
  &[type='submit'] {
    font-weight: 800;
    color: white;
    background-color: #1d9bf0;
    cursor: pointer;

    &:hover {
      opacity: 0.8;
    }
  }
`;

export const Error = styled.span`
  font-weight: 600;
  color: tomato;
`;

export const Switcher = styled.span`
  margin-top: 20px;
  a {
    &:hover {
      opacity: 0.8;
    }
    color: #1d9bf0;
  }
`;

export const Reset = styled.span`
  cursor: pointer;
  text-decoration: underline;
  color: #1d9bf0;
  &:hover {
    opacity: 0.8;
  }
`;
