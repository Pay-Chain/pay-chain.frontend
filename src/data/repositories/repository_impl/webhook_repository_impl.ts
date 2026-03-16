/**
 * Webhook Repository Implementation
 */
import { webhookDataSource } from '../../data_source';
import type { IWebhookRepository } from '../repository/common_repository';

class WebhookRepositoryImpl implements IWebhookRepository {
  async listLogs(page = 1, limit = 10) {
    return webhookDataSource.list(page, limit);
  }

  async testPing(url: string) {
    return webhookDataSource.test(url);
  }
}

export const webhookRepository = new WebhookRepositoryImpl();
