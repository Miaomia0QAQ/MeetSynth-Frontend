import { useEffect, useState } from 'react';
import { Avatar, List, Button, Popconfirm, Input, Space, message } from 'antd';
import { EditOutlined, MailOutlined, LockOutlined, DeleteOutlined } from '@ant-design/icons';
import { Link, useNavigate } from 'react-router-dom';
import './AccountManage.css';
import { deleteAccountAPI, getUserInfoAPI, updateUsernameAPI } from '../../../apis/user';

const AccountManage = () => {
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [avatar, setAvatar] = useState('');
  const [isEditing, setIsEditing] = useState(false);
  const [tempUsername, setTempUsername] = useState(username);
  const navigate = useNavigate();

  // 模拟数据
  const userInfo = {
    meetingCount: 15,
  };

  // 获取用户信息
  const getUserInfo = async () => {
    getUserInfoAPI().then((res) => {
      if (res.code === 1) {
        const { id, username, email, avatarUrl, role } = res.data;
        const userInfo = { id, username, email, avatarUrl, role };
        setUsername(userInfo.username);
        setAvatar(userInfo.avatarUrl);
        setEmail(userInfo.email);
      }
    })
  }

  useEffect(() => {
    getUserInfo();
  }, []);

  // 修改用户名
  const handleSaveUsername = async () => {
    setUsername(tempUsername);
    await updateUsernameAPI(tempUsername).then((res) => {
      if (res.code === 1) {
        getUserInfo();
        setIsEditing(false);
        message.success('用户名修改成功');
      } else {
        message.error('用户名修改失败');
      }
    }).catch((err) => console.log(err));
  };

  // 取消注销
  const handleCancelDelete = () => {
    // message.error('已取消注销操作');
  };

  // 注销
  const handleComfirmDelete = () => {
    deleteAccountAPI().then((res) => {
      if (res.code === 1) {
        message.success('已注销账号');
        setTimeout(() => {
          navigate('/login');
        }, 1000);
      } else {
        message.error('注销失败');
      }
    });
  }

  return (
    <div className="account-container">
      {/* 信息展示板块 */}
      <h2 className="section-title">个人信息</h2>
      <div className="profile-info">
        <Link to="/userCenter/info/avatar">
          <Avatar
            src={avatar}
            size={80}
            className="profile-avatar"
          />
        </Link>
        <div className="profile-detail">
          {isEditing ? (
            <Space>
              <Input
                value={tempUsername}
                onChange={(e) => setTempUsername(e.target.value)}
                style={{ width: 200 }}
              />
              <Button type="primary" onClick={handleSaveUsername}>
                保存
              </Button>
              <Button onClick={() => setIsEditing(false)}>取消</Button>
            </Space>
          ) : (
            <Space>
              <div className="username">{username}</div>
              <Button
                icon={<EditOutlined />}
                onClick={() => setIsEditing(true)}
              />
            </Space>
          )}
          <div className="meeting-count">
            已创建会议：{userInfo.meetingCount} 次
          </div>
        </div>
      </div>

      {/* 安全设置板块 */}
      <h2 className="section-title">安全设置</h2>
      <List className="security-list">
        <List.Item>
          <List.Item.Meta
            avatar={<MailOutlined />}
            title="绑定邮箱"
            description={email}
          />
          {/* <Button onClick={() => navigate('/user/security/email')}>
            修改邮箱
          </Button> */}
        </List.Item>
        <List.Item>
          <List.Item.Meta
            avatar={<LockOutlined />}
            title="登录密码"
            description="••••••••"
          />
          <Button onClick={() => navigate('/userCenter/password')}>
            修改密码
          </Button>
        </List.Item>
      </List>

      {/* 账号注销板块 */}
      <h2 className="section-title">风险操作</h2>
      <Popconfirm
        title="确定要注销账号吗？"
        description="此操作将永久删除所有数据且不可恢复！"
        okText="确认注销"
        cancelText="取消"
        okButtonProps={{ danger: true }}
        onConfirm={handleComfirmDelete}
        onCancel={handleCancelDelete}
      >
        <Button
          danger
          icon={<DeleteOutlined />}
          className="delete-account-btn"
        >
          注销账号
        </Button>
      </Popconfirm>
    </div>
  );
};

export default AccountManage;
