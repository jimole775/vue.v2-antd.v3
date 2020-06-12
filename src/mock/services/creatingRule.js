export default [
  {
    path: /\/baseRule\/baseRuleList/,
    mock: {
      'ruleName|1': ['2016年', '2017年', '2018年'],
      'planName|1': ['2016年年度', '2017年年度', '2018年年度'],
      'belongDate|1': ['2016年', '2017年', '2018年'],
      'status|1': ['待启动', '已启动', '未启动'],
      'unitNum|1-99': 100,
      'membersNum|1-99': 100,
      'createdBy': '@cname',
      'createdCareer': '@cword(5)',
      'type|1': ['年度']
    }
  }
]
