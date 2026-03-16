import { useMutation, useQuery } from '@tanstack/react-query';
import { webhookRepository } from '../repositories/repository_impl';

export const useWebhookLogsQuery = (page = 1, limit = 10) => {
  return useQuery({
    queryKey: ['webhooks', 'logs', page, limit],
    queryFn: () => webhookRepository.listLogs(page, limit).then((res) => {
      if (res.error) throw new Error(res.error);
      return res.data;
    }),
  });
};

export const useTestWebhookPingMutation = () => {
  return useMutation({
    mutationFn: (url: string) =>
      webhookRepository.testPing(url).then((res) => {
        if (res.error) throw new Error(res.error);
        return res.data;
      }),
  });
};
