// src/components/Header.tsx
import React from 'react';
import styles from './Header.module.css';

const Header: React.FC = () => {
  return (
    <header className={styles.header}>
      <div className={styles.logo}>
        <img src="/logo.png" alt="Logo" />
      </div>
      
      <nav className={styles.nav}>
        <a href="#quick">快速会议</a>
        <a href="#schedule">预定会议</a>
        <a href="#upload">录入音视频</a>
      </nav>

      <div className={styles.userAvatar}>
        <div className={styles.avatar} onClick={() => {/* 点击处理 */}} />
      </div>
    </header>
  );
};

export default Header;