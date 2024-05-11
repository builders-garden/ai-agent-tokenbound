import { useAccount, WalletClient } from 'wagmi'
import { TokenboundClient } from '@tokenbound/sdk'
 
const { address } = useAccount()
const walletClient: WalletClient = createWalletClient({
  chainId: goerli,
  account: address,
  transport: http(),
})
 
const tokenboundClient = new TokenboundClient({ walletClient, chainId: 5 })