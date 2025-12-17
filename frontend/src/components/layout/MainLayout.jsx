import { Outlet } from 'react-router-dom';
import { useContext } from 'react';
import { ThemeContext } from '../../context/ThemeContext';
import Sidebar from './Sidebar';
import Topbar from './Topbar';

const MainLayout = () => {
  const { theme } = useContext(ThemeContext);
  const bg = theme === 'light' ? 'bg-gray-100 text-gray-900' : 'bg-gradient-to-br from-gray-950 via-gray-900 to-gray-950';
  return (
    <div className={`min-h-screen ${bg}`}>
      <Sidebar />
      <Topbar />
      <main className="ml-64 mt-16 p-6">
        <Outlet />
      </main>
    </div>
  );
};

export default MainLayout;
