import { InvestmentSurvey } from '@/lib/condedus/types/investment-survey'
import { api } from './api'
import { generateSessionToken } from './generate-session-token'

type ScoreInvestorexperienceResponse = { score: number }

/**
 * https://docs.concedus.com/other/scoring#calculate-the-investor-experience-score
 * Please note, once the score is under the minimal required score of 7, the client can still bypass this if he confirms to have read the risk warning. He always can bypass questions by accepting the risks.
 *
 * ? https://docs.concedus.com/import-process/send-data-sets/investment-surveys#get-agp-score
 */
export async function scoreInvestorexperience(payload: {
  investorExperience: NonNullable<InvestmentSurvey['investorExperience']>
}) {
  const { accessToken } = await generateSessionToken()
  const response = await api({
    body: JSON.stringify(payload),
    headers: { Authorization: `Bearer ${accessToken}` },
    method: 'POST',
    path: '/compliance/scoring/investorexperience',
  })
  const data = await response.json()
  if (!response.ok) {
    console.log(
      '❌ concedus/scoreInvestorexperience',
      JSON.stringify(payload),
      response,
      data,
    )
    throw new Error(data.info, { cause: data.reason })
  }
  return data as ScoreInvestorexperienceResponse
}
