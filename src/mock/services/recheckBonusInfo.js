export default [
  {
    path: /\/recheckBonusInfo/,
    mock: {
      'lastYearBouns|100000-500000': 500000,
      'distributedBonus|100000-500000': 500000,
      'budget|100000-500000': 500000,
      'memberCount|500-2000': 2000,
      'bonusUnit|1': ['IT部', '销售部', '财政部', '法务部']
    }
  }
]

