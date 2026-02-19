import type { ApiResponse } from '@/core/network';
import type { CreatePaymentAppRequest } from '../../model/request';
import type { CreatePaymentAppResponse } from '../../model/response';
import type { RouteErrorDiagnostics, RouteErrorDiagnosticsParams } from '../../data_source/payment_app_data_source';

export interface IPaymentAppRepository {
  createPaymentApp(request: CreatePaymentAppRequest): Promise<ApiResponse<CreatePaymentAppResponse>>;
  getRouteErrorDiagnostics(params: RouteErrorDiagnosticsParams): Promise<RouteErrorDiagnostics | undefined>;
}
