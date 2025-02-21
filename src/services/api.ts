import OpenAI from 'openai';
import { Buffer } from 'buffer';

const openai = new OpenAI({
  apiKey: import.meta.env.VITE_OPENAI_API_KEY,
  dangerouslyAllowBrowser: true,
  organization: import.meta.env.VITE_OPENAI_ORG_KEY,
  project: import.meta.env.VITE_OPENAI_PROJECT_KEY,
});

export const transcribeAudio = async (audioBlob: Blob): Promise<string> => {
  try {
    const file = new File([audioBlob], 'audio.mp3', { type: 'audio/mp3' });
    const response = await openai.audio.transcriptions.create({
      file: file,
      model: 'whisper-1',
    });
    
    return response.text;
  } catch (error) {
    console.error('Transcription error:', error);
    throw new Error('Failed to transcribe audio');
  }
};

export const getChatResponse = async (message: string): Promise<{ response: string; audioUrl: string }> => {
  try {
    const chatResponse = await openai.chat.completions.create({
      model: 'gpt-3.5-turbo',
      messages: [{ role: 'user', content: message }],
    });

    const response = chatResponse.choices[0].message.content || '';
    const speechResponse = await openai.audio.speech.create({
      model: 'tts-1',
      voice: 'alloy',
      input: response,
    });

    const buffer = Buffer.from(await speechResponse.arrayBuffer());
    const audioUrl = `data:audio/mp3;base64,${buffer.toString('base64')}`;

    return { response, audioUrl };
  } catch (error) {
    console.error('Chat error:', error);
    throw new Error('Failed to process chat');
  }
}; 