<template>
  <div data-id="blocket-3">
    <a-row class="row-fixed" :gutter="24">
      <a-col :md="12" :sm="24">
        <h3 class="master-title">高管预留系数</h3>
      </a-col>
      <a-col :md="12" :sm="24" align="right">
        <div class="col-btn">
          <a-button type="primary" class="min-btn fake-ghost-btn" :disabled="disEditByStatus" @click="openUnitEditor"><i class="font_family icon-btn_normal_editjiangjin"></i>编辑社会调查报告单元</a-button>
          <a-button type="primary" class="min-btn fake-ghost-btn" :disabled="disEditByStatus" @click="openLevelEditor"><i class="font_family icon-btn_selected_editzhiji"></i>编辑等级</a-button>
        </div>
      </a-col>
    </a-row>
    <div>
      <a-table 
          bordered
          size="middle"
          rowKey="index"
          style="width: 100%; overflow-x: auto;"
          :scroll="{ x: mgrReserveColumns.length * 100, y: 420 }"
          :pagination="false"
          :columns="mgrReserveColumns" 
          :dataSource="mgrReserveData">
        <template slot="bonusUnitCoefficient" slot-scope="text, record, index">
          <InputNumber
            v-if="typeof text === 'number' && unitCanEdit"
            v-model="record['bonusUnitCoefficient']"
            @changeData="(val) => sumRow(val, record, index)"
          />
          <span v-else>{{ text }}</span>
        </template>
      </a-table>
    </div>
  </div>
</template>

