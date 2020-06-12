// 根据版本号来决定是否更新服务器缓存的字段配置
// 如果要更新缓存，给版本号 +1 就可以了
export const version = '1.9.0' 

// 默认展示字段
export const defaultFields = [
  'empName',
  // 'empNumber',
  'empLevelName',
  'bonusBudgetName',
  'serviceMonth',
  'countSalary',
  'lastMerits',
  'merits',
  'baseMerits',
  'lastIncreased',
  'currApprBonusMoney',
  'warningTips',
  'judgeBonusRange',
  'hrRemark'
]

// 不可编辑字段
export const disabledFields = [
  'empName',
  // 'empNumber',
  'empLevelName',
  'bonusBudgetName',
  'serviceMonth',
  'countSalary',
  'lastMerits',
  'merits',
  'baseMerits',
  'lastIncreased',
  'currApprBonusMoney',
  'warningTips',
  'judgeBonusRange',
  'hrRemark'
]

// 固定可展示的字段
export const columnsMap = [
  {
    title: '姓名(工号)',
    dataIndex: 'empName',
    width: 150,
    fixed: 'left',
    scopedSlots: { customRender: 'empName' }
  },
  {
    title: '处理方式',
    dataIndex: 'entryWay',
    width: 100
  },
  {
    title: '毕业时间',
    dataIndex: 'graduationDate',
    width: 100
  },
  {
    title: '入职日期',
    dataIndex: 'entryTime',
    width: 100
  },
  {
    title: '离职日期',
    dataIndex: 'leaveDate',
    width: 100
  },
  {
    title: '在职状态',
    dataIndex: 'onWorkName',
    width: 100,
    scopedSlots: { customRender: 'onWorkName' }
  },
  {
    title: '系统',
    dataIndex: 'belongSystemName',
    width: 140
  },
  {
    title: '中心',
    dataIndex: 'center', // 关联字段 center
    width: 120,
    scopedSlots: { customRender: 'center' }
  },
  {
    title: '部门',
    dataIndex: 'empDepartmentName',
    width: 140
  },
  {
    title: '小组',
    dataIndex: 'groupName2',
    width: 140
  },
  {
    title: '工作地点',
    dataIndex: 'workPlace',
    width: 140
  },
  {
    title: '社会调查报告单元',
    dataIndex: 'bounsUnitName',
    width: 140,
    scopedSlots: { customRender: 'bounsUnitName' }
  },
  // {
  //   title: '纳利部门',
  //   dataIndex: 'taxDepartmentName', // 关联字段 taxDepartment
  //   width: 120,
  //   scopedSlots: { customRender: 'taxDepartmentName' }
  // },
  // {
  //   title: '纳利单位',
  //   dataIndex: 'taxUnitName', // 关联字段 taxUnit
  //   width: 120,
  //   scopedSlots: { customRender: 'taxUnitName' }
  // },
  {
    title: '等级',
    dataIndex: 'empLevelName',
    width: 80,
    scopedSlots: { customRender: 'empLevelName' }
  },
  {
    title: '是否升级',
    dataIndex: 'upLevel',
    width: 80,
    scopedSlots: { customRender: 'upLevel' }
  },
  {
    title: '岗位',
    dataIndex: 'empJobName', // 关联字段 empJob
    width: 140,
    scopedSlots: { customRender: 'empJobName' }
  },
  {
    title: '通道',
    dataIndex: 'empPassagewayName',
    width: 100
  },
  {
    title: '领域',
    dataIndex: 'empRealm',
    width: 100
  },
  // {
  //   title: '岗位价值',
  //   dataIndex: 'jobWorth',
  //   width: 100,
  //   scopedSlots: { customRender: 'jobWorth' }
  // },
  // {
  //   title: '认证通道',
  //   dataIndex: 'authPassageway',
  //   width: 100
  // },
  // {
  //   title: '认证领域',
  //   dataIndex: 'authRealm',
  //   width: 100
  // },
  // {
  //   title: '认证等级',
  //   dataIndex: 'authGrade',
  //   width: 100
  // },
  {
    title: '上年效率',
    dataIndex: 'lastBonusBudget',
    width: 80
  },
  {
    title: '效率',
    dataIndex: 'bonusBudgetName',
    width: 80
  },
  {
    title: '上年服务月数',
    dataIndex: 'lastServiceMonth',
    // sorter: true,
    width: 120
  },
  {
    title: '服务月数',
    dataIndex: 'serviceMonth',
    width: 100
  },
  // {
  //   title: '服务月数系数',
  //   dataIndex: 'serviceCoefficient',
  //   width: 120
  // },
  // {
  //   title: 'HR调整系数',
  //   dataIndex: 'hrCoefficient',
  //   width: 100
  // },
  {
    title: '利前月薪(万)',
    dataIndex: 'empSalary',
    width: 100,
    // sorter: true,
    scopedSlots: { customRender: 'empSalary' }
  },
  {
    title: '合计利前月薪(万)',
    dataIndex: 'countSalary',
    width: 140,
    // sorter: true,
    scopedSlots: { customRender: 'countSalary' }
  },
  {
    title: '上年社会调查报告(万)',
    dataIndex: 'lastMerits',
    width: 120,
    // sorter: true,
    scopedSlots: { customRender: 'lastMerits' }
  },
  {
    title: '分发系数',
    dataIndex: 'bonusCoefficientInFact',
    width: 100,
    scopedSlots: { customRender: 'bonusCoefficientInFact' }
  },
  {
    title: '社会调查报告明文(报告)',
    dataIndex: 'payTaxSalary1',
    width: 130,
    scopedSlots: { customRender: 'payTaxSalary1' }
  },
  {
    title: '利前社会调查报告(报告)',
    dataIndex: 'prePayTaxSalary1',
    width: 140,
    scopedSlots: {
      customRender: 'prePayTaxSalary1'
    }
  },
  {
    title: '利后社会调查报告(报告)',
    dataIndex: 'financeJudgeBonus',
    width: 140,
    scopedSlots: {
      customRender: 'financeJudgeBonus'
    }
  },
  {
    title_model: '利前/后实体社会调查报告(最新意见)',
    dataIndex: 'assigneeJudgeBonus',
    width: 160,
    slots: { title: 'assigneeJudgeBonusTitle' },
    scopedSlots: {
      customRender: 'assigneeJudgeBonus'
    }
  },
  {
    title_model: '利前/后实体社会调查报告(我的意见)',
    dataIndex: 'currApprBonusMoney',
    width: 160,
    slots: { title: 'currApprBonusMoneyTitle' },
    scopedSlots: {
      customRender: 'currApprBonusMoney'
    }
  },
  {
    title: '较上年月均增幅',
    dataIndex: 'lastIncreased',
    width: 140,
    scopedSlots: {
      customRender: 'lastIncreased'
    }
  },
  {
    title: '预警信息',
    dataIndex: 'warningTips',
    width: 200,
    scopedSlots: { customRender: 'warningTips' }
  },
  {
    title: '社会调查报告分发参考区间',
    dataIndex: 'judgeBonusRange',
    width: 140,
    scopedSlots: {
      customRender: 'judgeBonusRange'
    }
  },
  {
    title: 'HR备注',
    dataIndex: 'hrRemark',
    width: 160
  },
  {
    title: '是否配股',
    dataIndex: 'stockFlag',
    width: 80
  },
  {
    title: '分发人备注',
    dataIndex: 'currApproverOpinion',
    width: 160,
    scopedSlots: { customRender: 'currApproverOpinion' }
  },
  {//financeRemark 报告备注
    title: '报告备注',
    dataIndex: 'financeRemark',
    width: 160,
    scopedSlots: { customRender: 'financeRemark' }
  },
  {//communicated 沟通情况
    title: '沟通情况',
    dataIndex: 'communicated',
    width: 140,
    scopedSlots: { customRender: 'communicated' }
  },
  {
    title: '分发异常',
    dataIndex: 'difference',
    width: 80,
    scopedSlots: { customRender: 'difference' }
  }
]

