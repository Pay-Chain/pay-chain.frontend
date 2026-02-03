/**
 * Payment Data Source
 * Acts as HTTP connector between PaymentRepository and httpClient
 */
import { httpClient } from '@/core/network';
import { API_ENDPOINTS } from '@/core/constant';
import type { CreatePaymentRequest } from '../model/request';
import type {
  CreatePaymentResponse,
  PaymentResponse,
  PaymentsResponse,
  PaymentEventsResponse,
} from '../model/response';

class PaymentDataSource {
  async create(request: CreatePaymentRequest) {
    return httpClient.post<CreatePaymentResponse>(API_ENDPOINTS.PAYMENTS, request);
  }

  async getById(id: string) {
    return httpClient.get<PaymentResponse>(API_ENDPOINTS.PAYMENT_BY_ID(id));
  }

  async list(page = 1, limit = 10) {
    return httpClient.get<PaymentsResponse>(
      `${API_ENDPOINTS.PAYMENTS}?page=${page}&limit=${limit}`
    );
  }

  async getEvents(id: string) {
    return httpClient.get<PaymentEventsResponse>(API_ENDPOINTS.PAYMENT_EVENTS(id));
  }
}

export const paymentDataSource = new PaymentDataSource();
