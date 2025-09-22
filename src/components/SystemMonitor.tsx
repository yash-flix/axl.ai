import React, { useEffect, useState } from 'react';
import { Progress } from '@/components/ui/progress';

interface SystemStats {
  cpu: number;
  memory: number;
  network: 'strong' | 'weak' | 'offline';
  battery?: number;
  isCharging?: boolean;
}

export const SystemMonitor: React.FC = () => {
  const [stats, setStats] = useState<SystemStats>({
    cpu: 0,
    memory: 0,
    network: 'strong',
    battery: 85,
    isCharging: true,
  });

  useEffect(() => {
    // Simulate real-time system monitoring
    const interval = setInterval(() => {
      setStats(prev => ({
        ...prev,
        cpu: Math.max(0, Math.min(100, prev.cpu + (Math.random() - 0.5) * 10)),
        memory: Math.max(0, Math.min(100, prev.memory + (Math.random() - 0.5) * 5)),
        battery: prev.isCharging 
          ? Math.min(100, prev.battery! + 0.1)
          : Math.max(0, prev.battery! - 0.2),
      }));
    }, 2000);

    return () => clearInterval(interval);
  }, []);

  const getStatusColor = (value: number, type: 'cpu' | 'memory' | 'battery') => {
    if (type === 'battery') {
      if (value < 20) return 'from-red-500 to-red-600';
      if (value < 40) return 'from-yellow-500 to-yellow-600';
      return 'from-jarvis-cyan to-jarvis-blue';
    }
    
    if (value > 80) return 'from-red-500 to-red-600';
    if (value > 60) return 'from-yellow-500 to-yellow-600';
    return 'from-jarvis-cyan to-jarvis-blue';
  };

  const StatCard: React.FC<{
    label: string;
    value: number;
    type: 'cpu' | 'memory' | 'battery';
    icon: string;
    suffix?: string;
  }> = ({ label, value, type, icon, suffix = '%' }) => (
    <div className="bg-gradient-to-br from-jarvis-dark/50 to-jarvis-darker/50 p-4 rounded-lg border border-jarvis-blue/20 backdrop-blur-sm">
      <div className="flex items-center justify-between mb-2">
        <span className="text-jarvis-light text-sm font-medium">{icon} {label}</span>
        <span className="text-jarvis-cyan text-sm font-bold">{value.toFixed(1)}{suffix}</span>
      </div>
      <div className="relative">
        <Progress 
          value={value} 
          className="h-2 bg-jarvis-darker"
        />
        <div 
          className={`absolute top-0 left-0 h-2 rounded-full bg-gradient-to-r ${getStatusColor(value, type)} transition-all duration-500`}
          style={{ width: `${value}%` }}
        />
      </div>
    </div>
  );

  return (
    <div className="space-y-3">
      <h3 className="text-jarvis-cyan text-lg font-bold mb-4">📊 System Status</h3>
      
      <StatCard
        label="CPU"
        value={stats.cpu}
        type="cpu"
        icon="🖥️"
      />
      
      <StatCard
        label="Memory"
        value={stats.memory}
        type="memory"
        icon="💾"
      />
      
      <StatCard
        label="Battery"
        value={stats.battery!}
        type="battery"
        icon={stats.isCharging ? "🔌" : "🔋"}
      />
      
      {/* Network status */}
      <div className="bg-gradient-to-br from-jarvis-dark/50 to-jarvis-darker/50 p-4 rounded-lg border border-jarvis-blue/20 backdrop-blur-sm">
        <div className="flex items-center justify-between">
          <span className="text-jarvis-light text-sm font-medium">🌐 Network</span>
          <div className="flex items-center gap-2">
            <div className={`w-2 h-2 rounded-full ${
              stats.network === 'strong' ? 'bg-jarvis-cyan animate-pulse' :
              stats.network === 'weak' ? 'bg-yellow-500' : 'bg-red-500'
            }`} />
            <span className="text-jarvis-cyan text-sm capitalize">{stats.network}</span>
          </div>
        </div>
      </div>
    </div>
  );
};