import { deleteDoc, doc, updateDoc } from "firebase/firestore";
import { auth, db, storage } from "../firebase";
import { ITweet } from "./timeline";
import { styled } from "styled-components";
import { deleteObject, ref } from "firebase/storage";
import { useState } from "react";

const Wrapper = styled.div`
  display: grid;
  grid-template-columns: 3fr 1fr;
  padding: 20px;
  border: 1px solid rgba(255, 255, 255, 0.5);
  border-radius: 15px;
`;

const Column = styled.div`
&:last-child{
  place-self: end;
}`;

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
const DeleteButton = styled.button`
background-color: tomato;
color:white;
font-weight: 600;
border:0;
font-size: 12px;
padding: 5px 10px;
text-transform: uppercase;
border-radius: 5px;
cursor: pointer;
`;
const EditButton = styled.button`
  background-color: white;
  color: tomato;
  font-weight: 600;
  border: 0;
  font-size: 12px;
  padding: 5px 10px;
  text-transform: uppercase;
  border-radius: 5px;
  cursor: pointer;
`;
const SaveBtn=styled(DeleteButton)`

`
const EditText = styled.input`
  margin: 10px 0px;
  font-size: 18px;
`;

export default function Tweet({ username, photo, tweet, userId,id }: ITweet) {
  const user = auth.currentUser;
  const [isEdit, setIsEdit] = useState(false);
  const [tweeText, setTweeText] =useState(tweet)
  const onDelete = async () => {
    const ok = confirm("정말로 삭제하시겠습니까?");
    if (!ok || user?.uid !== userId) return; //userId가 같지 않으면 함수 종료
    //user?.으로 써야하는 이유 user.만 쓰면 오류뜸
    try {
      await deleteDoc(doc(db, "tweets", id)); //트윗 내용 삭제
      if (photo) { //사진이 있다면 사진도 삭제한다
        const photoRef = ref(storage, `tweets/${user.uid}/${id}`);
        await deleteObject(photoRef);
      }
    } catch (e) {
      console.log(e);
    } finally {
      //
    }
  }
  const onEdit = () => {
    setIsEdit(true);
  }
  const onChange = (e:React.ChangeEvent<HTMLInputElement>) => {
    setTweeText(e.target.value);
  }
  const onSaveBtn = async () => {
    if (user?.uid !== userId && tweeText.length > 180) return;
    try {
      const modifyText = await doc(db, "tweets", id);
      const ok = confirm("수정하시겠습니까?")
      if (ok) {
        await updateDoc(modifyText, { tweet: tweeText })
      }
    } catch (error) {
      console.log(error)
    } finally {
      setIsEdit(false)
    }
  };
  return (
    <>
      {isEdit ? (
        <Wrapper>
          <Username>{username}</Username>
          <EditText onChange={onChange} value={tweeText}></EditText>
          <SaveBtn onClick={ onSaveBtn}> Save </SaveBtn>
        </Wrapper>
      ) : (
        <Wrapper>
          <Column>
            <Username>{username}</Username>
            <Payload>{tweet}</Payload>
            {user?.uid === userId ? (
              <DeleteButton onClick={onDelete}>Delete</DeleteButton>
            ) : null}
            {user?.uid === userId ? (
              <EditButton onClick={onEdit}>Edit</EditButton>
            ) : null}
            <Column>{photo ? <Photo src={photo} /> : null}</Column>
          </Column>
        </Wrapper>
      )}
      ;
    </>
  );
}