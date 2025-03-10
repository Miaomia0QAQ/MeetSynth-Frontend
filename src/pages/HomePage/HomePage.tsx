import React, { useCallback, useEffect, useRef, useState } from 'react';
import Header from './Header/Header';
import './HomePage.css'
import ScrollIndicator from './ScrollIndicator/ScrollIndicator';
import MeetingScheduler from './MeetingScheduler/MeetingScheduler';
import AudioVideoUploader from './AudioVideoUploader/AudioVideoUploader';

// 定义 Section 配置类型
interface SectionConfig {
    name: string;
    scrollSpeed?: number; // 可单独控制每个 section 的滚动速度
}

const HomePage: React.FC = () => {
    const sections: SectionConfig[] = [
        { name: 'hero', scrollSpeed: 800 },
        { name: 'quick', scrollSpeed: 800 },
        { name: 'schedule', scrollSpeed: 800 },
        { name: 'upload', scrollSpeed: 800 },
    ]

    const [activeSection, setActiveSection] = useState('hero');
    const [isScrolling, setIsScrolling] = useState(false);
    const containerRef = useRef<HTMLDivElement>(null);

    // 获取所有 section 元素
    const getSectionElements = () => {
        return sections.map(s => document.getElementById(s.name)) as HTMLElement[];
    };

    // 滚动控制函数
    const scrollToSection = useCallback((targetId: string) => {
        if (isScrolling || targetId === activeSection) return;

        const target = document.getElementById(targetId);
        const container = containerRef.current;
        if (!target || !container) return;

        setIsScrolling(true);
        setActiveSection(targetId)

        target.scrollIntoView({ behavior: "smooth" })

        setTimeout(() => {
            setIsScrolling(false)
        }, 800)

    }, [isScrolling])

    // 鼠标滚轮处理
    const handleWheel = useCallback((e: WheelEvent) => {
        e.preventDefault();
        if (isScrolling) return;

        const delta = Math.sign(e.deltaY);
        const currentIndex = sections.findIndex(s => s.name === activeSection);
        const nextIndex = Math.min(Math.max(currentIndex + delta, 0), sections.length - 1);

        if (nextIndex !== currentIndex) {
            scrollToSection(sections[nextIndex].name);
        }
    }, [activeSection, isScrolling, scrollToSection]);

    // 自动吸附逻辑
    const autoSnap = useCallback(() => {
        if (isScrolling) return;

        const container = containerRef.current;
        const sections = getSectionElements();
        if (!container) return;

        const scrollPos = container.scrollTop + container.clientHeight / 2;

        for (const section of sections) {
            if (scrollPos >= section.offsetTop && scrollPos < section.offsetTop + section.offsetHeight) {
                setActiveSection(section.id);
                break;
            }
        }
    }, [isScrolling]);

    useEffect(() => {
        const container = containerRef.current;
        if (!container) return;

        // 事件监听
        container.addEventListener('wheel', handleWheel, { passive: false });
        container.addEventListener('scroll', autoSnap);

        return () => {
            container.removeEventListener('wheel', handleWheel);
            container.removeEventListener('scroll', autoSnap);
        };
    }, [handleWheel, autoSnap]);

    return (
        <div className="home-container" ref={containerRef}>
            <Header scrollToSection={scrollToSection} />
            <section key="hero" className="fullscreen-section" id="hero">
                <div className={`title-content ${activeSection === 'hero' || 'quick' ? '' : 'hide'}`}>
                    <h1>MeetSynth AI会议纪要生成器</h1>
                    <p>智能转换 • 精准提炼 • 高效协作</p>
                </div>
                <ScrollIndicator targetId="quick" />
            </section>

            <section key="quick" className="fullscreen-section" id="quick">
                <div className="section-content">
                    <h2>快速开始会议</h2>
                    <div className="placeholder-box" style={{ height: '300px' }} />
                </div>
            </section>

            <section key="schedule" className="fullscreen-section" id="schedule">
                <MeetingScheduler />
            </section>

            <section key="upload" className="fullscreen-section" id="upload" style={{ backgroundColor: '#fff' }}>
                <AudioVideoUploader />
            </section>
        </div>
    );
};

export default HomePage;