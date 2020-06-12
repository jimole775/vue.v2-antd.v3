<template>
<div class="main-content" style="padding-bottom: 5rem">
  <a-breadcrumb separator=">">
    <!-- <a-breadcrumb-item>首页</a-breadcrumb-item> -->
    <a-breadcrumb-item>
      <a href="javascript:void(0)" @click="$router.go(-1)">规则列表</a>
    </a-breadcrumb-item>
    <a-breadcrumb-item>
      设置规则
    </a-breadcrumb-item>
  </a-breadcrumb>
  <div class="content-layout">
    <div class="table-page-search-wrapper">
      <a-form layout="inline">
        <a-row :gutter="24">
          <a-col :md="6" :sm="24">
            <a-form-item label="规则名称" required>
              <a-input v-model="dataSet.ruleName" :disabled="disEditByStatus" placeholder="请输入标题名称" />
            </a-form-item>
          </a-col>
          <!-- <a-col :md="3" :sm="24">
            <a-form-item>
              <a href="javascript:void(0)" >复用已有规则</a>
            </a-form-item>
          </a-col> -->
          <a-col :md="18" :sm="24">
            <a-form-item label="关联计划">
              <!-- <span >/setbonusallocationplan/viewBonusAllocationPlan?planId=**</span> -->
              <router-link v-if="dataSet.planName" :to="`/setbonusallocationplan/viewBonusAllocationPlan?planId=${dataSet.planId}`">{{ dataSet.planName }}</router-link>
              <span v-else> 无 </span>
            </a-form-item>
          </a-col>
        </a-row>
      </a-form>
    </div>
  </div>
  <div class="content-layout">
    <a-tabs :defaultActiveKey="tabsActive" @change="tabsChange">
      <a-tab-pane tab="预警规则" key="1">
        <a-form layout="inline">
          <div data-id="block-1">
            <h3 class="master-title">浮动制人员</h3>
            <a-row :gutter="24">
              <a-col :md="8" :sm="24">
                <!-- <a-form-item label="较去年实体年终奖增幅预警"> -->
                <a-form-item label="较上年实体月均增幅预警">
                  <div style="position:relative;">
                  <InputNumber
                    v-model="dataSet.annualBonusWarning" 
                    :disabled="disEditByStatus"
                    :min="-100" 
                    :max="100" 
                    />
                  <span class="fixed-suffix" style="top: 0.5rem;">%</span>
                  </div>
                </a-form-item>
              </a-col>
              <!-- <a-col :md="8" :sm="24">
                <a-form-item label="较预算增幅预警">
                  <InputNumber 
                    v-model="dataSet.budgetWarning" 
                    :disabled="disEditByStatus"
                    :min="-100" 
                    :max="100" 
                    /><span class="fixed-suffix">%</span>
                </a-form-item>
              </a-col> -->
            </a-row>
          </div>
          <div>
            <EarlyWarningRule ref="EarlyWarningRule" :dataSet="dataSet" @update="asyncDataSet"/>
          </div>
        </a-form>
      </a-tab-pane>
      <a-tab-pane tab="预算规则（浮动制人员）" key="2">
        <div>
          <div data-id="blocket-1" class="blocket">
            <h3 class="master-title">年终奖基数</h3>
            <a-form layout="inline">
              <a-row :gutter="24">
                <a-col :md="24" :sm="24">
                  <a-form-item label="年终奖基准值">
                    <!-- <InputNumber 
                      v-model="dataSet.annualBonusValue" 
                      :disabled="disEditByStatus"
                      /><span class="fixed-suffix">元</span> -->
                      <div class="reference-value">
                        <a-input-number
                          v-model="dataSet.annualBonusValue"
                          :disabled="disEditByStatus"
                          :formatter="value => `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')"
                          :parser="value => value.replace(/\$\s?|(,*)/g, '')"
                          :precision="2"
                          :max="999999999999"
                        />
                        <!-- <span class="fixed-suffix">元</span> -->
                        <span>基准单位：{{measure}}</span>
                      </div>
                  </a-form-item>
                </a-col>
              </a-row>
            </a-form>
          </div>
          <div v-if="dataSet.budgetRuleVoList || dataSet.valueRuleVoList" class="blocket fixed-blocket">
            <BudgetCoefficient ref="BudgetCoefficient" :dataSet="dataSet" @update="asyncDataSet" @reload="reload"/>
          </div> 
          <div v-if="dataSet.highLevelVO && dataSet.highBonusVO" class="blocket">
            <ReserveCoefficient ref="ReserveCoefficient" :dataSet="dataSet" @update="asyncDataSet"/>
          </div> 
        </div>
      </a-tab-pane>
    </a-tabs>
  </div>
  <div class="footer">
    <a-row class="footer-content">
      <a-col :md="24" :sm="24" align="center">
        <a-button :loading="delLoading" class="btn-primary" type="primary" :disabled="disEditByStatus" @click="showDelModal = true">删除</a-button>
        <a-button :loading="loading" class="btn-primary" type="primary" :disabled="disEditByStatus" @click="save">保存</a-button>
      </a-col>
    </a-row>
  </div>
  <a-modal title="提示操作" v-model="showDelModal" @ok="delConfirm">
    <h3>请确认是否删除?</h3>
  </a-modal>
