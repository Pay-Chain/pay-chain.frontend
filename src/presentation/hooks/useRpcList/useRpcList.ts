import { useQuery } from '@tanstack/react-query';
import { httpClient } from '../../../core/network/http_client';
import { GetRpcListUseCase } from '../../../domain/usecase/rpc/GetRpcListUseCase';
import { RpcRepositoryImpl } from '../../../data/repository/RpcRepositoryImpl';
import { RpcDataSourceImpl } from '../../../data/datasource/rpc/RpcDataSource';
import { RpcFilterParams } from '../../../data/model/response/rpc/RpcResponse';

export const useRpcList = (params: RpcFilterParams) => {
  
  const dataSource = new RpcDataSourceImpl(httpClient);
  const repository = new RpcRepositoryImpl(dataSource);
  const useCase = new GetRpcListUseCase(repository);

  return useQuery({
    queryKey: ['rpcs', params],
    queryFn: () => useCase.execute(params),
    retry: false,
    refetchOnWindowFocus: false,
  });
};
