import type { CurrChat } from '@src/types/chat';
import api from './apiClient';

export const chatService = {
  getChatHistory: async () => {
    const response = await api.get('/api/chat/history');
    return response.data?.chatHistory ?? [];
  },

  handlePrompt: async (chat: CurrChat, prompt: string) => {
    const response = await api.post('/api/chat/prompt', { chat, prompt });
    return response.data?.chat ?? chat;
  },

  updateChatTitle: async (chatId: string, newTitle: string) => {
    const response = await api.patch('/api/chat/title', {
      chatId: chatId,
      title: newTitle,
    });
    return response.data?.chat;
  },

  deleteChat: async (chatId: string) => {
    const response = await api.delete(`/api/chat/history/${chatId}`);
    return response.data;
  },
};
