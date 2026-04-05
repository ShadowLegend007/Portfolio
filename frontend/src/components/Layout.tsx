import { Outlet } from 'react-router-dom';
import Navbar from './Navbar';
import SakuraAnimation from './SakuraAnimation';

const Layout = () => {
  return (
    <>
      <Navbar />
      <SakuraAnimation />
      <Outlet />
    </>
  );
};

export default Layout;
