import type { Dispatch, SetStateAction } from 'react';
import { useState } from 'react';
import type { Chat, CurrChat } from '@src/types/chat';
import { useAuth } from '@src/context/AuthContext';
import MenuButton from './MenuButton';
import ChatItem from './ChatItem';
import DeleteModal from './DeleteModal';
import '@src/styles/SideBar.css';

interface SideBarProps {
  chats: Chat[];
  setIsSidebarOpen: Dispatch<SetStateAction<boolean>>;
  currentChat: CurrChat;
  setCurrentChat: Dispatch<SetStateAction<CurrChat>>;
  onUpdateChatTitle?: (chatId: string, newTitle: string) => void;
  onDeleteChat?: (chatId: string) => void;
}

const SideBar = ({
  chats,
  setIsSidebarOpen,
  currentChat,
  setCurrentChat,
  onUpdateChatTitle,
  onDeleteChat,
}: SideBarProps) => {
  const { user, logout } = useAuth();
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [chatToDelete, setChatToDelete] = useState<Chat | null>(null);

  const handleDeleteClick = (chatId: string) => {
    const chat = chats.find(c => c.id === chatId);
    if (chat) {
      setChatToDelete(chat);
      setIsDeleteModalOpen(true);
    }
  };

  const confirmDelete = () => {
    if (chatToDelete && onDeleteChat) {
      onDeleteChat(chatToDelete.id);
    }
    setIsDeleteModalOpen(false);
    setChatToDelete(null);
  };

  return (
    <>
      <MenuButton onClick={() => setIsSidebarOpen(false)} />

      <button className="new-chat-btn" onClick={() => setCurrentChat(null)}>
        <svg
          width="20"
          height="20"
          viewBox="0 0 20 20"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          style={{ marginRight: '0.1rem' }}
        >
          <circle
            cx="10"
            cy="10"
            r="9"
            stroke="currentColor"
            strokeWidth="2"
            fill="none"
          />
          <line
            x1="10"
            y1="6"
            x2="10"
            y2="14"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
          />
          <line
            x1="6"
            y1="10"
            x2="14"
            y2="10"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
          />
        </svg>
        New Chat
      </button>

      <span className="sidebar-section-title">Your Chats</span>
      <div className="recent-chats">
        {chats.length === 0 ? (
          <span className="no-chats-msg">No existing chats</span>
        ) : (
          <ul className="chat-list">
            {chats.map((chat) => (
              <ChatItem
                key={chat.id}
                chat={chat}
                isActive={currentChat?.id === chat.id}
                onSelect={setCurrentChat}
                onUpdateTitle={onUpdateChatTitle}
                onDelete={handleDeleteClick}
              />
            ))}
          </ul>
        )}
      </div>

      {user && (
        <div className="sidebar-footer">
          <div className="user-profile">
            {user.picture ? (
              <img src={user.picture} alt="Profile" className="user-avatar" />
            ) : (
              <div className="user-avatar-placeholder">
                {user.name.charAt(0).toUpperCase()}
              </div>
            )}
            <div className="user-info">
              <span className="user-name">{user.name}</span>
              <span className="user-email">{user.email}</span>
            </div>
          </div>
          <button className="logout-btn" onClick={logout} title="Log out">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
              <polyline points="16 17 21 12 16 7" />
              <line x1="21" y1="12" x2="9" y2="12" />
            </svg>
          </button>
        </div>
      )}

      <DeleteModal
        isOpen={isDeleteModalOpen}
        onClose={() => setIsDeleteModalOpen(false)}
        onConfirm={confirmDelete}
        chatTitle={chatToDelete?.title}
      />
    </>
  );
};

export default SideBar;
