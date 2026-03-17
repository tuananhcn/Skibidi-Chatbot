export interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
}

export interface Chat {
  id: string;
  userId: string;
  title: string;
  messages: Message[];
}

export type CurrChat = {
  id: string;
  userId: string;
  title: string;
  messages: Message[];
} | null;
