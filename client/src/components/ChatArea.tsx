import { useState, useEffect } from 'react';
import type { Dispatch, SetStateAction } from 'react';
import { chatService } from '@src/services/chatService';
import type { Chat, CurrChat } from '@src/types/chat';
import MenuButton from './MenuButton';
import Conversation from './Conversation';
import '@src/styles/ChatArea.css';
import { v4 as uuidv4 } from 'uuid';

interface ChatAreaProps {
  currentChat: CurrChat;
  setCurrentChat: Dispatch<SetStateAction<CurrChat>>;
  isSidebarOpen: boolean;
  setIsSidebarOpen: Dispatch<SetStateAction<boolean>>;
  onNewChat?: (chat: CurrChat | Chat) => void;
}

const ChatArea = ({
  currentChat,
  setCurrentChat,
  isSidebarOpen,
  setIsSidebarOpen,
  onNewChat,
}: ChatAreaProps) => {
  const [timeOfDay, setTimeOfDay] = useState<string>('');
  const [inputValue, setInputValue] = useState<string>(''); // Stores user's current prompt input
  const [isLoading, setIsLoading] = useState(false); // Message-loading state

  useEffect(() => {
    const updateGreeting = () => {
      const currentHour = new Date().getHours();

      if (currentHour >= 5 && currentHour < 12) {
        setTimeOfDay('morning');
      } else if (currentHour >= 12 && currentHour < 17) {
        setTimeOfDay('afternoon');
      } else {
        setTimeOfDay('evening');
      }
    };
    updateGreeting();

    // Update greeting every minute
    const interval = setInterval(updateGreeting, 60000);
    return () => clearInterval(interval);
  }, []);

  const updateChat = async () => {
    if (!inputValue.trim()) return;

    const currentInput = inputValue; // Save input in case of error
    setInputValue(''); // Optimistically clear input
    setIsLoading(true);

    try {
      if (currentChat) {
        // Backup previous state
        const prevMessages = [...currentChat.messages];

        // Optimistically add user message and loading state
        // Note: The UI adds the user message here immediately and waits for assistant
        // Only trigger UI update if we already appended the user text elsewhere,
        // wait, the previous code didn't append the user text to currentChat before adding loading!
        // Actually, looking at the previous code, it only appended 'loading'. The user's prompt was missing from UI until the API returned. Let's fix that too.

        const tempUserMessage = {
          id: uuidv4(),
          role: 'user' as const,
          content: currentInput,
        };
        setCurrentChat({
          ...currentChat,
          messages: [
            ...prevMessages,
            tempUserMessage,
            { id: 'loading', role: 'assistant' as const, content: '...' },
          ],
        });

        // Call API
        try {
          const updatedChat = await chatService.handlePrompt(
            currentChat,
            currentInput
          );
          setCurrentChat(updatedChat);
        } catch (error: unknown) {
          const apiError = error as {
            response?: { data?: { chat?: Chat; error?: string } };
          };
          const savedChat = apiError?.response?.data?.chat;
          if (savedChat) {
            setCurrentChat(savedChat);
          } else {
            // Fallback if backend didn't return a chat object
            const errorMsg =
              apiError?.response?.data?.error ||
              'Failed to get a response from the server.';
            setCurrentChat({
              ...currentChat,
              messages: [
                ...prevMessages,
                tempUserMessage,
                {
                  id: uuidv4(),
                  role: 'assistant' as const,
                  content: `**Error:** ${errorMsg}`,
                },
              ],
            });
          }
        }
      } else {
        // New Chat Flow
        const tempId = uuidv4();
        const tempUserMessage = {
          id: uuidv4(),
          role: 'user' as const,
          content: currentInput,
        };
        const initialMessages = [
          tempUserMessage,
          { id: 'loading', role: 'assistant' as const, content: '...' },
        ];

        setCurrentChat({
          id: tempId,
          userId: '',
          title: '',
          messages: initialMessages,
        });

        try {
          const newChat = await chatService.handlePrompt(null, currentInput);
          setCurrentChat(newChat);
          if (onNewChat) onNewChat(newChat);
        } catch (error: unknown) {
          const apiError = error as {
            response?: { data?: { chat?: Chat; error?: string } };
          };
          const savedChat = apiError?.response?.data?.chat;
          if (savedChat) {
            setCurrentChat(savedChat);
            if (onNewChat) onNewChat(savedChat);
          } else {
            // Show error in chat instead of alert
            const errorMsg =
              apiError?.response?.data?.error ||
              'Failed to get a response from the server.';
            setCurrentChat({
              id: tempId,
              userId: '',
              title: 'Failed Chat',
              messages: [
                tempUserMessage,
                {
                  id: uuidv4(),
                  role: 'assistant' as const,
                  content: `**Error:** ${errorMsg}`,
                },
              ],
            });
          }
        }
      }
    } catch (error: unknown) {
      console.error('(Client) Error calling handlePrompt() API:', error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <div className="chat-area-head">
        {!isSidebarOpen && (
          <MenuButton onClick={() => setIsSidebarOpen(true)} />
        )}
        <label className="main-title">Jawuan GPT</label>
      </div>

      {currentChat ? (
        <Conversation chat={currentChat.messages} />
      ) : (
        <div className="greeting-container">
          <label className="greeting">Good {timeOfDay}!</label>
        </div>
      )}
      <div className="input-container">
        {/* <button className="input-action-btn" title="Add attachment" aria-label="Add attachment">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <line x1="12" y1="5" x2="12" y2="19" />
            <line x1="5" y1="12" x2="19" y2="12" />
          </svg>
        </button> */}

        <input
          type="text"
          placeholder="Ask anything"
          className="chat-input"
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && updateChat()}
          disabled={isLoading}
        />

        <div className="input-right-actions">
          {/* <button className="input-action-btn" title="Voice input" aria-label="Voice input">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M12 1a3 3 0 0 0-3 3v8a3 3 0 0 0 6 0V4a3 3 0 0 0-3-3z" />
              <path d="M19 10v2a7 7 0 0 1-14 0v-2" />
              <line x1="12" y1="19" x2="12" y2="23" />
              <line x1="8" y1="23" x2="16" y2="23" />
            </svg>
          </button> */}

          <button
            className="send-button"
            title="Send message"
            onClick={() => updateChat()}
            aria-label="Send message"
            disabled={isLoading}
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
              <path
                d="M12 19V5M5 12l7-7 7 7"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </button>
        </div>
      </div>
    </>
  );
};

export default ChatArea;
