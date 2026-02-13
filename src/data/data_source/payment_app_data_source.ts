import { signedProxyHttpClient } from '@/core/network';
import { API_ENDPOINTS } from '@/core/constant/api_endpoints';
import type { CreatePaymentAppRequest } from '../model/request';
import type { CreatePaymentAppResponse } from '../model/response';
import { ApiResponse } from '@/core/network';

export class PaymentAppDataSource {
  async createPaymentApp(request: CreatePaymentAppRequest): Promise<ApiResponse<CreatePaymentAppResponse>> {
    return signedProxyHttpClient.post<CreatePaymentAppResponse>(API_ENDPOINTS.PAYMENT_APP, request);
  }
}

export const paymentAppDataSource = new PaymentAppDataSource();
