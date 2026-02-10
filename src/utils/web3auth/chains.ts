import { CHAIN_NAMESPACES, CustomChainConfig } from '@web3auth/base'

export const chains: { [key: string]: CustomChainConfig } = {
  Polygon: {
    blockExplorerUrl: 'https://polygonscan.com',
    chainId: '0x89', // hex of 137, polygon mainnet
    chainNamespace: CHAIN_NAMESPACES.EIP155,
    displayName: 'Polygon Mainnet',
    logo: 'https://images.toruswallet.io/polygon.svg',
    // Avoid using public rpcTarget in production.
    // Use services like Infura, Quicknode etc
    rpcTarget: 'https://rpc.ankr.com/polygon',
    ticker: 'MATIC',
    tickerName: 'Matic',
  },
  PolygonAmoy: {
    blockExplorerUrl: 'https://amoy.polygonscan.com/',
    chainId: '0x13882', // hex of 80002, polygon testnet
    chainNamespace: CHAIN_NAMESPACES.EIP155,
    displayName: 'Polygon Amoy Testnet',
    logo: 'https://images.toruswallet.io/polygon.svg',
    // Avoid using public rpcTarget in production.
    // Use services like Infura, Quicknode etc
    // rpcTarget: 'https://rpc.ankr.com/polygon_amoy',
    rpcTarget: 'https://polygon-amoy.drpc.org',
    ticker: 'MATIC',
    tickerName: 'Matic',
  },
}
