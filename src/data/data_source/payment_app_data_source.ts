import { signedProxyHttpClient } from '@/core/network';
import { API_ENDPOINTS } from '@/core/constant/api_endpoints';
import type { CreatePaymentAppRequest } from '../model/request';
import type { CreatePaymentAppResponse } from '../model/response';
import { ApiResponse } from '@/core/network';

export interface RouteErrorDiagnosticsParams {
  sourceChainId: string;
  paymentId: string;
}

export interface RouteErrorDiagnostics {
  sourceChainId: string;
  gatewayAddress: string;
  paymentIdHex: string;
  decoded?: {
    rawHex?: string;
    selector?: string;
    name?: string;
    message?: string;
    details?: Record<string, unknown>;
  };
}

export class PaymentAppDataSource {
  async createPaymentApp(request: CreatePaymentAppRequest): Promise<ApiResponse<CreatePaymentAppResponse>> {
    return signedProxyHttpClient.post<CreatePaymentAppResponse>(API_ENDPOINTS.PAYMENT_APP, request);
  }

  async getRouteErrorDiagnostics(params: RouteErrorDiagnosticsParams): Promise<RouteErrorDiagnostics | undefined> {
    const query = new URLSearchParams({ sourceChainId: params.sourceChainId });
    const { data, error } = await signedProxyHttpClient.get<{ diagnostics: RouteErrorDiagnostics }>(
      `${API_ENDPOINTS.PAYMENT_APP_DIAGNOSTICS_ROUTE_ERROR(params.paymentId)}?${query.toString()}`
    );
    if (error) throw new Error(error);
    return data?.diagnostics;
  }
}

export const paymentAppDataSource = new PaymentAppDataSource();
