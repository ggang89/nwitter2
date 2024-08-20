import { addDoc, collection } from "firebase/firestore";
import { useState } from "react";
import { styled } from "styled-components";
import { auth, db } from "../firebase";

const Form = styled.form`
  display: flex;
  flex-direction: column;
  gap: 10px;
`;

const TextArea = styled.textarea`
  border: 2px solid white;
  padding: 20px;
  border-radius: 20px;
  font-size: 16px;
  color: white;
  background-color: black;
  width: 100%;
  resize: none;
  font-family: system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto,
    Oxygen, Ubuntu, Cantarell, "Open Sans", "Helvetica Neue", sans-serif;
  &::placeholder {
    font-size: 16px;
  }
  &:focus {
    outline: none;
    border-color: #1d9bf0;
  }
`;

const AttachFileButton = styled.label`
  padding: 10px 0px;
  color: #1d9bf0;
  text-align: center;
  border-radius: 20px;
  border: 1px solid #1d9bf0;
  font-size: 14px;
  font-weight: 600;
  cursor: pointer;
`;

const AttachFileInput = styled.input`
  display: none;
`;

const SubmitBtn = styled.input`
  background-color: #1d9bf0;
  color: white;
  border: none;
  padding: 10px 0px;
  border-radius: 20px;
  font-size: 16px;
  cursor: pointer;
  &:hover,
  &:active {
    opacity: 0.9;
  }
`;

export default function PostTweetForm() {
  const [loading, setLoading] = useState(false);
  const [tweet, setTweet] = useState("");
  const [file, setFile] = useState<File | null>(null);
  const onChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setTweet(e.target.value);
  };
  const onFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    //type=file인 input(AttachfileInput)이 변경될 때마다 파일의 배열을 받음
    const { files } = e.target; //input에서 file 추출
    console.log("e.target", e.target);
    if (files && files.length === 1) { //file이 있고, file이 1개일 때
      setFile(files[0]); //파일 리스트의 첫번재 파일을 file state에 저장
    }
  };
  const onSubmit = async (e:React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const user = auth.currentUser;
    if (!user || loading || tweet === "" || tweet.length > 180) return; 
    //조건에 해당하면 함수 종료
    try {
      setLoading(true);
      await addDoc(collection(db, "tweets"), {
        tweet,
        createdAt: Date.now(),
        username: user.displayName || "Anonymous",
        userId:user.uid
      })
      //addDoc: 새로운 document생성 함수
    } catch (e) {
      console.log("error",e)
    } finally {
      setLoading(false)
    }

  }
  return (
    <Form onSubmit={onSubmit}>
      <TextArea
        rows={5}
        maxLength={180}
        onChange={onChange}
        value={tweet}
        placeholder="what is happening?!!"
      />
      <AttachFileButton htmlFor="file">
        {file ? "Photo added !" : "Add Photo"}
      </AttachFileButton>
      {/* input창을 숨겨준다 => 같은 id를 가지고 있으면 label을 눌렀을 때
      file버튼을 클릭하는 것과 같에 동작한다 */}
      <AttachFileInput
        onChange={onFileChange}
        type="file"
        id="file"
        accept="image/*"
      />
      {/*accept : 이미지만 받는데, 확장자는 모두 가능 */}
      <SubmitBtn
        type="submit"
        value={loading ? "Posting..." : "Post Tweet"}
      />
    </Form>
  );
}
