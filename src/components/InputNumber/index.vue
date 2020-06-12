<template>
  <div>
    <input 
      type="number" 
      class="ant-input" 
      v-model="input" 
      :style="{background: disabled ? '#f0f0f0' : '#fff'}"
      :title="title"
      :max="max"
      :min="min"
      :disabled="disabled"
      :placeholder="placeholder"
      @blur="blurEvent"
      @focus="focusEvent"
      @mousewheel="stopWhellScroll"
      @DOMMouseScroll="stopWhellScroll"
      @change="change"/>
      <div v-if="showWarning" class="required-tips">{{ requiredTips }}</div>
  </div>
</template>
<script>
import { isEmpty } from '@/utils/util'
export default {
  name: 'InputNumber',
  props: {
    value: {
      type: Number | String,
      default: null
    },
    disabled: { // 是否禁用
      type: Boolean,
      default: false
    },
    title: {
      type: String | Number,
      default: ''
    },
    max: {
      type: Number,
      default: Infinity
    },
    min: {
      type: Number,
      default: -Infinity
    },
    required: { // 必填
      type: Boolean,
      default: false
    },
    requiredTips: { // 空值提示
      type: String,
      default: '不能为空'
    },
    recordLastValue: { // 如果设为true, 当输入空值时, 强制填充上一个真值
      type: Boolean,
      default: false
    },
    placeholder: {
      type: String,
      default: ''
    }
  },
  data() {
    return {
      input: null,
      warningActive: false,
      showWarning: false,
      cached: null
    }
  },
  computed: {
  },
  watch: {
    value: {
      handler(_new, _old) {
        if (isEmpty(_new) && this.recordLastValue) {
          this.input = this.queryData(this.cached)
        } else {
          this.input = this.queryData(_new)
        }
      },
      immediate: true
    }
  },
  mounted() {
    this.storingInput()
  },
  methods: {
    // 当鼠标悬浮在 a-input-number 内，
    // 使用中键滚动的时候会失去对页面滚动条的控制
    // 所以需要禁用掉鼠标滚轮事件
    stopWhellScroll(evt) {
      evt = evt || window.event
      if (evt.preventDefault) {  
        // Firefox  
        evt.preventDefault()
        evt.stopPropagation()
      } else {  
        // IE  
        evt.cancelBubble = true
        evt.returnValue = false
      }  
      return false
    },
    focusEvent(evt) {
      this.storingInput()
      this.warningActive = true
      this.$emit('focus', this.queryData(evt.target.value))
    },
    change(evt) {
      this.limitVal(evt)
      this.tryRollback(evt.target.value)
      this.tryShowWarning(evt.target.value)
      this.$emit('changeData', this.queryData(evt.target.value))
      this.$emit('input', this.queryData(evt.target.value)) // 推给input组件处理空字串的问题
    },
    blurEvent(evt) {
      this.tryRollback(evt.target.value)
      this.tryShowWarning(evt.target.value)
      this.$emit('blur', this.queryData(evt.target.value))
    },
    storingInput() {
      this.cached = this.queryData(this.input)
    },
    tryShowWarning(val) {
      if (isEmpty(val) && this.warningActive &&　this.required && !this.recordLastValue) {
        this.showWarning = true
      } else {
        this.showWarning = false
      }
    },
    tryRollback(val) {
      if (isEmpty(val) && this.recordLastValue) {
        this.input = this.queryData(this.cached)
      }
    },
    limitVal(evt) {
      const val = this.queryData(evt.target.value)
      if (val > this.max) {
        evt.target.value = this.max
      }
      if (val < this.min) {
        evt.target.value = this.min
      }
    },
    queryData(val) {
      if (isEmpty(val)) {
        return null
      }

      if (Object.prototype.toString.call(val) === '[object String]') {
        return Number.parseFloat(val)
      }

      return val
    }
  }
}
</script>
<style lang="less" scoped>
input::-webkit-inner-spin-button {
  -webkit-appearance: none;
}
input::-webkit-outer-spin-button {
  -webkit-appearance: none;
}
.required-tips {
  color: red;
  font-size: 0.9rem;
  padding: 2px 0 0 2px;
}
</style>

