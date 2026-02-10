import { ExternalRetailWallet } from '@/lib/nyala/types/external-retail-wallet'
import { api } from './api'

const PATH = '/retail-wallets/external'

export async function getExternalRetailWallets() {
  const result = await api({
    method: 'GET',
    path: PATH,
  })
  return result.data as ExternalRetailWallet[]
  // id, email, wallet > customer id

  // 8afe5b46-..., @gmai, 0x3e44b... :
  // {
  //     "id": "f4f8b7a3-cf11-41b3-8834-48064eb5561f",
  //     "blockchain": 14,
  //     "publicAddress": "0x3e44b9Cf966BE765f45105597906986093c620e3",
  //     "name": "Name",
  //     "created": "2024-07-05T10:38:59.6234482"
  // },

  // ecd3507d-..., @tess, 0x9ca96... :
  // {
  //     "id": "58397052-6ba0-4d08-bbc6-695d38afbfb9",
  //     "blockchain": 14,
  //     "publicAddress": "0x9ca966D8888FB97078dDA9d0783f6Cd9113E277F",
  //     "name": "Account 1",
  //     "created": "2024-06-29T08:46:52.3388155"
  // }
}

export async function createExternalRetailWallet(
  customerId: string,
  wallet: string,
) {
  const result = await api({
    body: {
      AccountId: customerId,
      Blockchain: 14,
      PublicAddress: wallet,
      Name: 'Name',
    },
    method: 'POST',
    path: PATH,
  })
  // {
  //     "errorMessageCodes": null,
  //     "data": {
  //         "id": "237d51d2-0d8f-47f2-a491-c4a16ad7e916",
  //         "externalId": null
  //     }
  // }
  return result.data.id as ExternalRetailWallet['id']
}
