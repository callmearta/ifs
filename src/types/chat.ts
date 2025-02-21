export interface ChatMessage {
  role: 'user' | 'assistant';
  content: string;
  audioUrl?: string;
}

export interface AudioState {
  isRecording: boolean;
  isProcessing: boolean;
  error?: string;
} 