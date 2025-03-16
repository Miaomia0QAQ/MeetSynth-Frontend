import React, { FC, useEffect, useState } from 'react'
import './AvatarManage.css'
import { UploadOutlined, PictureOutlined, UserOutlined } from '@ant-design/icons'
import { Upload, message, UploadFile } from 'antd'
// import { useDispatch, useSelector } from 'react-redux'
// import { UploadImageAPI } from '../../../apis/upload'
// import { GetUserInfoAPI, UpdateAvatarAPI } from '../../../apis/user'
import type { UploadChangeParam } from 'antd/es/upload'
// import type { RootState } from '../../../store' // 请根据你的 store 类型定义路径调整
// import type { AppDispatch } from '../../../store' // 请根据你的 store 配置调整

const AvatarManager: FC = () => {
  // const userInfo = useSelector((state: RootState) => state.user.userInfo)
  const [avatar, setAvatar] = useState<string | null>(null)
  // const [currentAvatar, setCurrentAvatar] = useState<string>('')
  const [fileList, setFileList] = useState<UploadFile[]>([])
  const [uploading, setUploading] = useState(false)
  // const dispatch = useDispatch<AppDispatch>()

  // 获取用户信息
  // useEffect(() => {
  //   if (userInfo) {
  //     setCurrentAvatar(userInfo.avatar)
  //   }
  // }, [userInfo])

  const handleUpload = () => {
    const formData = new FormData()
    fileList.forEach((file) => {
      formData.append('image', file.originFileObj as File)
    })
    setUploading(true)

    // 上传图片
    //   UploadImageAPI(formData)
    //     .then((result) => {
    //       setFileList([])
    //       if (result.code === 1) {
    //         UpdateAvatarAPI(result.data)
    //           .then((updateResult) => {
    //             if (updateResult.code === 1) {
    //               GetUserInfoAPI()
    //                 .then((res) => {
    //                   if (res.code === 1) {
    //                     dispatch({ type: 'user/fetchUserInfo', payload: res.data })
    //                   }
    //                 })
    //                 .catch((error) => {
    //                   console.error('Fetch user info failed:', error)
    //                 })
    //               window.location.reload()
    //               message.success('修改成功')
    //             } else {
    //               message.error('头像修改失败')
    //             }
    //           })
    //           .catch((error) => {
    //             console.error('Update avatar failed:', error)
    //           })
    //       } else {
    //         message.error('图片上传失败')
    //       }
    //     })
    //     .catch(() => {
    //       message.error('图片上传失败')
    //     })
    //     .finally(() => {
    //       setUploading(false)
    //     })
  }

  const uploadProps = {
    onRemove: (file: UploadFile) => {
      const index = fileList.indexOf(file)
      const newFileList = fileList.slice()
      newFileList.splice(index, 1)
      setFileList(newFileList)
    },
    beforeUpload: (file: File) => {
      const isJpgOrPng = file.type === 'image/jpeg' || file.type === 'image/png'
      if (!isJpgOrPng) {
        message.error('请选择JPG/PNG格式的文件!')
        return false
      }
      const isLt2M = file.size / 1024 / 1024 < 2
      if (!isLt2M) {
        message.error('图片需小于2M!')
        return false
      }
      // setFileList([{ uid: file.name, name: file.name, status: 'done', originFileObj: file }])
      return false
    },
    onChange: (info: UploadChangeParam) => {
      if (info.file) {
        const reader = new FileReader()
        reader.onload = (e) => {
          setAvatar(e.target?.result as string)
        }
        if (info.file.originFileObj) {
          reader.readAsDataURL(info.file.originFileObj)
        }
      }
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
            {avatar ? <img src={avatar} alt="用户头像" /> : <UserOutlined style={{ fontSize: '50px', marginTop: '23px'}} />}
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
