import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { verifySession } from '@/dal/session'
import { selectUserWithOptinsAndOptinSummary } from '@/dal/user/queries/select-user-with-optins-and-optin-summary'
import { currencyFormatter } from '@/utils/currency-formatter'
import { Banknote, Coins } from 'lucide-react'
import { Metadata } from 'next'
import { Locale } from 'next-intl'
import ImportantInformation from './important-information'
import PortfolioTable from './portfolio-table'

type Props = {
  params: Promise<{ locale: Locale }>
}

export const metadata: Metadata = {
  title: 'App - Investments',
}

export default async function InvestmentsPage(props: Props) {
  const params = await props.params

  const { locale } = params

  await verifySession()

  const user = await selectUserWithOptinsAndOptinSummary()

  const investedCurrentMonth = user.optinSummary[0]?.invested_current_month ?? 0
  const investedPreviousMonth =
    user.optinSummary[0]?.invested_previous_month ?? 0
  const investedTotal = user.optinSummary[0]?.invested_total ?? 0
  const projectCount = user.optinSummary[0]?.projects ?? 0
  const tokenCount = user.optinSummary[0]?.tokens ?? 0

  return (
    // <div className="space-y-6">
    <div className="mx-auto w-full max-w-4xl space-y-6 pb-8">
      <h1 className="text-3xl font-bold">Portfolio</h1>
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle className="text-sm font-medium">
              Total Invertido
            </CardTitle>
            <Banknote className="size-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {currencyFormatter.format(investedTotal)}
            </div>
            <p className="text-xs text-muted-foreground">
              {/* +20.1% respecto al mes pasado */}
              {!investedPreviousMonth
                ? investedCurrentMonth
                  ? 100
                  : 0
                : Math.floor(
                    (100 * (investedCurrentMonth - investedPreviousMonth)) /
                      investedPreviousMonth,
                  )}
              {'% '}
              respecto al mes pasado
            </p>
          </CardContent>
        </Card>
        {/* <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Rentabilidad total
            </CardTitle>
            <Banknote className="size-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">€2,500</div>
            <p className="text-xs text-muted-foreground">
              +15% respecto al mes pasado
            </p>
          </CardContent>
        </Card> */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle className="text-sm font-medium">Total Tokens</CardTitle>
            <Coins className="size-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{tokenCount}</div>
            <p className="text-xs text-muted-foreground">
              En {projectCount} {projectCount === 1 ? 'proyecto' : 'proyectos'}
            </p>
          </CardContent>
        </Card>
        {/* <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Retorno de la inversión promedio
            </CardTitle>
            <Calendar className="size-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">10%</div>
            <p className="text-xs text-muted-foreground">Anualizado</p>
          </CardContent>
        </Card> */}
      </div>

      {/*  */}

      <Card>
        <CardHeader>
          <CardTitle>Tus inversiones</CardTitle>
        </CardHeader>
        <CardContent>
          <PortfolioTable optins={user.optins} />
        </CardContent>
      </Card>

      <ImportantInformation />
    </div>
  )
}
