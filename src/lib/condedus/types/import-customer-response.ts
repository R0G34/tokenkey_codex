export type ImportCustomerResponse = {
  identLinks: {
    kyc: string
    url: string
    key: string
    actionId: string
    status: string
    transactionId: string
  }[]
}
