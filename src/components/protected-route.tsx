// 로그인한 사용자는 trotexted route를 볼 수 있고
// 로그인하지 않은 경우 계정 생성 페이지로 리디렉션

import { Navigate } from "react-router-dom";
import { auth } from "../firebase";

export default function ProtectedRoute({
  children,
}: {
  children: React.ReactNode;
}) {
  const user = auth.currentUser;
  if (user === null) return <Navigate to="/login" />;
  return children;
}
