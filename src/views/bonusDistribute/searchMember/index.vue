<template>
<div class="main-content">
  <a-breadcrumb separator=">">
    <a-breadcrumb-item>首页</a-breadcrumb-item>
    <a-breadcrumb-item>
      <a href="javascript:void(0)" @click="$router.go(-1)">待处理社会调查报告单元</a>
    </a-breadcrumb-item>
    <a-breadcrumb-item>
      查看全部人员
    </a-breadcrumb-item>
  </a-breadcrumb>
  <div class="content-layout">
    <div class="table-page-search-wrapper">
      <a-form layout="inline">
        <a-row :gutter="24">
          <a-col :md="6" :sm="24">
              <a-input style="height: 2.85rem;line-height: 2.85rem;" v-model="queryParam.empName" allowClear placeholder="请输入员工号或姓名查询" />
          </a-col>
          <a-col :md="6" :sm="24">
            <span>
              <a-button class="btn-primary" type="primary" @click="getData">搜索</a-button>
            </span>
          </a-col>
        </a-row>
      </a-form>
    </div>
    <div class="table-bonus-plan">
        <a-row :gutter="24">
            <a-col :md="20" :sm="24">
                <h4>搜索结果</h4> 
            </a-col>
        </a-row>
      <a-table
        bordered
        rowKey="empNumber"
        :loading="loading"
        :columns="columnsPlan"
        :dataSource="dataPlan"
        :pagination="pagination"
        @change="handleTableChange"
      >
        <template slot="empName" slot-scope="text, record">
          <div>
            {{ record.empName }}({{ record.empNumber }})
          </div>
        </template>
        <template slot="warningTips" slot-scope="text, record">
          <div v-if="overBonusTips(record, record.assigneeJudgeBonus).length">
            <span v-for="item in overBonusTips(record, record.assigneeJudgeBonus)" :key="item">
              <!-- <a-icon type="exclamation-circle" /> &nbsp;{{ item }} -->
                <a-icon type="exclamation-circle" class="warning warning-icon-fixed" theme="filled" />{{ item }}
              <br>
            </span>
          </div>
        </template>
        <template slot="merits" slot-scope="text, record">
          <div v-if="text || text === 0">
            <span>{{ text }}</span>
          </div>
          <div v-else>{{ record['baseMerits'] }}</div>
        </template>        
        <template slot="checkOperation" slot-scope="text, record">
          <OperationButton :record="record" :rootTreeId="queryParam.treeId" :rootUnitId="queryParam.unitId"/>
        </template>
      </a-table>
    </div>
  </div>
</div>
</template>

<script>
import { getDistributingMemberList } from '@/api/bonusDistributeServer'
import { fixedNumber } from '@/utils/util'
import OperationButton from '@/views/bonusDistribute/common/OperationButton'
import StatusContent from '@/views/bonusDistribute/common/StatusContent'
import { 
  // countJudgeBonusRange, 
  overBonusTips,
  } from '@/views/bonusDistribute/common/common'

