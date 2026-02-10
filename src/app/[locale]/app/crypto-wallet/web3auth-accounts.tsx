'use client'

import { useWeb3Auth } from '@/hooks/use-web3auth'
import { Web3Auth } from '@web3auth/modal'
import { useEffect, useState } from 'react'
import Web3 from 'web3'

export default function Web3AuthAccounts() {
  const [accounts, setAccounts] = useState<string[] | undefined>()
  const { web3Auth } = useWeb3Auth()

  useEffect(() => {
    async function getAccounts(web3Auth: Web3Auth) {
      const web3 = new Web3(web3Auth.provider as any)

      const _accounts = await web3.eth.getAccounts()

      setAccounts(_accounts)
    }

    if (web3Auth) getAccounts(web3Auth)
  }, [web3Auth])

  return accounts
}
