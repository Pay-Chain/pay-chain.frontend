import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { AdminRepository } from '../repositories/admin_repository';

const adminRepository = new AdminRepository();

export const useAdminStats = () => {
  return useQuery({
    queryKey: ['admin', 'stats'],
    queryFn: () => adminRepository.getStats(),
  });
};

export const useAdminUsers = (search?: string) => {
  return useQuery({
    queryKey: ['admin', 'users', search],
    queryFn: () => adminRepository.getUsers(search),
  });
};

export const useAdminMerchants = () => {
  return useQuery({
    queryKey: ['admin', 'merchants'],
    queryFn: () => adminRepository.getMerchants(),
  });
};

export const useAdminChains = () => {
  return useQuery({
    queryKey: ['chains'],
    queryFn: () => adminRepository.getChains(),
  });
};

export const useUpdateMerchantStatus = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, status }: { id: string; status: string }) => 
      adminRepository.updateMerchantStatus(id, status),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin', 'merchants'] });
    },
  });
};

export const useCreateChain = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: any) => adminRepository.createChain(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['chains'] });
    },
  });
};

export const useUpdateChain = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, data }: { id: number; data: any }) => adminRepository.updateChain(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['chains'] });
    },
  });
};

export const useDeleteChain = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: number) => adminRepository.deleteChain(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['chains'] });
    },
  });
};

export const useAdminContracts = () => {
  return useQuery({
    queryKey: ['contracts'],
    queryFn: () => adminRepository.getContracts(),
  });
};

export const useCreateContract = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: any) => adminRepository.createContract(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['contracts'] });
    },
  });
};

export const useUpdateContract = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: any }) => adminRepository.updateContract(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['contracts'] });
    },
  });
};

export const useDeleteContract = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => adminRepository.deleteContract(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['contracts'] });
    },
  });
};
