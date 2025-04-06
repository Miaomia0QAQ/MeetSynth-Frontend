import {
    useEffect,
    useRef,
    useState,
    forwardRef,
    useImperativeHandle,
    ForwardedRef
} from 'react'
import './AISummary.css'
import MarkdownRenderer from './MarkdownRenderer/MarkdownRenderer'
import request from '../../../utils/request'
import MarkdownEditor from './MarkdownEditor/MarkdownEditor'
import { saveAISummaryAPI } from '../../../apis/meeting'
import { Alert, message, Spin } from 'antd'
import { isEditContext } from './isEditContext'

export interface AISummaryRef {
    sendRequest: () => void
    setSummary: (newSummary: string) => void
}

interface AISummaryProps {
    id: string,
}

const AISummary = forwardRef((
    props: AISummaryProps,
    ref: ForwardedRef<AISummaryRef>
) => {
    const [isLoading, setIsLoading] = useState<boolean>(false)
    const [error, setError] = useState<string | null>(null)
    const [summary, setSummary] = useState<string>('')
    const eventSourceRef = useRef<EventSource | null>(null)
    const [isEdit, setIsEdit] = useState(false);
    const [feedback, setFeedback] = useState('');

    // 暴露方法给父组件
    useImperativeHandle(ref, () => ({
        sendRequest: () => {
            if (!summary || summary.trim() === '') {
                handleSendRequest()
            }
        },
        setSummary: (newSummary: string) => {
            setSummary(newSummary)
        }
    }))

    // 关闭SSE连接
    const closeEventSource = () => {
        if (eventSourceRef.current) {
            eventSourceRef.current.close()
            eventSourceRef.current = null
        }
    }

    // 处理流式更新
    const handleStreamUpdate = (chunk: string) => {
        setSummary(prev => prev + chunk)
    }

    // 发送请求的核心方法
    const handleSendRequest = async () => {
        if (isLoading) return

        try {
            setIsLoading(true)
            setError(null)
            setSummary('')
            closeEventSource()

            // 建立SSE连接
            const eventSource = new EventSource(
                `${request.defaults.baseURL}/ai/summary?message=${feedback}&id=${props.id}`
            )
            eventSourceRef.current = eventSource

            // 处理消息接收
            const handleMessage = (event: MessageEvent) => {
                if (event.data === 'event: end') {
                    closeEventSource()
                    saveAISummary()
                    setIsLoading(false)
                    return
                }
                handleStreamUpdate(event.data)
            }

            // 处理错误
            const handleError = (err: Event) => {
                console.error('SSE Error:', err)
                setError('连接异常，请重试')
                closeEventSource()
                setIsLoading(false)
            }

            // 处理结束
            const handleEnd = () => {
                closeEventSource()
                setIsLoading(false)
            }

            eventSource.addEventListener('message', handleMessage)
            eventSource.addEventListener('end', handleEnd)
            eventSource.addEventListener('error', handleError)

        } catch (error) {
            console.error('发送失败:', error)
            setError('请求发送失败')
            setIsLoading(false)
        }
    }

    const saveAISummary = async () => {
        saveAISummaryAPI(props.id, summary).then(res => {
            if (res.code === 1) {
            } else {
                message.error(res.msg || '总结保存失败');
            }
        }).catch(err => {
            message.error('总结保存失败，请检查网络');
            console.error(err);
        });
    }

    useEffect(() => {
        if (!isEdit && summary && summary.trim() !== '') {
            saveAISummary();
        }
    }, [isEdit])

    // 组件卸载时清理连接
    useEffect(() => {
        return () => {
            closeEventSource()
        }
    }, [])

    return (
        <div className='ai-summary-container'>
            {/* 加载指示器 */}
            {isLoading && (!summary || summary.trim() === '') && <Spin style={{ position: 'absolute', top: '20px', left: '20px' }} />}

            {/* 错误提示 */}
            {error && <Alert message="服务器繁忙，请稍后重试" type="error" showIcon style={{ position: 'absolute', top: '20px', left: '20px' }} />}

            {/* 总结内容显示 */}
            <div className="summary-content">
                {isEdit ?
                    <MarkdownEditor value={summary} onChange={setSummary} setIsEdit={setIsEdit} />
                    :
                    <isEditContext.Provider value={{ feedback, setFeedback, isEdit, setIsEdit, handleSendRequest }}>
                        <MarkdownRenderer content={summary} />
                    </isEditContext.Provider>
                }
            </div>

        </div>
    )
})

export default AISummary