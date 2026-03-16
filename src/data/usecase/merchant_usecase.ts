import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { merchantRepository } from '../repositories/repository_impl';

export const useMerchantMeQuery = () => {
  return useQuery({
    queryKey: ['merchant', 'me'],
    queryFn: () => merchantRepository.getMe().then((res) => {
      if (res.error) throw new Error(res.error);
      return res.data;
    }),
  });
};

export const useUpdateMerchantSettingsMutation = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: (input: { callbackUrl: string; webhookIsActive: boolean }) =>
      merchantRepository.updateSettings(input).then((res) => {
        if (res.error) throw new Error(res.error);
        return res.data;
      }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['merchant', 'me'] });
    },
  });
};
