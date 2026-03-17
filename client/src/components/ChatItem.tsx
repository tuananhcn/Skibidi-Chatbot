import { useState } from 'react';
import type { Chat } from '@src/types/chat';
import '@src/styles/ChatItem.css';

interface ChatItemProps {
  chat: Chat;
  isActive: boolean;
  onSelect: (chat: Chat) => void;
  onUpdateTitle?: (chatId: string, newTitle: string) => void;
  onDelete?: (chatId: string) => void;
}

const ChatItem = ({
  chat,
  isActive,
  onSelect,
  onUpdateTitle,
  onDelete,
}: ChatItemProps) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editTitle, setEditTitle] = useState(chat.title);

  const handleEditClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    setIsEditing(true);
    setEditTitle(chat.title);
  };

  const handleTitleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (editTitle.trim() && onUpdateTitle) {
      onUpdateTitle(chat.id, editTitle.trim());
    }
    setIsEditing(false);
  };

  return (
    <li
      className={`chat-item ${isActive ? 'active' : ''}`}
      onClick={() => onSelect(chat)}
    >
      {isEditing ? (
        <form onSubmit={handleTitleSubmit} className="edit-form">
          <input
            type="text"
            value={editTitle}
            onChange={(e) => setEditTitle(e.target.value)}
            onClick={(e) => e.stopPropagation()}
            autoFocus
          />
          <button type="submit" className="save-btn">
            ✓
          </button>
          <button
            type="button"
            className="cancel-btn"
            onClick={(e) => {
              e.stopPropagation();
              setIsEditing(false);
            }}
          >
            ✕
          </button>
        </form>
      ) : (
        <>
          <span className="chat-title">{chat.title}</span>
          <div className="chat-item-actions">
            <button
              className="edit-btn"
              onClick={handleEditClick}
              title="Edit chat title"
            >
              ✎
            </button>
            <button
              className="delete-btn"
              onClick={(e) => {
                e.stopPropagation();
                if (onDelete) onDelete(chat.id);
              }}
              title="Delete chat"
            >
              <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M3 6h18"></path>
                <path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6"></path>
                <path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2"></path>
                <line x1="10" y1="11" x2="10" y2="17"></line>
                <line x1="14" y1="11" x2="14" y2="17"></line>
              </svg>
            </button>
          </div>
        </>
      )}
    </li>
  );
};

export default ChatItem;
