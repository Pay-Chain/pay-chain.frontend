import { useMutation, useQueryClient } from "@tanstack/react-query";
import { UpdateTokenUseCase } from "@/domain/usecase/token/UpdateTokenUseCase";
import { TokenRepositoryImpl } from "@/data/repository/TokenRepositoryImpl";
import { TokenDataSourceImpl } from "@/data/datasource/token/TokenDataSource";
import { httpClient } from "@/core/network/http_client";
import { toast } from "sonner";

export const useUpdateToken = () => {
    const queryClient = useQueryClient();
    const dataSource = new TokenDataSourceImpl(httpClient);
    const repository = new TokenRepositoryImpl(dataSource);
    const useCase = new UpdateTokenUseCase(repository);

    return useMutation({
        mutationFn: ({ id, data }: { id: string, data: any }) => useCase.execute(id, data),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['tokens'] });
            toast.success('Token updated successfully');
        },
        onError: (error: any) => {
            toast.error(error.message || 'Failed to update token');
        }
    });
};
