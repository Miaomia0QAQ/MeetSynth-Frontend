import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
    faFileArrowUp,
    faFileLines,
    faCog,
    faUser,
    faPenToSquare
} from '@fortawesome/free-solid-svg-icons';
import './Siderbar.css';
import { AIIcon } from '../../../component/Icons';
import { Tooltip } from 'antd';

interface SidebarProps {
    isCollapsed: boolean;
}

const Sidebar: React.FC<SidebarProps> = ({ isCollapsed }) => {
    return (
        <nav className={`meeting-sidebar ${isCollapsed ? 'collapsed' : ''}`}>
            {/* 原有侧边栏内容保持不变 */}
            <div className="btn-group">
                <Tooltip title="AI总结" placement="left">
                    <button className="nav-btn">
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
                <Tooltip title="编辑" placement="left">
                    <button className="nav-btn">
                        <FontAwesomeIcon icon={faPenToSquare} className="icon" />
                    </button>
                </Tooltip>
                <Tooltip title="上传文件" placement="left">
                    <button className="nav-btn">
                        <FontAwesomeIcon icon={faFileArrowUp} className="icon" />
                    </button>
                </Tooltip>
                <Tooltip title="设置" placement="left">
                    <button className="nav-btn">
                        <FontAwesomeIcon icon={faCog} className="icon" />
                    </button>
                </Tooltip>
                <Tooltip title="用户" placement="left">
                    <button className="nav-btn">
                        <FontAwesomeIcon icon={faUser} className="icon" />
                    </button>
                </Tooltip>
            </div>
        </nav>
    );
};

interface NavButtonProps {
    icon: any;
}

const NavButton: React.FC<NavButtonProps> = ({ icon }) => {
    return (
        <button className="nav-btn">
            <FontAwesomeIcon icon={icon} className="icon" />
        </button>
    );
};

export default Sidebar;