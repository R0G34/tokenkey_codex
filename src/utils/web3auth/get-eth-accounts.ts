import { IWeb3AuthCore } from '@web3auth/base'

/**
 *
 * @param web3Auth
 * @returns
 */
export async function getEthAccounts(web3Auth: IWeb3AuthCore) {
  return web3Auth.provider?.request({
    method: 'eth_accounts',
  }) as Promise<string[]>
}
