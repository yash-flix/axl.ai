import { useState, useEffect, useCallback } from 'react';

interface PyWebViewAPI {
  start_backend: () => Promise<boolean>;
  stop_backend: () => Promise<boolean>;
  send_command: (command: string) => Promise<string>;
  get_backend_status: () => Promise<boolean>;
  set_voice_enabled: (enabled: boolean) => Promise<void>;
  get_voice_enabled: () => Promise<boolean>;
}

interface AxlApiState {
  isBackendRunning: boolean;
  isVoiceEnabled: boolean;
  isConnected: boolean;
}

export const useAxlApi = () => {
  const [state, setState] = useState<AxlApiState>({
    isBackendRunning: false,
    isVoiceEnabled: true,
    isConnected: false
  });

  const api = window.pywebview?.api as PyWebViewAPI | undefined;

  useEffect(() => {
    // Check if PyWebView API is available
    setState(prev => ({ ...prev, isConnected: !!api }));
    
    if (api) {
      // Initialize state from backend
      initializeState();
    }
  }, [api]);

  const initializeState = async () => {
    if (!api) return;
    
    try {
      const [backendStatus, voiceStatus] = await Promise.all([
        api.get_backend_status(),
        api.get_voice_enabled()
      ]);
      
      setState(prev => ({
        ...prev,
        isBackendRunning: backendStatus,
        isVoiceEnabled: voiceStatus
      }));
    } catch (error) {
      console.error('Failed to initialize AXL API state:', error);
    }
  };

  const startBackend = useCallback(async (): Promise<boolean> => {
    if (!api) return false;
    
    try {
      const success = await api.start_backend();
      if (success) {
        setState(prev => ({ ...prev, isBackendRunning: true }));
      }
      return success;
    } catch (error) {
      console.error('Failed to start backend:', error);
      return false;
    }
  }, [api]);

  const stopBackend = useCallback(async (): Promise<boolean> => {
    if (!api) return false;
    
    try {
      const success = await api.stop_backend();
      if (success) {
        setState(prev => ({ ...prev, isBackendRunning: false }));
      }
      return success;
    } catch (error) {
      console.error('Failed to stop backend:', error);
      return false;
    }
  }, [api]);

  const sendCommand = useCallback(async (command: string): Promise<string> => {
    if (!api) return 'API not available';
    
    try {
      return await api.send_command(command);
    } catch (error) {
      console.error('Failed to send command:', error);
      return 'Command failed';
    }
  }, [api]);

  const toggleVoice = useCallback(async (): Promise<void> => {
    if (!api) return;
    
    try {
      const newState = !state.isVoiceEnabled;
      await api.set_voice_enabled(newState);
      setState(prev => ({ ...prev, isVoiceEnabled: newState }));
    } catch (error) {
      console.error('Failed to toggle voice:', error);
    }
  }, [api, state.isVoiceEnabled]);

  return {
    ...state,
    startBackend,
    stopBackend,
    sendCommand,
    toggleVoice,
    refreshStatus: initializeState
  };
};