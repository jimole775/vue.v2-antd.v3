<template>
<div class="main-content">
  <a-breadcrumb separator=">">
    <!-- <a-breadcrumb-item>首页</a-breadcrumb-item> -->
    <a-breadcrumb-item>
      规则列表
    </a-breadcrumb-item>
  </a-breadcrumb>
  <div class="content-layout">
    <div class="table-page-search-wrapper">
      <a-form layout="inline">
        <a-row :gutter="24">
          <a-col :md="6" :sm="24">
            <a-form-item label="预警规则">
              <a-input v-model="queryParam.ruleName" allowClear placeholder="请输入预警名称" />
            </a-form-item>
          </a-col>
          <a-col :md="6" :sm="24">
            <span >
                <a-button class="btn-primary" type="primary" @click="getData">查询</a-button>
              <!-- <a-button style="display:none;margin-left: 8px" @click="() => queryParam = {}">重置</a-button> -->
            </span>
          </a-col>
        </a-row>
      </a-form>
    </div>
  </div>
  <div class="content-layout">
    <div class="table-bonus-plan">
      <!-- <p>
        <a-button class="btn-primary" type="primary" @click="createPlan" id="createPlan">创建</a-button>
      </p> -->
      <a-table
        rowKey="pkRuleId"
        :loading="loading"
        :columns="columnsPlan"
        :dataSource="dataPlan"
        :pagination="false"
        @change="handleTableChange"
      >
        <template slot="index" slot-scope="text, record, index">
          <span>{{ (index + 1) }}</span>  
        </template>
        <template slot="ruleName" slot-scope="text, record">
          <div class="row-recond" :id="record.key">
            <a @click="() => viewDetail(record)">{{text}}</a>
          </div>
        </template>
        <template slot="createdName" slot-scope="text, record">
          <span v-if="text">{{ `${ text }(${ record['createdBy'] })` }}</span>
          <span v-else></span>
        </template>
      </a-table>
    </div>
  </div>
</div>
</template>

<script>
import { getRuleList } from '@/api/creatingRuleServer'

const columnsPlan = [
  {
    title: '序号',
    dataIndex: 'index',
    align: 'center',
    scopedSlots: { customRender: 'index' }
  },
  {
    title: '预警规则名称',
    dataIndex: 'ruleName',
    scopedSlots: { customRender: 'ruleName' }
  },
  {
    title: '关联计划',
    dataIndex: 'bonusPlanName'
  },
  {
    title: '创建人(工号)',
    dataIndex: 'createdName',
    scopedSlots: { customRender: 'createdName' }
  },
  // {
  //   title: '创建人工号',
  //   dataIndex: 'createdBy'
  // },
  {
    title: '创建人岗位',
    dataIndex: 'createdDept'
  },
  {
    title: '创建时间',
    dataIndex: 'createdDate'
  },
]
export default {
  name: 'RuleList',
  components: {
  },
  data() {
    return {
      loading: false,
      // 高级搜索 展开/关闭
      advanced: false,
      // 查询参数
      queryParam: {
        ruleName: '',
      }, // 查询入参
      columnsPlan: columnsPlan, // 表头
      dataPlan: [], // 表数据源
      selectedRowKeys: [],
      selectedRows: [],
    }
  },
  created() {
    this.getData()
  },
  methods: {
    async getData() {
      this.loading = true
      const res = await getRuleList({...this.queryParam})
      this.dataPlan = [...res.data]
      this.loading = false
    },
    createPlan(data) {
      this.$router.push({
        path: '/creatingRules/rulesEdit',
        query: { id: '' }
      })
    },
    viewDetail(rowData) {
      this.$router.push({
        path: '/creatingRules/rulesEdit',
        query: { id: rowData.pkRuleId }
      })
    },
    handleTableChange(pagination, filters, sorter) {
    },
  }
}
</script>

<style lang="less" scoped>
.ant-layout .main-content .ant-breadcrumb{
    span{
        color:#30303D;
        /* font-size:16px; */
    }
    a{
        color:#A0A4AC;
        /* font-size:16px; */
    }
}
</style>