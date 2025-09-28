// Type definitions for AXL.AI project

export interface AxlConfig {
  version: string;
  voiceEnabled: boolean;
  theme: 'light' | 'dark';
  autoStart: boolean;
}

export interface AxlCommand {
  id: string;
  text: string;
  timestamp: Date;
  response?: string;
  status: 'pending' | 'success' | 'error';
}

export interface AxlSystemInfo {
  os: string;
  version: string;
  memory: {
    total: number;
    available: number;
    usage: number;
  };
  cpu: {
    usage: number;
    cores: number;
  };
}

export interface AxlVoiceState {
  isListening: boolean;
  isProcessing: boolean;
  lastCommand?: string;
  confidence?: number;
}

export interface AxlBackendResponse {
  success: boolean;
  message: string;
  data?: any;
  error?: string;
}

// PyWebView API interface
export interface PyWebViewAPI {
  // Backend control
  start_backend: () => Promise<boolean>;
  stop_backend: () => Promise<boolean>;
  get_backend_status: () => Promise<boolean>;
  restart_backend: () => Promise<boolean>;
  
  // Command processing
  send_command: (command: string) => Promise<string>;
  get_command_history: () => Promise<AxlCommand[]>;
  clear_command_history: () => Promise<void>;
  
  // Voice control
  set_voice_enabled: (enabled: boolean) => Promise<void>;
  get_voice_enabled: () => Promise<boolean>;
  get_voice_state: () => Promise<AxlVoiceState>;
  
  // System information
  get_system_info: () => Promise<AxlSystemInfo>;
  get_config: () => Promise<AxlConfig>;
  set_config: (config: Partial<AxlConfig>) => Promise<void>;
  
  // File operations
  save_log: (message: string, level: 'info' | 'warn' | 'error') => Promise<void>;
  export_data: () => Promise<string>;
  import_data: (data: string) => Promise<boolean>;
}

// Error types
export class AxlError extends Error {
  constructor(
    message: string,
    public code: string,
    public details?: any
  ) {
    super(message);
    this.name = 'AxlError';
  }
}

export class AxlBackendError extends AxlError {
  constructor(message: string, details?: any) {
    super(message, 'BACKEND_ERROR', details);
  }
}

export class AxlVoiceError extends AxlError {
  constructor(message: string, details?: any) {
    super(message, 'VOICE_ERROR', details);
  }
}

export class AxlApiError extends AxlError {
  constructor(message: string, details?: any) {
    super(message, 'API_ERROR', details);
  }
}