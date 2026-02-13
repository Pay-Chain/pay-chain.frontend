import { useMutation } from '@tanstack/react-query';
import { paymentAppRepository } from '../repositories/repository_impl/payment_app_repository_impl';
import type { CreatePaymentAppRequest } from '../model/request';

export function useCreatePaymentAppMutation() {
  return useMutation({
    mutationFn: async (request: CreatePaymentAppRequest) => {
      const response = await paymentAppRepository.createPaymentApp(request);
      if (response.error) throw new Error(response.error); // Or response.message
      return response.data;
    },
  });
}
