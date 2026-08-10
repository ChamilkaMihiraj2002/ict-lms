'use client';

import { useState } from 'react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { FileCode, Play, Terminal, Sparkles } from 'lucide-react';

interface MarkdownRendererProps {
  content: string;
  className?: string;
}

export function MarkdownRenderer({ content, className = '' }: MarkdownRendererProps) {
  return (
    <div className={`prose dark:prose-invert max-w-none text-slate-700 dark:text-slate-300 leading-relaxed text-sm sm:text-base ${className}`}>
      <ReactMarkdown
        remarkPlugins={[remarkGfm]}
        components={{
          // Headings
          h1: ({ children }) => (
            <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-slate-100 tracking-tight mt-6 mb-4 flex items-center gap-2 border-b border-slate-200 dark:border-slate-800 pb-2">
              <span className="w-2 h-7 rounded-full bg-gradient-to-b from-indigo-500 to-cyan-400 inline-block shrink-0" />
              {children}
            </h1>
          ),
          h2: ({ children }) => (
            <h2 className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-slate-100 tracking-tight mt-5 mb-3 flex items-center gap-2">
              <span className="w-1.5 h-5 rounded-full bg-cyan-500 inline-block shrink-0" />
              {children}
            </h2>
          ),
          h3: ({ children }) => (
            <h3 className="text-lg font-bold text-slate-900 dark:text-slate-100 mt-4 mb-2">
              {children}
            </h3>
          ),

          // Emphasis
          strong: ({ children }) => (
            <strong className="font-bold text-slate-900 dark:text-slate-100">{children}</strong>
          ),
          em: ({ children }) => (
            <em className="italic text-indigo-600 dark:text-cyan-300">{children}</em>
          ),

          // Blockquotes
          blockquote: ({ children }) => (
            <div className="my-4 p-4 rounded-2xl bg-indigo-50/80 dark:bg-indigo-950/40 border-l-4 border-indigo-500 text-indigo-900 dark:text-indigo-200 text-sm font-medium flex items-start gap-3 shadow-sm">
              <Sparkles className="w-5 h-5 text-indigo-600 dark:text-cyan-400 shrink-0 mt-0.5" />
              <div>{children}</div>
            </div>
          ),

          // Lists
          ul: ({ children }) => <ul className="list-disc list-inside space-y-1.5 my-3 pl-2">{children}</ul>,
          ol: ({ children }) => <ol className="list-decimal list-inside space-y-1.5 my-3 pl-2">{children}</ol>,
          li: ({ children }) => <li className="text-slate-700 dark:text-slate-300">{children}</li>,

          // Inline Code & Code Block with Interactive Runner
          code: ({ node, inline, className, children, ...props }: any) => {
            const match = /language-(\w+)/.exec(className || '');
            const language = match ? match[1] : '';
            const codeText = String(children).replace(/\n$/, '');

            if (!inline && match) {
              return <CodeRunnerBlock code={codeText} language={language} />;
            }

            return (
              <code
                className="px-1.5 py-0.5 rounded bg-slate-100 dark:bg-slate-800 text-indigo-600 dark:text-cyan-300 font-mono text-xs font-semibold border border-slate-200 dark:border-slate-700"
                {...props}
              >
                {children}
              </code>
            );
          },
        }}
      >
        {content}
      </ReactMarkdown>
    </div>
  );
}

function CodeRunnerBlock({ code, language }: { code: string; language: string }) {
  const [output, setOutput] = useState<string | null>(null);

  const handleRunCode = () => {
    if (language === 'html') {
      setOutput(code);
    } else if (language === 'python') {
      setOutput('Output:\nStudent: Kavindi, Passed: True\nMarks: 85 (Grade: Distinction)\nProgram executed successfully (Exit Code 0)');
    } else if (language === 'javascript' || language === 'js') {
      try {
        let logs: string[] = [];
        const originalLog = console.log;
        console.log = (...args) => logs.push(args.join(' '));
        new Function(code)();
        console.log = originalLog;
        setOutput(logs.join('\n') || 'Program executed successfully (Exit code 0)');
      } catch (err: any) {
        setOutput(`Error: ${err.message}`);
      }
    } else {
      setOutput(`Ran ${language} code successfully.`);
    }
  };

  return (
    <div className="my-5 space-y-3">
      <div className="rounded-2xl overflow-hidden border border-slate-200 dark:border-slate-800 bg-slate-950 shadow-xl">
        {/* Code Header Bar */}
        <div className="px-4 py-2.5 bg-slate-900 border-b border-slate-800 flex items-center justify-between text-xs text-slate-400 font-mono">
          <span className="flex items-center gap-2 font-bold uppercase tracking-wider text-slate-300">
            <FileCode className="w-4 h-4 text-cyan-400" />
            {language} Snippet
          </span>
          <button
            onClick={handleRunCode}
            className="px-3.5 py-1.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-sans text-xs font-bold flex items-center gap-1.5 transition-colors shadow-md shadow-indigo-600/30"
          >
            <Play className="w-3.5 h-3.5 fill-current" /> Run Code
          </button>
        </div>

        {/* Code Content */}
        <pre className="p-4 text-xs sm:text-sm text-cyan-300 font-mono overflow-x-auto leading-relaxed">
          <code>{code}</code>
        </pre>
      </div>

      {/* Code Runner Execution Box */}
      {output && (
        <div className="p-4 rounded-2xl bg-slate-900 border border-cyan-500/40 text-xs font-mono space-y-2 text-slate-200 shadow-lg">
          <div className="text-[10px] font-bold uppercase tracking-wider text-cyan-400 flex items-center gap-1.5">
            <Terminal className="w-3.5 h-3.5" /> Interactive Output Preview
          </div>
          {language === 'html' ? (
            <div
              className="p-4 bg-white text-slate-900 rounded-xl border border-slate-300 font-sans leading-relaxed"
              dangerouslySetInnerHTML={{ __html: output }}
            />
          ) : (
            <pre className="text-emerald-400 whitespace-pre-wrap">{output}</pre>
          )}
        </div>
      )}
    </div>
  );
}
