import { useMutation, useQueryClient } from "@tanstack/react-query";
import { CreateTokenUseCase } from "@/domain/usecase/token/CreateTokenUseCase";
import { TokenRepositoryImpl } from "@/data/repository/TokenRepositoryImpl";
import { TokenDataSourceImpl } from "@/data/datasource/token/TokenDataSource";
import { httpClient } from "@/core/network/http_client";
import { toast } from "sonner";

export const useCreateToken = () => {
    const queryClient = useQueryClient();
    const dataSource = new TokenDataSourceImpl(httpClient);
    const repository = new TokenRepositoryImpl(dataSource);
    const useCase = new CreateTokenUseCase(repository);

    return useMutation({
        mutationFn: (data: any) => useCase.execute(data),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['tokens'] });
            toast.success('Token created successfully');
        },
        onError: (error: any) => {
            toast.error(error.message || 'Failed to create token');
        }
    });
};
