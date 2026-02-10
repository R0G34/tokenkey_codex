'use client'

import { useWeb3Auth } from '@/hooks/use-web3auth'
import { Web3Auth } from '@web3auth/modal'
import { useEffect, useState } from 'react'
import Web3 from 'web3'

export default function Web3AuthBalance() {
  const [balance, setBalance] = useState<string | undefined>()
  const { web3Auth } = useWeb3Auth()

  useEffect(() => {
    async function fetchBalance(web3Auth: Web3Auth) {
      const web3 = new Web3(web3Auth.provider as any)

      const address = (await web3.eth.getAccounts())[0]

      // Balance is in wei
      const _balance = web3.utils.fromWei(
        await web3.eth.getBalance(address),
        'ether',
      )

      setBalance(_balance)
    }

    if (web3Auth) fetchBalance(web3Auth)
  }, [web3Auth])

  return balance
}
