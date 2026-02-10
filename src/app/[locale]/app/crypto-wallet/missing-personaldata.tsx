import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Link } from '@/i18n/navigation'
import { AlertCircle, UserCircle2 } from 'lucide-react'

export default async function MissingPersonalData() {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center space-x-2">
          <UserCircle2 className="size-6 text-[#e76e50]" />
          <span>Completa tu perfil</span>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <p className="mb-4 text-gray-600">
          Antes de conectar una wallet, debes completar el proceso de
          verificación de identidad. Esto nos ayuda a garantizar la seguridad de
          tu cuenta y cumplir con los requisitos regulatorios.
        </p>
        <div className="mb-6 rounded-md bg-yellow-50 p-4">
          <div className="flex items-start space-x-2">
            <AlertCircle className="mt-1 text-yellow-500" />
            <div>
              <p className="font-semibold text-yellow-700">Acción requerida</p>
              <p className="text-yellow-600">
                Completa tu información personal antes de continuar con la
                conexión de la wallet.
              </p>
            </div>
          </div>
        </div>
        <Link href="/app/personal-data">
          <Button className="w-full bg-primary text-white hover:bg-[#1f7d72]">
            Completar Información Personal
          </Button>
        </Link>
      </CardContent>
    </Card>
  )
}
