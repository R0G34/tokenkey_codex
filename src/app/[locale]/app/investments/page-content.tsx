'use client'

import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import {
  Empty,
  EmptyContent,
  EmptyDescription,
  EmptyTitle,
} from '@/components/ui/empty'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { Link } from '@/i18n/navigation'
import { Tables } from '@/lib/supabase/types/database.types'
import { currencyFormatter } from '@/utils/currency-formatter'
import { dateTimeFormatter } from '@/utils/date-formatter'
import { Eye } from 'lucide-react'
import { useTranslations } from 'next-intl'
import { complianceStatusColorMap, paymentStatusColorMap } from './constants'

type Props = {
  orders: (Tables<'order'> & { project: Tables<'project'> })[]
}

export function InvestmentsPageContent({ orders }: Props) {
  const t = useTranslations('investment.list')

  return orders.length === 0 ? (
    <Empty>
      <EmptyTitle>{t('empty.title')}</EmptyTitle>
      <EmptyDescription>{t('empty.description')}</EmptyDescription>
      <EmptyContent>
        <Link href="/app/projects">
          <Button variant="outline">{t('empty.cta')}</Button>
        </Link>
      </EmptyContent>
    </Empty>
  ) : (
    <Card>
      <CardHeader>
        <CardTitle>{t('table.title')}</CardTitle>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>{t('table.headers.project')}</TableHead>
              <TableHead>{t('table.headers.amount')}</TableHead>
              {/* <TableHead>{t('table.headers.paymentReference')}</TableHead> */}
              <TableHead>{t('table.headers.compliancestatus')}</TableHead>
              <TableHead>{t('table.headers.paymentstatus')}</TableHead>
              <TableHead>{t('table.headers.date')}</TableHead>
              <TableHead className="text-right">
                {t('table.headers.actions')}
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {orders.map((order) => (
              <TableRow key={order.id}>
                <TableCell className="font-medium">
                  {order.project.code}
                </TableCell>
                <TableCell>
                  {currencyFormatter.format(
                    (order.token_quantity * order.token_price) / 100,
                  )}
                </TableCell>
                {/* <TableCell className="font-mono text-sm">
                  {order.payment_reference}
                </TableCell> */}
                <TableCell>
                  <Badge
                    className={
                      (order.compliance_status &&
                        complianceStatusColorMap[order.compliance_status]) ||
                      'bg-gray-100 text-gray-800'
                    }
                    variant="secondary"
                  >
                    {/* @ts-expect-error */}
                    {t(`compliance_status.${order.compliance_status}`)}
                  </Badge>
                </TableCell>
                <TableCell>
                  <Badge
                    className={
                      (order.payment_status &&
                        paymentStatusColorMap[order.payment_status]) ||
                      'bg-gray-100 text-gray-800'
                    }
                    variant="secondary"
                  >
                    {/* @ts-expect-error */}
                    {t(`payment_status.${order.payment_status}`)}
                  </Badge>
                </TableCell>
                <TableCell>
                  {dateTimeFormatter.format(new Date(order.created_at))}
                </TableCell>
                <TableCell className="text-right">
                  <Link
                    href={{
                      pathname: '/app/investments/[id]',
                      params: { id: order.id },
                    }}
                  >
                    <Button size="sm" variant="ghost">
                      <Eye className="mr-2 size-4" />
                      {t('table.view')}
                    </Button>
                  </Link>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  )
}
