import { paymentAppDataSource } from '../../data_source/payment_app_data_source';
import type { IPaymentAppRepository } from '../repository/payment_app_repository';
import type { ApiResponse } from '@/core/network';
import type { CreatePaymentAppRequest } from '../../model/request';
import type { CreatePaymentAppResponse } from '../../model/response';
import type { RouteErrorDiagnostics, RouteErrorDiagnosticsParams } from '../../data_source/payment_app_data_source';

export class PaymentAppRepositoryImpl implements IPaymentAppRepository {
  async createPaymentApp(request: CreatePaymentAppRequest): Promise<ApiResponse<CreatePaymentAppResponse>> {
    return paymentAppDataSource.createPaymentApp(request);
  }

  async getRouteErrorDiagnostics(params: RouteErrorDiagnosticsParams): Promise<RouteErrorDiagnostics | undefined> {
    return paymentAppDataSource.getRouteErrorDiagnostics(params);
  }
}

export const paymentAppRepository = new PaymentAppRepositoryImpl();