const columnsPlan = [
  {
    title: '姓名(工号)',
    dataIndex: 'empName',
    width: 150,
    align: 'center',
    scopedSlots: { customRender: 'empName' }
  },
  {
    title: '等级',
    dataIndex: 'empLevelName',
    width: 100,
    align: 'center',
    scopedSlots: { customRender: 'empLevelName' }
  },
  {
    title: '效率',
    dataIndex: 'bonusBudgetName',
    width: 100,
    align: 'center',
    scopedSlots: { customRender: 'bonusBudgetName' }
  },
  {
    title: '社会调查报告单元',
    dataIndex: 'bounsUnitName',
    width: 120,
    align: 'center',
    scopedSlots: { customRender: 'bounsUnitName' }
  },
  {
    title: '社会调查报告预算(万)',
    dataIndex: 'merits',
    width: 100,
    align: 'center',
    scopedSlots: { customRender: 'merits' }
  },
  {
    title: '分发社会调查报告(万)',
    dataIndex: 'assigneeJudgeBonus',
    align: 'center',
    width: 100,
    scopedSlots: {
      customRender: 'assigneeJudgeBonus'
    }
  },
  {
    title: '预警信息',
    dataIndex: 'warningTips',
    width: 14 * 12,
    scopedSlots: { customRender: 'warningTips' }
  },
  {
    "title": "分发人备注",
    "dataIndex": "currApproverOpinion",
    "width": 168,
    "scopedSlots": { "customRender": "currApproverOpinion" },
  },
  {
    title: 'HR备注',
    dataIndex: 'hrRemark',
    width: 100,
    align: 'center',
    scopedSlots: { customRender: 'hrRemark' }
  },
  {
    title: '分发/审核社会调查报告',
    dataIndex: 'checkOperation',
    align: 'center',
    width: 100,
    scopedSlots: { customRender: 'checkOperation' },
  },
]
export default {
  name: 'SearchMember',
  components: {
    OperationButton,
    StatusContent,
  },
  computed: {
    scrollConfig() {
      const res =  { x: 0 }
      this.columnsPlan.forEach((colItem) => {
        res.x += colItem.width || 0
      })
      return res
    },
  },
  data() {
    return {
      // 查询参数
      queryParam: {
        empName: null,
        bonusType: null, // 年薪制=1 ，浮动制=2
        difference: null, // 异常人员名单=1
        deep: null, // 是否深度查询
        treeId: null,	// 社会调查报告树ID
        unitId: null,	// 社会调查报告单元ID
        bizType: null, // 区分是否向下汇总
        current: 0,
        pageSize: 20,
      },
      pagination: {
        total: 0,
        pageSize: 20, // 每页中显示10条数据
        showSizeChanger: true,
        showQuickJumper: true,
        pageSizeOptions: ['20', '50', '100'], // 每页中显示的数据
        showTotal: total => `共有 ${total} 条数据` // 分页中显示总的数据
      },
      loading: false,
      columnsPlan, // 表头
      dataPlan: [], // 表数据源
    }
  },
  created() {
    this.queryParam.treeId = this.$route.query.treeId
    this.queryParam.unitId = this.$route.query.unitId
    this.queryParam.deep = this.$route.query.deep
    this.queryParam.difference = this.$route.query.difference
    this.queryParam.bonusType = this.$route.query.bonusType
    this.queryParam.bizType = this.$route.query.bizType
    this.getData()
  },
  mounted() {
  },
  methods: {
    overBonusTips,
    async getData() {
      this.loading = true
      // 年薪制人员列表
      const res = await getDistributingMemberList({
        ...this.queryParam,
        // bizType: 'appr'
      })
      if (res.data && res.data.list) {
        this.dataPlan = res.data.list
        this.pagination.total = res.data.total
      } else {
        this.dataPlan = []
      }
      this.loading = false
      this.transformFields(this.dataPlan || [])
    },
    transformFields(originData) {
      // 转换几个必要的字段，使整个模块可以使用../common.js里面公共方法
      originData.forEach((item) => {
        item.treeId = item.bounsTreeId
        item.unitId = item.bounsUnitId
        item.assignStatus = item.unitStatus
      })
    },
    handleTableChange(pagination, filters, sorter) {
      this.queryParam.current = pagination.current //当前页
      this.queryParam.pageSize = pagination.pageSize
      this.getData()
    },
  }
}
</script>

<style lang="less" scoped>
.content-layout {
  .ant-card-wider-padding {
    .ant-card-body {
      margin: 0;
    }
  }
}

@warningColor: #f7b500;
.warning {
  color: @warningColor;
}
.warning-icon-fixed {
  margin: 0 7px;
}

.inner-layout {
  padding: 0;
}

.bonus-unit-col-layout {
  display: inline-block;
  .bonus-unit-inner-layout {
    display: table;
    .bonus-unit-icon {
      display:table-cell; vertical-align: middle;
    }
    .bonus-unit-card {
      text-indent: 0.5rem;
      display:table-cell; vertical-align: middle;
      .bonus-unit-title {
        font-weight: 600;
        font-size: 0.95rem;
        color: #2E2E3B;
        display:block;
      }
      .bonus-unit-desc {
        color:#7C7B80;
        font-size: 0.9rem;
        display:block;
      }
    }
  }
}

</style>