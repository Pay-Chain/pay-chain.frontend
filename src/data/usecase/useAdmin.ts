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

export const useAdminChains = (page?: number, limit?: number) => {
  return useQuery({
    queryKey: ['chains', page, limit],
    queryFn: () => adminRepository.getChains(page, limit),
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
    mutationFn: ({ id, data }: { id: string; data: any }) => adminRepository.updateChain(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['chains'] });
    },
  });
};

export const useDeleteChain = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => adminRepository.deleteChain(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['chains'] });
    },
  });
};

export const useAdminContracts = (page?: number, limit?: number, chainId?: string, type?: string) => {
  return useQuery({
    queryKey: ['contracts', page, limit, chainId, type],
    queryFn: () => adminRepository.getContracts(page, limit, chainId, type),
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

export const usePublicTeams = () => {
  return useQuery({
    queryKey: ['teams', 'public'],
    queryFn: () => adminRepository.getPublicTeams(),
  });
};

export const useAdminTeams = (search?: string) => {
  return useQuery({
    queryKey: ['admin', 'teams', search],
    queryFn: () => adminRepository.getAdminTeams(search),
  });
};

export const useCreateTeam = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: any) => adminRepository.createTeam(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin', 'teams'] });
      queryClient.invalidateQueries({ queryKey: ['teams', 'public'] });
    },
  });
};

export const useUpdateTeam = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: any }) => adminRepository.updateTeam(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin', 'teams'] });
      queryClient.invalidateQueries({ queryKey: ['teams', 'public'] });
    },
  });
};

export const useDeleteTeam = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => adminRepository.deleteTeam(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin', 'teams'] });
      queryClient.invalidateQueries({ queryKey: ['teams', 'public'] });
    },
  });
};
