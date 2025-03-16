import { useState } from 'react';
import { Steps, Input, Button, Space, Alert, Result } from 'antd';
import { MailOutlined, LockOutlined, SafetyOutlined } from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';
import './PasswordChange.css';

const { Step } = Steps;

const PasswordChange = () => {
    const [currentStep, setCurrentStep] = useState(0);
    const [oldPassword, setOldPassword] = useState('');
    const [code, setCode] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const navigate = useNavigate();

    const steps = [
        { title: '验证原密码', icon: <LockOutlined /> },
        { title: '邮箱验证', icon: <MailOutlined /> },
        { title: '设置新密码', icon: <SafetyOutlined /> },
    ];

    const validateOldPassword = () => {
        setLoading(true);
        setTimeout(() => {
            setLoading(false);
            if (oldPassword === '123456') { // 模拟验证
                setCurrentStep(1);
                setError('');
            } else {
                setError('原密码不正确');
            }
        }, 1000);
    };

    const validateCode = () => {
        if (code === '123456') {
            setCurrentStep(2);
            setError('');
        } else {
            setError('验证码错误');
        }
    };

    const handleSetPassword = () => {
        if (newPassword !== confirmPassword) {
            setError('两次输入的密码不一致');
            return;
        }
        setLoading(true);
        setTimeout(() => {
            setLoading(false);
            setCurrentStep(3);
        }, 1000);
    };

    const renderForm = () => {
        switch (currentStep) {
            case 0:
                return (
                    <div className="form-step">
                        <Input.Password
                            placeholder="请输入原密码"
                            value={oldPassword}
                            onChange={(e) => setOldPassword(e.target.value)}
                            size="large"
                            className="custom-input"
                        />
                        <Button
                            type="primary"
                            onClick={validateOldPassword}
                            loading={loading}
                            className="action-button"
                        >
                            下一步
                        </Button>
                    </div>
                );
            case 1:
                return (
                    <div className="form-step">
                        <Space direction="vertical" style={{ width: '100%' }}>
                            <Alert
                                message="验证码已发送至注册邮箱（xxx@example.com）"
                                type="info"
                                showIcon
                                className="info-alert"
                            />
                            <Input
                                placeholder="请输入6位验证码"
                                value={code}
                                onChange={(e) => setCode(e.target.value)}
                                size="large"
                                className="custom-input"
                                maxLength={6}
                            />
                        </Space>
                        <Button
                            type="primary"
                            onClick={validateCode}
                            className="action-button"
                        >
                            验证
                        </Button>
                    </div>
                );
            case 2:
                return (
                    <div className="form-step">
                        <Space direction="vertical" style={{ width: '100%' }}>
                            <Input.Password
                                placeholder="新密码（至少8位字符）"
                                value={newPassword}
                                onChange={(e) => setNewPassword(e.target.value)}
                                size="large"
                                className="custom-input"
                            />
                            <Input.Password
                                placeholder="确认新密码"
                                value={confirmPassword}
                                onChange={(e) => setConfirmPassword(e.target.value)}
                                size="large"
                                className="custom-input"
                            />
                        </Space>
                        <Button
                            type="primary"
                            onClick={handleSetPassword}
                            loading={loading}
                            className="action-button"
                        >
                            确认修改
                        </Button>
                    </div>
                );
            default:
                return (
                    <Result
                        status="success"
                        title="密码修改成功！"
                        subTitle="您可以使用新密码重新登录系统"
                        extra={[
                            <Button
                                type="primary"
                                key="return"
                                onClick={() => navigate('/user')}
                            >
                                返回用户中心
                            </Button>,
                        ]}
                        className="success-result"
                    />
                );
        }
    };

    return (
        <div className='password-change-container'>
            <div className="title">
                <h2 className="title-text">修改密码</h2>
            </div>
            <div className="steps-container">
                {currentStep < 3 && (
                    <Steps current={currentStep} className="custom-steps">
                        {steps.map((step) => (
                            <Step key={step.title} title={step.title} icon={step.icon} />
                        ))}
                    </Steps>
                )}
            </div>
            <div className="password-container">
                <div className="form-wrapper">
                    {error && (
                        <Alert message={error} type="error" showIcon className="error-alert" />
                    )}
                    {renderForm()}
                </div>
            </div>
        </div>
    );
};

export default PasswordChange;