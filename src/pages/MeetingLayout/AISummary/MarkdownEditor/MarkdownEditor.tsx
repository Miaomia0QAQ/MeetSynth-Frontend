import React, { useState, useRef, useEffect } from 'react';
import ReactMarkdown, { Components } from 'react-markdown';
import remarkGfm from 'remark-gfm';
import remarkMath from 'remark-math';
import rehypeKatex from 'rehype-katex';
import { Highlight as SyntaxHighlighter, Language, PrismTheme } from 'prism-react-renderer';
import { visit } from 'unist-util-visit';
import type { Node } from 'unist';
import {
    BoldOutlined,
    ItalicOutlined,
    LinkOutlined,
    PictureOutlined,
    CodeOutlined,
    OrderedListOutlined,
    UnorderedListOutlined,
    CheckOutlined,
    LayoutOutlined
} from '@ant-design/icons';
import '../MarkdownRenderer/MarkdownRenderer.css';
import './MarkdownEditor.css'
import { Button, Divider, Splitter, Tooltip } from 'antd';

// 定义支持的编程语言类型
type SupportedLanguage =
    'javascript' | 'typescript' | 'python' | 'java' |
    'cpp' | 'csharp' | 'go' | 'rust' | 'sql' |
    'json' | 'yaml' | 'bash' | 'html' | 'css';

const supportedLanguages: SupportedLanguage[] = [
    'javascript',
    'typescript',
    'python',
    'java',
    'cpp',
    'csharp',
    'go',
    'rust',
    'sql',
    'json',
    'yaml',
    'bash',
    'html',
    'css'
];

// 定义主题类型
interface CustomPrismTheme extends PrismTheme {
    styles: Array<{
        types: string[];
        style: {
            color?: string;
            fontStyle?: 'italic';
            opacity?: number;
        };
    }>;
}

const theme: CustomPrismTheme = {
    plain: {
        color: "#393A34",
        backgroundColor: "#f6f8fa",
    },
    styles: [
        {
            types: ["comment", "prolog", "doctype", "cdata"],
            style: {
                color: "#999988",
                fontStyle: "italic",
            },
        },
        {
            types: ["namespace"],
            style: {
                opacity: 0.7,
            },
        },
        {
            types: ["string", "attr-value"],
            style: {
                color: "#e3116c",
            },
        },
        {
            types: ["punctuation", "operator"],
            style: {
                color: "#393A34",
            },
        },
    ]
};

interface MarkdownEditorProps {
    value: string;
    onChange?: (value: string) => void;
    setIsEdit: (value: boolean) => void;
}

function rehypeSyntaxHighlight() {
    return (tree: Node) => {
        visit(tree, 'element', (node: any) => {
            if (node.tagName === 'code' && node.data?.meta) {
                const className = node.properties.className?.[0] || '';
                const lang = className.replace('language-', '') as SupportedLanguage;
                if (supportedLanguages.includes(lang)) {
                    node.properties['data-language'] = lang;
                }
            }
        });
    };
}