<script>
import { fixedNumber } from '@/utils/util'
import InputNumber from '@/components/InputNumber'
const mgrReserveColModel = [
    {title: '', dataIndex: 'bonusUnitName', key: 'bonusUnitName', width: 100},
    {title: '', dataIndex: 'bonusUnitCoefficient', key: 'bonusUnitCoefficient', width: 100, scopedSlots: { customRender: 'bonusUnitCoefficient' }},
    {title: '等级', dataIndex: 'keepSpace', key: 'keepSpace', width: 100 },
    // {title: '1', dataIndex: 'level1', key: 'level1', scopedSlots: { customRender: 'level1' }},
    // {title: '2', dataIndex: 'level2', key: 'level2', scopedSlots: { customRender: 'level2' }},
    // {title: '3', dataIndex: 'level3', key: 'level3', scopedSlots: { customRender: 'level3' }},
    // {title: '4', dataIndex: 'level4', key: 'level4', scopedSlots: { customRender: 'level4' }},
    // {title: '5', dataIndex: 'level5', key: 'level5', scopedSlots: { customRender: 'level5' }},
]
export default {
  name: 'BudgeRule',
  components: {
    InputNumber
  },
  props: {
    dataSet: {
      type: Object,
      default: () => {}
    }
  },
  computed: {
    disEditByStatus() {
      // 60 70 80 90 不可编辑
      const map = [60, 70, 80, 90]
      return map.indexOf(Number.parseInt(this.dataSet.bonusPlanStatus)) > -1
    }
  },
  watch: {
    levelCanEdit(val) {
      let i = this.elementsCache.highLevelInput.length
      if (!i) return 
      while(i --) {
        const el_input = this.elementsCache.highLevelInput[i]
        const el_span = this.elementsCache.highLevelSpan[i]
        if (val) {
          el_input.style.display = 'inline-block'
          el_span.style.display = 'none'
        } else {
          el_input.style.display = 'none'
          el_span.style.display = 'inline'
        }
      }
    }
  },
  data() {
    return {
      loading: false,
      levelCanEdit: false,
      unitCanEdit: false,
      mgrReserveColumns: mgrReserveColModel,
      mgrReserveData: [],
      levelColumns: [],
      elementsCache: {
        highLevelInput: [],
        highLevelSpan: [],
      }
    }
  },
  mounted() {
    this.cacheOperationElements()
  },
  created() {
    this.buildReserveData()
    this.initCrossCount()
    this.buildReserveColumns()
  },
  methods: {
    openUnitEditor(e) {
      this.unitCanEdit = !this.unitCanEdit
      if (this.unitCanEdit) {
        e.target.style.backgroundColor = '#6bd36e'
        e.target.style.color = '#fff'
      } else {
        e.target.style.backgroundColor = '#fff'
        e.target.style.color = '#59e359'
      }
    },
    openLevelEditor(e) {
      this.levelCanEdit = !this.levelCanEdit
      if (this.levelCanEdit) {
        e.target.style.backgroundColor = '#6bd36e'
        e.target.style.color = '#fff'
      } else {
        e.target.style.backgroundColor = '#fff'
        e.target.style.color = '#59e359'
      }
    },
    cacheOperationElements() {
      this.elementsCache.highLevelInput = document.querySelectorAll('[data-id="highLevelInput0"]')
      this.elementsCache.highLevelSpan = document.querySelectorAll('[data-id="highLevelSpan0"]')
    },
    initCrossCount() {
      const levelRow = this.mgrReserveData[0]
      Object.keys(levelRow).forEach((key) => {
        if (/^level/.test(key) && (levelRow[key] || levelRow[key] === 0)) {
          this.sumCol(levelRow[key], key)
        }
      })
    },
    buildReserveColumns() { 
      // :columns="mgrReserveColumns" 
      this.levelColumns = [] // 存储等级模板
      this.dataSet.highLevelVO && 
      this.dataSet.highLevelVO.forEach((item, highLevelIndex) => {
      const title = item.highLevel
      const levelKey = 'level' + item.highLevel
      this.levelColumns.push({
        width: 100,
        title: title,
        dataIndex: levelKey,
        key: levelKey,
        // scopedSlots: { customRender: levelKey },
        customRender: (text, record, index) => {
          const self = this
          return this.$createElement(
            'div', {}, [
              this.$createElement('InputNumber', {
                attrs: {
                  'data-id': `highLevelInput${index}`,
                  // 'type': 'number',
                  // 'class':'ant-input '
                },
                style: {
                  display: 'none'
                },
                props: {
                  value: record[levelKey]
                },
                on: {
                  changeData: (val) => { 
                    record[levelKey] = Number.parseFloat(val)
                    self.sumCol(val, levelKey)
                  }
                }
              }),
              this.$createElement('span', {
                domProps: {
                  innerText: record[levelKey],
                },
                attrs: {
                  'data-id': `highLevelSpan${index}`,
                },
                style: {
                  display: 'inline-block'
                },
              })
            ])
        }
      })
      })
      this.mgrReserveColumns = this.mgrReserveColumns.concat(this.levelColumns)
    },
    /**重新拼装mgrReserveData */
    buildReserveData() {
      // :dataSource="mgrReserveData"
      this.mgrReserveData = []

      const dataModel = {
        index: 0,
        keepSpace: '', // 只有第一行有固定的数据
        bonusUnitName: '', // 第一行没有数据，第二行固定数据为 '社会调查报告单元'，其他为String类型数据
        bonusUnitCoefficient: '', // 第一行没有数据，第二行固定数据为 '社会调查报告单元系数'，其他为int类型数据
        // showSecretComponent: false // 暂时无用
      }

      /************************等级系数: 只赋值第一行数据*************************/
      const firstRowModel = {...dataModel}
      this.dataSet.highLevelVO && 
      this.dataSet.highLevelVO.forEach((item, highLevelIndex) => {
        dataModel['level' + item.highLevel] = ''
        firstRowModel['level' + item.highLevel] = item.highLevelCoefficient
        firstRowModel['pkSeniorBudgetId' + item.highLevel] = item.pkSeniorBudgetId
        firstRowModel['ruleId' + item.highLevel] = item.ruleId
      })

      firstRowModel.index = 0
      firstRowModel.keepSpace = '等级系数'
      this.mgrReserveData.push({ ...firstRowModel })

      /*************************第二行 空白行处理*******************************/
      const secondRowModel = { ...dataModel }
      secondRowModel.index = 1
      secondRowModel.bonusUnitName = '社会调查报告单元'
      secondRowModel.bonusUnitCoefficient = '社会调查报告单元系数'
      this.mgrReserveData.push({ ...secondRowModel })
      
      /*************************第三行 往后的社会调查报告单元系数**********************/
      this.dataSet.highBonusVO && 
      this.dataSet.highBonusVO.forEach((item, index) => {
        const highBonusModel = { ...dataModel }
        highBonusModel.index = index += 2
        highBonusModel.bonusUnitName = item.bonusUnitName || ''
        highBonusModel.bonusUnitCoefficient = item.bonusUnitCoefficient || 0
        highBonusModel['pkSeniorBudgetId'] = item.pkSeniorBudgetId
        highBonusModel['ruleId'] = item.ruleId
        highBonusModel['bonusUnitId'] = item.bonusUnitId
        this.mgrReserveData.push({ ...highBonusModel })
      })
    },
    deconstructReserveTable() {
      this.dataSet.highLevelVO = []
      this.dataSet.highBonusVO = []
      this.mgrReserveData.forEach((rowData, rowIndex) => {
        if (rowIndex === 0) {
          // 第一行 字段为 level 的，获取值
          // 构造如下字段
          // highLevel: 1
          // highLevelCoefficient: null
          // pkSeniorBudgetId: 9
          // ruleId: 12
          Object.keys(rowData).forEach((key) => {
            if (/^level/i.test(key)) {
              const level = key.replace(/level/, '')
              this.dataSet.highLevelVO.push({
                highLevel: level,
                highLevelCoefficient: rowData[key],
                pkSeniorBudgetId: rowData['pkSeniorBudgetId' + level],
                ruleId: rowData['ruleId' + level]
              })
            }
          })
        }

        if (rowIndex > 1) {
          // 第三行开始，获取字段 bonusUnitCoefficient bonusUnitName
          // 构造如下字段
          // bonusUnitCoefficient: null
          // bonusUnitId: 1
          // bonusUnitName: null
          // pkSeniorBudgetId: 9
          // ruleId: 12
          this.dataSet.highBonusVO.push({
            bonusUnitCoefficient: rowData['bonusUnitCoefficient'],
            bonusUnitId: rowData['bonusUnitId'],
            bonusUnitName: rowData['bonusUnitName'],
            pkSeniorBudgetId: rowData['pkSeniorBudgetId'],
            ruleId: rowData['ruleId'],
          })
        }

      })
    },
    update() {
      this.deconstructReserveTable()
      this.$emit('update', this.dataSet)
    },
    delRow() {
      
    },
    addRow() {
      const newModel = { 
        index: 0,
        keepSpace: '',
        bonusUnitName: '',
        bonusUnitCoefficient: 0
      }
      newModel.index = this.mgrReserveData.length
      this.mgrReserveData.push(newModel)
    },
    sumRow(val, countRow, index) {
      // 获取第一行系数
      const baseFactorRow = this.mgrReserveData[0] 
      Object.keys(countRow).forEach(key => {
        if (/^(level)/.test(key)) {
          countRow[key] = Number.parseFloat(fixedNumber(val * baseFactorRow[key])(2))
        }
      })
    },
    sumCol(val, colKey) {
      const baseFactorKey = 'bonusUnitCoefficient'
      this.mgrReserveData.forEach((countRow, rowIndex) => {
        if (rowIndex < 2) return
        Object.keys(countRow).forEach(key => {
          if (colKey === key) {
            countRow[colKey] = Number.parseFloat(fixedNumber(val * countRow[baseFactorKey])(2))
          }
        })
      })
    },
  }
}
</script>

