import { Navigate } from 'react-router-dom'
import { FC, ReactNode, useState, useEffect } from 'react'
import styled, { keyframes } from 'styled-components'

// 创建加载动画组件
const spin = keyframes`
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
`

const LoadingContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 100vh;
  background-color: #f5f5f5;
`

const Spinner = styled.div`
  width: 50px;
  height: 50px;
  border: 5px solid #e0e0e0;
  border-top: 5px solid #3498db;
  border-radius: 50%;
  animation: ${spin} 1s linear infinite;
`

const LoadingText = styled.p`
  margin-top: 20px;
  color: #666;
  font-size: 1.2rem;
  font-family: Arial, sans-serif;
`

const Loading = () => (
    <LoadingContainer>
        <Spinner />
        <LoadingText>正在验证权限...</LoadingText>
    </LoadingContainer>
)

// 增强的 PrivateRoute 组件
interface PrivateRouteProps {
    children: ReactNode
}

const PrivateRoute: FC<PrivateRouteProps> = ({ children }) => {
    // const [isChecking, setIsChecking] = useState(true)

    // useEffect(() => {
    //     // 模拟异步检查过程
    //     const timer = setTimeout(() => {
    //         setIsChecking(false)
    //     }, 1000) // 实际项目中可以替换为真实的 API 请求

    //     return () => clearTimeout(timer)
    // }, [])

    // if (isChecking) {
    //     return <Loading />
    // }

    const token = localStorage.getItem('token')
    return token ? <>{children}</> : <Navigate to="/login" replace />
}

export default PrivateRoute