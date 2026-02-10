import { ConcedusComplianceStatus } from '@/services/concedus/schema'
import { SecupayTransactionStatus } from '@/services/secupay/schema'

export const ORDER_PAYMENT_STATUS = {
  SECUPAY_CREATED: 'secupay_created',
  SECUPAY_PROCESSING: 'secupay_processing',
  SECUPAY_FAILED: 'secupay_failed',
  SECUPAY_APPROVED: 'secupay_approved',
  SECUPAY_PENDING: 'secupay_pending',
  SECUPAY_RECEIVED: 'secupay_received',
  SECUPAY_COLLECTION: 'secupay_collection',
  SECUPAY_OK: 'secupay_ok',
  SECUPAY_SHIPPED: 'secupay_shipped',
  SECUPAY_COLLECTED: 'secupay_collected',
  SECUPAY_AUTHORIZATION_ERROR: 'secupay_authorization_error',
} as const

export type OrderPaymentStatus =
  (typeof ORDER_PAYMENT_STATUS)[keyof typeof ORDER_PAYMENT_STATUS]

export const secupayToInternalMap: Record<
  SecupayTransactionStatus,
  OrderPaymentStatus
> = {
  created: ORDER_PAYMENT_STATUS.SECUPAY_CREATED,
  processing: ORDER_PAYMENT_STATUS.SECUPAY_PROCESSING,
  failed: ORDER_PAYMENT_STATUS.SECUPAY_FAILED,
  approved: ORDER_PAYMENT_STATUS.SECUPAY_APPROVED,
  pending: ORDER_PAYMENT_STATUS.SECUPAY_PENDING,
  received: ORDER_PAYMENT_STATUS.SECUPAY_RECEIVED,
  collection: ORDER_PAYMENT_STATUS.SECUPAY_COLLECTION,
  ok: ORDER_PAYMENT_STATUS.SECUPAY_OK,
  shipped: ORDER_PAYMENT_STATUS.SECUPAY_SHIPPED,
  collected: ORDER_PAYMENT_STATUS.SECUPAY_COLLECTED,
}

export const ORDER_COMPLIANCE_STATUS = {
  CONCEDUS_100_RELEASE_UNCOMPROMISING: 'concedus_100_release_uncompromising',
  CONCEDUS_200_WAITING_FOR_ADDITIONAL_DOCUMENTS:
    'concedus_200_waiting_for_additional_documents',
  CONCEDUS_300_REJECTED_AML_SANCTIONS_PEP:
    'concedus_300_rejected_aml_sanctions_pep',
  CONCEDUS_301_REJECTED_NO_ADEQUACY_FINAL:
    'concedus_301_rejected_no_adequacy_final',
  CONCEDUS_302_REJECTED_PROCESS_DATA_ERROR_FRAUD:
    'concedus_302_rejected_process_data_error_fraud',
  CONCEDUS_303_REJECTED_OTHER: 'concedus_303_rejected_other',
  CONCEDUS_400_INQUIRY_ASSET_SITUATION: 'concedus_400_inquiry_asset_situation',
  CONCEDUS_401_INQUIRY_OTHER: 'concedus_401_inquiry_other',
  CONCEDUS_402_MISSING_DOCUMENTS: 'concedus_402_missing_documents',
  CONCEDUS_403_MISSING_ADEQUACY_INFORMATION:
    'concedus_403_missing_adequacy_information',
  CONCEDUS_500_PAYMENT_EXPIRED: 'concedus_500_payment_expired',
  CONCEDUS_501_PAYMENT_ERROR_OTHER: 'concedus_501_payment_error_other',
  CONCEDUS_502_PAYMENT_PARTIAL: 'concedus_502_payment_partial',
  CONCEDUS_503_PAYMENT_FULL: 'concedus_503_payment_full',
  CONCEDUS_600_PAYMENT_DEADLINE_EXPIRED_7_DAYS:
    'concedus_600_payment_deadline_expired_7_days',
  CONCEDUS_601_PAYMENT_DEADLINE_EXPIRED_14_DAYS:
    'concedus_601_payment_deadline_expired_14_days',
  CONCEDUS_602_PAYMENT_DEADLINE_EXPIRED_20_DAYS:
    'concedus_602_payment_deadline_expired_20_days',
  CONCEDUS_700_CANCELLATION_POSSIBLE: 'concedus_700_cancellation_possible',
  CONCEDUS_701_CANCELLATION_NOT_POSSIBLE_DEADLINE:
    'concedus_701_cancellation_not_possible_deadline',
  CONCEDUS_702_CANCELLATION_NOT_POSSIBLE_OTHER:
    'concedus_702_cancellation_not_possible_other',
  CONCEDUS_800_DATA_CHANGE_SUCCESS: 'concedus_800_data_change_success',
  CONCEDUS_801_DATA_CHANGE_FAILED_DATA_ERROR:
    'concedus_801_data_change_failed_data_error',
  CONCEDUS_802_DATA_CHANGE_FAILED_OTHER:
    'concedus_802_data_change_failed_other',
  CONCEDUS_COMPLIANCE_ERROR: 'concedus_compliance_error',
  CONCEDUS_PENDING_COMPLIANCE_REVIEW: 'concedus_pending_compliance_review',
} as const

