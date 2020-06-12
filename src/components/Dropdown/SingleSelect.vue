<template>
  <a-select 
    allowClear
    mode="default"
    :showArrow="showArrow"
    :showSearch="showSearch"
    :placeholder="placeholder"
    :value="selectedValue"
    :disabled="disabled"
    :filterOption="filterOption"
    @focus="getData"
    @search="search"
    @change="change"
    >
    <slot name="defaultOption"></slot>  
    <a-select-option
      v-for="item in dataSet"
      :key="item[getField]"
      :title="item[showField]"
      :value="item[getField]" >
      {{ item[showField] }}
    </a-select-option>
  </a-select>
</template>
<script>
import { axios } from '@/utils/request'
import { urlParam } from '@/utils/util'
import debounce from 'lodash/debounce'
export default {
  name: 'SingleSelect',
  props: {
    url: { // API路径 *必填
      type: String,
      required: true,
    },
    value: { // 选中的项的value *必填
      type: Number | String | Array,
      default: undefined,
      required: true
    },
    method: {
      type: String,
      default: 'get'
    },
    params: { // 接口参数
      type: Object,
      default: () => {return {}}
    },
    // showArrow: { // 是否显示箭头
    //   type: Boolean,
    //   default: true
    // },
    showSearch: { // 是否可搜索
      type: Boolean,
      default: false
    },
    autoFetch: {
      type: Boolean,
      default: true
    },
    disabled: { // 是否禁用
      type: Boolean,
      default: false
    },
    remoteFilter: {
      type: Boolean,
      default: false
    },
    showField: { // 需要显示的字段的字段名
      type: String,
      default: 'text'
    },
    getField: { // 需要输出的字段的字段名
      type: String,
      default: 'value'
    },
    placeholder: {
      type: String,
      default: '请选择'
    }
  },
  data() {
    return {
      dataSet: [],
      showArrow: true,
      // autoFetch: true,
      selectedValue: undefined,
    }
  },
  computed: {
  },
  watch: {
    /**监听输入，包括选择框和输入框 */
    value(newVal) {
      if (newVal !== this.selectedValue) {
        // 默认值必须为undefined
        this.selectedValue = newVal === '' ? undefined : newVal
      }
    },
  },
  async mounted() {
    this.getData = debounce(this.getData, 500)
    // this.showSearch 的值决定展示形态
    if (this.showSearch) {
      this.showArrow = false
      // this.autoFetch = false
    }
    if (this.autoFetch) {
      this.getData()
    }
    this.selectedValue = this.value || undefined
  },
  methods: {
    async getData() {
      let res
      if (this.method === 'get') {
        res = await axios.get(`${this.url}${urlParam(this.params)}`)
      } else {
        res = await axios.post(this.url,this.params)
      }
      if (res.data && res.data.list) {
        this.dataSet = [...res.data.list]
      } else if (res.data) {
        this.dataSet = [...res.data]
      }
    },
    filterOption(val, target) {
      const title = target.componentOptions.propsData.title || ''
      return title.includes(val.trim())
    },
    search(val) {
      if (this.remoteFilter && val) {
        this.params[this.showField] = val
        this.getData()
      }
    },
    blurFocus() {
      // this.remoteMethod('')
      // console.log('focus')
    },
    change(val) {
      let checkedItem = {}
      this.selectedValue = val
      this.dataSet.forEach((item, index) => {
        if (item[this.getField] === val) {
          checkedItem = item
        }
      })
      this.$emit('changeData', val, checkedItem[this.showField], checkedItem, this.dataSet)
      this.$emit('input', val) // 推给input组件处理空字串的问题
    }
  }
}
</script>
