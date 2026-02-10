'use client'

import {
  Table,
  TableBody,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { Tables } from '@/lib/supabase/types/database.types'
import PortfolioTableRow from './portfolio-table-row'

const mockOptins = [
  {
    id: 1,
    amount: 100,
    status: 'pending_payment',
    created_at: '2023-06-01',
    saleOngoing: true,
    nyala_optin_id: '',
    project_id: 0,
    updated_at: '',
    user_id: '',
    payments: [
      {
        id: 1,
        created_at: '2024-06-04 22:23:12.682192+00',
        updated_at: '2024-06-04 22:23:12.682192+00',
        amount: 0,
        optin_id: 0,
        type: '',
        user_id: '',
      },
    ],
    project: {
      token_price: 1000,
      profitability: 12,
      real_profitability: null,
      translations: [{ name: 'Apartamentos Sunset' }],
    },
  },
  {
    id: 2,
    amount: 500,
    status: 'tokens_sent',
    created_at: '2023-05-15',
    saleOngoing: true,
    nyala_optin_id: '',
    project_id: 0,
    updated_at: '',
    user_id: '',
    payments: [
      {
        id: 1,
        created_at: '2024-05-17 11:04:54.682192+00',
        updated_at: '2024-06-04 22:23:12.682192+00',
        amount: 0,
        optin_id: 0,
        type: '',
        user_id: '',
      },
    ],
    project: {
      token_price: 500,
      profitability: 8,
      real_profitability: null,
      translations: [{ name: 'Complejo de oficinas en el centro' }],
    },
  },
  {
    id: 3,
    amount: 200,
    status: 'completed',
    created_at: '2023-04-30',
    saleOngoing: false,
    nyala_optin_id: '',
    project_id: 0,
    updated_at: '',
    user_id: '',
    payments: [
      {
        id: 1,
        created_at: '2024-05-02 10:26:11.682192+00',
        updated_at: '2024-06-04 22:23:12.682192+00',
        amount: 0,
        optin_id: 0,
        type: '',
        user_id: '',
      },
    ],
    project: {
      token_price: 2000,
      profitability: 15,
      real_profitability: 17.5,
      translations: [{ name: 'Villas junto al mar' }],
    },
  },
]

interface Props {
  optins: (Tables<'optin'> & {
    project: Tables<'project'> & {
      translations: Tables<'project_translation'>[]
    }
  })[]
}

export default function PortfolioTable({ optins }: Props) {
  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Proyecto</TableHead>
          <TableHead>Tokens</TableHead>
          <TableHead>Total</TableHead>
          {/* <TableHead>Rentabilidad</TableHead> */}
          {/* <TableHead>Estado</TableHead> */}
          <TableHead>Acciones</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {optins.map((optin) => (
          <PortfolioTableRow key={optin.id} optin={optin} />
        ))}
        {/* {mockOptins.map((optin) => (
          // @ts-expect-error
          <PortfolioTableRow key={optin.id} optin={optin} />
        ))} */}
      </TableBody>
    </Table>
  )
}
