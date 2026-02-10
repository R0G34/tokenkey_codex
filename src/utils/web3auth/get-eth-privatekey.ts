import { IWeb3AuthCore } from '@web3auth/base'

/**
 * @param web3Auth
 * @returns
 */
export async function getEthPrivateKey(web3Auth: IWeb3AuthCore) {
  return web3Auth.provider?.request({
    method: 'eth_private_key', // "private_key" for non-evm chains
  })
}
