import { useLayoutEffect, useRef } from 'react';
import type { Message } from '@src/types/chat';
import '@src/styles/Conversation.css';

interface ConversationProps {
  chat: Message[];
}

const Conversation = ({ chat }: ConversationProps) => {
  const containerRef = useRef<HTMLDivElement>(null);

  useLayoutEffect(() => {
    const container = containerRef.current;
    if (container) {
      container.scrollTop = container.scrollHeight;
    }
  }, [chat]);

  return (
    <div className="conversation-container" ref={containerRef}>
      <div className="conversation-scroll-area">
        <ul className="message-list">
          {chat.map((message) => (
            <li key={message.id} className={`message-wrapper ${message.role}-wrapper`}>
              {message.role === 'assistant' && (
                <div className="assistant-avatar">
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M12 2a2 2 0 0 1 2 2c0 .74-.4 1.39-1 1.73V7h1a7 7 0 0 1 7 7h1a2 2 0 0 1 2 2v2a2 2 0 0 1-2 2h-1v1a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-1H2a2 2 0 0 1-2-2v-2a2 2 0 0 1 2-2h1a7 7 0 0 1 7-7h1V5.73A2 2 0 1 1 12 2z"></path>
                    <path d="M8 13v.01"></path>
                    <path d="M16 13v.01"></path>
                  </svg>
                </div>
              )}
              <div className={`message-content ${message.role}-message`}>
                {message.id === 'loading' ? (
                  <span className="loading-dots">
                    <span>.</span>
                    <span>.</span>
                    <span>.</span>
                  </span>
                ) : (
                  <div className="markdown-prose">
                    {message.content.split('\n').map((line, i) => (
                      <span key={i}>
                        {line}
                        <br />
                      </span>
                    ))}
                  </div>
                )}
              </div>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default Conversation;
