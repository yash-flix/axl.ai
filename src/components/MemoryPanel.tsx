import React, { useState, useEffect } from 'react';
import { ScrollArea } from '@/components/ui/scroll-area';

interface MemoryEntry {
  id: string;
  input: string;
  output: string;
  timestamp: Date;
  type: 'command' | 'conversation' | 'system';
}

export const MemoryPanel: React.FC = () => {
  const [memories, setMemories] = useState<MemoryEntry[]>([]);

  useEffect(() => {
    // Initialize with some sample memory entries
    const sampleMemories: MemoryEntry[] = [
      {
        id: '1',
        input: 'What time is it?',
        output: 'Current time is 14:32 PM',
        timestamp: new Date(Date.now() - 300000), // 5 minutes ago
        type: 'command'
      },
      {
        id: '2',
        input: 'Take screenshot',
        output: 'Screenshot saved to desktop',
        timestamp: new Date(Date.now() - 600000), // 10 minutes ago
        type: 'command'
      },
      {
        id: '3',
        input: 'System status check',
        output: 'All systems operational',
        timestamp: new Date(Date.now() - 900000), // 15 minutes ago
        type: 'system'
      },
      {
        id: '4',
        input: 'Tell me a joke',
        output: 'Why don\'t scientists trust atoms? Because they make up everything!',
        timestamp: new Date(Date.now() - 1200000), // 20 minutes ago
        type: 'conversation'
      }
    ];
    
    setMemories(sampleMemories);
  }, []);

  const getTypeIcon = (type: MemoryEntry['type']) => {
    switch (type) {
      case 'command': return '⚡';
      case 'conversation': return '💬';
      case 'system': return '🔧';
      default: return '📝';
    }
  };

  const getTypeColor = (type: MemoryEntry['type']) => {
    switch (type) {
      case 'command': return 'text-jarvis-cyan';
      case 'conversation': return 'text-jarvis-purple';
      case 'system': return 'text-yellow-400';
      default: return 'text-gray-400';
    }
  };

  const formatTimestamp = (timestamp: Date) => {
    const now = new Date();
    const diff = now.getTime() - timestamp.getTime();
    const minutes = Math.floor(diff / 60000);
    const hours = Math.floor(minutes / 60);
    
    if (hours > 0) {
      return `${hours}h ago`;
    } else if (minutes > 0) {
      return `${minutes}m ago`;
    } else {
      return 'Just now';
    }
  };

  const MemoryItem: React.FC<{ memory: MemoryEntry }> = ({ memory }) => (
    <div className="p-3 mb-3 rounded-lg bg-gradient-to-r from-jarvis-dark/30 to-jarvis-darker/30 border border-jarvis-blue/10 hover:border-jarvis-blue/30 transition-all duration-300">
      <div className="flex items-start gap-3">
        <span className="text-lg">{getTypeIcon(memory.type)}</span>
        <div className="flex-1 min-w-0">
          <div className="flex items-center justify-between mb-2">
            <span className={`text-xs font-medium ${getTypeColor(memory.type)}`}>
              {memory.type.toUpperCase()}
            </span>
            <span className="text-xs text-gray-500">
              {formatTimestamp(memory.timestamp)}
            </span>
          </div>
          <div className="space-y-1">
            <p className="text-sm text-gray-300 truncate">
              <span className="text-gray-500">Input:</span> {memory.input}
            </p>
            <p className="text-sm text-gray-300 truncate">
              <span className="text-gray-500">Output:</span> {memory.output}
            </p>
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <div className="bg-gradient-to-br from-jarvis-dark/50 to-jarvis-darker/50 p-4 rounded-lg border border-jarvis-blue/20 backdrop-blur-sm h-full">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-jarvis-cyan text-lg font-bold">🧠 Recent Memory</h3>
        <div className="flex items-center gap-2">
          <div className="w-2 h-2 bg-jarvis-cyan rounded-full animate-pulse" />
          <span className="text-xs text-gray-400">Live</span>
        </div>
      </div>
      
      <ScrollArea className="h-80">
        {memories.length > 0 ? (
          memories.map((memory) => (
            <MemoryItem key={memory.id} memory={memory} />
          ))
        ) : (
          <div className="flex flex-col items-center justify-center h-40 text-gray-500">
            <span className="text-4xl mb-2">🧠</span>
            <p className="text-sm">No recent memories</p>
          </div>
        )}
      </ScrollArea>
      
      {/* Memory stats */}
      <div className="mt-4 pt-4 border-t border-jarvis-blue/20">
        <div className="grid grid-cols-3 gap-4 text-center">
          <div>
            <div className="text-jarvis-cyan font-bold">{memories.filter(m => m.type === 'command').length}</div>
            <div className="text-xs text-gray-400">Commands</div>
          </div>
          <div>
            <div className="text-jarvis-purple font-bold">{memories.filter(m => m.type === 'conversation').length}</div>
            <div className="text-xs text-gray-400">Chats</div>
          </div>
          <div>
            <div className="text-yellow-400 font-bold">{memories.filter(m => m.type === 'system').length}</div>
            <div className="text-xs text-gray-400">System</div>
          </div>
        </div>
      </div>
    </div>
  );
};