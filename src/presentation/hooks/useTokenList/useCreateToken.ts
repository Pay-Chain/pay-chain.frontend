import { useMutation, useQueryClient } from "@tanstack/react-query";
import { CreateTokenUseCase } from "@/domain/usecase/token/CreateTokenUseCase";
import { TokenRepositoryImpl } from "@/data/repository/TokenRepositoryImpl";
import { TokenDataSourceImpl } from "@/data/datasource/token/TokenDataSource";
import { httpClient } from "@/core/network/http_client";
import { toast } from "sonner";
import { useTranslation } from "@/presentation/hooks";

export const useCreateToken = () => {
    const { t } = useTranslation();
    const queryClient = useQueryClient();
    const dataSource = new TokenDataSourceImpl(httpClient);
    const repository = new TokenRepositoryImpl(dataSource);
    const useCase = new CreateTokenUseCase(repository);

    return useMutation({
        mutationFn: (data: any) => useCase.execute(data),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['tokens'] });
            toast.success(t('admin.tokens_view.toasts.create_success'));
        },
        onError: (error: any) => {
            toast.error(error.message || t('admin.tokens_view.toasts.create_failed'));
        }
    });
};
