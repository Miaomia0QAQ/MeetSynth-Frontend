import { NavLink, Outlet, useNavigate } from 'react-router-dom';
import './UserCenter.css';

const UserCenter = () => {
  const navigate = useNavigate();

  return (
    <div className="user-layout-container">
      <nav className="side-menu">
        <div className="logo-box" onClick={() => navigate('/')}>MeetSynth</div>
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
                更换头像
              </NavLink>
              <NavLink
                to="/userCenter/password"
                className={({ isActive }) =>
                  `menu-link ${isActive ? 'active' : ''}`
                }
              >
                修改密码
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