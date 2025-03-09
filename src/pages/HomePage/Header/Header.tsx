// src/components/Header.tsx
import React from 'react';
import styles from './Header.module.css';

interface HeaderProps {
  scrollToSection: (targetId: string) => void;
}

const Header: React.FC<HeaderProps> = ({ scrollToSection }) => {
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

      <div className={styles.userAvatar}>
        <div className={styles.avatar} onClick={() => {/* 点击处理 */ }} />
      </div>
    </header>
  );
};

export default Header;