import { useState } from 'react';
import { FaRocket, FaMicrophone, FaClipboardList } from 'react-icons/fa';
import './QuickStart.css';
import HitechButton from './HitechButton/HitechButton';
import { useNavigate } from 'react-router-dom';

const QuickStart = () => {
    const [isHovered, setIsHovered] = useState(false);
    const navigate = useNavigate();

    const handleStart = () => {
        navigate('/meeting');
    };

    return (
        <div className='quick-start-container'>
            {/* 内容区域 */}
            <div className='left-panel'>
                <div className="title-container">
                    <h1 className="title">
                        MeetSynth
                    </h1>
                    <p>你的智能会议小助手</p>
                </div>

                <HitechButton
                    className='start-button'
                    onMouseEnter={() => setIsHovered(true)}
                    onMouseLeave={() => setIsHovered(false)}
                    onClick={handleStart}
                >
                    <span style={{ marginRight: '10px' }}>快速开始</span>
                    <FaRocket className={isHovered ? 'animate-hover' : 'animate-pulse'} />
                </HitechButton>
            </div>
            <div className="right-panel">
                <div className='feature-card'>
                    <div>
                        <div>
                            <FaMicrophone />
                        </div>
                        <div>
                            <h3>智能语音识别</h3>
                            <p>精准捕捉会议发言，支持多语言实时转写</p>
                        </div>
                    </div>
                </div>

                <div>
                    <div>
                        <div>
                            <FaClipboardList />
                        </div>
                        <div>
                            <h3>AI智能总结</h3>
                            <p>自动生成会议纪要，关键信息智能提取</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default QuickStart;