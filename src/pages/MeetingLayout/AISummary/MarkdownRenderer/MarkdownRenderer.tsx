import React from 'react';
import ReactMarkdown, { Components } from 'react-markdown';
import remarkGfm from 'remark-gfm';
import remarkMath from 'remark-math';
import rehypeKatex from 'rehype-katex';
import { Highlight as SyntaxHighlighter, Language, PrismTheme } from 'prism-react-renderer';
import { visit } from 'unist-util-visit';
import type { Node } from 'unist';
import './MarkdownRenderer.css';
import AIChatInput from './AIChatInput/AIChatInput';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';

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

// 定义组件props类型
interface MarkdownRendererProps {
  content: string;
}

// 自定义rehype插件处理代码块
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

const MarkdownRenderer: React.FC<MarkdownRendererProps> = ({ content }) => {
  // 拓展markdown语法处理范围（#号后不带空格也可处理为标题）
  const processedContent = content
  .replace(/(^#{1,6})([^\s#])/gm, (_, hashes, text) => `${hashes} ${text}`)
  .replace(/(^[-])([^\s])/gm, (_, symbol, text) => `${symbol} ${text}`)
  .replace(/(\*\*.*?\*\*)(\S)/g, (_, boldText, nextChar) => `${boldText} ${nextChar}`);

  // 导出pdf
  const exportPdf = async () => {
    const element = document.getElementById('md-content');
    if (!element) return;

    // 1. 将 HTML 转为 Canvas（提升清晰度）
    const canvas = await html2canvas(element);

    // 2. 定义边距（单位：毫米）
    const margin = {
      top: 10,
      right: 0,
      bottom: 10,
      left: 0,
    };

    // 3. 创建 PDF 实例（A4纵向：210mm x 297mm）
    const pdf = new jsPDF('p', 'mm', 'a4');
    const pageWidth = pdf.internal.pageSize.getWidth(); // 210mm
    const pageHeight = pdf.internal.pageSize.getHeight(); // 297mm

    // 4. 计算内容区域尺寸（扣除边距）
    const contentWidth = pageWidth - margin.left - margin.right;
    const contentHeight = pageHeight - margin.top - margin.bottom;

    // 5. 计算图片缩放比例（确保内容适应边距区域）
    const imgWidth = contentWidth; // 宽度占满内容区域
    const imgHeight = (canvas.height * imgWidth) / canvas.width;

    // 6. 如果高度超出内容区域，按高度缩放
    let finalWidth = imgWidth;
    let finalHeight = imgHeight;
    if (imgHeight > contentHeight) {
      finalHeight = contentHeight;
      finalWidth = (canvas.width * finalHeight) / canvas.height;
    }

    // 7. 居中内容（水平方向）
    const x = margin.left + (contentWidth - finalWidth) / 2;
    const y = margin.top;

    // 8. 添加图片到 PDF
    pdf.addImage(canvas, 'PNG', x, y, finalWidth, finalHeight);

    // 9. 保存 PDF
    pdf.save('document-with-padding.pdf');
  };

  return (
    <div className='renderer-container'>
      {/* 内容显示 */}
      <div className="markdown-container" id='md-content'>
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
          {processedContent}
        </ReactMarkdown>
      </div>

      {/* 消息发送 */}
      <AIChatInput onExportPdf={exportPdf} />
    </div>
  );
};

export default MarkdownRenderer;