import { useMutation, useQueryClient } from "@tanstack/react-query";
import { DeleteTokenUseCase } from "@/domain/usecase/token/DeleteTokenUseCase";
import { TokenRepositoryImpl } from "@/data/repository/TokenRepositoryImpl";
import { TokenDataSourceImpl } from "@/data/datasource/token/TokenDataSource";
import { httpClient } from "@/core/network/http_client";
import { toast } from "sonner";
import { useTranslation } from "@/presentation/hooks";

export const useDeleteToken = () => {
    const { t } = useTranslation();
    const queryClient = useQueryClient();
    const dataSource = new TokenDataSourceImpl(httpClient);
    const repository = new TokenRepositoryImpl(dataSource);
    const useCase = new DeleteTokenUseCase(repository);

    return useMutation({
        mutationFn: (id: string) => useCase.execute(id),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['tokens'] });
            toast.success(t('admin.tokens_view.toasts.delete_success'));
        },
        onError: (error: any) => {
            toast.error(error.message || t('admin.tokens_view.toasts.delete_failed'));
        }
    });
};
