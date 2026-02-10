import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'App - Wallet Validate',
}

export default async function OnboardingWalletValidateLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return children
}