<style lang="less" scoped>
.col-btn{
  button{
    margin-left:24px;
  }
}
/deep/.ant-table-thead {
  tr th {
    min-width: 100px;
  }
}
.master-title {
  border-left: 2px solid #00b627;
  text-indent: 7px;
  margin: 1rem 0;
}
.blocket {
  margin-top: 1rem;
}
.row-fixed {
  align-items: center; 
  margin-bottom: 1rem;
}
.secret-component {
  border-top: 0.5px solid #00b627;
  border-right: 0.5px solid #00b627;
  border-bottom: 0.5px solid #00b627;
  position: absolute;
  top: 0;
  left: 100%;
  height: 100%;
  width: 6.6rem;
  box-sizing: content-box;
  margin-top: -1px;
  padding-bottom: 0.5px;
  button.ant-btn {
    width: 18px;
    max-width: 18px;
    min-width: 50%;
    height: 100%;
    margin: 0;
    padding: 0;
    border: 0;
    background: transparent;
    i {
      font-size: 1.2rem;
    }
  }
}

/deep/ .ant-table table tr th, 
/deep/ .ant-table table tr td {
  text-align: center;
 /deep/ .ant-input-number {
   width: 66px;
 }
}

.ant-row .ant-form-item {
  /deep/ .ant-input-number {
   width: 110px;
 }
 /deep/ .ant-form-item-label {
   font-size: 1rem;
 }
}
.min-btn {
  min-width: 6.4rem !important;
  i {
    &::before{
      margin-right: 0.4rem;
    }
  }
}
.fake-ghost-btn{
  background-color: transparent;
  color: #32d637;
}
</style>