// 浮动制的专有字段
export const floatColumns = {
  merits: {
    title: '浮动制社会调查报告预算(万)',
    dataIndex: 'merits',
    width: 150,
    scopedSlots: {
      customRender: 'merits'
    }
  }
}

// 年薪制的专有字段
export const fixedColumns = {
  baseMerits: {
    title: '年薪制社会调查报告预算(万)',
    dataIndex: 'baseMerits',
    width: 150,
    scopedSlots: {
      customRender: 'baseMerits'
    }
  }
}

// 根据实际状况，动态插入，这个字段并不在全量表里
export const dynamicColumn = {
  preBonusMoney: {
    'title_model': '利前/后实体社会调查报告(他人意见)',
    'dataIndex': 'preBonusMoney',
    'width': 160,
    'slots': {
      'title': 'preBonusMoneyTitle'
    },
    'scopedSlots': {
      'customRender': 'preBonusMoney'
    }
  },
}
export const groupInfo = {
  '个人信息': ['empName', 'entryWay', 'graduationDate', 'entryTime', 'leaveDate', 'onWorkName'],
  '组织信息': ['belongSystemName', 'center', 'empDepartmentName', 'groupName2', 'workPlace', 'bounsUnitName'],
  '职务信息': ['empLevelName', 'upLevel', 'empJobName', 'empPassagewayName', 'empRealm'],
  '分发重要信息': ['lastBonusBudget', 'bonusBudgetName', 'lastServiceMonth', 'serviceMonth', 'difference'],
  '薪酬信息': ['empSalary', 'countSalary', 'lastMerits', 'judgeBonusRange', 'bonusCoefficientInFact', 'assigneeJudgeBonus', 'currApprBonusMoney', 'lastIncreased', 'warningTips', 'payTaxSalary1', 'prePayTaxSalary1', 'financeJudgeBonus'],
  '备注信息': ['hrRemark', 'stockFlag', 'currApproverOpinion', 'financeRemark', 'communicated']
}
