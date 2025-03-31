import { Navigate } from 'react-router-dom'
import { FC, ReactNode } from 'react'

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