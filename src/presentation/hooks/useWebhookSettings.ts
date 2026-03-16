'use client';

import { useState, useCallback } from 'react';
import { webhookRepository } from '@/data/repositories/repository_impl';
import { toast } from 'sonner';

export const useWebhookSettings = () => {
  const [status, setStatus] = useState<'IDLE' | 'LOADING' | 'SUCCESS' | 'ERROR'>('IDLE');
  
  const sendTestPing = useCallback(async (url: string) => {
    if (!url) {
      toast.error("Please enter an endpoint URL.");
      return;
    }

    setStatus('LOADING');
    try {
      const response = await webhookRepository.testPing(url);
      if (response.error) {
        throw new Error(response.error);
      }
      setStatus('SUCCESS');
      toast.success("Test ping sent! Check your server logs.");
    } catch (e: any) {
      setStatus('ERROR');
      toast.error(e.message || "Failed to reach endpoint.");
    }
  }, []);

  return { status, sendTestPing };
};
