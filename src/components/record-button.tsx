import Processing from "./processing";
import { AudioState } from "../types/chat";
import { useMemo } from "react";

export default function RecordButton({ audioState, toggleRecording, recordButtonInside }: { audioState: AudioState, toggleRecording: () => void, recordButtonInside: React.ReactNode }) {
    const displayedText = useMemo(() => {
        if (audioState.isProcessing) return 'Working on it...';
        if (audioState.isRecording) return 'Recording...';
        return 'Tap to start recording!';
    }, [audioState]);
    return (
        <div className="fixed bottom-0 py-12 pt-36 flex items-center justify-center flex-col left-0 right-0 mx-auto gap-4 bg-gradient-to-t from-white from-50% to-white/0">
            <span className="text-sm text-gray-500 font-medium">{displayedText}</span>
            <button
                onClick={toggleRecording}
                disabled={audioState.isProcessing}
                className={`bg-gray-50 border border-gray-200 transition-all duration-300 cursor-pointer w-16 h-16 flex items-center hover:shadow-lg justify-center rounded-full ${audioState.isRecording
                    ? ''
                    : ''
                    } ${audioState.isProcessing ? 'opacity-50' : ''}`}
            >
                {audioState.isProcessing ? <Processing /> : recordButtonInside}
            </button>

        </div>
    );
}
