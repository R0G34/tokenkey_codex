import { Card, CardContent } from '@/components/ui/card'
import { Tables } from '@/lib/supabase/types/database.types'
import { currencyFormatter } from '@/utils/currency-formatter'
import { numberFormatter } from '@/utils/number-formatter'
import { formatDate } from 'date-fns'
import { useTranslations } from 'next-intl'

interface Props {
  optins: Tables<'optin'>[]
  project: Tables<'project'>
}

export default function RecentSales({ optins, project }: Props) {
  const t = useTranslations('project.tabs.recent_activity')
  return (
    <Card>
      <CardContent>
        <div>
          <h3 className="mb-4 font-semibold">{t('inner_title')}</h3>
          <div className="space-y-4">
            {optins
              .sort((a, b) => (b.created_at > a.created_at ? 1 : -1))
              .map((optin) => (
                <div
                  key={optin.id}
                  className="flex items-center justify-between"
                >
                  <div>
                    <p className="font-semibold">
                      {numberFormatter.format(optin.amount)} token
                      {optin.amount === 1 ? '' : 's'}
                    </p>
                    <p className="text-sm text-muted-foreground">
                      {formatDate(new Date(optin.created_at), 'PPP')}
                    </p>
                  </div>
                  <p className="font-medium">
                    {currencyFormatter.format(
                      optin.amount * (project.token_price / 100),
                    )}
                  </p>
                </div>
              ))}
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
