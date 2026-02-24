import Navbar from "@/components/Navbar";
import ChatInterface from "@/components/ChatInterface";
import VoiceCallFAB from "@/components/VoiceCallFAB";

const Chat = () => {
  return (
    <div className="min-h-screen pt-16">
      <Navbar />
      <ChatInterface />
      <VoiceCallFAB />
    </div>
  );
};

export default Chat;
