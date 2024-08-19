export interface IAccount {
  _owner: string;
  _contract: string;
  description: string;
  price: bigint;
  purchasable: boolean;
}

export interface ContractData<T> {
  data: T;
  isLoading: boolean;
}
