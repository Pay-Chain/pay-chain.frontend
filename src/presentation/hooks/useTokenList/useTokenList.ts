import { useQuery } from '@tanstack/react-query';
import { httpClient } from '../../../core/network/http_client';
import { GetTokenListUseCase } from '../../../domain/usecase/token/GetTokenListUseCase';
import { TokenRepositoryImpl } from '../../../data/repository/TokenRepositoryImpl';
import { TokenDataSourceImpl } from '../../../data/datasource/token/TokenDataSource';
import { TokenFilterParams } from '../../../data/model/response/token/TokenResponse';

export const useTokenList = (params: TokenFilterParams) => {
  
  const dataSource = new TokenDataSourceImpl(httpClient);
  const repository = new TokenRepositoryImpl(dataSource);
  const useCase = new GetTokenListUseCase(repository);

  return useQuery({
    queryKey: ['tokens', params],
    queryFn: () => useCase.execute(params),
    retry: false,
    refetchOnWindowFocus: false,
  });
};
