import styled from 'styled-components';
import { ITweet } from './timeline';
import { auth, db, storage } from '../firebase';
import { deleteDoc, doc } from 'firebase/firestore';
import { deleteObject, ref } from 'firebase/storage';
import { useState } from 'react';
import EditTweetForm from './EditTweetForm';
import { EditContext } from '../context/EditContext';
const Wrapper = styled.div`
  display: grid;
  grid-template-columns: 3fr 1fr;
  padding: 20px;
  border: 1px solid rgba(255, 255, 255, 0.5);
  border-radius: 15px;
`;

const Column = styled.div``;

const Photo = styled.img`
  width: 100px;
  height: 100px;
  border-radius: 15px;
`;

const Username = styled.span`
  font-weight: 600;
  font-size: 15px;
`;

const Payload = styled.p`
  margin: 10px 0px;
  font-size: 18px;
`;

const BtnWrapper = styled.div`
  display: flex;
  border: 0;
  margin-top: 20px;
  gap: 10px;
`;

const DeleteBtn = styled.button`
  background-color: tomato;
  color: white;
  font-weight: 600;
  border: 0;
  font-size: 12px;
  padding: 5px 10px;
  text-transform: uppercase;
  border-radius: 5px;
  cursor: pointer;
  &:hover {
    opacity: 0.8;
  }
`;

const EditBtn = styled.button`
  background-color: #1d9bf0;
  color: white;
  font-weight: 600;
  border: 0;
  font-size: 12px;
  padding: 5px 10px;
  text-transform: uppercase;
  border-radius: 5px;
  cursor: pointer;
  &:hover {
    opacity: 0.8;
  }
`;

export default function Tweet(props: ITweet) {
  const { username, photo, tweet, userId, id } = props;
  const user = auth.currentUser;
  // const [modal, setModal] = useState(false);
  const [edit, setEdit] = useState(false);
  const onDelete = async () => {
    const ok = confirm('Are you sure  you want to delete this tweet?');
    if (!ok || user?.uid !== userId) return;
    try {
      await deleteDoc(doc(db, 'tweets', id));
      if (photo) {
        const photoRef = ref(storage, `tweets/${user.uid}/${id}`);
        await deleteObject(photoRef);
      }
    } catch (e) {
      console.log(e);
    } finally {
      //
    }
  };

  const onEdit = () => {
    setEdit(true);
  };

  const onClick = () => {};

  return (
    <>
      {!edit ? (
        <Wrapper>
          {/* <Modal isOpen={true}>good</Modal> */}
          <Column>
            <Username>{username}</Username>
            <Payload>{tweet}</Payload>
            {user?.uid === userId ? (
              <BtnWrapper>
                <DeleteBtn onClick={onDelete}>Delete</DeleteBtn>
                <EditBtn onClick={onEdit}>Edit</EditBtn>
              </BtnWrapper>
            ) : null}
          </Column>
          <Column>
            {photo ? <Photo src={photo} onClick={onClick} /> : null}
          </Column>
        </Wrapper>
      ) : (
        <EditContext.Provider value={{ edit, setEdit }}>
          <EditTweetForm {...props} />
        </EditContext.Provider>
      )}
    </>
  );
}
