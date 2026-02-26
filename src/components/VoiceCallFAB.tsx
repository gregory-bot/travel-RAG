
import { useState, useRef } from "react";
import { Phone, X, Mic, MicOff } from "lucide-react";

const VoiceCallFAB = () => {

  const [isOpen, setIsOpen] = useState(false);
  const [isCallActive, setIsCallActive] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [isRecording, setIsRecording] = useState(false);
  const [statusMsg, setStatusMsg] = useState<string>("");
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);
  const audioPlayerRef = useRef<HTMLAudioElement | null>(null);

  // Start recording and send audio to backend
  const handleStartCall = async () => {
    setIsCallActive(true);
    setStatusMsg("Say something! Recording...");
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const mediaRecorder = new window.MediaRecorder(stream);
      mediaRecorderRef.current = mediaRecorder;
      audioChunksRef.current = [];

      mediaRecorder.ondataavailable = (e) => {
        if (e.data.size > 0) audioChunksRef.current.push(e.data);
      };
      mediaRecorder.onstop = async () => {
        setStatusMsg("Processing...");
        const audioBlob = new Blob(audioChunksRef.current, { type: 'audio/webm' });
        // Send audio to backend
        const formData = new FormData();
        formData.append('audio', audioBlob, 'voice.webm');
        try {
          const resp = await fetch('https://travel-rag-la.onrender.com/voice-call', {
            method: 'POST',
            body: formData,
          });
          const data = await resp.json();
          setStatusMsg(data.message || "Response received.");
          // TODO: If backend returns TTS audio, play it here
          // if (data.audio_url) {
          //   const audio = new Audio(data.audio_url);
          //   audioPlayerRef.current = audio;
          //   audio.play();
          // }
        } catch (err) {
          setStatusMsg("Error sending audio. Try again later.");
        }
      };
      mediaRecorder.start();
      setIsRecording(true);
      // Automatically stop after 10 seconds for demo
      setTimeout(() => {
        if (mediaRecorder.state !== 'inactive') {
          mediaRecorder.stop();
          setIsRecording(false);
        }
      }, 10000);
    } catch (err) {
      setStatusMsg("Microphone access denied or not available.");
    }
  };

  const handleEndCall = () => {
    setIsCallActive(false);
    setIsOpen(false);
    setStatusMsg("");
    if (mediaRecorderRef.current && mediaRecorderRef.current.state !== 'inactive') {
      mediaRecorderRef.current.stop();
      setIsRecording(false);
    }
  };

  return (
    <>
      {/* FAB Button */}
      {!isOpen && (
        <button
          onClick={() => setIsOpen(true)}
          className="fixed bottom-6 right-6 z-50 w-14 h-14 rounded-full bg-primary hover:bg-primary-hover text-primary-foreground shadow-lg flex items-center justify-center transition-all animate-pulse-amber"
          aria-label="Voice call"
        >
          <Phone className="w-6 h-6" />
        </button>
      )}

      {/* Call Panel */}
      {isOpen && (
        <div className="fixed bottom-6 right-6 z-50 w-80 bg-card rounded-2xl shadow-2xl border border-border overflow-hidden">
          {/* Header */}
          <div className="bg-primary px-4 py-3 flex items-center justify-between">
            <span className="text-primary-foreground font-display font-semibold text-sm">
              AI Travel Assistant
            </span>
            <button onClick={() => { setIsCallActive(false); setIsOpen(false); }}>
              <X className="w-4 h-4 text-primary-foreground" />
            </button>
          </div>

          <div className="p-6 flex flex-col items-center">
            {/* Avatar */}
            <div className="w-20 h-20 rounded-full bg-accent flex items-center justify-center mb-4">
              <span className="text-3xl">👩🏽‍💼</span>
            </div>

            {isCallActive ? (
              <>
                <p className="text-foreground font-display font-semibold mb-1">Connected</p>
                <p className="text-muted-foreground text-xs font-body mb-6">{statusMsg || "AI Travel Guide • Listening..."}</p>
                {/* Call controls */}
                <div className="flex gap-4">
                  <button
                    onClick={() => setIsMuted(!isMuted)}
                    className={`w-12 h-12 rounded-full flex items-center justify-center transition-colors ${
                      isMuted ? "bg-destructive text-destructive-foreground" : "bg-muted text-foreground"
                    }`}
                  >
                    {isMuted ? <MicOff className="w-5 h-5" /> : <Mic className="w-5 h-5" />}
                  </button>
                  <button
                    onClick={handleEndCall}
                    className="w-12 h-12 rounded-full bg-destructive text-destructive-foreground flex items-center justify-center"
                  >
                    <Phone className="w-5 h-5 rotate-[135deg]" />
                  </button>
                </div>
                {/* Optionally, play TTS audio here */}
                <audio ref={audioPlayerRef} hidden />
              </>
            ) : (
              <>
                <p className="text-foreground font-display font-semibold mb-1">Voice Assistant</p>
                <p className="text-muted-foreground text-xs font-body mb-6 text-center">
                  Talk to our AI travel guide about Kenya destinations
                </p>
                <button
                  onClick={handleStartCall}
                  className="w-full bg-primary hover:bg-primary-hover text-primary-foreground py-3 rounded-full font-semibold font-body transition-colors"
                >
                  Start Call
                </button>
              </>
            )}
          </div>
        </div>
      )}
    </>
  );
};

export default VoiceCallFAB;
