/**
 * Webhook Data Source
 * Acts as HTTP connector between WebhookRepository and httpClient
 */
import { httpClient } from '@/core/network';
import { API_ENDPOINTS } from '@/core/constants';
import type { WebhookLog } from '../model/entity';
import type { Pagination } from '../model/response';

export interface WebhookLogsResponse {
  items: WebhookLog[];
  meta: Pagination;
}

class WebhookDataSource {
  async list(page = 1, limit = 10) {
    return httpClient.get<WebhookLogsResponse>(
      `${API_ENDPOINTS.WEBHOOK_LOGS}?page=${page}&limit=${limit}`
    );
  }

  async test(url: string) {
    return httpClient.post<{ message: string }>(API_ENDPOINTS.WEBHOOK_TEST_PING, { url });
  }
}

export const webhookDataSource = new WebhookDataSource();
