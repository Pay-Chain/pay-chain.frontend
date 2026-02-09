import { HttpClient } from "../../../core/network/http_client";
import { API_ENDPOINTS } from "../../../core/constant/api_endpoints";
import { RpcListResponse, RpcResponse, CreateRpcRequest, UpdateRpcRequest, RpcFilterParams } from "../../model/response/rpc/RpcResponse";

export interface RpcDataSource {
  getRpcList(params: RpcFilterParams): Promise<RpcListResponse>;
  createRpc(data: CreateRpcRequest): Promise<RpcResponse>;
  updateRpc(id: string, data: UpdateRpcRequest): Promise<RpcResponse>;
  deleteRpc(id: string): Promise<void>;
}

export class RpcDataSourceImpl implements RpcDataSource {
  constructor(private client: HttpClient) {}

  async getRpcList(params: RpcFilterParams): Promise<RpcListResponse> {
    const query = new URLSearchParams();
    if (params.chainId) query.append('chainId', params.chainId.toString());
    if (params.isActive !== undefined) query.append('isActive', params.isActive.toString());
    if (params.search) query.append('search', params.search);
    if (params.page) query.append('page', params.page.toString());
    if (params.limit) query.append('limit', params.limit.toString());

    const response = await this.client.get<RpcListResponse>(`${API_ENDPOINTS.ADMIN_RPCS}?${query.toString()}`);
    if (response.error || !response.data) {
      throw new Error(response.error || 'Failed to fetch RPCs');
    }
    return response.data;
  }

  async createRpc(data: CreateRpcRequest): Promise<RpcResponse> {
    // Note: Backend might need a specific endpoint for CREATE RPC if not using standard crud
    // For now assuming we might piggyback or use a new endpoint if created
    // Since we didn't explicitly create POST /admin/rpcs, we might need to handle this via Chain update or add it.
    // Wait, implementation plan check: we only added GET /admin/rpcs. 
    // Creating RPCs independently might require a new endpoint.
    // For now let's stub or use chain update if that's the only way.
    // Actually, looking at main.go, we ONLY added GET. 
    // So writing to RPCs is likely still done via Chain Update for now, or we missed adding POST/PUT in backend.
    // Let's assume for this task we focus on LISTING/FILTERING as per user request. 
    throw new Error("Create RPC not implemented in backend yet");
  }

  async updateRpc(id: string, data: UpdateRpcRequest): Promise<RpcResponse> {
     throw new Error("Update RPC not implemented in backend yet");
  }

  async deleteRpc(id: string): Promise<void> {
     throw new Error("Delete RPC not implemented in backend yet");
  }
}
