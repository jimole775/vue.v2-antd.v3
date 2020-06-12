<template>
  <div data-id="blocket-2">
    <a-row type="flex" justify="start" class="row-fixed" :gutter="24">
      <a-col :md="12" :sm="24">
        <h3 class="master-title">年终奖预算系数</h3>
      </a-col>
      <a-col :md="12" :sm="24" align="right">
        <div class="col-btn">
          <a-button type="primary" ghost class="min-btn" :disabled="disEditByStatus" @click="showUpload = true">
            <i class="font_family icon-btn_normal_Import1"/>导入</a-button>
          <a-button :loading="loading" type="primary" ghost class="min-btn" @click="download"><i class="font_family icon-btn_normal_download" />下载</a-button>
        </div>
      </a-col>
      <!-- <a-col :md="2" :sm="24">
        <a-button v-show="!searchStatus" type="primary" ghost class="min-btn" @click="startSearch"><i class="font_family icon-icon_lookup" />搜索</a-button>
        <a-input v-show="searchStatus" v-model="searchExperssion" ref="searchInput" class="searchInput" @focus="focusSearch" @blur="blurSearch">
        </a-input>
      </a-col> -->
    </a-row>
    <div>
      <a-tabs :defaultActiveKey="tabsActive" @change="tabsChange">
        <a-tab-pane tab="社会调查报告单元系数" key="1"></a-tab-pane>
        <a-tab-pane tab="等级系数" key="2"></a-tab-pane>
        <a-tab-pane tab="价值系数" key="3"></a-tab-pane>
      </a-tabs>
      <div>
        <a-table
          bordered
          style="width:100%;"
          :rowKey="rowKey[tabsActive]"
          :columns="budgetColumns"
          :scroll="budgetCoeffiScroll"
          :dataSource="dataViews"
          :pagination="budgetCoeffiPagination"
        >
          <template slot="coefficient" slot-scope="text, record">
            <InputNumber
              class="row-recond"
              :disabled="disEditByStatus"
              v-model="record['coefficient']"
            />
          </template>
        </a-table>
      </div>
    </div>
    <a-modal title="导入" width="500px" v-model="showUpload" @ok="uploadConfirm">
      <up-load 
        :urlSrc="`/rule/import?flag=${targetMap[tabsActive]}&pkRuleId=${moduleDataSet.pkRuleId}`"
        @getFileTableData="reload"
      >
        <template slot="templateDownload">
          <div class="link">
            <a
              :href="spillDownloadUrl(`/template/${targetMap_cn[tabsActive]}导入模板V1.xls`)"
              target="_blank"
              rel="noopener noreferrer"
            >下载导入模板</a>
          </div>
        </template>
      </up-load>
    </a-modal>
  </div>
</template>

<script>

import { downloadExcel } from '@/api/creatingRuleServer'
import UpLoad from '@/components/BonusCommon/UpLoad' // 引用选择列组件
import InputNumber from '@/components/InputNumber'

const budgetColumnsModel1 = [
  {
    title: '社会调查报告单元ID',
    dataIndex: 'bonusUnitId',
    width: 100,
    key: 'bonusUnitId'
  },
  {
    title: '社会调查报告单元名称',
    dataIndex: 'bonusUnitName',
    width: 100,
    key: 'bonusUnitName'
  },
  {
    title: '社会调查报告单元系数',
    dataIndex: 'coefficient',
    width: 100,
    key: 'coefficient',
    scopedSlots: { customRender: 'coefficient' }
  }
]
const budgetColumnsModel2 = [
  {
    title: '等级ID',
    dataIndex: 'attrId',
    width: 100,
    key: 'attrId'
  },
  {
    title: '等级名称',
    dataIndex: 'rankUnitName',
    width: 100,
    key: 'rankUnitName'
  },
  {
    title: '等级系数',
    dataIndex: 'coefficient',
    width: 100,
    key: 'coefficient',
    scopedSlots: { customRender: 'coefficient' }
  }
]
const budgetColumnsModel3 = [
  {
    title: '岗位价值ID',
    dataIndex: 'attrId',
    width: 100,
    key: 'attrId'
  },
  {
    title: '岗位价值名称',
    dataIndex: 'valUnitName',
    width: 100,
    key: 'valUnitName'
  },
  {
    title: '岗位价值系数',
    dataIndex: 'coefficient',
    width: 100,
    key: 'coefficient',
    scopedSlots: { customRender: 'coefficient' }
  }
]

const budgetCoeffiScroll = { x:300, y: 300 }
const budgetCoeffiPagination = {
        total: 0,
        pageSize: 20, // 每页中显示10条数据
        showSizeChanger: true,
        pageSizeOptions: ['20', '50', '100'], // 每页中显示的数据
        showTotal: total => `共 ${total} 条` // 分页中显示总的数据
      }
