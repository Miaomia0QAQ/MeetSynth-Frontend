// src/components/Header.tsx
import React, { useEffect, useState } from 'react';
import styles from './Header.module.css';
import { UserOutlined } from '@ant-design/icons';
import type { MenuProps } from 'antd';
import { Avatar, Dropdown } from 'antd';
import { useNavigate } from 'react-router-dom';
import { getUserInfoAPI } from '../../../apis/user';

interface HeaderProps {
  scrollToSection: (targetId: string) => void;
}

const Header: React.FC<HeaderProps> = ({ scrollToSection }) => {
  const navigate = useNavigate();
  const [userInfo, setUserInfo] = useState<any>({});

  // 退出登录
  const handleLogout = () => {
    if (localStorage.getItem('token')) {
      localStorage.removeItem('token');
      localStorage.removeItem('userInfo');
    }
    navigate('/login');
  };

  const onUserCenterClick = () => {
    navigate('/userCenter/info/account');
  };

  // 头像下拉框菜单
  const items: MenuProps['items'] = [
    {
      label: (
        <a onClick={onUserCenterClick}>
          用户中心
        </a>
      ),
      key: '0',
    },
    {
      label: (
        <a onClick={() => { navigate('/userCenter/meetings') }}>
          我的会议
        </a>
      ),
      key: '1',
    },
    {
      label: (
        <a onClick={() => { navigate('/admin') }}>
          管理后台
        </a>
      ),
      key: '2',
      disabled: userInfo?.role === 'admin'
    },
    {
      type: 'divider',
    },
    {
      label: (
        <a onClick={handleLogout}>
          退出登录
        </a>
      ),
      key: '3',
    },
  ];

  // 菜单项被点击事件
  const handleItemClick = (targetId: string) => {
    scrollToSection(targetId);
  };

  // 获取用户信息
  useEffect(() => {
    if (localStorage.getItem('token')) {
      getUserInfoAPI().then((res) => {
        if (res.code === 1) {
          const { id, username, email, avatarUrl, role } = res.data;
          setUserInfo({ id, username, email, avatarUrl, role });
          localStorage.setItem('userInfo', JSON.stringify(userInfo));
        }
      })
    }
  }, []);

  return (
    <header className={styles.header}>
      <div className={styles.logo} onClick={() => handleItemClick('hero')}>
        <h2 className={styles.logoText}>MeetSynth</h2>
      </div>

      <nav className={styles.nav}>
        <a onClick={() => handleItemClick('quick')}>快速会议</a>
        <a onClick={() => handleItemClick('schedule')}>预定会议</a>
        <a onClick={() => handleItemClick('upload')}>录入音视频</a>
      </nav>

      <div className={styles.username}>{userInfo?.username}</div>
      <Dropdown menu={{ items }} trigger={['hover']} placement='bottom' arrow={{ pointAtCenter: true }}>
        <div className={styles.userAvatar}>
          {userInfo?.avatarUrl && userInfo?.avatarUrl !== 'https://example.com/avatar/default.png' ?
            <Avatar
              src={userInfo.avatarUrl}
              alt="avatar"
              size={40}
            /> :
            <div className={styles.avatar} ><UserOutlined /></div>}
        </div>
      </Dropdown>
    </header>
  );
};

export default Header;