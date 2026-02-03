/**
 * Payment Repository Implementation
 * Uses PaymentDataSource for HTTP operations
 */
import { paymentDataSource } from '../../data_source';
import type { IPaymentRepository } from '../repository/payment_repository';
import type { CreatePaymentRequest } from '../../model/request';

class PaymentRepositoryImpl implements IPaymentRepository {
  async createPayment(input: CreatePaymentRequest) {
    return paymentDataSource.create(input);
  }

  async getPayment(id: string) {
    return paymentDataSource.getById(id);
  }

  async listPayments(page = 1, limit = 10) {
    return paymentDataSource.list(page, limit);
  }

  async getPaymentEvents(id: string) {
    return paymentDataSource.getEvents(id);
  }
}

export const paymentRepository = new PaymentRepositoryImpl();
