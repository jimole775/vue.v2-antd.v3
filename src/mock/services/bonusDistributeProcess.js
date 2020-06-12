export default [
  {
    path: /\/bonusDistributeProcess/,
    mock: {
      'index|+1': 1,
      'bonusUnit|1': ['IT部', '销售部', '财政部', '法务部'],
      'level|10-18': 18,
      'distributer': '@cname',
      'memberCount|100-500': 500,
      'memberName': '@cname',
      'status|1': ['未开始', '已处理', '未处理'],
      'curHandler|1': '@cname',
      'opinions': {
        'totalStat': 0,
        'title': '召唤师的整理意见',
        'list|1-4': [
          {
            'date': '2019-10-01 19:30',
            'content': '@cparagraph(1, 2)',
            'stat|1': [0, 1, 2]
          }
        ]
      },
      'children|1-3': [
        {
          'index|+100': 100,
          'bonusUnit|1': ['IT部', '销售部', '财政部', '法务部'],
          'level|10-18': 18,
          'distributer': '@cname',
          'memberCount|100-500': 500,
          'memberName': '@cname',
          'status|1': ['未开始', '已处理', '未处理'],
          'curHandler|1': '@cname',
          'opinions': {
            'totalStat': 0,
            'title': '召唤师的整理意见',
            'list|1-4': [
              {
                'date': '2019-10-01 19:30',
                'content': '@cparagraph(1, 2)',
                'stat|1': [0, 1, 2]
              }
            ]
          }
        }
      ]
    }
  }
]
