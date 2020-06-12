<template>
  <a-modal title="批量分发金额" width="750px" height="600px" v-model="showModal" @ok="confirm" @cancel="handleCancel">
    <p>
      金额（人民币）
      <a-input-number v-model="bonus" />万
      &nbsp;&nbsp;
      <a href="javascript:void(0)" @click="autoTypingByBudget">按预算自动分发</a>
    </p>
    <div class="content-bar">
      <a-table
        rowKey="index"
        :columns="ownColumns"
        :dataSource="dataSet"
        :scroll="{y: 260}"
        :pagination="false"
      >
        <template slot="empName" slot-scope="text, record">
          <span>{{ `${text}（${record['empNumber']}）` }}</span>
        </template>
        <template slot="operation" slot-scope="text, record, index">
          <a href="javascript: void(0)" @click="delItem(record, index)">
            <a-icon type="delete" />
          </a>
        </template>
      </a-table>
      <br />
      <span>
        已选人员 {{selectedRows.length}} 人
        <span>
          <a-icon type="exclamation-circle" class="warning warning-icon-fixed" theme="filled" />提示：请确认以上人员是您想批量分发的人员
        </span>
      </span>
    </div>
    <div></div>
  </a-modal>
</template>

<script>
export default {
  name: 'BatchEditorModal', // 展开树表
  props: {
    visiable: {
      type: Boolean,
      default: false
    },
    selectedRows: {
      type: Array,
      default: []
    },
    columnsPlan: {
      type: Array,
      default: []
    },
    editField: {
      type: String,
      default: 'currApprBonusMoney'
    },
    type: {
      type: String,
      default: null
    },
    status: {
      type: String | Number,
      default: null
    },
    rootAssignStatus: {
      type: String | Number,
      default: null
    },
  },
  data() {
    return {
      showModal: false,
      bonus: 0,
      dataSet: []
    }
  },
  watch: {
    visiable(val) {
      this.showModal = val
    },
    showModal(val) {
      this.dataSet = [...this.selectedRows]
      this.$emit('visiableEvent', val)
    },
    selectedRows(val) {
      this.dataSet = [...val]
    }
  },
  computed: {
    ownColumns() {
      const keepColumns = ['empName', 'bounsUnitName', 'empLevelName', 'lastServiceMonth', 'bonusBudgetName']
      const res = []
      keepColumns.forEach(title => {
        this.columnsPlan.forEach(colItem => {
          if (title === colItem.dataIndex) {
            const copy = { ...colItem }
            delete copy.fixed
            res.push(copy)
          }
        })
      })
      res.push({
        title: '',
        dataIndex: 'operation',
        width: 50,
        scopedSlots: { customRender: 'operation' }
      })
      return res
    }
  },
  methods: {
    confirm() {
      this.showModal = false
      const selectedRowKeys = []
      if (!this.dataSet.length) return this.$message.warning('无数据需要处理')
      this.dataSet.forEach(item => {
        if (!this.isDisabledForKeepFocusInput(item)) {
          item[this.editField] = this.bonus || 0
          selectedRowKeys.push(item.empNumber)
        }
      })
      this.$emit('changeEvent', this.dataSet, selectedRowKeys)
    },
    handleCancel() {
      // 取消
    },
    isDisabledForKeepFocusInput(record) {
      // :type="queryParam.type"
      // :status="queryParam.status"
      // :rootAssignStatus="queryParam.rootAssignStatus"
      if (this.type === 'keepFocus') {
        if (this.status === 'pending' &&  this.rootAssignStatus != '25') {
          if (record.apprId == this.$store.state.user.userId) {
            // 可分发单元
            // 40: '被驳回',
            return record.unitStatus == 40
          } else {
            // 被审核单元
            // 10: '未送审',
            // 20: '未送审',
            // 40: '已驳回',
            return record.unitStatus == 40 || record.unitStatus == 10 || record.unitStatus == 20
          }
        } else {
          return true
        }
      } else {
        return false
      }
    },
    autoTypingByBudget() {
      // title: '浮动制社会调查报告预算(万)',
      // dataIndex: 'merits',
      // title: '年薪制社会调查报告预算(万)',
      // dataIndex: 'baseMerits',
      this.showModal = false
      const selectedRowKeys = []
      this.dataSet.forEach(item => {
        if (!this.isDisabledForKeepFocusInput(item)) {
          item[this.editField] = item['bonusType'] === 1 ? item['baseMerits'] : item['merits'] 
          selectedRowKeys.push(item['empNumber'])
        }
      })
      this.$emit('changeEvent', this.dataSet, selectedRowKeys)
    },
    delItem(record, index) {
      this.dataSet.splice(index, 1)
    },
  }
}
</script>
<style lang="less" scoped>
.bonus-tree {
  height: 500px;
}
ul,
li,
ol {
  list-style: none;
}
.list-select {
  position: relative;
  margin: 0 0 1rem 0;
  li {
    margin-right: 10px;
    padding: 3px 10px 3px 10px;
    display: inline-block;
    position: relative;
    background: #f0f0f0;
    border-radius: 4px;
    margin: 0.3rem;
    i.anticon {
      cursor: pointer;
      font-size: 0.5rem;
      position: relative;
      top: -0.5rem;
      &:hover {
        color: red;
      }
    }
  }
}
/deep/ .ant-row {
  margin: 0.3rem 0;
}
@warningColor: #f7b500;
.warning {
  color: @warningColor;
}
.warning-icon-fixed {
  margin: 0 7px;
}
</style>
