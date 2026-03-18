import { useState, useEffect, useCallback } from 'react';
import { chatService } from '@src/services/chatService';
import type { Chat, CurrChat } from '@src/types/chat';
import SideBar from '@src/components/SideBar';
import ChatArea from '@src/components/ChatArea';
import { AuthProvider, useAuth } from '@src/context/AuthContext';
import ProtectedRoute from '@src/components/ProtectedRoute';
import '@src/styles/App.css';

import { Analytics } from '@vercel/analytics/react';

const MainApp = () => {
  const [chats, setChats] = useState<Chat[]>([]);
  const [activeChat, setActiveChat] = useState<CurrChat>(() => {
    const savedChat = sessionStorage.getItem('ACTIVE_CHAT');
    return savedChat ? JSON.parse(savedChat) : null;
  });
  const [isMobile, setIsMobile] = useState<boolean>(window.innerWidth <= 768);
  const [isSidebarOpen, setIsSidebarOpen] = useState<boolean>(
    window.innerWidth > 768
  );
  const { user } = useAuth();

  const getChats = useCallback(async () => {
    if (!user) return [];
    try {
      return await chatService.getChatHistory();
    } catch (error) {
      console.error('(Client) Error calling getChatHistory() API:', error);
      return [];
    }
  }, [user]);

  useEffect(() => {
    const initializeChats = async () => {
      const chatHistory = await getChats();
      setChats(chatHistory || []);
    };
    void initializeChats();
  }, [getChats]);

  useEffect(() => {
    sessionStorage.setItem('ACTIVE_CHAT', JSON.stringify(activeChat));
  }, [activeChat]);

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth <= 768);
    };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const handleUpdateChatTitle = async (chatId: string, newTitle: string) => {
    try {
      await chatService.updateChatTitle(chatId, newTitle);
      setChats(
        chats.map((chat) =>
          chat.id === chatId ? { ...chat, title: newTitle } : chat
        )
      );
      if (activeChat?.id === chatId) {
        setActiveChat({ ...activeChat, title: newTitle });
      }
    } catch (error) {
      console.error('(Client) Error updating chat title:', error);
    }
  };

  const handleNewChat = (newChat: Chat | null) => {
    if (newChat) {
      // Add the new chat to the top of the sidebar list
      setChats((prevChats) => [newChat, ...prevChats]);
    }
  };

  const handleDeleteChat = async (chatId: string) => {
    try {
      await chatService.deleteChat(chatId);
      setChats((prevChats) => prevChats.filter(chat => chat.id !== chatId));
      if (activeChat?.id === chatId) {
        setActiveChat(null);
      }
    } catch (error) {
      console.error('(Client) Error deleting chat:', error);
      alert('Failed to delete chat. Please try again.');
    }
  };

  return (
    <>
      <ProtectedRoute>
        <div className={`app${isMobile && isSidebarOpen ? ' sidebar-open' : ''}`}>
          {(!isMobile || isSidebarOpen) && (
            <div className={`sidebar${isSidebarOpen ? '' : ' hidden'}`}>
              <SideBar
                chats={chats}
                setIsSidebarOpen={setIsSidebarOpen}
                currentChat={activeChat}
                setCurrentChat={setActiveChat}
                onUpdateChatTitle={handleUpdateChatTitle}
                onDeleteChat={handleDeleteChat}
              />
            </div>
          )}
          <div className="chat-area">
            <ChatArea
              currentChat={activeChat}
              setCurrentChat={setActiveChat}
              isSidebarOpen={isSidebarOpen}
              setIsSidebarOpen={setIsSidebarOpen}
              onNewChat={handleNewChat}
            />
          </div>
        </div>
      </ProtectedRoute>
      <Analytics />
    </>
  );
};

const App = () => (
  <AuthProvider>
    <MainApp />
  </AuthProvider>
);

export default App;
