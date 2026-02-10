'use client'

import React, { createContext, useContext, useState } from 'react'

type WalletContextType = {
  config: { step: number; type?: 'web3auth' | 'external' }
  setConfig: ({
    step,
    type,
  }: {
    step: number
    type?: 'web3auth' | 'external'
  }) => void
  isProcessing: boolean
  setIsProcessing: (isProcessing: boolean) => void
}

const WalletContext = createContext<WalletContextType | undefined>(undefined)

export const useWallet = () => {
  const context = useContext(WalletContext)
  if (context === undefined) {
    throw new Error('useWallet must be used within a WalletProvider')
  }
  return context
}

export const WalletProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [config, setConfig] = useState({ step: 0 })
  const [isProcessing, setIsProcessing] = useState(false)

  // useEffect(() => {
  //   // Check if wallet is already linked
  //   const checkWallet = async () => {
  //     try {
  //       const response = await fetch('/api/wallet')
  //       if (response.ok) {
  //         const data = await response.json()
  //         setWalletInfo(data)
  //         setStep(3)
  //       }
  //     } catch (error) {
  //       const message = getErrorMessage(error)
  //       console.error('Error fetching wallet info:', message)
  //     }
  //   }
  //   checkWallet()
  // }, [])

  // const connectExistingWallet = async () => {
  //   setIsProcessing(true)
  //   try {
  //     // Simulating wallet connection
  //     await new Promise((resolve) => setTimeout(resolve, 1000))
  //     const newWalletInfo = {
  //       address: '0x1234...5678',
  //       type: 'MetaMask',
  //       date: new Date().toLocaleDateString(),
  //     }
  //     setWalletInfo(newWalletInfo)
  //     setStep(3)
  //     // Simulating API call to save wallet info
  //     await fetch('/api/wallet', {
  //       method: 'POST',
  //       headers: { 'Content-Type': 'application/json' },
  //       body: JSON.stringify(newWalletInfo),
  //     })
  //   } catch (error) {
  //     const message = getErrorMessage(error)
  //     console.error('Error connecting wallet:', message)
  //     toast.error('Error de conexión', {
  //       description:
  //         'No se pudo conectar la wallet. Por favor, inténtalo de nuevo.',
  //     })
  //   } finally {
  //     setIsProcessing(false)
  //   }
  // }

  // const generateNewWallet = async () => {
  //   setIsProcessing(true)
  //   try {
  //     // Simulating Web3Auth login
  //     await new Promise((resolve) => setTimeout(resolve, 1000))
  //     const newWalletInfo = {
  //       address: '0x8765...4321',
  //       type: 'Web3Auth',
  //       date: new Date().toLocaleDateString(),
  //       socialMethod: 'Google',
  //       email: 'user@example.com',
  //     }
  //     setWalletInfo(newWalletInfo)
  //     setStep(2) // Move to connection step
  //     // Simulating API call to save wallet info
  //     await fetch('/api/wallet', {
  //       method: 'POST',
  //       headers: { 'Content-Type': 'application/json' },
  //       body: JSON.stringify(newWalletInfo),
  //     })
  //   } catch (error) {
  //     const message = getErrorMessage(error)
  //     console.error('Error generating wallet:', message)
  //     toast.error('Error de generación', {
  //       description:
  //         'No se pudo generar la nueva wallet. Por favor, inténtalo de nuevo.',
  //     })
  //   } finally {
  //     setIsProcessing(false)
  //   }
  // }

  return (
    <WalletContext.Provider
      value={{
        config,
        setConfig,
        isProcessing,
        setIsProcessing,
      }}
    >
      {children}
    </WalletContext.Provider>
  )
}
