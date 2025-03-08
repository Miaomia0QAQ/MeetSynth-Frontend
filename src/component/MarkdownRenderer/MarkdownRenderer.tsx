import React from 'react';
import ReactMarkdown, { Components } from 'react-markdown';
import remarkGfm from 'remark-gfm';
import remarkMath from 'remark-math';
import rehypeKatex from 'rehype-katex';
import { Highlight as SyntaxHighlighter, Language, PrismTheme } from 'prism-react-renderer';
import { visit } from 'unist-util-visit';
import type { Node } from 'unist';
import './MarkdownRenderer.css';

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
  const processedContent = content.replace(
    /(^#{1,6})([^\s#])/gm,
    (_, hashes, text) => `${hashes} ${text}`
  );

  return (
    <div className="markdown-container">
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
  );
};

export default MarkdownRenderer;