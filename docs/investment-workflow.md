# Investment Order & Compliance Workflow

## Flow Diagram

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                          INVESTMENT ORDER FLOW                               │
└─────────────────────────────────────────────────────────────────────────────┘

1. USER CREATES ORDER (AUTOMATIC CONTRACT SIGNING)
   ┌─────────────────────────────────────────────────┐
   │ User clicks "Invest now" button                 │
   │ Page: /app/projects/[code]/invest               │
   └──────┬──────────────────────────────────────────┘
          │
          ▼
   ┌─────────────────────────────────────────────────┐
   │ createOrder() action:                           │
   │ 1. Validates:                                   │
   │    - KYC completed                              │
   │    - Max 1 order per project                    │
   │ 2. Creates order with status:                   │
   │    pending_contract_signature                   │
   │ 3. Generates contract PDFs (en, de, es)         │
   │ 4. Sends English PDF to Concedus API            │
   │ 5. Updates status to:                           │
   │    pending_compliance_review                    │
   └──────┬──────────────────────────────────────────┘
          │
          ▼
   ↪️  Redirect to /app/investments/[id]
   ⏳ Waiting for Concedus review


2. COMPLIANCE REVIEW (CONCEDUS)
   ┌───────────────────────────┐
   │ Concedus processes        │
   │ compliance checks         │
   └──────┬────────────────────┘
          │
          ▼
   ┌─────────────────────────────────────────┐
   │ Webhook: POST /api/webhooks/concedus   │
   │                                         │
   │ Status codes:                           │
   │ • 100 → Approved                        │
   │ • 200, 400-403 → Needs more docs        │
   │ • 300-303 → Rejected                    │
   └──────┬──────────────────────────────────┘
          │
          ▼
   ┌─────────────────────────────────────────┐
   │ processComplianceRecords()              │
   │ • Store record in DB                    │
   │ • Update order status                   │
   └──────┬──────────────────────────────────┘
          │
          ├─────────────┬──────────────┬──────────────┐
          ▼             ▼              ▼              ▼
    ┌─────────┐  ┌──────────┐  ┌──────────┐  ┌───────────┐
    │ Status  │  │ Status   │  │ Status   │  │ Status    │
    │ 100     │  │ 200,     │  │ 300-303  │  │ Other     │
    │         │  │ 400-403  │  │          │  │           │
    └────┬────┘  └────┬─────┘  └────┬─────┘  └────┬──────┘
         │            │             │             │
         ▼            ▼             ▼             ▼
    pending_     pending_      rejected     pending_
    payment      compliance_                compliance_
                 review                     review


3. PAYMENT (Status: pending_payment)
   ┌──────────────────────────┐
   │ User sees payment info:  │
   │ • Bank transfer details  │
   │ • Payment reference      │
   │ • Amount                 │
   └──────┬───────────────────┘
          │
          ▼
   💰 User makes bank transfer
   🔄 Payment reconciliation (future implementation)
```

---

## Status Flow

```
pending_contract_signature
         ↓
    (automatic: contract generated & sent to Concedus)
         ↓
pending_compliance_review
         ↓
    (Concedus webhook)
         ↓
    ┌────┴────┐
    ↓         ↓
pending_   rejected
payment
```

**Note:** The transition from `pending_contract_signature` to `pending_compliance_review` happens automatically within the `createOrder()` action. The user never sees the `pending_contract_signature` status in the UI.

---

## Webhook Integration

```
┌──────────────┐
│  CONCEDUS    │
└──────┬───────┘
       │
       │ POST /api/webhooks/concedus
       │ x-concedus-signature: SECRET
       │
       ▼
┌──────────────────────────────────────────┐
│  Webhook Handler                         │
│  1. Verify signature                     │
│  2. Filter complianceRecord events       │
│  3. Process records (deduplication)      │
│  4. Update order status                  │
└──────────────────────────────────────────┘
```

---

## Cron Fallback (Optional)

```
┌────────────────────────────────────────────────────┐
│  Vercel Cron (hourly)                              │
│  GET /api/cron/poll-compliance-status              │
│  Authorization: Bearer CRON_SECRET                 │
└────────┬───────────────────────────────────────────┘
         │
         ▼
