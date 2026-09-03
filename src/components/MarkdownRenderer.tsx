import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';

export function MarkdownRenderer({ content }: { content: string }) {
  return (
    <div className="prose-dr">
      <ReactMarkdown
        remarkPlugins={[remarkGfm]}
        components={{
          a: ({ href, children }) => {
            const external = href?.startsWith('http');
            return (
              <a
                href={href}
                target={external ? '_blank' : undefined}
                rel={external ? 'noreferrer noopener' : undefined}
              >
                {children}
              </a>
            );
          },
          input: (props) => <input {...props} disabled readOnly />,
        }}
      >
        {content}
      </ReactMarkdown>
    </div>
  );
}