</div>
</template>

<script>
import { getDetail, save, del } from '@/api/creatingRuleServer'
import EarlyWarningRule from './EarlyWarningRule'
import BudgetCoefficient from './BudgetCoefficient'
import ReserveCoefficient from './ReserveCoefficient'
import InputNumber from '@/components/InputNumber'
let dataSetModel = {
  annualBonusValue: 0, 
  annualBonusWarning: 0,
  budgetWarning: 0,
  createdBy: 0,
  createdDate: '',
  highLevelBudgetRuleVO: [],
  infoBudgetRuleVO: {},
  pkRuleId: 0,
  rankRuleVoList: [],
  ruleName: '',
  userJob: '',
  userName: '',
  valueRuleVoList: [],
  warnRuleVoList: []
}

export default {
  name: 'RulesEditManager',
  components: {
    BudgetCoefficient,
    ReserveCoefficient,
    EarlyWarningRule,
    InputNumber,
  },
  data () {
    return {
      queryParam: {
        ruleName: '',
      },
      tabsActive: '2',
      loading: false,
      delLoading: false,
      showDelModal: false,
      firstLoad: false,
      dataSet: {},
      id: null,
    }
  },
  computed: {
    // tabsActive() {
      // return '2'
    // },
    disEditByStatus() {
      // 60 70 80 90 不可编辑
      const map = [60, 70, 80, 90]
      return map.indexOf(Number.parseInt(this.dataSet.bonusPlanStatus)) > -1
    },
    measure(){
      let unitArr = ['万','十万','百万','千万','亿','十亿','百亿','千亿']
      let maxNum = this.dataSet.annualBonusValue
      if(typeof maxNum == 'number'){
          let digit = parseInt(maxNum).toString().length  //获取位数
          if(digit > 4){
            return unitArr[digit - 5]
          }else{
            return '----'
          }
      }else{
        return '----'
      }
      
    }
  },
  watch: {},
  created() {
    this.id = this.$route.query.id
    if (this.id) {
      this.getData()
    }
  },
  methods: {
    async delConfirm() {
      if (this.id) {
        this.delLoading = true
        const res = await del(this.dataSet.pkRuleId)
        if (res.code === 200) {
          this.$message.success('删除成功')
          this.$router.push('/creatingRules/RuleList')
        } else {
          this.$message.warning(res.msg)
        }
        this.delLoading = false
      } else {
        this.$message.error('删除失败，ID丢失')
      }
    },
    delCancel() {

    },
    async save() {
      this.loading = true
      // ReserveCoefficient 涉及到字段的重新构造，双向绑定失效
      // 所以，父层的保存操作，也需要更新 ReserveCoefficient 的数据
      this.$refs.ReserveCoefficient && this.$refs.ReserveCoefficient.update()
      const failureTips = this.vaildData()
      if (failureTips.length) {
        this.loading = false
        return this.$warning({
          title: '提示',
          content: failureTips
        })
      }
      const res = await save(this.dataSet)
      if (res.code === 200) {
        // this.$message.success('保存成功')
        this.$success({
          title: '保存成功',
          content: res.msg
        })
        if (!this.id) {
          this.$router.push('/creatingRules/RuleList')
        }
      } else {
        this.$error({
          title: '保存失败',
          content: res.msg
        })
        // this.$message.error('保存失败')
      }
      this.loading = false
    },
    vaildData() {
      let failureTips = ''
      const nameMap = {
        1: "年薪制",
        2: "浮动制",
      }
      this.dataSet.warnRuleVoList && this.dataSet.warnRuleVoList.forEach((item, index) => {
        if (Number.parseFloat(item.beginInterval) > Number.parseFloat(item.endInterval)) {
          failureTips = `${nameMap[item.warningType]} - 效率等级 - '${item.performanceLevel}' 填写有误，请检查！`
        }
      })
      return failureTips
    },
    getData() {
      return new Promise(async(resolve, reject) => {
        this.loading = true
        const res = await getDetail(this.id)
        this.dataSet = res.data
        this.loading = false
        return resolve(this.dataSet)
      })
    },
    async reload(callback) {
      const data = await this.getData()
      callback && callback(data)
    },
    tabsChange(key) {
      this.tabsActive = key
    },
    asyncDataSet(data) {
      this.dataSet = { ...data }
    }
  }
}
</script>
<style lang="less">
.reference-value{
  .ant-input-number-handler-wrap{
    display: none;
  }
  .ant-input-number{
    width:170px !important;
    margin-right:24px;
    position: relative;
    &:after{
      content:'元';
      position: absolute;
      right:12px;
      top:0;
      line-height:2.3;
      font-size:13px;
    }
  }
  .ant-input-number-input{
    padding-right:40px;
  }
}
</style>
<style lang="less" scoped>
.center {
  text-align: center;
}
.master-title {
  border-left: 2px solid #00b627;
  text-indent: 7px;
  margin: 1rem 0;
}
.blocket {
  margin-top: 2rem;
}
.fixed-blocket {
  /* height: 39rem; */
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

.fixed-suffix {
  right: 1rem;
  position: absolute;
  top: 0;
  color: #999999;
  line-height: 2;
}
.ant-form {
  /deep/ label {
    font-size: 1rem;
  }
}
</style>
