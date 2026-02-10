'use server'

import { getErrorMessage } from '@/utils/error/get-error-message'
import {
  ContactsApi,
  ContactsApiApiKeys,
  CreateContact,
  ErrorModel,
  HttpError,
} from '@getbrevo/brevo'

const NEWSLETTER_LIST_ID = 3

const apiInstance = new ContactsApi()
apiInstance.setApiKey(ContactsApiApiKeys.apiKey, process.env.BREVO_API_KEY!)

export async function subscribeToNewsletter(email: string, terms: boolean) {
  try {
    const createContact = new CreateContact()
    createContact.email = email
    createContact.listIds = [NEWSLETTER_LIST_ID]
    // createContact.attributes = { FIRSTNAME: name, COUNTRY: country }
    // const contact = await apiInstance.getContactInfo(email)
    await apiInstance.createContact(createContact)
    return { success: true }
  } catch (error) {
    // Ignore error when email already subscribed.
    if (
      error instanceof HttpError &&
      ((error as HttpError).body as ErrorModel).code ===
        ErrorModel.CodeEnum.DuplicateParameter
    )
      return

    const message = getErrorMessage(error)
    console.error('❌ Error subscribing to newsletter:', message)
    throw new Error('Failed to subscribe to newsletter')
  }
}
