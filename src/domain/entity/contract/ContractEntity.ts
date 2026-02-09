export interface ContractEntity {
  id: string;
  name: string;
  address: string;
  chainId: string;
  type: string;
  version?: string;
  abi?: any;
  isActive?: boolean;
  createdAt: string;
  updatedAt: string;
}
