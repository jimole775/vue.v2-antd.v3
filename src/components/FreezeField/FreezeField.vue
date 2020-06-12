<template>
  <a-modal width="800px" v-model="showModal" @ok="handleFieldConfirm">
    <template slot="title">
      <div class="ant-modal-title">
        {{ title }}
        <a href="javascript: void(0)" @click="clear()">清空</a>
      </div>
    </template> 
    <div class="select-field">
      <!-- <a-radio-group :options="optionsWithDisabled" disabled @change="onChange3" v-model="value3" /> -->
      <a-checkbox-group class="select-group" :options="optionsList" v-model="checkedFields" @change="onChange" />
    </div>
  </a-modal>
</template>

<script>
const model = {
  disabled: true, // 禁止选中项
  checked: true, // 操作选中项
  title: '抬头',
  width: 100,
  value: 'key',
  key: 'id'
}

import { getCache, saveCache } from '@/api/customFieldServer'
export default {
  name: 'FreezeField',
  props: {
    visiable: {
      type: Boolean,
      default: false,
      required: true
    },
    title: {
      type: String,
      default: '自定义冻结列'
    },
    relativeColumns: {
      type: Array,
      default: null,
      required: true
    },
    // moduleName用于localstorage缓存的时候作为标记
    moduleName: {
      type: String,
      default: 'FreezeField',
      required: true
    },
    hasCheckBox: {
      type: Boolean,
      default: false
    },
    // 默认选中的字段
    defaultFields: {
      type: Array,
      default: []
    },
    // 默认禁用的字段
    freezeFields: {
      type: Array,
      default: []
    },
    version: { // 版本号，可重置服务器留存的数据
      type: String,
      default: '1.0.0'
    },
  },
  computed: {
    colLength() {
      return this.relativeColumns.length
    }
  },
  watch: {
    visiable(val) {
      this.showModal = val
    },
    showModal(val) {
      this.$emit('visiableEvent', val)
    },
    colLength(_new, _old) {
      if (_new !== _old) {
        console.log('is changed cols, then fetch data again from server')
        this.init()
      }
    }
  },
  data() {
    return {
      showModal: false,
      optionsList: [], // 选项数据
      checkedFields: [] // 已选项的字段数组--用于提供给antd组件进行双向绑定
    }
  },
  mounted() {
  },
  created() {
    this.init()
  },
  methods: {
    clear() {
      this.checkedFields = []
      this.optionsList.forEach((optionItem) => {
        optionItem.checked = false
        if (optionItem.fixed === 'right') optionItem.checked = true
        if (this.checkedFields.includes(optionItem.dataIndex)) optionItem.checked = true
      })
    },
    async init() {
      const { checkedFields, version } = await this.getCache()
      this.buildOptionList()
      this.coverByCache(checkedFields, version)
      this.confirm()
    },
    coverByCache(checkedFields, version) {
      if (checkedFields && version == this.version) {
        this.checkedFields = [...checkedFields]
        this.version = version
        this.optionsList.forEach((optionItem) => {
          optionItem.checked = false
          if (optionItem.fixed === 'right') optionItem.checked = true
          if (this.checkedFields.includes(optionItem.dataIndex)) optionItem.checked = true
        })
      }
    },
    handleFieldConfirm() {
      this.showModal = false
      this.confirm()
    },
    onChange(checkeds) {
      this.checkedFields = checkeds
      // this.$emit('changeEvent', this.checkedFields)
    },
    confirm() {
      this.setcols()
      /** 组件内不能修改 props 入参，只能用 $emit 把结果推给上级进行修改 */
      // this.requeueCols()
      this.saveCache()
      // this.calcWidth()
      this.$emit('changeEvent', this.checkedFields)
    },
    calcWidth() {
      const optionsList = this.optionsList
      this.scrollConfig.x = 0
      optionsList.forEach(optionItem => {
        if (optionItem.checked) {
          this.scrollConfig.x += optionItem.width ? optionItem.width : 0
        }
      })
      if (this.hasCheckBox) this.scrollConfig.x += 60
    },
    async getCache() {
      const usrInfo = this.$store.state.user
      const { code, data, msg } = await getCache({
        pageKey: this.moduleName,
        userId: usrInfo.userId + '' // 用户ID
      })
      if (code === 200) {
        return this.seriStoreData(data ? data.markFiled : '')
      } else {
        this.$message.error(msg)
      }
    },
    async saveCache() {
      const usrInfo = this.$store.state.user
      const res = await saveCache({
        markFiled: JSON.stringify({ checkedFields: this.checkedFields, version: this.version }),
        pageKey: this.moduleName,
        userId: usrInfo.userId + '' // 用户ID
      })
      if (res.code === 200) {
        // this.$message.success('保存成功')
      } else {
        this.$message.error(res.msg)
      }
    },
    seriStoreData(dataString) {
      return dataString ? JSON.parse(dataString) : {}
    },
    setcols() {
      this.relativeColumns.forEach((relativeItem) => {
        if (relativeItem.fixed === 'right') return
        if (this.freezeFields.includes(relativeItem.dataIndex)) return 
        delete relativeItem.fixed // 默认无固定值
        if (this.checkedFields.includes(relativeItem.dataIndex)) {
          relativeItem.fixed = 'left' // 选中后定位左固定
        }
      })
    },
    buildOptionList() {
      this.optionsList = []
      // 添加 【a-checkbox-group】组件 需要的控制字段
      this.relativeColumns.forEach((item, index) => {
        this.optionsList.push({
          disabled: item.disabled ? item.disabled : false, // 禁止选中项
          checked: item.checked ? item.checked : false, // 操作选中项
          label: item.title ? item.title : item.title_model, // 选项描述
          fixed: item.fixed ? item.fixed : false,
          value: item.dataIndex
        })
      })

      this.optionsList.forEach(item => {
        /**设置默认显示项*/
        item.checked = !!item.fixed // 如果默认有fixed值，就设置为默认选中
        if (this.defaultFields.includes(item.value)) {
          item.checked = true
        }

        /**设置固定字段*/
        item.disabled = item.fixed === 'right' // 如果默认是右固定，就设置为禁止项
        if (this.freezeFields.includes(item.value)) {
          item.disabled = true
        }
      })
    }
  }
}
</script>

<style lang="less" scoped>
.select-field {
  .optionsList {
    vertical-align: top;
    width: 630px;
    display: inline-block;
    li {
      margin-right: 10px;
      padding: 3px 10px 3px 10px;
      display: inline-block;
      position: relative;
      background: #f0f0f0;
      border-radius: 4px;
      margin: 0.3rem;
      &:hover {
        background: #e1e1e1;
        span.close {
          color: #f00;
          z-index: 1;
          cursor: pointer;
        }
      }
      /deep/ i {
        cursor: pointer;
        font-size: 0.5rem;
      }
    }
  }
  .select-group {
    // width: 300px;
    /deep/ label.ant-checkbox-group-item {
      width: 33.33%;    
      line-height: 2rem;
      margin: 0;
      padding: 0;
    }
  }
}
</style>
