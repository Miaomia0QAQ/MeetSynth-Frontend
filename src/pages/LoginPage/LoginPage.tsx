import React, { useEffect, useState } from 'react'
import { motion } from 'framer-motion';
import styles from './LoginPage.module.css'
import { getUserInfoAPI, loginAPI, registerAPI, sendcaptchaAPI } from '../../apis/user';
import { message } from 'antd';
import { useNavigate } from 'react-router-dom';

interface AuthData {
  username?: string;
  email: string;
  password: string;
  confirmPassword?: string;
  verificationCode?: string;
}

const LoginPage: React.FC = () => {
  const [isRegistering, setIsRegistering] = useState(false);
  const [authData, setAuthData] = useState<AuthData>({
    username: '',
    email: '',
    password: '',
    confirmPassword: '',
    verificationCode: ''
  });
  const [rememberMe, setRememberMe] = useState(false);
  const [countdown, setCountdown] = useState(0);
  const navigate = useNavigate();

  useEffect(() => {
    const stored = localStorage.getItem('credentials');
    if (stored) {
      const credentials = JSON.parse(stored);
      setAuthData((prev: AuthData) => ({ ...prev, password: credentials.password, email: credentials.email }));
      setRememberMe(credentials.remember);
    }
  }, []);

  // 发送验证码
  const handleSendCode = async () => {
    if (!authData.email?.match(/^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/)) {
      alert('请输入有效的邮箱地址');
      return;
    }

    setCountdown(60);
    const interval = setInterval(() => {
      setCountdown((prev: number) => (prev > 0 ? prev - 1 : 0));
    }, 1000);

    try {
      await sendcaptchaAPI(authData.email).then(res=> {
        if (res.code === 1) {
        } else {
          message.error('验证码发送失败');
        }
      })
    } catch (error) {
      clearInterval(interval);
      message.error('发送验证码失败');
    }
  };

  // 处理登录逻辑
  const handleLogin = async () => {
    try {
      const res = await loginAPI(authData).then();
      if (res.code === 1) {
        localStorage.setItem('token', res.data.token);
        navigate('/')
      }
    } catch (error) {
      message.error("登录失败，请检查网络连接")
    }
  }

  // 处理注册逻辑
  const handleRegister = async () => {
    const { email, password, username } = authData;
    const data = { email, password, username, captcha: authData.verificationCode };
    try {
      const res = await registerAPI(data).then();
      if (res.code === 1) {
        message.success('注册成功，请登录');
        handleChangeLoginState();
      } else {
        message.error(res.msg);
      }
    } catch (error) {
      console.error(error);
    }
  }

  // 处理登录/注册逻辑
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    // 密码确认校验
    if (isRegistering) {
      if (authData.password !== authData.confirmPassword) {
        alert('两次输入的密码不一致');
        return;
      }
      if (!authData.verificationCode) {
        alert('请输入验证码');
        return;
      }
    }

    // 处理登录逻辑
    if (!isRegistering) {
      handleLogin()
    }

    // 处理注册逻辑
    if (isRegistering) {
      handleRegister()
    }

    // 处理记住密码逻辑
    if (rememberMe && !isRegistering) {
      localStorage.setItem('credentials', JSON.stringify({
        email: authData.email,
        password: authData.password,
        remember: true
      }));
    } else {
      localStorage.removeItem('credentials');
    }
  };

  // 切换登录/注册状态
  const handleChangeLoginState = () => {
    setIsRegistering(!isRegistering);
    setAuthData({
      username: '',
      email: '',
      password: '',
      confirmPassword: '',
      verificationCode: ''
    });
  };

  return (
    <div className={styles.body}>
      <div className={styles.gridLines}></div>
      <div
        className={styles.container}
        key={isRegistering ? 'register' : 'login'}
      >
        <h2 className={styles.title}>{isRegistering ? '注册' : '登录'}</h2>
        <form onSubmit={handleSubmit}>
          {/* 用户名输入框 */}
          {isRegistering && (
            <div className={styles.inputBox}>
              <input
                type="text"
                required
                value={authData.username}
                onChange={e => setAuthData((prev: AuthData) => ({ ...prev, username: e.target.value }))}
              />
              <label className={authData.username ? styles.filled : ''}>用户名</label>
            </div>
          )
          }

          {/* 登录邮箱输入框 */}
          {!isRegistering && (
            <div className={styles.inputBox}>
              <input
                type="email"
                required
                value={authData.email}
                onChange={e => setAuthData((prev: AuthData) => ({ ...prev, email: e.target.value }))}
              />
              <label className={authData.email ? styles.filled : ''}>邮箱</label>
            </div>
          )
          }

          {/* 注册时邮箱输入框和验证码输入框 */}
          {isRegistering && (
            <>
              <motion.div
                key='email'
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                transition={{ duration: 0.2 }}
              >
                <div className={styles.inputBox}>
                  <input
                    type="email"
                    required
                    value={authData.email}
                    onChange={e => setAuthData((prev: AuthData) => ({ ...prev, email: e.target.value }))}
                  />
                  <label className={authData.email ? styles.filled : ''}>电子邮箱</label>
                </div>
              </motion.div>

              <motion.div
                key='code'
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                transition={{ duration: 0.2 }}
              >
                <div className={styles.codeContainer}>
                  <div className={styles.inputBox} style={{ flex: 2, marginBottom: 0 }}>
                    <input
                      type="text"
                      required
                      value={authData.verificationCode}
                      onChange={e => setAuthData((prev: AuthData) => ({ ...prev, verificationCode: e.target.value }))}
                    />
                    <label className={authData.verificationCode ? styles.filled : ''}>验证码</label>
                  </div>
                  <button
                    type="button"
                    onClick={handleSendCode}
                    className={styles.codeButton}
                    disabled={countdown > 0}
                  >
                    {countdown > 0 ? `${countdown}s后重发` : '获取验证码'}
                  </button>
                </div>
              </motion.div>
            </>
          )}

          <div className={styles.inputBox}>
            <input
              type="password"
              required
              value={authData.password}
              onChange={e => setAuthData((prev: AuthData) => ({ ...prev, password: e.target.value }))}
            />
            <label className={authData.password ? styles.filled : ''}>密码</label>
          </div>

          {isRegistering && (
            <div className={styles.inputBox}>
              <input
                type="password"
                required
                value={authData.confirmPassword}
                onChange={e => setAuthData((prev: AuthData) => ({ ...prev, confirmPassword: e.target.value }))}
              />
              <label className={authData.confirmPassword ? styles.filled : ''}>确认密码</label>
            </div>
          )}
          {!isRegistering && (
            <div className={styles.rememberContainer}>
              <label className={styles.rememberLabel}>
                <input
                  type="checkbox"
                  checked={rememberMe}
                  onChange={e => setRememberMe(e.target.checked)}
                  className={styles.rememberCheckbox}
                />
                <span className={styles.rememberText}>记住登录</span>
              </label>
            </div>
          )}

          <button
            type="submit"
            className={styles.button}
          >
            {isRegistering ? '立即注册' : '进入系统'}
          </button>

          <div className={styles.toggleAuth}>
            <motion.button
              type="button"
              onClick={handleChangeLoginState}
              className={styles.toggleButton}
              whileHover={{ color: '#00ffff' }}
              transition={{ duration: 0.2 }}
            >
              {isRegistering ? '已有账号？去登录' : '没有账号？去注册'}
            </motion.button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default LoginPage
