import { auth } from "../firebase";
import { Navigate } from "react-router-dom";

export default function ProtectedRoute({
  children,
}: {
    children: React.ReactNode;
  // React.ReactNode => 컴포넌트의 자식을 설명하는 두가지 방법 중 하나
  }) {
  const user = auth.currentUser;
  if (user === null) {
    return <Navigate to="/login" />;
  }
  return children;
}