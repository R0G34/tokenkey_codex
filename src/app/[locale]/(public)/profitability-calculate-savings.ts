export const calculateSavings = (
  _initialCapital: number,
  _monthlyContribution: number,
  _years: number,
) => {
  const interestRate = 0.15 // 15% annual interest rate
  let total = _initialCapital
  let periodicDeposit = 0
  let totalInterest = 0
  const newChartData = []

  for (let year = 1; year <= _years; year++) {
    const yearlyContribution = _monthlyContribution * 12
    periodicDeposit += yearlyContribution
    total += yearlyContribution
    const yearlyInterest = total * interestRate
    totalInterest += yearlyInterest
    total += yearlyInterest

    newChartData.push({
      year,
      initialCapital: _initialCapital,
      periodicDeposit,
      totalInterest,
    })
  }

  return { totalSavings: total, chartData: newChartData }
}
