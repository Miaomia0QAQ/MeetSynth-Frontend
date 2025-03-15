import { NavLink, Outlet } from 'react-router-dom';
import './UserCenter.css';

const UserCenter = () => {
  return (
    <div className="user-layout-container">
      <nav className="side-menu">
        <div className="logo-box">MeetSynth</div>
        <ul className="menu-list">
          <li className="menu-item">
            <div className="title">个人信息</div>
            <div className="sub-menu">
              <NavLink 
                to="/userCenter/info/account" 
                className={({ isActive }) => 
                  `menu-link ${isActive ? 'active' : ''}`
                }
              >
                账号管理
              </NavLink>
              <NavLink 
                to="/userCenter/info/avatar"
                className={({ isActive }) => 
                  `menu-link ${isActive ? 'active' : ''}`
                }
              >
                修改头像
              </NavLink>
            </div>
          </li>
          <li className="menu-item">
            <NavLink 
              to="/userCenter/meetings"
              className={({ isActive }) => 
                `menu-link ${isActive ? 'active' : ''}`
              }
            >
              我的会议
            </NavLink>
          </li>
        </ul>
      </nav>
      <main className="content-area">
        <Outlet />
      </main>
    </div>
  );
};

export default UserCenter;