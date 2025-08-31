import React from "react";
import ReactMarkdown from "react-markdown";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { atomDark } from "react-syntax-highlighter/dist/esm/styles/prism";
import remarkGfm from "remark-gfm";
import remarkMath from "remark-math";
import rehypeKatex from "rehype-katex";
import { Divider, Tooltip, Button } from "@heroui/react";
import { Icon } from "@iconify/react";

// Interface matching the database structure
export interface ArticleDisplayProps {
  index: number;
  doc_content: string;
  update_taime: Date;
  autor: string;
  docid: string;
  doc_title: string;
}

export const ArticleDisplay: React.FC<ArticleDisplayProps> = ({
  doc_title,
  doc_content,
  update_taime,
  autor,
}) => {
  // Format the date
  const formatDate = (date: Date) => {
    return new Intl.DateTimeFormat("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    }).format(date);
  };

  // Copy code function
  const copyToClipboard = (code: string) => {
    navigator.clipboard.writeText(code);
  };

  return (
    <article id="article-test" className="article-container w-full max-w-none">
      <style>{`
        .article-content {
          line-height: 1.7;
        }

        .article-content h1 {
          font-size: 2rem;
          font-weight: 700;
          margin-top: 2rem;
          margin-bottom: 1rem;
        }

        .article-content h2 {
          font-size: 1.5rem;
          font-weight: 600;
          margin-top: 1.5rem;
          margin-bottom: 0.75rem;
        }

        .article-content h3 {
          font-size: 1.25rem;
          font-weight: 600;
          margin-top: 1.25rem;
          margin-bottom: 0.5rem;
        }

        .article-content h4 {
          font-size: 1.125rem;
          font-weight: 600;
          margin-top: 1rem;
          margin-bottom: 0.5rem;
        }

        .article-content p {
          margin-bottom: 1rem;
        }

        .article-content ul, .article-content ol {
          margin-left: 1.5rem;
          margin-bottom: 1rem;
        }

        .article-content ul {
          list-style-type: disc;
        }

        .article-content ol {
          list-style-type: decimal;
        }

        .article-content li {
          margin-bottom: 0.25rem;
        }

        .article-content blockquote {
          border-left: 4px solid hsl(var(--heroui-primary-300));
          padding-left: 1rem;
          margin-left: 0;
          margin-right: 0;
          margin-bottom: 1rem;
          font-style: italic;
          color: hsl(var(--heroui-foreground-500));
        }

        .article-content a {
          color: hsl(var(--heroui-primary-500));
          text-decoration: underline;
        }

        .article-content img {
          max-width: 100%;
          margin: 1.5rem 0;
          border-radius: 0.5rem;
        }

        .article-content table {
          width: 100%;
          border-collapse: collapse;
          margin-bottom: 1rem;
        }

        .article-content table th,
        .article-content table td {
          border: 1px solid hsl(var(--heroui-default-200));
          padding: 0.5rem;
        }

        .article-content table th {
          background-color: hsl(var(--heroui-default-100));
        }

        .article-content hr {
          margin: 2rem 0;
          border: 0;
          border-top: 1px solid hsl(var(--heroui-default-200));
        }

        .article-content .math-display {
          overflow-x: auto;
          padding: 1rem 0;
        }
      `}</style>
      {/* Article Header */}
      <header className="mb-4">
        <h1 className="text-3xl font-bold text-foreground mb-2">{doc_title}</h1>
        <div className="flex items-center text-foreground-500 text-sm mb-2">
          <div className="flex items-center mr-4">
            <Icon icon="lucide:calendar" className="mr-1" />
            <span>{formatDate(update_taime)}</span>
          </div>
          <div className="flex items-center">
            <Icon icon="lucide:user" className="mr-1" />
            <span>{autor}</span>
          </div>
        </div>
      </header>

      <Divider className="my-4" />

      {/* Article Content */}
      <div className="article-content w-full">
        <ReactMarkdown
          rehypePlugins={[rehypeKatex]}
          remarkPlugins={[remarkGfm, remarkMath]}
          components={{
            code({
              node,
              inline,
              className,
              children,
              ...props
            }: {
              node?: any;
              inline?: boolean;
              className?: string;
              children?: React.ReactNode;
              [key: string]: any;
            }) {
              const match = /language-(\w+)/.exec(className || "");
              const code = String(children).replace(/\n$/, "");

              if (!inline && match) {
                return (
                  <div className="relative mb-6">
                    <div className="flex items-center justify-between bg-foreground-100 px-4 py-2 rounded-t-md">
                      <span className="text-xs font-medium text-foreground-600">
                        {match[1].toUpperCase()}
                      </span>
                      <Tooltip content="Copy code">
                        <Button
                          isIconOnly
                          size="sm"
                          variant="light"
                          onPress={() => copyToClipboard(code)}
                          className="text-foreground-600"
                        >
                          <Icon icon="lucide:copy" />
                        </Button>
                      </Tooltip>
                    </div>
                    <SyntaxHighlighter
                      style={atomDark}
                      language={match[1]}
                      PreTag="div"
                      className="rounded-b-md !mt-0"
                      showLineNumbers
                      {...props}
                    >
                      {code}
                    </SyntaxHighlighter>
                  </div>
                );
              } else if (inline) {
                return (
                  <code
                    className="bg-foreground-100 px-1.5 py-0.5 rounded text-foreground-700 text-sm"
                    {...props}
                  >
                    {children}
                  </code>
                );
              }
              return null;
            },
            img({ src, alt }) {
              return (
                <img
                  src={src}
                  alt={alt}
                  className="rounded-md shadow-sm max-w-full h-auto my-4"
                />
              );
            },
            blockquote({ children }) {
              return (
                <blockquote className="border-l-4 border-primary-300 pl-4 italic text-foreground-600 my-4">
                  {children}
                </blockquote>
              );
            },
            a({ href, children }) {
              return (
                <a
                  href={href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-primary-500 hover:underline"
                >
                  {children}
                </a>
              );
            },
            table({ children }) {
              return (
                <div className="overflow-x-auto my-4">
                  <table className="w-full border-collapse">{children}</table>
                </div>
              );
            },
            th({ children }) {
              return (
                <th className="border border-default-200 bg-default-100 px-4 py-2 text-left">
                  {children}
                </th>
              );
            },
            td({ children }) {
              return (
                <td className="border border-default-200 px-4 py-2">
                  {children}
                </td>
              );
            },
          }}
        >
          {doc_content}
        </ReactMarkdown>
      </div>
    </article>
  );
};
