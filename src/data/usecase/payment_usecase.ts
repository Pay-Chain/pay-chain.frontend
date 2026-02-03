/**
 * Payment Usecases - React Query hooks for payments
 */
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { paymentRepository } from '../repositories/repository_impl';
import type { CreatePaymentRequest } from '../model/request';

export function usePaymentsQuery(page = 1, limit = 10) {
  return useQuery({
    queryKey: ['payments', page, limit],
    queryFn: async () => {
      const response = await paymentRepository.listPayments(page, limit);
      return response.data;
    },
  });
}

export function usePaymentQuery(id: string) {
  return useQuery({
    queryKey: ['payment', id],
    queryFn: async () => {
      const response = await paymentRepository.getPayment(id);
      return response.data;
    },
    enabled: !!id,
  });
}

export function usePaymentEventsQuery(id: string) {
  return useQuery({
    queryKey: ['paymentEvents', id],
    queryFn: async () => {
      const response = await paymentRepository.getPaymentEvents(id);
      return response.data;
    },
    enabled: !!id,
  });
}

export function useCreatePaymentMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (input: CreatePaymentRequest) => paymentRepository.createPayment(input),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['payments'] });
    },
  });
}
