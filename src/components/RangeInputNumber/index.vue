<template>
  <div>
    <InputNumber 
    v-model="min" 
    :placeholder="'请输入'"
    :min="-99999" :max="99999" 
    @focus="minFocusOn = true"
    @blur="minFocusOn = false; verifyLimitValue()"
    style="width: 33%;display:inline-block;"/>&nbsp;{{suffix}}
    &nbsp;~&nbsp;
    <InputNumber 
    v-model="max" 
    :placeholder="'请输入'"
    :min="-99999" :max="99999" 
    @focus="maxFocusOn = true"
    @blur="maxFocusOn = false; verifyLimitValue()"
    style="width: 33%;display:inline-block;"/>&nbsp;{{suffix}}
  </div>
</template>

<script>
import { isEmpty } from '@/utils/util'
import InputNumber from '@/components/InputNumber'
export default {
  name: 'RangeInputNumber',
  components: {
    InputNumber
  },
  props: {
    value: {
      type: String | Number,
      default: ''
    },
    suffix: {
      type: String,
      default: ''
    }
  },
  data() {
    return {
      range: '',
      min: '',
      max: '',
      minFocusOn: false,
      maxFocusOn: false,
    }
  },
  watch: {
    value(val) {
      this.range = val
      const regx = new RegExp(this.suffix, 'g')
      const min = this.range.replace(regx, '').split('~')[0]
      const max = this.range.replace(regx, '').split('~')[1]
      this.min = isEmpty(min) ? '' : Number.parseFloat(min)
      this.max = isEmpty(max) ? '' : Number.parseFloat(max)
    },
    min(val) {
      if (isEmpty(val) && isEmpty(this.max)) {
        this.range = ''
        return this.$emit('changeData', this.range)
      }
      if (isEmpty(val) || isNaN(val)) {
        val = ''
      }
      
      if (this.range) {
        const min = val
        const regx = new RegExp(this.suffix, 'g')
        const max = Number.parseFloat(this.range.replace(regx, '').split('~')[1])
        this.range = `${min}${this.suffix}~${max}${this.suffix}`
      } else {
        this.range = `${val}${this.suffix}~`
      }
      this.$emit('changeData', this.range)
    },
    max(val) {
      if (isEmpty(val) && isEmpty(this.min)) {
        this.range = '' 
        return this.$emit('changeData', this.range)
      }
      if (isEmpty(val) || isNaN(val)) {
        val = ''
      }

      if (this.range) {
        const regx = new RegExp(this.suffix, 'g')
        const min = Number.parseFloat(this.range.replace(regx, '').split('~')[0])
        const max = val
        this.range = `${min}${this.suffix}~${max}${this.suffix}`
      } else {
        this.range = `~${val}${this.suffix}`
      }

      this.$emit('changeData', this.range)
    }
  },
  computed: {
  },
  methods: {
    verifyLimitValue() {
      if (!isEmpty(this.min) && !isEmpty(this.max) && !this.minFocusOn && !this.maxFocusOn) {
        if (this.min > this.max) {
          this.min = this.max
        }
      }
    },
  },
}
</script>
<style lang="less" scoped>
</style>
