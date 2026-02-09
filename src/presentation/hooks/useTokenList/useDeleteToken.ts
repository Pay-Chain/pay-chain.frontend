import { useMutation, useQueryClient } from "@tanstack/react-query";
import { DeleteTokenUseCase } from "@/domain/usecase/token/DeleteTokenUseCase";
import { TokenRepositoryImpl } from "@/data/repository/TokenRepositoryImpl";
import { TokenDataSourceImpl } from "@/data/datasource/token/TokenDataSource";
import { httpClient } from "@/core/network/http_client";
import { toast } from "sonner";

export const useDeleteToken = () => {
    const queryClient = useQueryClient();
    const dataSource = new TokenDataSourceImpl(httpClient);
    const repository = new TokenRepositoryImpl(dataSource);
    const useCase = new DeleteTokenUseCase(repository);

    return useMutation({
        mutationFn: (id: string) => useCase.execute(id),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['tokens'] });
            toast.success('Token deleted successfully');
        },
        onError: (error: any) => {
            toast.error(error.message || 'Failed to delete token');
        }
    });
};
