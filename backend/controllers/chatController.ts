/// <reference types="express" />
/// <reference types="passport" />
import express from 'express';
import 'passport';
import { nanoid } from 'nanoid';
import { IMessage } from '../types/chat.js';
import { IUser } from '../types/user.js';
import Chat from '../models/Chat.js';
import { model as geminiModel } from '../config/gemini.js';

const getUserId = (req: express.Request): string | null => {
  const q = req as any;
  if (!q.isAuthenticated() || !q.user) return null;
  return (q.user as IUser)._id.toString();
};

const chatController = {
  getChatHistory: async (req: express.Request, res: express.Response) => {
    const s = res as any;
    const userId = getUserId(req);
    if (!userId) {
      return s.status(401).json({ error: 'Unauthorized.' });
    }

    try {
      const chats = await Chat.find({ userId }).sort({ updatedAt: -1 });
      return s.json({ chatHistory: chats });
    } catch (error) {
      console.error('(Server) Error getting chat history:', error);
      return s.status(500).json({ error: 'Failed to get chat history.' });
    }
  },

  handlePrompt: async (req: express.Request, res: express.Response) => {
    const q = req as any;
    const s = res as any;
    const userId = getUserId(req);
    if (!userId) {
      return s.status(401).json({ error: 'Unauthorized.' });
    }

    try {
      const { chat, prompt } = q.body;

      if (!prompt || typeof prompt !== 'string') {
        return s
          .status(400)
          .json({ error: '(Server) Prompt is required and must be a string.' });
      }

      let chatDoc;
      const newMessage: IMessage = {
        id: nanoid(),
        role: 'user',
        content: prompt,
      };

      if (chat?.id) {
        // Update existing chat
        chatDoc = await Chat.findOne({ id: chat.id, userId });

        if (!chatDoc) {
          chatDoc = await Chat.findOne({ id: chat.id });
          if (chatDoc) {
            chatDoc.userId = userId;
            await chatDoc.save();
          }
        }

        if (!chatDoc) {
          return s
            .status(404)
            .json({ error: '(Server) Chat not found for this user.' });
        }

        chatDoc.messages.push(newMessage);
      } else {
        // Create new chat
        chatDoc = await Chat.create({
          id: nanoid(),
          userId,
          title: `Chat ${Date.now()}`,
          messages: [newMessage],
        });
      }

      const messagesForAssistant = chatDoc.messages.map((msg: any) => ({
        role: msg.role,
        content: msg.content,
      }));

      // Generate assistant response via Gemini
      try {
        // Map history to Gemini format (user/model)
        // Gemini expects 'user' and 'model' (not assistant)
        const history = messagesForAssistant.slice(0, -1).map((m: any) => ({
          role: m.role === 'assistant' ? 'model' : 'user',
          parts: [{ text: m.content }],
        }));

        const chatSession = geminiModel.startChat({
          history: history,
        });

        const result = await chatSession.sendMessage(prompt);
        const responseText = result.response.text();

        if (!responseText) {
          throw new Error('(Server) No response from Gemini.');
        }

        const assistantMessage: IMessage = {
          id: nanoid(),
          role: 'assistant',
          content: responseText,
        };

        chatDoc.messages.push(assistantMessage);
        await chatDoc.save();

        return s.json({ chat: chatDoc });
      } catch (geminiError: any) {
        console.error('(Server) Gemini API error:', geminiError);

        const errorMessage =
          geminiError.message ||
          'Failed to generate AI response. Please try again.';

        const errorAssistantMessage: IMessage = {
          id: nanoid(),
          role: 'assistant',
          content: `**AI Error:** ${errorMessage}`,
        };

        chatDoc.messages.push(errorAssistantMessage);
        await chatDoc.save();

        return s.status(503).json({
          error: errorMessage,
          chat: chatDoc,
        });
      }
    } catch (error) {
      console.error('(Server) Error handling user prompt:', error);
      return s.status(500).json({ error: 'Failed to process user prompt.' });
    }
  },

  updateChatTitle: async (req: express.Request, res: express.Response) => {
    const q = req as any;
    const s = res as any;
    const userId = getUserId(req);
    if (!userId) {
      return s.status(401).json({ error: 'Unauthorized.' });
    }

    try {
      const { chatId, title } = q.body;

      if (!title || typeof title !== 'string') {
        return s
          .status(400)
          .json({ error: '(Server) Title is required and must be a string.' });
      }

      const chatDoc = await Chat.findOne({ id: chatId, userId });
      if (!chatDoc) {
        return s
          .status(404)
          .json({ error: '(Server) Chat not found for this user.' });
      }

      chatDoc.title = title;
      await chatDoc.save();

      return s.json({ chat: chatDoc });
    } catch (error) {
      console.error('(Server) Error updating chat title:', error);
      return s.status(500).json({ error: 'Failed to update chat title.' });
    }
  },

  deleteChat: async (req: express.Request, res: express.Response) => {
    const q = req as any;
    const s = res as any;
    const userId = getUserId(req);
    if (!userId) {
      return s.status(401).json({ error: 'Unauthorized.' });
    }

    try {
      const { id } = q.params;

      if (!id || typeof id !== 'string') {
        return s.status(400).json({ error: '(Server) Chat ID is required.' });
      }

      const deletedChat = await Chat.findOneAndDelete({ id, userId });
      if (!deletedChat) {
        return s
          .status(404)
          .json({ error: '(Server) Chat not found for this user.' });
      }

      return s.json({ message: 'Chat deleted successfully.', id });
    } catch (error) {
      console.error('(Server) Error deleting chat:', error);
      return s.status(500).json({ error: 'Failed to delete chat.' });
    }
  },
};

export default chatController;