const MarkdownEditor: React.FC<MarkdownEditorProps> = ({ value, onChange, setIsEdit }) => {
    const [content, setContent] = useState(value);
    const [isPreview, setIsPreview] = useState(0);
    const [sizes, setSizes] = useState<(number | string)[]>(['50%', '50%']);
    const textAreaRef = useRef<HTMLTextAreaElement>(null);

    useEffect(() => {
        if (isPreview === 1) {
            setSizes(['100%', '0']);
        } else if (isPreview === 2) {
            setSizes(['0', '100%']);
        } else {
            setSizes(['50%', '50%']);
        }
    }, [isPreview]);

    useEffect(() => {
        const processedContent = content.replace(
            /(^#{1,6})([^\s#])/gm,
            (_, hashes, text) => `${hashes} ${text}`
        );
        setContent(processedContent);
    }, [value]);

    const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
        const newValue = e.target.value;
        setContent(newValue);
        onChange?.(newValue);
    };

    const insertText = (
        prefix: string,
        suffix: string = '',
        placeholder: string = '',
        offset: number = 0 // 新增偏移量参数
    ) => {
        const textarea = textAreaRef.current;
        if (!textarea) return;

        const start = textarea.selectionStart;
        const end = textarea.selectionEnd;
        const selectedText = content.slice(start, end);

        // 计算新的内容
        const newText = `${content.slice(0, start)}${prefix}${selectedText}${suffix}${placeholder}${content.slice(end)}`;
        setContent(newText);

        // 计算新的光标位置（增加偏移量）
        const basePosition = start + prefix.length + selectedText.length + suffix.length;
        const newPos = Math.max(0, basePosition + offset); // 确保位置不小于0

        // 异步设置光标位置
        setTimeout(() => {
            textarea.selectionStart = newPos;
            textarea.selectionEnd = newPos;
            textarea.focus();
        }, 0);
    };

    // 工具栏操作处理函数
    const handleHeading = (level: number) => insertText('#'.repeat(level) + ' ');
    const handleBold = () => {
        const textarea = textAreaRef.current;
        if (!textarea) return;

        const hasSelection = textarea.selectionStart !== textarea.selectionEnd;

        // 如果有选中文本，光标留在末尾；没有选中则左移两位
        insertText('**', '**', '', hasSelection ? 0 : -2);
    };
    const handleItalic = () => {
        const textarea = textAreaRef.current;
        if (!textarea) return;

        const hasSelection = textarea.selectionStart !== textarea.selectionEnd;

        // 如果有选中文本，光标留在末尾；没有选中则左移两位
        insertText('*', '*', '', hasSelection ? 0 : -1);
    };
    const handleLink = () => insertText('[', '](https://)');
    const handleImage = () => insertText('![alt](', ')');
    const handleCode = () => insertText('```\n', '\n```\n');
    const handleList = (ordered: boolean) => insertText(ordered ? '1. ' : '- ', '\n');

    return (
        <div className="markdown-editor">
            <div className="editor-toolbar">
                {/* 左侧格式工具 */}
                <div className="toolbar-left">
                    <Tooltip title="一级标题 (Ctrl+1)">
                        <Button
                            type="text"
                            onClick={() => handleHeading(1)}
                            style={{ fontWeight: 'bold', width: '32px', border: 'none', backgroundColor: 'transparent' }}
                        >
                            h1
                        </Button>
                    </Tooltip>
                    <Tooltip title="二级标题 (Ctrl+2)">
                        <Button
                            type="text"
                            onClick={() => handleHeading(1)}
                            style={{ fontWeight: 'bold', width: '32px', border: 'none', backgroundColor: 'transparent' }}
                        >
                            h2
                        </Button>
                    </Tooltip>
                    <Divider type="vertical" style={{ fontWeight: '600', height: '24px' }} />
                    <Tooltip title="加粗 (Ctrl+B)">
                        <Button type="text" icon={<BoldOutlined />} onClick={handleBold} style={{ border: 'none', backgroundColor: 'transparent' }} />
                    </Tooltip>
                    <Tooltip title="斜体 (Ctrl+I)">
                        <Button type="text" icon={<ItalicOutlined />} onClick={handleItalic} style={{ border: 'none', backgroundColor: 'transparent' }} />
                    </Tooltip>
                    <Divider type="vertical" style={{ fontWeight: '600', height: '24px' }} />
                    <Tooltip title="插入链接">
                        <Button type="text" icon={<LinkOutlined />} onClick={handleLink} style={{ border: 'none', backgroundColor: 'transparent' }} />
                    </Tooltip>
                    <Tooltip title="插入图片">
                        <Button type="text" icon={<PictureOutlined />} onClick={handleImage} style={{ border: 'none', backgroundColor: 'transparent' }} />
                    </Tooltip>
                    <Tooltip title="代码块">
                        <Button type="text" icon={<CodeOutlined />} onClick={handleCode} style={{ border: 'none', backgroundColor: 'transparent' }} />
                    </Tooltip>
                    <Divider type="vertical" style={{ fontWeight: '600', height: '24px' }} />
                    <Tooltip title="无序列表">
                        <Button type="text" icon={<UnorderedListOutlined />} onClick={() => handleList(false)} style={{ border: 'none', backgroundColor: 'transparent' }} />
                    </Tooltip>
                    <Tooltip title="有序列表">
                        <Button type="text" icon={<OrderedListOutlined />} onClick={() => handleList(true)} style={{ border: 'none', backgroundColor: 'transparent' }} />
                    </Tooltip>
                </div>

                {/* 右侧操作按钮 */}
                <div className="toolbar-right">
                    <Tooltip title="编辑器布局">
                        <Button
                            type="text"
                            icon={<LayoutOutlined />}
                            style={{ backgroundColor: 'transparent' }}
                            onClick={() => { setIsPreview(prev => (prev + 1) % 3) }}
                        />
                    </Tooltip>
                    <Tooltip title="完成编辑">
                        <Button
                            type="text"
                            icon={<CheckOutlined />}
                            style={{ backgroundColor: 'transparent' }}
                            onClick={() => setIsEdit(false)}
                        />
                    </Tooltip>
                </div>
            </div>

            <Splitter className="editor-container" onResize={setSizes}>
                <Splitter.Panel style={{ overflow: 'hidden' }} collapsible={true} size={sizes[0]}>
                    <textarea
                        ref={textAreaRef}
                        className="editor-input"
                        value={content}
                        onChange={handleChange}
                        placeholder="输入Markdown内容..."
                    />
                </Splitter.Panel>
                <Splitter.Panel collapsible={true} size={sizes[1]}>
                    <div className="editor-preview">
                        <ReactMarkdown
                            remarkPlugins={[remarkGfm, remarkMath]}
                            rehypePlugins={[rehypeKatex, rehypeSyntaxHighlight]}
                            components={{
                                code({ node, className, children, ...props }) {
                                    const match = /language-(\w+)/.exec(className || '');
                                    const language = (match?.[1] || 'text') as Language;
                                    const codeContent = String(children).replace(/\n$/, '');

                                    return node && node.position && !(node.position.start.line === node.position.end.line) ? (
                                        <SyntaxHighlighter
                                            language={language}
                                            theme={theme}
                                            code={codeContent}
                                        >
                                            {({ className, style, tokens, getLineProps, getTokenProps }) => (
                                                <div className="code-block-wrapper">
                                                    <div className="code-header">
                                                        <span className="code-language">{language}</span>
                                                        <button
                                                            className="copy-button"
                                                            onClick={() => navigator.clipboard.writeText(codeContent)}
                                                        >
                                                            复制
                                                        </button>
                                                    </div>
                                                    <pre className={className} style={style}>
                                                        {tokens.map((line, i) => (
                                                            <div key={i} {...getLineProps({ line })}>
                                                                <span className="line-number">{i + 1}</span>
                                                                {line.map((token, key) => (
                                                                    <span key={key} {...getTokenProps({ token })} />
                                                                ))}
                                                            </div>
                                                        ))}
                                                    </pre>
                                                </div>
                                            )}
                                        </SyntaxHighlighter>
                                    ) : (
                                        <code className="inline-code" {...props}>
                                            {children}
                                        </code>
                                    );
                                },
                                table({ node, children, ...props }) {
                                    return (
                                        <div className="table-wrapper">
                                            <table {...props}>{children}</table>
                                        </div>
                                    );
                                },
                                img({ node, alt, src, ...props }) {
                                    return (
                                        <img
                                            alt={alt}
                                            src={src || ''}
                                            {...props}
                                            style={{ maxWidth: '100%', height: 'auto' }}
                                        />
                                    );
                                },
                                math: ({ children }: { children: React.ReactNode }) => (
                                    <span className="math-inline">{children}</span>
                                ),
                                mtext: ({ children }: { children: React.ReactNode }) => (
                                    <span className="math-text">{children}</span>
                                ),
                                h1: ({ node, children, ...props }) => (
                                    <h1 className="md-heading md-h1" {...props}>
                                        {children}
                                    </h1>
                                ),
                                h2: ({ node, children, ...props }) => (
                                    <h2 className="md-heading md-h2" {...props}>
                                        {children}
                                    </h2>
                                ),
                                h3: ({ node, children, ...props }) => (
                                    <h3 className="md-heading md-h3" {...props}>
                                        {children}
                                    </h3>
                                ),
                                h4: ({ node, children, ...props }) => (
                                    <h4 className="md-heading md-h4" {...props}>
                                        {children}
                                    </h4>
                                ),
                                h5: ({ node, children, ...props }) => (
                                    <h5 className="md-heading md-h5" {...props}>
                                        {children}
                                    </h5>
                                ),
                                h6: ({ node, children, ...props }) => (
                                    <h6 className="md-heading md-h6" {...props}>
                                        {children}
                                    </h6>
                                ),
                            } as Components}
                        >
                            {content}
                        </ReactMarkdown>
                    </div>
                </Splitter.Panel>
            </Splitter>
        </div>
    );
};

export default MarkdownEditor;