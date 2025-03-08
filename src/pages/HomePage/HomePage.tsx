import React from 'react';
import Header from './Header/Header';
import styles from './HomePage.module.css';

const HomePage: React.FC = () => {
    return (
        <div className={styles.homeContainer} >
            <Header />

            <section className={styles.fullscreenSection} id="hero">
                {/* 效果展示板块 */}
                <div className={styles.heroContent}>
                    <h1>AI会议纪要生成器</h1>
                    <p>智能转换 • 精准提炼 • 高效协作</p>
                </div>
            </section>

            <section className={styles.fullscreenSection} id="quick" style={{backgroundColor: '#fff'}}>
                {/* 快速会议板块 */}
                <div className={styles.sectionContent}>
                    <h2>快速开始会议</h2>
                    <div className={styles.placeholderBox} style={{ height: '300px' }} />
                </div>
            </section>

            <section className={styles.fullscreenSection} id="schedule">
                {/* 预定会议板块 */}
                <div className={styles.splitContainer}>
                    <div className={styles.formPanel}>
                        <h2>预定会议</h2>
                        <div className={styles.placeholderBox} style={{ height: '400px' }} />
                    </div>
                    <div className={styles.imagePanel}>
                        {/* 右侧图片占位 */}
                    </div>
                </div>
            </section>

            <section className={styles.fullscreenSection} id="upload" style={{backgroundColor: '#fff'}}>
                {/* 音视频录入板块 */}
                <div className={styles.sectionContent}>
                    <h2>文件上传</h2>
                    <div className={styles.placeholderBox} style={{ height: '300px' }} />
                </div>
            </section>
        </div>
    );
};

export default HomePage;