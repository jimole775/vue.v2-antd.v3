<template>
  <a-modal :title="title" width="800px" v-model="showModal" @ok="handleFieldConfirm">
    <div class="select-field">
      <!-- <div>
        已选择（{{ alreadyCheckedView && alreadyCheckedView.length }}）：
        <ul class="options-list">
          <li v-for="(item, index) in alreadyCheckedView" :key="index">
            <span class="column">{{ item.label }}</span>
            <sup
              v-if="disabledFields && disabledFields.indexOf(item.value) === -1"
              @click="offCheck(item, index)"
            >
              <a-icon type="close" />
            </sup>
          </li>
        </ul>
      </div> -->
      <div>
        全部列（{{ optionsLength }}）
        <a
          href="javascript: void(0)"
          :checked="checkAll"
          :style="{ cursor: 'pointer' }"
          @click="onCheckAllChange"
        >{{ optionsLength === checkedFields.length ? '取消全选' : '全选' }}</a>
      </div>
      <div v-for="(groupItem, index) in groupOptionsList" :key="index">
        <h3 class="group-title"><span>{{ groupItem.name }}：</span></h3>
        <a-checkbox-group
          class="select-group"
          :options="groupItem['options']"
          v-model="checkedFields"
          @change="onChange"
        />
      </div>
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
// import { groupInfo } from '../../views/bonusDistribute/distributing/data.config'
// import { mapState, mapActions, mapGetters } from 'vuex'
export default {
  name: 'CustomField',
  props: {
    visiable: {
      type: Boolean,
      default: false,
      required: true
    },
    relativeColumns: {
      type: Array,
      default: null,
      required: true
    },
    // moduleName用于localstorage缓存的时候作为标记
    moduleName: {
      type: String,
      default: 'CustomFiled',
      required: true
    },
    // 由 a-table 组件决定的，必须绑定一个scroll对象
    // scrollConfig: {
    //   type: Object,
    //   default() {
    //     return { x: 1500, y: 300 }
    //   },
    //   required: true
    // },
    title: {
      type: String,
      default: '自定义列表'
    },
    groupInfo: {
      type: Object,
      default: null
    },
    // 因为checkbox不再columns内定义，只能当作固定值处理，
    // 如果标记有checkbox，那么在计算宽度时，加 60 px
    hasCheckBox: {
      type: Boolean,
      default: false
    },
    // 默认选中的字段
    defaultFields: {
      type: Array,
      default: null
    },
    // 默认禁用的字段
    disabledFields: {
      type: Array,
      default: null
    },
    version: { // 版本号，可重置服务器留存的数据
      type: String,
      default: '1.0.0'
    },
  },
  computed: {
    optionsLength() {
      let res = 0
      this.groupOptionsList.forEach((groupItem) => {
        res += groupItem['options'].length || 0
      })
      return res
    }
  },
  watch: {
    visiable(val) {
      this.showModal = val
    },
    showModal(val) {
      this.$emit('visiableEvent', val)
    }
  },
  data() {
    return {
      showModal: false,
      groupOptionsList: [ // 分组选项
        // {
        //   name: '',
        //   options: []
        // }
      ],
      // alreadyCheckedView: [], // 已选项--用作头部的陈列视图
      checkedFields: [], // 已选项的字段数组
      checkAll: false // 全选标记
    }
  },
  mounted() {},
  async created() {
    const { checkedFields, version } = await this.getCache()
    this.buildOptionList()
    this.coverByCache(checkedFields, version)
    this.confirm()
  },
  methods: {
    shareData() {
      return this.checkedFields
    },
    handleFieldConfirm() {
      this.showModal = false
      this.confirm()
    },
    offCheck(item, index) {
      // this.alreadyCheckedView.splice(index, 1)
      this.checkedFields.splice(this.checkedFields.indexOf(item.value), 1)
    },
    onChange(checkedFields) {
      this.checkedFields = checkedFields
      // this.alreadyCheckedView = []
      this.groupOptionsList.forEach((groupItem) => {
        groupItem['options'].forEach((optionItem) => {
          optionItem.checked = false
          this.checkedFields.forEach(checkedField => {
            if (optionItem.value === checkedField) {
              optionItem.checked = true
              // this.alreadyCheckedView.push({ ...optionItem })
            }
          })
        })
      })
      this.$emit('changeEvent', this.checkedFields)
    },
    onCheckAllChange(e) {
      // 如果一个都没选，或者只选了几个，就进行全选
      if (!this.checkedFields.length || this.checkedFields.length < this.optionsLength) {
        // this.alreadyCheckedView = []
        this.checkedFields = []
        this.groupOptionsList.forEach((groupItem) => {
          groupItem['options'].forEach((optionItem) => {            
            // 填充 冻结的列
            optionItem.checked = true
            // this.alreadyCheckedView.push({ ...optionItem })
            this.checkedFields.push(optionItem.value)
          })
        })
      } else {
        // 否则，进行置空
        this.reset()
      }

      this.$emit('changeEvent', this.checkedFields)
    },
    confirm() {
      this.checkedFields && this.saveCache(this.checkedFields)
      this.$emit('changeEvent', this.checkedFields)
    },
    reset() {
      this.checkedFields = []
      this.groupOptionsList &&
      this.groupOptionsList.forEach((groupItem) => {
        groupItem['options'].forEach((optionItem) => {            
          // 填充 冻结的列
          if (this.disabledFields && this.disabledFields.indexOf(optionItem.value) > -1) {
            optionItem.checked = true
            this.checkedFields.push(optionItem.value)
          } else {
            optionItem.checked = false
          }
        })
      })
    },
    // 回滚到默认字段
    rollback() {
      this.checkedFields = []
      const defaultCheckedFields = this.defaultFields.concat(this.disabledFields)
      this.groupOptionsList &&
      this.groupOptionsList.forEach((groupItem) => {
        groupItem['options'].forEach((optionItem) => {
          if (defaultCheckedFields.indexOf(optionItem.value) > -1) {
            optionItem.checked = true
            this.checkedFields.push(optionItem.value)
          } else {
            optionItem.checked = false
          }
        })
      })
    },
    async getCache(optionsList) {
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
      // "createdTime": "2019-11-25T12:05:28.994Z",
      // "markFiled": "string",
      // "pageKey": "string",
      // "pkId": 0,
      // "userId": "string"
      const usrInfo = this.$store.state.user
      const res = await saveCache({
        // markFiled: JSON.stringify({ optionsList, delItems, version: this.version }),
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
    coverByCache(checkedFields, version) {
      if (checkedFields && version == this.version) {
        this.checkedFields = [...checkedFields]
        // this.alreadyCheckedView = []
        this.version = version
        this.groupOptionsList.forEach((groupItem) => {
          groupItem['options'].forEach((optionItem) => {            
            optionItem.checked = false
            if (optionItem.disabled) optionItem.checked = true
            if (this.checkedFields.includes(optionItem.dataIndex)) optionItem.checked = true
            // if (optionItem.checked) this.alreadyCheckedView.push(optionItem)
          })
        })
      }
    },
    seriStoreData(dataString) {
      return dataString ? JSON.parse(dataString) : {}
    },
    buildOptionList() {
      // 添加 【a-checkbox-group】组件 需要的控制字段
      this.relativeColumns.forEach((item, index) => {
        // item.__index__ = index // 标记序号，方便排序
        item.disabled = item.disabled ? item.disabled : !!item.fixed // 禁止选中项
        item.checked = item.checked ? item.checked : true // 操作选中项
        item.label = item.title ? item.title : item.title_model // 选项描述
        item.value = item.dataIndex // 选项字段值
      })
      const columns = JSON.parse(JSON.stringify(this.relativeColumns))
      if (this.groupInfo) {
        Object.keys(this.groupInfo).forEach((groupName, groupIndex) => {
          this.groupOptionsList.push({
            name: groupName,
            options: [],
          })
          const groupKeys = this.groupInfo[groupName]
          columns.forEach((colItem) => {
            let i = groupKeys.length
            while(i--) {
              const key = groupKeys[i]
              if (colItem.dataIndex === key) {
                this.groupOptionsList[groupIndex]['options'].push(colItem)
                break
              }
            }
          })
        })
      } else {
        this.groupOptionsList[0] = {}
        this.groupOptionsList[0]['name'] = '基础选项'
        this.groupOptionsList[0]['options'] = columns
      }
      
      /** 设置默认显示项 */
      if (this.defaultFields) {
        this.groupOptionsList.forEach((groupItem) => {
          groupItem['options'].forEach((optionItem) => {
            optionItem.checked = false
            if (this.defaultFields.includes(optionItem['dataIndex'])) {
              // this.alreadyCheckedView.push(optionItem)
              this.checkedFields.push(optionItem['dataIndex'])
              optionItem.checked = true
            }
          })
        })
      }

      /** 设置禁止操作字段 */
      if (this.disabledFields) {
        this.groupOptionsList.forEach((groupItem) => {
          groupItem['options'].forEach((optionItem) => {
            if (this.disabledFields.includes(optionItem['dataIndex'])) {
              optionItem.disabled = true
            }
          })
        })
      }

    }
  }
}
</script>

<style lang="less" scoped>
.select-field {
  .options-list {
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
  .select-group.ant-checkbox-group {
    width: 100%;
    /deep/ label.ant-checkbox-group-item {
      width: 33.33%;
      margin-right: 0;
    }
  }
}
.group-title {
  margin-top: 1rem;
  span {
    background: #00B050;
    color: #fff;
    padding: 0.2rem 0.6rem 0.1rem 1.2rem;
    font-size: 1.1rem;
  }
}
</style>
