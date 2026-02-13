import { useMutation, useQueryClient } from "@tanstack/react-query";
import { UpdateTokenUseCase } from "@/domain/usecase/token/UpdateTokenUseCase";
import { TokenRepositoryImpl } from "@/data/repository/TokenRepositoryImpl";
import { TokenDataSourceImpl } from "@/data/datasource/token/TokenDataSource";
import { httpClient } from "@/core/network/http_client";
import { toast } from "sonner";
import { useTranslation } from "@/presentation/hooks";

export const useUpdateToken = () => {
    const { t } = useTranslation();
    const queryClient = useQueryClient();
    const dataSource = new TokenDataSourceImpl(httpClient);
    const repository = new TokenRepositoryImpl(dataSource);
    const useCase = new UpdateTokenUseCase(repository);

    return useMutation({
        mutationFn: ({ id, data }: { id: string, data: any }) => useCase.execute(id, data),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['tokens'] });
            toast.success(t('admin.tokens_view.toasts.update_success'));
        },
        onError: (error: any) => {
            toast.error(error.message || t('admin.tokens_view.toasts.update_failed'));
        }
    });
};
