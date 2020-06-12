<template>
  <div>
    <div class="content-layout">
      <div class="head-card">
        <h3><span>社会调查报告单元：{{ bonusDetailsSplit(summary.bonusDetails || '') }} </span><span>（共 {{ summary.members }} 人）</span></h3>
        <a-row :gutter="24">
          <a-col :md="12" :sm="24" style="border-right: 1px solid rgb(192, 192, 192);">
            <a-row :gutter="24">
              <a-col :md="6" :sm="24">
                <p><span class="desc">浮动制人员情况</span></p>
                <p class="long-data-block">
                  <span class="context" :title="`${summaryVO.floatAllocBudget || 0}万`">{{ fixedNumber(summaryVO.floatAllocBudget || 0)(2) }}万</span>
                </p>
                <p><span class="desc">预算</span></p>
              </a-col>
              <a-col :md="5" :sm="24">
                <p>&nbsp;&nbsp;</p>
                <p class="long-data-block" >
                  <span class="context" :title="`${summaryVO.totleFloatAllocMoney || 0}万`">{{ fixedNumber(summaryVO.totleFloatAllocMoney || 0)(2) }}万</span>
                </p>
                <p><span class="desc">已分社会调查报告</span></p>
              </a-col>
              <a-col :md="5" :sm="24">
                <p>&nbsp;&nbsp;</p>
                <p class="long-data-block" :title="`${ summaryVO.totleFloatResidue || 0}万`">
                  <span class="context" :class="summaryVO.totleFloatResidue < 0 ? 'obvious' : ''">{{ fixedNumber(summaryVO.totleFloatResidue || 0)(2) }}万</span>
                </p>
                <p><span class="desc">剩余预算</span></p>
              </a-col>
              <a-col :md="4" :sm="24">
                <p>&nbsp;&nbsp;</p>
                <p class="long-data-block" :title="`${ summaryVO.totleFloatMembers }`">
                  <span class="context" >{{ summaryVO.totleFloatMembers || 0}}人</span>
                </p>
                <p><span class="desc">总人数</span></p>
              </a-col>
              <a-col :md="4" :sm="24">
                <p>&nbsp;&nbsp;</p>
                <p class="long-data-block" >
                  <span class="context">{{ summaryVO.floatDifferences || 0 }}人</span>
                </p>
                <p>
                  <span class="desc">异常人数</span>
                </p>
              </a-col>
            </a-row>
          </a-col>
          <a-col :md="12" :sm="24">
            <a-row :gutter="24">
              <a-col :md="6" :sm="24">
                <p><span class="desc">年薪制人员情况</span></p>
                <p class="long-data-block" >
                  <span class="context" :title="`${summaryVO.yearlyAllocBudget || 0}万`">{{ fixedNumber(summaryVO.yearlyAllocBudget || 0)(2) }}万</span>
                </p>
                <p><span class="desc">预算</span></p>
              </a-col>
              <a-col :md="5" :sm="24">
                <p>&nbsp;&nbsp;</p>
                <p class="long-data-block" >
                  <span class="context" :title="`${summaryVO.totleYearlyAllocMoney || 0}万`">{{ fixedNumber(summaryVO.totleYearlyAllocMoney || 0)(2) }}万</span>
                </p>
                <p><span class="desc">已分社会调查报告</span></p>
              </a-col>
              <a-col :md="5" :sm="24">
                <p>&nbsp;&nbsp;</p>
                <p class="long-data-block" :title="`${ summaryVO.totleYearlyResidue }万`">
                  <span class="context" :class="summaryVO.totleYearlyResidue < 0 ? 'obvious' : ''">{{ fixedNumber(summaryVO.totleYearlyResidue || 0)(2) }}万</span>
                </p>
                <p><span class="desc">剩余预算</span></p>
              </a-col>
              <a-col :md="4" :sm="24">
                <p>&nbsp;&nbsp;</p>
                <p class="long-data-block" :title="`${ summaryVO.totleYearlyMembers }`">
                  <span class="context" >{{ summaryVO.totleYearlyMembers || 0}}人</span>
                </p>
                <p><span class="desc">总人数</span></p>
              </a-col>
              <a-col :md="4" :sm="24">
                <p>&nbsp;&nbsp;</p>
                <p class="long-data-block" >
                  <span class="context">{{ summaryVO.yearlyDifferences || 0 }}人</span>
                </p>
                <p>
                  <span class="desc">异常人数</span>
                </p>
              </a-col>
            </a-row>
          </a-col>
        </a-row>
      </div>
    </div>
    <div v-if="floatRemark || yearlyRemark || stateType === 'distribute'" class="content-layout warning-bar">
      <a-row :gutter="24">
        <a-col :md="24" :sm="24">
          <p v-if="stateType === 'distribute'">
            <a-icon type="exclamation-circle" class="warning warning-icon-fixed" theme="filled" />
            分发情况：您还有
            <span class="mark-text warning">{{ summary.nopayAll }}</span> 个员工未分发社会调查报告，
            其中浮动制 <span class="mark-text warning">{{ summary.nopayFloat }}</span> 人， 年薪制
            <span class="mark-text warning">{{ summary.nopayYearly }}</span> 人
          </p>
          <p v-if="floatRemark">
            <a-icon type="exclamation-circle" class="warning warning-icon-fixed" theme="filled" />
            浮动制超额原因：<span>{{ floatRemark }}</span>
          </p>
          <p v-if="yearlyRemark">
            <a-icon type="exclamation-circle" class="warning warning-icon-fixed" theme="filled" />
            年薪制超额原因：<span>{{ yearlyRemark }}</span>
          </p>
        </a-col>
      </a-row>
    </div>
    <div v-if="stateType === 'keepFocus'" class="content-layout warning-bar">
      <a-row :gutter="24">
        <a-col :md="24" :sm="24">
          <p>
            <a-icon type="exclamation-circle" class="warning warning-icon-fixed" theme="filled" />
            <span>上面的浮动制和年薪制人员情况展示的是 '{{ bonusDetailsSplit(summary.bonusDetails || '') }}' 的汇总数据，下面的人员清单展示的是您重点关注的人员信息</span>
          </p>
        </a-col>
      </a-row>
    </div>
  </div>
