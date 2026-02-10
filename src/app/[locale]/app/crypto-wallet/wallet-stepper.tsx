'use client'

import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { useWallet } from './wallet-context'

export default function WalletStepper() {
  const {
    config: { step },
  } = useWallet()

  return (
    <Tabs value={step.toString()} className="mb-6 w-full">
      <TabsList className="grid w-full grid-cols-3">
        <TabsTrigger value="0" disabled>
          Introducción
        </TabsTrigger>
        <TabsTrigger value="1" disabled>
          Opciones
        </TabsTrigger>
        <TabsTrigger value="2" disabled>
          Conexión
        </TabsTrigger>
        {/* <TabsTrigger value="3" disabled>
          Completado
        </TabsTrigger> */}
      </TabsList>
    </Tabs>
  )
}
