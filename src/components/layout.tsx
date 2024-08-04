import { Outlet } from "react-router-dom";

export default function Layout() {
  return (
    <>
      <h2>layout 컴포넌트입니다</h2>
      <Outlet />
      {/* outlet컴포넌트 안에 childern router가 반영됨 */}
    </>
  )
}