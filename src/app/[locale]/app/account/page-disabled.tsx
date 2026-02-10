import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { Progress } from '@/components/ui/progress'
import { selectUserWithPersonalDataAndExperienceAndWalletAndBankAccount } from '@/dal/onboarding/queries/select-user-with-personaldata-and-experience-and-wallet-and-bank-account'
import { format } from 'date-fns'
import { AlertCircle, CheckCircle2 } from 'lucide-react'

export default async function ProfileStatusPage() {
  const user =
    await selectUserWithPersonalDataAndExperienceAndWalletAndBankAccount()

  const verificationItems = [
    {
      name: 'Información Personal',
      status: user.personal_data ? 'verified' : 'pending',
      date: user.personal_data?.created_at,
    },
    {
      name: 'Persona Expuesta Políticamente',
      status:
        typeof user.personal_data?.pep !== 'undefined' &&
        user.personal_data?.pep !== null
          ? 'verified'
          : 'pending',
      date: user.personal_data?.updated_at,
    },
    {
      name: 'Experiencia y conocimiento',
      status: user.experience ? 'verified' : 'pending',
      date: user.experience?.updated_at,
    },
    {
      name: 'Billetera',
      status: user.wallet ? 'verified' : 'pending',
      date: user.wallet?.updated_at,
    },
    {
      name: 'Verificación KYC',
      status: user.personal_data?.kyc ? 'verified' : 'pending',
      date: user.personal_data?.updated_at,
    },
    {
      name: 'Cuenta bancaria',
      status: user.bankAccount.length ? 'verified' : 'pending',
      date: user.bankAccount.find(({ is_default }) => is_default)?.updated_at,
    },
    { name: 'Información fiscal', status: 'pending', date: null },
  ]

  const completedItems = verificationItems.filter(
    (item) => item.status === 'verified',
  ).length
  const totalItems = verificationItems.length
  const progressPercentage = Math.round((completedItems / totalItems) * 100)

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Estado del perfil</h1>
        <p className="text-muted-foreground">
          Sigue tu estado de verificación y completa tu perfil.
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Estado de verificación</CardTitle>
          <CardDescription>
            Tu perfil está completo al {progressPercentage}%.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="mb-4">
            <Progress value={progressPercentage} className="h-2" />
          </div>

          <div className="space-y-4">
            {verificationItems.map((item, index) => (
              <div
                key={index}
                className="flex items-center justify-between border-b pb-3 last:border-0 last:pb-0"
              >
                <div className="flex items-center gap-3">
                  {item.status === 'verified' ? (
                    <CheckCircle2 className="size-5 text-green-500" />
                  ) : (
                    <AlertCircle className="size-5 text-amber-500" />
                  )}
                  <div>
                    <p className="font-medium">{item.name}</p>
                    {item.date && (
                      <p className="text-xs text-muted-foreground">
                        Verificado el {format(item.date, 'PPP')}
                      </p>
                    )}
                  </div>
                </div>
                <div>
                  {item.status === 'verified' ? (
                    <span className="inline-flex items-center rounded-full border border-green-200 bg-green-100 px-2.5 py-0.5 text-xs font-semibold text-green-800 dark:border-green-800 dark:bg-green-950 dark:text-green-300">
                      Verificado
                    </span>
                  ) : (
                    <span className="inline-flex items-center rounded-full border border-amber-200 bg-amber-100 px-2.5 py-0.5 text-xs font-semibold text-amber-800 dark:border-amber-800 dark:bg-amber-950 dark:text-amber-300">
                      Pendiente
                    </span>
                  )}
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
