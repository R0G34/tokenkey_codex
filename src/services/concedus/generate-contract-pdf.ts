import { download, upload } from '@/dal/admin/storage'
import { Tables } from '@/lib/supabase/types/database.types'
import { numberFormatter } from '@/utils/number-formatter'
import { format } from 'date-fns'
import { Locale } from 'next-intl'
import { PDFDocument } from 'pdf-lib'

/**
 * Generate subscription contract PDF from template for Concedus
 *
 * Template location: Supabase bucket 'user' at /template/contract/contract-template-{locale}.pdf
 * Generated contracts stored at: user/{user.id}/investments/{project.id}/{order.id}/contract-{locale}.pdf
 *
 * Template should have fillable form fields with these exact names:
 * - customer_first_name
 * - customer_last_name
 * - customer_address
 * - project_name
 * - investment_amount
 *
 * @returns Object with PDF buffer and storage path
 */
export async function generateContractPDF(
  locale: Locale,
  personalData: Tables<'personal_data'>,
  order: Tables<'order'>,
  project: Tables<'project'>,
  userId: string,
) {
  const templateData = await download(
    'user',
    `template/contract/contract-template-${locale}.pdf`,
  )
  const templateBytes = await templateData.arrayBuffer()
  const pdfDoc = await PDFDocument.load(templateBytes)
  const form = pdfDoc.getForm()

  // const fields = form.getFields()

  const fieldMappings = {
    customer_first_name: personalData.forename,
    customer_last_name: personalData.surname,
    // customer_address: `${personalData.street} ${personalData.street_number}, ${personalData.postcode} ${personalData.city}, ${personalData.country}`,
    project_name: project.code,
    investment_amount: numberFormatter.format(
      (order.token_quantity * order.token_price) / 100,
    ),
    token_quantity: numberFormatter.format(order.token_quantity),
    token_price: numberFormatter.format(order.token_price / 100),
    investment_date: format(new Date(order.created_at), 'PPP'),
    signature_name: `${personalData.forename} ${personalData.surname}`,
    signature_date: format(new Date(order.created_at), 'PPP'),
    contract_number: `${order.id}`,
  }

  let fieldsSet = 0
  for (const [fieldName, value] of Object.entries(fieldMappings)) {
    try {
      const field = form.getTextField(fieldName)
      field.setText(value)
      fieldsSet++
    } catch (error) {
      console.error(
        `❌ generateContractPDF: Error filling form fields with field "${fieldName}"`,
        error,
      )
      throw new Error(
        'Failed to fill PDF form fields. Check template field names.',
      )
    }
  }

  form.flatten()

  const pdfBytes = await pdfDoc.save()

  // Upload generated contract to user's folder in Supabase
  await upload(
    'user',
    `${userId}/orders/${order.id}/contract-${locale}.pdf`,
    pdfBytes,
    { contentType: 'application/pdf' },
  )

  return pdfBytes
}