┌────────────────────────────────────────────────────┐
│  1. Fetch orders with status:                      │
│     pending_compliance_review                      │
│  2. For each order:                                │
│     GET /v2/compliance/status/contracts/{key}      │
│  3. Process same as webhook                        │
└────────────────────────────────────────────────────┘

⚠️  Status: Code ready, NOT YET ENABLED
📝  To enable: Add cron config to vercel.json
```

---

## Key Business Rules

| Rule                        | Description                                            |
| --------------------------- | ------------------------------------------------------ |
| **1 order per project**     | Users can only create 1 order per project (any status) |
| **Compliance status codes** | 100=Approved, 200/400-403=Waiting, 300-303=Rejected    |
| **No retry on rejection**   | User must contact support for rejected orders          |

---

## Key Files

| Type         | File                                                                         | Purpose                                                  |
| ------------ | ---------------------------------------------------------------------------- | -------------------------------------------------------- |
| **Webhook**  | `src/app/api/webhooks/concedus/route.ts`                                     | Receives compliance updates from Concedus                |
| **Cron**     | `src/app/api/cron/concedus/poll-compliance-status/route.ts`                  | Fallback polling                                         |
| **Service**  | `src/services/concedus/process-compliance-records.ts`                        | Processes compliance data from webhook                   |
| **Service**  | `src/services/concedus/contract.ts`                                          | `importContract()` - Sends contract to Concedus          |
| **Service**  | `src/services/concedus/build-contract-payload.ts`                            | Builds contract payload for Concedus API                 |
| **Service**  | `src/services/concedus/generate-contract-pdf.ts`                             | Generates contract PDF from template                     |
| **Template** | `user/template/contract/contract-template-{locale}.pdf` (Supabase Storage)   | PDF template with form fields                            |
| **Action**   | `src/app/[locale]/app/projects/[code]/invest/step-2-confirmation/actions.ts` | `createOrder()` - Creates order & auto-sends to Concedus |
| **Action**   | `src/app/[locale]/app/investments/[id]/actions.ts`                           | `getContractUrl()` - View signed contract                |
| **DAL**      | `src/dal/orders.ts`                                                          | Order CRUD operations                                    |

---

## Environment Variables

```bash
# Required
CONCEDUS_API_BASE_URL=https://api.concedus.com
CONCEDUS_API_TOKEN=your_token
CONCEDUS_WEBHOOK_SECRET=your_webhook_secret

# Optional (for cron)
CRON_SECRET=your_cron_secret
```

---

## Contract PDF Requirements ✅ ANSWERED

### Concedus Requirements

**From Concedus team:**

> The customer must be able to download this form, which includes their personal data and information about the product. From a technical perspective, it's sufficient for the subscription form to be generated and transmitted as a PDF file.
>
> What's important is that the customer data included in the form matches the data stored in the customer profile. If the data has been corrected by the KYC provider, those changes should be synced back to the profile.
>
> We don't require a QES or digital signature for the subscription form — the customer's name and date at the end are sufficient. Some also include the IP address alongside the "signature" (name + date) as an additional reference.

### Implementation Approach

```
┌────────────────────────────────────────────────────────────┐
│  PDF Generation Flow (Server-Side, Automatic)              │
└────────────────────────────────────────────────────────────┘

1. USER CLICKS "INVEST NOW"
   ┌─────────────────────────────────────┐
   │ Page: /app/projects/[code]/invest   │
   │ • User confirms investment amount   │
   │ • Clicks "Invest now" button        │
   └──────┬──────────────────────────────┘
          │
          ▼
2. SERVER ACTION: createOrder()
   ┌─────────────────────────────────────┐
   │ 1. Fetch data from database:        │
   │    • Customer info (personal_data)  │
   │    • Project info                   │
   │    • Investment amount              │
   │    • Current date/time              │
   │                                     │
   │ 2. Create order (status: pending_   │
   │    contract_signature)              │
   │                                     │
   │ 3. Generate PDFs in all locales:    │
   │    • Replace form field values      │
   │    • Customer name, address         │
   │    • Project name, amount, terms    │
   │    • Store in Supabase Storage      │
   │                                     │
   │ 4. Send English PDF to Concedus API │
   │                                     │
   │ 5. Update status: pending_          │
   │    compliance_review                │
   │                                     │
   │ 6. Redirect to /app/investments/[id]│
   └─────────────────────────────────────┘
```
