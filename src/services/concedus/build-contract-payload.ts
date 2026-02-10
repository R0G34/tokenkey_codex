import { Contract, SendContractPayload } from '@/lib/condedus/types/contract'
import { Tables } from '@/lib/supabase/types/database.types'
import { format } from 'date-fns'

export function buildContractPayload(
  order: Tables<'order'>,
  project: Tables<'project'>,
): SendContractPayload {
  const modified = new Date().toISOString()
  const contract: Contract = {
    product: project.concedus_project_product_name!,
    share: (order.token_quantity * order.token_price) / 100,
    origin: 'P',
    signed: format(new Date(order.updated_at), 'yyyy-MM-dd'),
    customer: {
      person: {
        key: `PERS_${order.user_id}`,
        modified,
      },
      key: `CUSTO_${order.user_id}`,
      modified,
    },
    key: `CONTR_${order.id}`,
    modified,
    events: [
      {
        date: new Date(order.created_at).toISOString(),
        subject: `contract-${order.id}-${Date.now()}`,
        category: 'Contract',
        file: `contract-${order.id}-${Date.now()}.pdf`,
        key: `ATT_${order.id}`,
        modified,
      },
    ],
  }

  return { contracts: [contract] }
}
