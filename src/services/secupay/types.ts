// export interface CreateSmartTransactionRequest {
//   is_demo?: boolean
//   intent: 'sale' | 'authorization'
//   transactionRef?: string
//   merchantRef?: string
//   contract: {
//     id: string
//   }
//   basket_info: {
//     sum: number // Amount in cents
//     currency: string // e.g., "EUR"
//   }
//   customer?: {
//     contact: {
//       forename: string
//       surname: string
//       email: string
//       phone?: string
//       mobile?: string
//     }
//   }
//   application_context?: {
//     return_urls: {
//       url_push: string
//       url_success?: string
//       url_failure?: string
//       url_abort?: string
//     }
//   }
//   payment_context?: {
//     auto_capture: boolean
//   }
// }

// export interface PrepareDebitRequest {
//   container:
//     | {
//         id: string // Use existing container
//       }
//     | {
//         merchant_id: string
//         type: 'bank_account'
//         private: {
//           owner: string
//           iban: string
//         }
//       }
// }
