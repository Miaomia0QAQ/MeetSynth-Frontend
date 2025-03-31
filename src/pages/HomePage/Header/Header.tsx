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

  // 根据用户信息动态生成菜单项
  const generateMenuItems = () => {
    const isEmpty = !userInfo || Object.keys(userInfo).length === 0;

    if (isEmpty) {
      return [
        {
          label: <a onClick={() => navigate('/login')}>去登录</a>,
          key: 'login',
        },
      ];
    }

    const baseItems: MenuProps['items'] = [
      {
        label: <a onClick={onUserCenterClick}>用户中心</a>,
        key: 'user-center',
      },
      {
        label: <a onClick={() => navigate('/userCenter/meetings')}>我的会议</a>,
        key: 'my-meetings',
      },
    ];

    // 当角色为'1'时添加管理后台项
    if (userInfo.role === '1') {
      baseItems.push({
        label: <a onClick={() => navigate('/admin')}>管理后台</a>,
        key: 'admin',
      });
    }

    baseItems.push(
      { type: 'divider' },
      {
        label: <a onClick={handleLogout}>退出登录</a>,
        key: 'logout',
      }
    );

    return baseItems;
  };

  // 使用生成后的菜单项
  const items: MenuProps['items'] = generateMenuItems();

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