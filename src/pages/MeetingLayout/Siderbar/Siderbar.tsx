import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
    faFileArrowUp,
    faFileLines,
    faUser,
    faPenToSquare
} from '@fortawesome/free-solid-svg-icons';
import './Siderbar.css';
import { AIIcon } from '../../../component/Icons';
import { Tooltip } from 'antd';
import SettingsButton from './SettingsButton/SettingsButton';

interface SidebarProps {
    handleSummarize: () => void;
    handleInfoModalOpen: () => void;
    handleUploadModalOpen: () => void;
}

const Sidebar: React.FC<SidebarProps> = ({ handleSummarize, handleInfoModalOpen, handleUploadModalOpen }) => {
    return (
        <nav className="meeting-sidebar">
            {/* 原有侧边栏内容保持不变 */}
            <div className="btn-group">
                <Tooltip title="AI总结" placement="left">
                    <button className="nav-btn" onClick={handleSummarize}>
                        <AIIcon color='currentColor' className="icon" />
                    </button>
                </Tooltip>
                <Tooltip title="查看文件" placement="left">
                    <button className="nav-btn">
                        <FontAwesomeIcon icon={faFileLines} className="icon" />
                    </button>
                </Tooltip>
            </div>

            <div className="divider" />

            <div className="btn-group">
                <Tooltip title="编辑会议信息" placement="left">
                    <button className="nav-btn" onClick={handleInfoModalOpen}>
                        <FontAwesomeIcon icon={faPenToSquare} className="icon" />
                    </button>
                </Tooltip>
                <Tooltip title="上传文件" placement="left">
                    <button className="nav-btn" onClick={handleUploadModalOpen}>
                        <FontAwesomeIcon icon={faFileArrowUp} className="icon" />
                    </button>
                </Tooltip>
                <SettingsButton />
                <Tooltip title="用户" placement="left">
                    <button className="nav-btn">
                        <FontAwesomeIcon icon={faUser} className="icon" />
                    </button>
                </Tooltip>
            </div>
        </nav>
    );
};

export default Sidebar;