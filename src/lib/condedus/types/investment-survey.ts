export type InvestmentSurvey = {
  investmentExperience?: [
    { type: 0; knowledge: boolean }, // Closed-end investment funds
    { type: 3; knowledge: boolean }, // Bonds
    // { type: 4; knowledge: boolean }, // Stocks
    { type: 5; knowledge: boolean }, // Certificates
    // { type: 8; knowledge: boolean }, // Warrants
    // { type: 10; knowledge: boolean }, // Hedge funds
    { type: 17; knowledge: boolean }, // Tokenized securities
  ]
  investorExperience?: [
    { name: 'AE1'; value: string },
    { name: 'AE2'; value: string },
    { name: 'AE3'; value: string },
    { name: 'AE4'; value: string },
    { name: 'AE5'; value: string },
    { name: 'AE6'; value: string },
    { name: 'AE7'; value: string },
    { name: 'AE8'; value: string },
  ]
  customFields?: { name: 'ForceMissedKnowledge'; value: string }[]
  key: `INVST_${string}`
  modified: string
}
