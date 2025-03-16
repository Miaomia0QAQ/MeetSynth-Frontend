// src/components/Header.tsx
import React from 'react';
import styles from './Header.module.css';
import { UserOutlined } from '@ant-design/icons';
import type { MenuProps } from 'antd';
import { Dropdown } from 'antd';
import { useNavigate } from 'react-router-dom';

interface HeaderProps {
  scrollToSection: (targetId: string) => void;
}

const Header: React.FC<HeaderProps> = ({ scrollToSection }) => {
  const navigate = useNavigate();

  // 退出登录
  const handleLogout = () => {
    if (localStorage.getItem('token')) {
      localStorage.removeItem('token');
    }
    navigate('/login');
  };

  // 头像下拉框菜单
  const items: MenuProps['items'] = [
    {
      label: (
        <a onClick={() => { navigate('/userCenter/info/account') }}>
          用户中心
        </a>
      ),
      key: '0',
    },
    {
      label: (
        <a onClick={() => { navigate('/admin') }}>
          管理后台
        </a>
      ),
      key: '1',
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

  return (
    <header className={styles.header}>
      <div className={styles.logo} onClick={() => handleItemClick('hero')}>
        <img src="/logo.png" alt="Logo" />
      </div>

      <nav className={styles.nav}>
        <a onClick={() => handleItemClick('quick')}>快速会议</a>
        <a onClick={() => handleItemClick('schedule')}>预定会议</a>
        <a onClick={() => handleItemClick('upload')}>录入音视频</a>
      </nav>

      <Dropdown menu={{ items }} trigger={['hover']} placement='bottom' arrow={{ pointAtCenter: true }}>
        <div className={styles.userAvatar}>
          <div className={styles.avatar} onClick={() => {/* 点击处理 */ }} >
            <UserOutlined />
          </div>
        </div>
      </Dropdown>
    </header>
  );
};

export default Header;