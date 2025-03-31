import { FC, useEffect, useState } from 'react'
import './AvatarManage.css'
import { UploadOutlined, PictureOutlined, UserOutlined } from '@ant-design/icons'
import { Upload, message, UploadFile, Avatar } from 'antd'
import { getUserInfoAPI, updateAvatarAPI } from '../../../apis/user'

const AvatarManager: FC = () => {
  // const userInfo = useSelector((state: RootState) => state.user.userInfo)
  const [avatar, setAvatar] = useState<string | null>(null)
  // const [currentAvatar, setCurrentAvatar] = useState<string>('')
  const [fileList, setFileList] = useState<any>([])
  const [uploading, setUploading] = useState(false)
  // const dispatch = useDispatch<AppDispatch>()

  // 获取用户信息
  useEffect(() => {
    getUserInfo()
  }, [])
  // 获取用户信息
  const getUserInfo = async () => {
    getUserInfoAPI().then((res) => {
      if (res.code === 1) {
        const { id, username, email, avatarUrl, role } = res.data;
        const userInfo = { id, username, email, avatarUrl, role };
        setAvatar(userInfo.avatarUrl);
      }
    })
  }

  const handleUpload = () => {
    if (fileList.length === 0) return
    setUploading(true)

    updateAvatarAPI(fileList[0])
      .then((result) => {
        if (result.code === 1) {
          message.success('头像更新成功');
          getUserInfo();
          setFileList([])
          // 如果需要保留新头像预览，可以注释下一行
          // setAvatar(null)
        } else {
          message.error(result.msg || '更新失败')
        }
      })
      .catch((error) => {
        message.error('请求失败')
        console.error('Update failed:', error)
      })
      .finally(() => {
        setUploading(false)
      })
  }

  const uploadProps = {
    onRemove: (file: UploadFile) => {
      const index = fileList.indexOf(file)
      const newFileList = fileList.slice()
      newFileList.splice(index, 1)
      setFileList(newFileList)
    },
    beforeUpload: (file: File) => {
      const isJpgOrPng = file.type === 'image/jpeg' || file.type === 'image/png';
      if (!isJpgOrPng) {
        message.error('请选择JPG/PNG格式的文件!');
        return false;
      }
      const isLt2M = file.size / 1024 / 1024 < 2;
      if (!isLt2M) {
        message.error('图片需小于2M!');
        return false;
      }
      // 直接读取文件并设置预览
      const reader = new FileReader();
      reader.onload = (e) => {
        setAvatar(e.target?.result as string); // 立即更新预览
      };
      reader.readAsDataURL(file);
      // 创建符合要求的文件对象
      // const rcFile = file as RcFile;
      // Object.assign(rcFile, {
      //   uid: Date.now().toString(),
      //   lastModifiedDate: new Date(file.lastModified)
      // });
    
      // 更新文件列表
      setFileList([file]);
    
      return false; // 阻止自动上传
    },
    fileList,
    showUploadList: false,
  }

  return (
    <div className="avatar-container">
      <div className="person-right-title">
        <h2 className="person-right-title-text">更换头像</h2>
      </div>
      <div className="avatar-box">
        <div className="avatar-left">
          <div className="avatar-file">
            <PictureOutlined style={{ marginRight: '10px' }} />
            <span className="file-text">选择默认图片</span>
          </div>
          <Upload {...uploadProps}>
            <div className="avatar-file">
              <UploadOutlined style={{ marginRight: '10px' }} />
              <span className="file-text">选择本地图片</span>
            </div>
          </Upload>
        </div>
        <div className="divider" />
        <div className="avatar-right">
          <div className="avatar-img">
            {avatar ? <Avatar style={{ height: '96px', width: '96px'}} src={avatar} alt="用户头像" /> : <UserOutlined style={{ fontSize: '50px', marginTop: '23px' }} />}
          </div>
          <p className="img-text">当前头像</p>
        </div>
      </div>
      <p className="avatar-text">
        请选择图片上传：大小180 * 180像素支持JPG、PNG等格式，图片需小于2M
      </p>
      <div className="modal-footer" onClick={handleUpload}>
        <input
          type="button"
          value="更新"
          className={`btn-confirm ${fileList.length === 0 ? 'disabled' : ''}`}
          disabled={uploading || fileList.length === 0}
        />
      </div>
    </div>
  )
}

export default AvatarManager