export default {
  name: 'BudgetCoefficient',
  components: {
    UpLoad,
    InputNumber
  },
  props: {
    dataSet: {
      type: Object,
      default: () => { return null }
    },
  },
  computed: {
    disEditByStatus() {
      // 60 70 80 90 不可编辑
      const map = [60, 70, 80, 90]
      return map.indexOf(Number.parseInt(this.dataSet.bonusPlanStatus)) > -1
    }
  },
  watch: {
    searchExperssion(val) {
      const newData = []
      // const fields = ['bonusUnitId','bonusUnitName','pkRankBudgetId','rankUnitName','valUnitName','coefficient']
      if (val) {
        const reg = new RegExp(val, 'i')
        this.budgetCoeffiTabData.forEach((item) => {
          if (item['rankUnitName'] && reg.test(item['rankUnitName'])) return newData.push(item)
          if (item['bonusUnitName'] && reg.test(item['bonusUnitName'])) return newData.push(item)
          if (item['valUnitName'] && reg.test(item['valUnitName'])) return newData.push(item)
          if (item['coefficient'] && reg.test(item['coefficient'])) return newData.push(item)
          if (item['bonusUnitId'] && reg.test(item['bonusUnitId'])) return newData.push(item)
          if (item['pkRankBudgetId'] && reg.test(item['pkRankBudgetId'])) return newData.push(item)
        })
        this.dataViews = [...newData]
      } else {
        this.dataViews = [...this.budgetCoeffiTabData]
      }
    },
    budgetCoeffiTabData() {
      this.dataViews = [...this.budgetCoeffiTabData]
    },
  },
  data() {
    return {
      tabsActive: '1',
      loading: false,
      budgetCoeffiScroll,
      budgetCoeffiPagination,
      budgetColumns: budgetColumnsModel1,
      budgetCoeffiTabData: [],
      moduleDataSet: {},
      dataViews: [],
      showUpload: false,
      searchStatus: false,
      searchExperssion: '',
      targetMap: {
        '1':'budgetRuleVoList',
        '2':'rankRuleVoList',
        '3':'valueRuleVoList',
      },
      targetMap_cn: {
        '1':'社会调查报告单元系数',
        '2':'等级系数',
        '3':'价值系数',
      },
      rowKey: {
        '1':'pkBonusBudgetId',
        '2':'pkRankBudgetId',
        '3':'pkRankBudgetId',
      },
    }
  },
  mounted() {
    // this.getList()
  },
  created() {
    this.moduleDataSet = { ...this.dataSet }
    this.budgetCoeffiTabData = this.moduleDataSet.budgetRuleVoList || []
  },
  methods: {
    spillDownloadUrl(target) {
      return process.env.VUE_APP_HOST_URL + target
    },
    uploadConfirm() {
      this.showUpload = false
    },
    startSearch() {
      this.searchStatus = true
      this.$nextTick(() => (this.$refs.searchInput.focus()))
    },
    focusSearch(e) {
      this.$refs.searchInput.$el.style.width = '12rem'
    },
    blurSearch() {
      this.$refs.searchInput.$el.style.width = '5rem'
      setTimeout(() => { this.searchStatus = false }, 500)
    },
    reload() {
      this.$emit('reload', (data) => {
        this.moduleDataSet = { ...data }
        this.tabsChange(this.tabsActive)
      })
    },
    update() {
      this.$emit('update', this.moduleDataSet)
    },
    async download() {
      this.loading = true
      const res = await downloadExcel({
        'flag': this.targetMap[this.tabsActive],
        'ruleId': this.moduleDataSet.pkRuleId
      }, this.targetMap_cn[this.tabsActive])
      if (res.code !== 200) {
        this.$message.error(res.msg)
      }
      this.loading = false
    },
    tabsChange(key) {
      this.tabsActive = key
      this.searchExperssion = ''
      this.budgetCoeffiPagination = {...budgetCoeffiPagination}
      switch (key) {
        case '1':
          // warnRuleVoList
          this.budgetCoeffiTabData = this.moduleDataSet.budgetRuleVoList || []
          this.budgetColumns = [...budgetColumnsModel1]
          // this.budgetCoeffiPagination = {...budgetCoeffiPagination}
          break
        case '2':
          // rankRuleVoList
          this.budgetCoeffiTabData = this.moduleDataSet.rankRuleVoList || []
          this.budgetColumns = [...budgetColumnsModel2]
          // this.budgetCoeffiPagination = false
          break
        case '3':
          // valueRuleVoList
          this.budgetCoeffiTabData = this.moduleDataSet.valueRuleVoList || []
          this.budgetColumns = [...budgetColumnsModel3]
          // this.budgetCoeffiPagination = false
          break
        default:
          this.budgetCoeffiTabData = this.moduleDataSet.budgetRuleVoList || []
          this.budgetColumns = [...budgetColumnsModel1]
          // this.budgetCoeffiPagination = {...budgetCoeffiPagination}
          break
      }
    }
  }
}
</script>

<style lang="less" scoped>
.col-btn{
  button{
    margin-left:24px;
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
}
.row-recond {
  max-width: 6rem;
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
    &::before {
      margin-right: 0.4rem;
    }
  }
}

.searchInput{
  height: 2.8rem;
  width: 5rem;
  transition: width 0.5s;
  -moz-transition: width 0.5s;	/* Firefox 4 */
  -webkit-transition: width 0.5s;	/* Safari 和 Chrome */
  -o-transition: width 0.5s;	/* Opera */
}
</style>
