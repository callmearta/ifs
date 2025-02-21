import { useState, useRef, useMemo } from 'react';
import { useReactMediaRecorder } from 'react-media-recorder';
import { AudioState } from '../types/chat';
import { transcribeAudio, getChatResponse } from '../services/api';
import RecordButton from './record-button';
import Error from './error';
import Response from './response';


export default function VoiceChat() {
  const [audioState, setAudioState] = useState<AudioState>({
    isRecording: false,
    isProcessing: false,
  });
  const audioRef = useRef<HTMLAudioElement>(null);

  const { startRecording, stopRecording } = useReactMediaRecorder({
    audio: true,
    onStop: async (_, blob) => {
      if (!blob) return;
      await handleAudioSubmission(blob);
    },
  });

  const [response, setResponse] = useState<string>('');

  const handleAudioSubmission = async (audioBlob: Blob) => {
    try {
      setAudioState(prev => ({ ...prev, isProcessing: true }));

      const text = await transcribeAudio(audioBlob);
      setResponse(text);

      const { response, audioUrl } = await getChatResponse(text);
      setResponse(response);

      if (audioRef.current && audioUrl) {
        audioRef.current.src = audioUrl;
        audioRef.current.currentTime = 0;
        audioRef.current.preload = "auto";
        audioRef.current.load();

        audioRef.current.onloadeddata = () => {
          if (audioRef.current) {
            audioRef.current.currentTime = 0;
            setTimeout(() => {
              audioRef.current?.play();
            }, 10);
          }
        };
      }
    } catch (error) {
      setAudioState(prev => ({
        ...prev,
        error: 'Failed to process audio',
      }));
    } finally {
      setAudioState(prev => ({ ...prev, isProcessing: false }));
    }
  };

  const toggleRecording = () => {
    if (audioState.isRecording) {
      stopRecording();
      setAudioState(prev => ({ ...prev, isRecording: false }));
    } else {
      startRecording();
      setAudioState(prev => ({ ...prev, isRecording: true }));
    }
  };

  const recordButtonInside = useMemo(() => audioState.isRecording ? <span className="bg-red-700 w-6 h-6 rounded-md block"></span> : <span className="bg-black rounded-full h-6 w-6 block"></span>, [audioState.isRecording]);

  return (
    <div className="w-screen min-h-screen flex items-center justify-start py-24 flex-col gap-4">
      <h1 className="absolute top-0 left-0 text-lg font-medium p-6 px-12 text-center w-full">IFS Guide</h1>
      <Response response={response} />
      <div className='h-48 flex-none w-full'></div>
      <RecordButton audioState={audioState} toggleRecording={toggleRecording} recordButtonInside={recordButtonInside} />
      <Error error={audioState.error} />
      <audio ref={audioRef} className="hidden" />
    </div>
  );
} 