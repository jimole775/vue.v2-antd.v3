<template>
<div class="main-content">
  <a-breadcrumb separator=">">
    <!-- <a-breadcrumb-item>首页</a-breadcrumb-item> -->
    <a-breadcrumb-item>
      社会调查报告单元列表
    </a-breadcrumb-item>
  </a-breadcrumb>
  
  <div class="content-layout warning-bar">
      <p>
          <a-icon type="exclamation-circle" class="warning warning-icon-fixed" theme="filled" />提醒: 跟钱相关的计量单位统一为人民币: 万元
      </p>
  </div>
  <div class="content-layout">
    <div class="table-bonus-plan">
      <div>
        <a-tabs :defaultActiveKey="queryParam.status" @change="tabsChange">
          <a-tab-pane tab="待处理" key="10"></a-tab-pane>
          <a-tab-pane tab="已处理" key="25"></a-tab-pane>
        </a-tabs>
      </div>
      <a-table
        rowKey="index"
        :loading="loading"
        :columns="columnsPlan"
        :dataSource="dataSet"
        :pagination="false"
        @change="handleTableChange"
      >
        <template slot="index" slot-scope="text, record, index">
          <span>{{index + 1}}</span>
        </template>
        <template slot="bonusUnitName" slot-scope="text, record">
          <div class="row-recond">
            <a @click="() => viewDetail(record)">{{spillUnitName(record)}}</a>
          </div>
        </template>
      </a-table>
    </div>
  </div>
</div>
</template>

<script>
import { getList } from '@/api/bonusDistributeServer'
let cacheTabKey = '10' // 用作缓存
const columnsPlan = [
  {
    title: '序号',
    dataIndex: 'index',
    align: 'center',
    scopedSlots: { customRender: 'index' }
  },
  {
    title: '事项',
    dataIndex: 'bonusUnitName',
    scopedSlots: { customRender: 'bonusUnitName' }
  },
  // {
  //   title: '超预算',
  //   dataIndex: 'overBudget'
  // },
  // {
  //   title: '已分发社会调查报告',
  //   dataIndex: 'alloced'
  // },
  // {
  //   title: '浮动人员社会调查报告',
  //   dataIndex: 'floatBonus'
  // },
  // {
  //   title: '年薪制人员社会调查报告',
  //   dataIndex: 'yearlyBonus'
  // },
  // {
  //   title: '社会调查报告单元数',
  //   dataIndex: 'unitCount'
  // },
  // {
  //   title: '总人数',
  //   dataIndex: 'members'
  // }
]

export default {
  name: 'DistributeList',
  components: {
  },
  data() {
    return {
      loading: false,
      // 高级搜索 展开/关闭
      advanced: false,
      // 查询参数
      queryParam: {
        status: '10' // 10 未处理， 25 已处理
      },
      columnsPlan: columnsPlan, // 表头
      dataSet: [], // 表数据源
    }
  },
  created() {
    this.queryParam.status = cacheTabKey
    this.getData()
  },
  methods: {
    spillUnitName(record) {
    // @ApiModelProperty(value = "类型：1-年度，2-季度，3-月度")
    // private Integer bonusPlanType;
    // @ApiModelProperty(value = "归属日期--年份")
    // private Integer belongYear;
    // @ApiModelProperty(value = "归属日期--季度")
    // private Integer belongQuarter;
    // @ApiModelProperty(value = "归属日期--月份")
    // private String belongMonth;
    // @ApiModelProperty(value = "帆船计划名称")
    // private String bonusPlanName;
      const map1 = {
        1: `${record.belongYear}年`,
        2: `${record.belongYear}年${record.belongQuarter}`,
        3: `${record.belongYear}年${record.belongMonth}`,
      }
      const map2 = {
        1: '年度',
        2: '季度',
        3: '月度',
      }
      return `${map1[record.bonusPlanType]}${map2[record.bonusPlanType]}社会调查报告分发(${record.bonusUnitName})`
    },
    async getData() {
      this.loading = true
      const res = await getList({ ...this.queryParam })
      if (res.code === 200) {
        this.dataSet = res.data || []
      }
      this.loading = false
    },
    viewDetail(rowData) {
      this.$router.push({
        path:'/bonusDistribute/pendingHandledUnit', 
        query: {
          ...rowData,
          status: this.queryParam.status == '10' ? 'pending' : 'handled'
        }
      })
    },
    handleTableChange(pagination, filters, sorter) {
      
    },
    tabsChange(key) {
      this.queryParam.status = cacheTabKey = key
      this.$router.push({
        query: Object.assign(this.$router.query || {}, { status: 'handled' })
      })
      this.getData()
    }
  },
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
@warningColor: #f7b500;
.warning {
  color: @warningColor;
}
.warning-icon-fixed {
  margin: 0 7px;
}
div.warning-bar {
  padding: 0.5rem !important;
  border-left: 1px solid @warningColor;
  border-radius: 0 6px 6px 0 !important;
  margin-top:18px;
  p {
    margin: 0;
    font-size: 1rem;
  }
}
</style>