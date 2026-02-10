'use client'

import { Button, buttonVariants } from '@/components/ui/button'
import { TableCell, TableRow } from '@/components/ui/table'
import { Link } from '@/i18n/navigation'
import { Tables } from '@/lib/supabase/types/database.types'
import { currencyFormatter } from '@/utils/currency-formatter'
import { dateFormatter } from '@/utils/date-formatter'
import { numberFormatter } from '@/utils/number-formatter'
import { toast } from 'sonner'

const statusColors = {
  pending_payment: 'bg-yellow-100 text-yellow-800 hover:bg-yellow-100',
  payment_received: 'bg-blue-100 text-blue-800 hover:bg-blue-100',
  tokens_sent: 'bg-green-100 text-green-800 hover:bg-green-100',
  completed: 'bg-purple-100 text-purple-800 hover:bg-purple-100',
}

const statusLabels = {
  pending_payment: 'Pago pendiente',
  payment_received: 'Pago recibido',
  tokens_sent: 'Tokens enviados',
  completed: 'Terminado',
}

interface Props {
  optin: Tables<'optin'> & {
    project: Tables<'project'> & {
      translations: Tables<'project_translation'>[]
    }
  }
}

export default function PortfolioTableRow({
  optin: { amount, created_at, id, project },
}: Props) {
  const projectTokenPrice = project.token_price / 100

  const handlePayment = (
    project: Tables<'project'> & {
      translations: Tables<'project_translation'>[]
    },
  ) => {
    alert(`Procesamiento de pago de inversión ${project.translations[0].name}`)
  }

  const real_profitability = 17.2

  return (
    <TableRow key={id}>
      <TableCell className="font-medium">
        {project.translations[0].name}
      </TableCell>
      <TableCell>
        {numberFormatter.format(amount)} @{' '}
        {currencyFormatter.format(projectTokenPrice ?? 0)}
      </TableCell>
      <TableCell>
        {currencyFormatter.format(amount * (projectTokenPrice ?? 0))}
        <p className="mt-1 text-xs text-gray-500">
          {dateFormatter.format(new Date(created_at))}
        </p>
      </TableCell>
      {/* <TableCell>
                  <TooltipProvider>
                  <Tooltip>
                  <TooltipTrigger asChild>
                  <div className="flex items-center">
                    {real_profitability !== null
                      ? `${real_profitability}%`
                      : `${project.profitability}% (est.)`}
                    <HelpCircle className="ml-1 size-4 text-gray-400" />
                  </div>
                  </TooltipTrigger>
                  <TooltipContent>
                        <p>
                          {investment.real_profitability !== null
                            ? 'Actual profitability'
                            : 'Estimated profitability'}
                        </p>
                      </TooltipContent>
                  </Tooltip>
                  </TooltipProvider>
                </TableCell> */}
      {/* <TableCell>
        <Badge className={statusColors[status as keyof typeof statusColors]}>
          {statusLabels[status as keyof typeof statusLabels]}
        </Badge>
        {status === 'payment_received' && (
          <p className="mt-1 text-xs text-gray-500">
            {dateFormatter.format(new Date(payments[0].created_at))}
          </p>
        )}
      </TableCell> */}
      <TableCell className="flex gap-2">
        {/* {status === 'pending_payment' && (
          <Button
            onClick={() => handlePayment(project)}
            className="bg-primary text-white hover:bg-[#1f7d72]"
          >
            Pagar Ahora
          </Button>
        )} */}
        {
          /* investment.saleOngoing && status !== 'pending_payment' */ true && (
            <Link
              className={buttonVariants()}
              href={{
                pathname: '/app/projects/[code]',
                params: { code: project.code.toLowerCase() },
              }}
            >
              Invertir más
            </Link>
          )
        }
        <Button onClick={() => toast('¡Próximamente!')} variant="secondary">
          Vender tokens
        </Button>
      </TableCell>
    </TableRow>
  )
}
