export interface Protocol {
    key: string;
    name: string;
    logoURI: string;
  }
  
  export interface TransactionStep {
    chainId: number;
    blockNumber: number;
    from: string;
    to: string;
    gasLimit: string;
    gasPrice: string;
    data: string;
    value: string;
    protocol: Protocol;
  }
  
  export interface Token {
    address: string;
    chainId: number;
    symbol: string;
    decimals: number;
    name: string;
    coinKey: string;
    logoURI: string;
    priceUSD: string;
  }
  
  export interface TransactionData {
    description: string;
    gasCostUSD: string;
    fromChainId: number;
    fromAmountUSD: string;
    fromAmount: string;
    fromToken: Token;
    fromAddress: string;
    toChainId: number;
    toAmountUSD: string;
    toAmount: string;
    toAmountMin: string;
    toToken: Token;
    toAddress: string;
    steps: TransactionStep[];
  }
  
  export interface Transaction {
    action: string;
    data: TransactionData[];
  }
  
  export enum TransactionCalldataRequestStatus {
    ERROR = "error",
    SUCCESS = "success",
    LOADING = "loading",
  }
  
  export interface TransactionCalldataResponse {
    result?: Transaction;
    status: TransactionCalldataRequestStatus;
  }