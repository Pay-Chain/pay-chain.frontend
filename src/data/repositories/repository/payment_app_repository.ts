import type { ApiResponse } from '@/core/network';
import type { CreatePaymentAppRequest } from '../../model/request';
import type { CreatePaymentAppResponse } from '../../model/response';

export interface IPaymentAppRepository {
  createPaymentApp(request: CreatePaymentAppRequest): Promise<ApiResponse<CreatePaymentAppResponse>>;
}