export type OrderComplianceStatus =
  (typeof ORDER_COMPLIANCE_STATUS)[keyof typeof ORDER_COMPLIANCE_STATUS]

export const concedusToInternalMap: Record<
  ConcedusComplianceStatus,
  OrderComplianceStatus
> = {
  100: ORDER_COMPLIANCE_STATUS.CONCEDUS_100_RELEASE_UNCOMPROMISING,
  200: ORDER_COMPLIANCE_STATUS.CONCEDUS_200_WAITING_FOR_ADDITIONAL_DOCUMENTS,
  300: ORDER_COMPLIANCE_STATUS.CONCEDUS_300_REJECTED_AML_SANCTIONS_PEP,
  301: ORDER_COMPLIANCE_STATUS.CONCEDUS_301_REJECTED_NO_ADEQUACY_FINAL,
  302: ORDER_COMPLIANCE_STATUS.CONCEDUS_302_REJECTED_PROCESS_DATA_ERROR_FRAUD,
  303: ORDER_COMPLIANCE_STATUS.CONCEDUS_303_REJECTED_OTHER,
  400: ORDER_COMPLIANCE_STATUS.CONCEDUS_400_INQUIRY_ASSET_SITUATION,
  401: ORDER_COMPLIANCE_STATUS.CONCEDUS_401_INQUIRY_OTHER,
  402: ORDER_COMPLIANCE_STATUS.CONCEDUS_402_MISSING_DOCUMENTS,
  403: ORDER_COMPLIANCE_STATUS.CONCEDUS_403_MISSING_ADEQUACY_INFORMATION,
  500: ORDER_COMPLIANCE_STATUS.CONCEDUS_500_PAYMENT_EXPIRED,
  501: ORDER_COMPLIANCE_STATUS.CONCEDUS_501_PAYMENT_ERROR_OTHER,
  502: ORDER_COMPLIANCE_STATUS.CONCEDUS_502_PAYMENT_PARTIAL,
  503: ORDER_COMPLIANCE_STATUS.CONCEDUS_503_PAYMENT_FULL,
  600: ORDER_COMPLIANCE_STATUS.CONCEDUS_600_PAYMENT_DEADLINE_EXPIRED_7_DAYS,
  601: ORDER_COMPLIANCE_STATUS.CONCEDUS_601_PAYMENT_DEADLINE_EXPIRED_14_DAYS,
  602: ORDER_COMPLIANCE_STATUS.CONCEDUS_602_PAYMENT_DEADLINE_EXPIRED_20_DAYS,
  700: ORDER_COMPLIANCE_STATUS.CONCEDUS_700_CANCELLATION_POSSIBLE,
  701: ORDER_COMPLIANCE_STATUS.CONCEDUS_701_CANCELLATION_NOT_POSSIBLE_DEADLINE,
  702: ORDER_COMPLIANCE_STATUS.CONCEDUS_702_CANCELLATION_NOT_POSSIBLE_OTHER,
  800: ORDER_COMPLIANCE_STATUS.CONCEDUS_800_DATA_CHANGE_SUCCESS,
  801: ORDER_COMPLIANCE_STATUS.CONCEDUS_801_DATA_CHANGE_FAILED_DATA_ERROR,
  802: ORDER_COMPLIANCE_STATUS.CONCEDUS_802_DATA_CHANGE_FAILED_OTHER,
}

export const complianceStatusColorMap: Record<string, string> = {
  concedus_compliance_error: 'bg-red-100 text-red-800 hover:bg-red-100',
  concedus_pending_compliance_review:
    'bg-amber-100 text-amber-800 hover:bg-amber-100',
  concedus_100_release_uncompromising:
    'bg-green-100 text-green-800 hover:bg-green-100',
  // : 'bg-yellow-100 text-yellow-800 hover:bg-yellow-100',
  // : 'bg-blue-100 text-blue-800 hover:bg-blue-100',
  // : 'bg-indigo-100 text-indigo-800 hover:bg-indigo-100',
  // : 'bg-orange-100 text-orange-800 hover:bg-orange-100',
  // : 'bg-gray-100 text-gray-800 hover:bg-gray-100',
}

export const paymentStatusColorMap: Record<string, string> = {
  secupay_failed: 'bg-red-100 text-red-800 hover:bg-red-100',
  secupay_approved: 'bg-indigo-100 text-indigo-800 hover:bg-indigo-100',
  secupay_pending: 'bg-amber-100 text-amber-800 hover:bg-amber-100',
  secupay_ok: 'bg-green-100 text-green-800 hover:bg-green-100',
  secupay_authorization_error: 'bg-red-100 text-red-800 hover:bg-red-100',
  // : 'bg-orange-100 text-orange-800 hover:bg-orange-100',
  // : 'bg-gray-100 text-gray-800 hover:bg-gray-100',
}