</template>

<script>
import { getDistributingSummary } from '@/api/bonusDistributeServer'
import { fixedNumber } from '@/utils/util'
export default {
  name: 'SummaryBar',
  props: {
    rootUnitName: {
      type: String | Number,
      default: null
    },
    summaryUnitId: {
      type: String | Number,
      default: null
    },
    stateType: {
      type: String,
      default: 'distribute'
    },
    summaryTreeId: {
      type: String | Number,
      default: null
    },
    bizType: {
      type: String | Number,
      default: null
    },
    summaryNotDeep: {
      type: String | Number,
      default: null
    },
    yearlyRemark: {
      type: String | Number,
      default: null
    },
    floatRemark: {
      type: String | Number,
      default: null
    }
  },
  data() {
    return {
      showModal: false,
      bonus: 0,
      summary: {},
    }
  },
  watch: {
  },
  computed: {
    summaryVO() {
      return this.summary.summaryVO || {}
    }
  },
  created(){
    this.getData()
  },
  methods: {
    fixedNumber,
    bonusDetailsSplit(text) {
      // 截取前3个单元
      const sign = ','
      const textArr = text.split(sign)
      // 如果是重点关注模块，只展示第一个
      if (this.stateType === 'keepFocus') return textArr[0]
      if (textArr.length > 3) {
        return `${textArr[0]}，${textArr[1]}，${textArr[2]}等`
      } else {
        return text
      }
    },
    async getData() {
      const res = await getDistributingSummary({
        treeId: this.summaryTreeId,
        unitId: this.summaryUnitId,
        notDeep: Number.parseInt(this.summaryNotDeep)
      })
      if (res.code === 200) {
        this.summary = res.data
      } else {
        this.$message.error(res.msg)
      }
    },
    shareData() {
      return this.summary
    },
    update() {
      console.log('is update')
      this.getData()
    },
    viewDiffMembers(bonusType) {
      this.$router.push({
        path: '/bonusDistribute/searchMember',
        query: {
          treeId: this.summaryTreeId,
          unitId: this.summaryUnitId,
          bizType: this.bizType,
          bonusType,
          deep: true,
          difference: 1
        }
      })
    }
  }
}
</script>
<style lang="less" scoped>
.content-layout {
  .head-card {
    /deep/ .ant-row {
      > div {
        padding-right: 0 !important; 
        .long-data-block {
          overflow: hidden;
          text-overflow: ellipsis;
        }
        .special_text {
          margin-left: -1rem;
        }
      }
    }
    .col-divid {
      border-left: 1px solid #979797;
      height: 100%;
      width: 100%;
    }
    padding: 0 0.3rem;
      p {
          white-space: nowrap;    
          margin: 0 0 0.3rem;
          padding: 0;
          .desc {
              font-size: 0.8rem;
              color: #637282;
              margin-right: 0.2rem;
          }
          .context {
              margin-right: 0.2rem;
              font-size: 1.6rem;
              color: #494949;   
              white-space: nowrap;       
          }
          .context-sub {
            white-space: nowrap;     
          }
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

div.warning-bar {
  padding: 0.5rem !important;
  border-left: 1px solid @warningColor;
  border-radius: 0 6px 6px 0 !important;
  p {
    margin: 0;
  }
}

.obvious {
  color: #E02020 !important;
}
.unobvious {
  color: #00b627 !important;
}
.sub {
  font-size: 0.9rem;
}
</style>
