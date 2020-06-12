<template>
  <div>
    <div>
      <h4 v-if="warnRuleVoList">效率区间预警设置</h4>
      <a-row v-if="warnRuleVoList" :gutter="9">
        <a-col :md="2" :sm="24">
          <p class="center">效率等级</p>
        </a-col>
        <a-col :md="7" :sm="24">
          <p class="center">较预算增幅区间</p>
        </a-col>
      </a-row>
      <template v-for="(item, index) in warnRuleVoList">
        <a-row v-if="item.warningType === 2" :gutter="9" :key="index" class="hack-for-loop-row">
          <a-col :md="2" :sm="24">
            <span>{{ item.performanceLevel }}</span>
          </a-col>
          <a-col :md="3" :sm="24">
            <InputNumber
              v-model="item.beginInterval"
              :disabled="disEditByStatus"/>
              <span class="fixed-suffix">%</span>
          </a-col>
          <a-col :md="1" :sm="24">~</a-col>
          <a-col :md="3" :sm="24">
            <InputNumber
              v-model="item.endInterval" 
              :disabled="disEditByStatus"/>
            <span class="fixed-suffix">%</span>
          </a-col>
        </a-row>
      </template>
    </div>
    <div v-if="dataSet.warnRuleVoList" data-id="block-2">
      <h3 class="master-title">年薪制人员</h3>
      <a-row :gutter="9">
        <a-col :md="2" :sm="24">
          <p class="center">效率等级</p>
        </a-col>
        <a-col :md="7" :sm="24">
          <p class="center">较预算增幅区间</p>
        </a-col>
      </a-row>
      <template v-for="(item, index) in warnRuleVoList">
        <a-row v-if="item.warningType === 1" :gutter="9" :key="index" class="hack-for-loop-row">
          <a-col :md="2" :sm="24">
            <span>{{ item.performanceLevel }}</span>
          </a-col>
          <a-col :md="3" :sm="24">
            <InputNumber
              v-model="item.beginInterval" 
              :disabled="disEditByStatus"/>
            <span class="fixed-suffix">%</span>
          </a-col>
          <a-col :md="1" :sm="24">~</a-col>
          <a-col :md="3" :sm="24">
            <InputNumber
              v-model="item.endInterval" 
              :disabled="disEditByStatus"/>
            <span class="fixed-suffix">%</span>
          </a-col>
        </a-row>
      </template>
    </div>
  </div>
</template>

<script>
import { getDetail } from '@/api/creatingRuleServer'
import InputNumber from '@/components/InputNumber'
export default {
  name: 'EarlyWarningRule',
  components: {
    InputNumber
  },
  props: {
    dataSet: {
      type: Object,
      default: () => {}
    }
  },
  data() {
    return {
      loading: true,
      warnRuleVoList: []
    }
  },
  computed: {
    disEditByStatus() {
      // 60 70 80 90 不可编辑
      const map = [60, 70, 80, 90]
      return map.indexOf(Number.parseInt(this.dataSet.bonusPlanStatus)) > -1
    }
  },
  watch:{
  },
  mounted() {
    this.warnRuleVoList = this.sortintList(this.dataSet.warnRuleVoList)
  },
  methods: {
    update() {
      this.$emit('update', this.dataSet)
    },
    sortintList(warnRuleVoList) {
      const res = []
      warnRuleVoList.forEach((left, i) => {
        let j = warnRuleVoList.length - i
        while(j--) {
          const right = warnRuleVoList[j]
          if (left.sortId >= right.sortId) {
            res[j] = left
            res[i] = right
            break
          }
        }
      })
      return res
    },
    handleChange(value) {}
  }
}
</script>

<style lang="less" scoped>
.ant-pro-components-tag-select {
  /deep/ .ant-pro-tag-select .ant-tag {
    margin-right: 24px;
    padding: 0 8px;
    font-size: 14px;
  }
}
.ant-input-number {
  width: 90%;
}
.center {
  text-align: center;
}
.hack-for-loop-row {
  margin: 0 0 1rem 0;
  line-height: 200%;
  /deep/ .ant-col-sm-24 {
    text-align: center;
  }
}
.master-title {
  border-left: 2px solid #00b627;
  text-indent: 7px;
}
.fixed-suffix {    
  right: 1rem;
  position: absolute;
  top: 0;
  color: #999999;
  line-height: 2.6;
}
.ant-form {
  /deep/ label {
    font-size: 1rem;
  }
}
</style>
