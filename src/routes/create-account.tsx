import { createUserWithEmailAndPassword, updateProfile } from "firebase/auth";
import { useState } from "react";

import { auth } from "../firebase";
import { Link, useNavigate } from "react-router-dom";
import { FirebaseError } from "firebase/app";
import {
  Form,
  Error,
  Input,
  Switcher,
  Title,
  Wrapper,
} from "../components/auth-components";



export default function CreateAccount() {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const onChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const {
      //변경된 input의 name을 통해서 setState해줌
      target: { name, value },
    } = e;
    if (name === "name") {
      setName(value);
    } else if (name === "email") {
      setEmail(value);
    } else if (name === "password") {
      setPassword(value);
    }
  };
  const onSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    setError("");
    e.preventDefault();
    if (isLoading || name === "" || email === "" || password === "") return;
    try {
      setIsLoading(true);
      //1. 계정생성
      const credentials = await createUserWithEmailAndPassword(
        auth,
        email,
        password
      );
      console.log(credentials.user);
      //2. 사용자 프로필 이름 지정
      await updateProfile(credentials.user, {
        displayName: name,
      });
      navigate("/");
      //3. 홈페이지로 리디렉션
    } catch (e) {
      if (e instanceof FirebaseError) {
      setError(e.message);  
      }
      
    } finally {
      setIsLoading(false);
    }
  };
  return (
    <Wrapper>
      <Title>Join 𝕏</Title>
      <Form onSubmit={onSubmit}>
        <Input
          onChange={onChange}
          name="name"
          value={name}
          placeholder="Name"
          type="text"
          required
        />
        <Input
          onChange={onChange}
          name="email"
          value={email}
          placeholder="Email"
          type="email"
          required
        />
        <Input
          onChange={onChange}
          name="password"
          value={password}
          placeholder="Password"
          type="password"
          required
        />
        <Input
          type="submit"
          value={isLoading ? "Loading..." : "Create Account"}
        />
      </Form>
      {error !== "" ? <Error>{error}</Error> : null}
      <Switcher>
        Aleady have an account? <Link to="/login">Log In</Link>
      </Switcher>
    </Wrapper>
  );
}
