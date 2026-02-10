export type BankAccount = {
  accountHolder: string
  bic: string
  iban: string
  bank: string
  country: string
  currency: string // 'EUR'
  key: `BA_${string}`
  modified: string
  sharedAccount?: boolean
}
