import React, { useState, useRef, useEffect } from 'react';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Input } from '@/components/ui/input';
import { JarvisButton } from './JarvisButton';

interface Message {
  id: string;
  type: 'user' | 'jarvis' | 'system';
  content: string;
  timestamp: Date;
}

interface ChatInterfaceProps {
  isListening: boolean;
  onSendMessage: (message: string) => void;
  onStartListening: () => void;
  onStopListening: () => void;
}

export const ChatInterface: React.FC<ChatInterfaceProps> = ({
  isListening,
  onSendMessage,
  onStartListening,
  onStopListening,
}) => {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      type: 'system',
      content: '🤖 J.A.R.V.I.S Interface Online - Advanced AI Assistant Ready',
      timestamp: new Date(),
    },
    {
      id: '2',
      type: 'jarvis',
      content: 'Good evening. I am J.A.R.V.I.S, your AI assistant. How may I assist you today?',
      timestamp: new Date(),
    },
  ]);
  const [inputValue, setInputValue] = useState('');
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  const handleSendMessage = () => {
    if (!inputValue.trim()) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      type: 'user',
      content: inputValue,
      timestamp: new Date(),
    };

    setMessages(prev => [...prev, userMessage]);
    onSendMessage(inputValue);
    setInputValue('');

    // Simulate Jarvis response
    setTimeout(() => {
      const jarvisResponse: Message = {
        id: (Date.now() + 1).toString(),
        type: 'jarvis',
        content: getJarvisResponse(inputValue),
        timestamp: new Date(),
      };
      setMessages(prev => [...prev, jarvisResponse]);
    }, 1000);
  };

  const getJarvisResponse = (input: string): string => {
    const responses = [
      "I'm processing your request. Please stand by.",
      "Understood. Executing command protocols.",
      "Scanning systems... All functions nominal.",
      "Command received. Initiating appropriate responses.",
      "Your request has been logged and is being processed.",
      "All systems operational. How else may I assist?",
    ];
    return responses[Math.floor(Math.random() * responses.length)];
  };

  const MessageBubble: React.FC<{ message: Message }> = ({ message }) => {
    const getMessageStyle = () => {
      switch (message.type) {
        case 'jarvis':
          return 'bg-gradient-to-r from-jarvis-blue/20 to-jarvis-cyan/20 border-jarvis-blue/40 ml-0 mr-12';
        case 'user':
          return 'bg-gradient-to-r from-jarvis-purple/20 to-jarvis-blue/20 border-jarvis-purple/40 ml-12 mr-0';
        case 'system':
          return 'bg-gradient-to-r from-gray-600/20 to-gray-500/20 border-gray-500/40 mx-6';
        default:
          return '';
      }
    };

    const getIcon = () => {
      switch (message.type) {
        case 'jarvis': return '🤖';
        case 'user': return '👤';
        case 'system': return '⚙️';
        default: return '';
      }
    };

    return (
      <div className={`p-4 mb-4 rounded-lg border-2 backdrop-blur-sm animate-slide-in ${getMessageStyle()}`}>
        <div className="flex items-start gap-3">
          <span className="text-2xl">{getIcon()}</span>
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-2">
              <span className="font-semibold text-jarvis-cyan">
                {message.type === 'jarvis' ? 'J.A.R.V.I.S' : message.type === 'user' ? 'User' : 'System'}
              </span>
              <span className="text-xs text-gray-400">
                {message.timestamp.toLocaleTimeString()}
              </span>
            </div>
            <p className="text-jarvis-light leading-relaxed">{message.content}</p>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="flex flex-col h-full bg-gradient-to-br from-jarvis-darker/50 to-jarvis-dark/50 rounded-xl border border-jarvis-blue/20 backdrop-blur-sm">
      {/* Header */}
      <div className="p-4 border-b border-jarvis-blue/20">
        <h2 className="text-xl font-bold text-jarvis-cyan flex items-center gap-2">
          🤖 J.A.R.V.I.S Chat Interface
          <div className={`w-3 h-3 rounded-full ${isListening ? 'bg-jarvis-cyan animate-pulse' : 'bg-gray-500'}`} />
        </h2>
      </div>

      {/* Messages */}
      <ScrollArea className="flex-1 p-4" ref={scrollRef}>
        {messages.map((message) => (
          <MessageBubble key={message.id} message={message} />
        ))}
        
        {isListening && (
          <div className="p-4 mb-4 rounded-lg bg-gradient-to-r from-jarvis-cyan/20 to-jarvis-blue/20 border-2 border-jarvis-cyan/40 backdrop-blur-sm">
            <div className="flex items-center gap-3">
              <div className="w-6 h-6 bg-jarvis-cyan rounded-full animate-pulse" />
              <span className="text-jarvis-cyan animate-pulse">Listening...</span>
            </div>
          </div>
        )}
      </ScrollArea>

      {/* Input */}
      <div className="p-4 border-t border-jarvis-blue/20">
        <div className="flex gap-3">
          <Input
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
            placeholder="Type your command here..."
            className="flex-1 bg-jarvis-darker/50 border-jarvis-blue/40 text-jarvis-light placeholder-gray-400 focus:border-jarvis-cyan"
          />
          <JarvisButton
            onClick={handleSendMessage}
            icon="📤"
            variant="success"
            disabled={!inputValue.trim()}
          >
            Send
          </JarvisButton>
          <JarvisButton
            onClick={isListening ? onStopListening : onStartListening}
            icon={isListening ? "🛑" : "🎤"}
            variant={isListening ? "danger" : "primary"}
            isActive={isListening}
          >
            {isListening ? 'Stop' : 'Voice'}
          </JarvisButton>
        </div>
      </div>
    </div>
  );
};