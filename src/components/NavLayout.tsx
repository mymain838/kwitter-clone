import { Outlet } from 'react-router-dom';

export default function NavLayout() {
  return (
    <>
      <h2>네비 게이션 바</h2>
      <Outlet></Outlet>
    </>
  );
}
