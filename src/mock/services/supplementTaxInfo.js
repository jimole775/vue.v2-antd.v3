export default [
  {
    path: /\/supplementTaxInfo/,
    mock: {
      'bonusBeforeTax|1000-20000': 20000,
      'tax|100-300': 300,
      'curYearBonus|1000-5000': 5000,
      'lastYearBonus|1000-5000': 5000,
      'bossBudget|100000-500000': 500000,
      'bonusBudget|100000-500000': 500000,
      'serviceMonth|1-36': 36,
      'salary|7000-30000': 30000,
      'name': '@cname',
      'EIN|10000000-10000100': 10000100,
      'department|1': ['IT部', '销售部', '财政部', '法务部']
    }
  }
]

