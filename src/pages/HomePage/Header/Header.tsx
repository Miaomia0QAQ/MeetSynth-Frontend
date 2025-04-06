// src/components/Header.tsx
import React, { useEffect, useState } from 'react';
import styles from './Header.module.css';
import { DashboardOutlined, LoginOutlined, LogoutOutlined, ScheduleOutlined, UserOutlined } from '@ant-design/icons';
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

    const menuItemStyle: React.CSSProperties = {
      fontSize: 14,
      lineHeight: '22px',
      padding: '8px 12px',
      transition: 'all 0.2s'
    };

    if (isEmpty) {
      return [
        {
          label: (
            <div
              onClick={() => navigate('/login')}
              className={styles.menuItem}
            >
              <LoginOutlined style={{ fontSize: 16, marginRight: 10 }} />
              <span>立即登录</span>
            </div>
          ),
          key: 'login',
          style: menuItemStyle
        },
      ];
    }

    const baseItems: MenuProps['items'] = [
      {
        label: (
          <div
            onClick={onUserCenterClick}
            className={styles.menuItem}
          >
            <UserOutlined style={{ fontSize: 16, marginRight: 10 }} />
            <span>用户中心</span>
          </div>
        ),
        key: 'user-center',
        style: menuItemStyle
      },
      {
        label: (
          <div
            onClick={() => navigate('/userCenter/meetings')}
            className={styles.menuItem}
          >
            <ScheduleOutlined style={{ fontSize: 16, marginRight: 10 }} />
            <span>我的会议</span>
          </div>
        ),
        key: 'my-meetings',
        style: menuItemStyle
      },
    ];

    if (userInfo.role === '1') {
      baseItems.push({
        label: (
          <div
            onClick={() => navigate('/admin/dashboard')}
            className={styles.menuItem}
          >
            <DashboardOutlined style={{ fontSize: 16, marginRight: 10 }} />
            <span>管理后台</span>
          </div>
        ),
        key: 'admin',
        style: menuItemStyle
      });
    }

    baseItems.push(
      {
        type: 'divider',
        style: {
          margin: '4px 0',
          borderColor: 'rgba(0, 0, 0, 0.06)'
        }
      },
      {
        label: (
          <div
            onClick={handleLogout}
            className={styles.menuItemDanger}
          >
            <LogoutOutlined style={{ fontSize: 16, marginRight: 10 }} />
            <span>退出登录</span>
          </div>
        ),
        key: 'logout',
        style: {
          ...menuItemStyle,
          color: '#ff4d4f'
        }
      }
    );

    return baseItems;
  };

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
      <Dropdown
        menu={{
          items: generateMenuItems(),
          style: {
            width: 160,
            padding: '8px 0',
            borderRadius: 8,
            boxShadow: '0 6px 16px 0 rgba(0, 0, 0, 0.08)'
          }
        }}
        trigger={['hover']}
        placement="bottom"
        arrow={{ pointAtCenter: true }}
        overlayClassName={styles.customDropdown}
      >
        <div className={styles.userAvatar}>
          {userInfo?.avatarUrl && userInfo?.avatarUrl !== 'https://example.com/avatar/default.png' ? (
            <Avatar
              src={userInfo.avatarUrl}
              alt="avatar"
              size={40}
              className={styles.avatarImage}
            />
          ) : (
            <div className={styles.defaultAvatar}>
              <UserOutlined style={{ fontSize: 20 }} />
            </div>
          )}
        </div>
      </Dropdown>
    </header>
  );
};

export default Header;