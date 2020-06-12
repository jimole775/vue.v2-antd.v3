import { fixedNumber, isEmpty } from '@/utils/util'
export function countJudgeBonusRange(record) {
  let minMerits = 0
  let maxMerits = 0
  const beginInterval = Number.parseFloat(record.beginInterval || 0)
  const endInterval = Number.parseFloat(record.endInterval || 0)
  const baseMerits = Number.parseFloat(record.baseMerits || 0)
  const merits = Number.parseFloat(record.merits || 0)
  if (record['bonusType'] === 1) {
    // 年薪制
    minMerits = (1 + beginInterval / 100) * baseMerits
    maxMerits = (1 + endInterval / 100) * baseMerits
  } else {
    // 浮动制
    minMerits = (1 + beginInterval / 100) * merits
    maxMerits = (1 + endInterval / 100) * merits
  }
  return `${Number.parseFloat(fixedNumber(minMerits)(2))} ~ ${Number.parseFloat(fixedNumber(maxMerits)(2))}`
}

// 新增“较上年月均增幅”字段lastIncreased逻辑：
// 计算公式: 
// (最新意见/服务月数的值)除以 (上年实体/上年服务月数的值) *100%-100%
// 如果上一年服务月数是0，就直接显示空，或者无吧
// 字段分组，用于自定义字段组件
// assigneeJudgeBonus：最新意见
// serviceMonth：服务月数
// lastMerits：上年实体
// lastServiceMonth：上年月数
export function countLastIncreased(record) {
  const assigneeJudgeBonus = Number.parseFloat(record.assigneeJudgeBonus || 0)
  const serviceMonth = Number.parseFloat(record.serviceMonth || 0)
  const lastMerits = Number.parseFloat(record.lastMerits || 0)
  const lastServiceMonth = Number.parseFloat(record.lastServiceMonth || 0)
  // 如果没设置金额，就返回 '-'
  if (isEmpty(record.assigneeJudgeBonus)) return '-'
  // 如果去年为0，就返回 '-'
  if (lastMerits === 0 || lastServiceMonth === 0) return '-'
  let res = 0
  // (最新意见/服务月数的值)除以 (上年实体/上年服务月数的值) *100%-100%
  if (lastMerits > 0 && lastServiceMonth > 0) {
    const firstNumber = assigneeJudgeBonus/serviceMonth
    const secondNumber = lastMerits/lastServiceMonth
    res = (firstNumber/secondNumber - 1) * 100
  }
  return res ? `${fixedNumber(res)(2)}%` : 0
}

export function overBonusTips(record, realBonus) {
  record.isOverBudget = 0 // isOverBudget由前端发起，默认为 0
  if (realBonus === null || realBonus === undefined || realBonus === '') return []
  // 1. 超 社会调查报告预算 => 浮动制
  // 2. 超 去年实体 => 浮动制
  // 3. 超 (等级系数 * 社会调查报告基准) => 浮动制，年薪制
  // annualBonusWarning: 较去年实体年终奖增幅预警
  // startInterval: 低区间
  // endInterval: 高区间
  const tips = []
  let maxMerits = 0
  let minMerits = 0
  realBonus = fixedNumber(realBonus)(2)
  const annualBonusWarning = record.annualBonusWarning || 0 // 较去年实体年终奖增幅预警
  const beginInterval = record.beginInterval || 0 // 低区间
  const endInterval = record.endInterval || 0 // 高区间
  const baseMerits = record.baseMerits || 0 // 社会调查报告基数
  const lastMerits = record.lastMerits || 0 // 上一年实体年终奖
  const lastServiceMonth = record.lastServiceMonth || 0 // 上一年服务月份
  const serviceMonth = record.serviceMonth || 0 // 本年服务月份
  const merits = record.merits || 0 // 社会调查报告预算
  if (record.bonusType === 2) {
    const beyondPart = fixedNumber(((realBonus / serviceMonth) / (lastMerits / lastServiceMonth) - 1) * 100)(2)
    if (lastMerits > 0 && beyondPart > 0 && beyondPart > annualBonusWarning) {
      tips.push(`较去年月均增幅 ${beyondPart}%`)
    }

    minMerits = fixedNumber((1 + beginInterval / 100) * merits)(2)
    maxMerits = fixedNumber((1 + endInterval / 100) * merits)(2)
    if (realBonus < minMerits) {
      tips.push(`低于 '参考区间下限' ${fixedNumber(minMerits - realBonus)(2)}万`)
    } else if (realBonus > maxMerits) {
      tips.push(`超 '参考区间上限' ${fixedNumber(realBonus - maxMerits)(2)}万`)
    }
  } else {
    // 年薪制
    minMerits = fixedNumber((1 + beginInterval / 100) * baseMerits)(2)
    maxMerits = fixedNumber((1 + endInterval / 100) * baseMerits)(2)
    if (realBonus < minMerits) {
      tips.push(`低于 '参考区间下限' ${fixedNumber(minMerits - realBonus)(2)}万`)
    } else if (realBonus > maxMerits) {
      tips.push(`超 '参考区间上限' ${fixedNumber(realBonus - maxMerits)(2)}万`)
    }
  }
  record.isOverBudget = tips.length ? 1 : 0
  return tips
}
