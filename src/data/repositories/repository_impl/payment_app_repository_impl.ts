import { paymentAppDataSource } from '../../data_source/payment_app_data_source';
import type { IPaymentAppRepository } from '../repository/payment_app_repository';
import type { ApiResponse } from '@/core/network';
import type { CreatePaymentAppRequest } from '../../model/request';
import type { CreatePaymentAppResponse } from '../../model/response';

export class PaymentAppRepositoryImpl implements IPaymentAppRepository {
  async createPaymentApp(request: CreatePaymentAppRequest): Promise<ApiResponse<CreatePaymentAppResponse>> {
    return paymentAppDataSource.createPaymentApp(request);
  }
}

export const paymentAppRepository = new PaymentAppRepositoryImpl();
