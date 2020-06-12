<template>
  <div class="select-field">
    <div style="display:none;">
      <ul class="list">
        <li :key="index" v-for="(item, index) in topList">
          <span class="column" :title="item" :id="index">{{ item.title }}</span>
          <span
            class="close"
            :id="index"
            v-if="index > (disabledValueAttr.length -1)"
            @click="delCheck(index)"
          >&times;</span>
        </li>
      </ul>
    </div>

    <div class="top">
      <span style="float:right">已选{{ checkedList.length }}列</span>
      全部列（{{ columnsData.length}}）
      <span
        @click="onCheckAllChange"
        :checked="checkAll"
        :style="{ cursor: 'pointer'}"
        v-if="showCheck"
      >全选</span>
      <span
        @click="cancelAllChange"
        :style="{ cursor: 'pointer','margin-left':'10px'}"
        v-if="!showCheck"
      >取消全选</span>
    </div>
    <!-- :value="defaultValue" :defaultValue="defaultValue"-->
    <div>
      <a-form :gutter="12" :span="12">
        <a-checkbox-group
          class="select-group"
          :defaultValue="defaultValueAttr"
          :value="valueAttr"
          v-model="checkedList"
          @change="onChange"
          style="width:100%;"
        >
          <!-- :options="plainOptions" -->

          <a-row :gutter="24" :span="24">
            <a-col :span="24">
              <span class="info-type">个人信息</span>
            </a-col>
          </a-row>
          <a-row :gutter="12" :span="12">
            <a-col :span="6" :key="index" v-for="(item, index) in selectData.list1">
              <a-checkbox :value="item.dataIndex" :disabled="item.disabled">{{ item.title }}</a-checkbox>
            </a-col>
          </a-row>
          <a-row :gutter="24" :span="24">
            <a-col :span="24">
              <span class="info-type">组织信息</span>
            </a-col>
          </a-row>
          <a-row :gutter="24" :span="24">
            <a-col :span="6" :key="index" v-for="(item, index) in selectData.list2">
              <a-checkbox :value="item.dataIndex" :disabled="item.disabled">{{ item.title }}</a-checkbox>
            </a-col>
          </a-row>
          <a-row :gutter="24" :span="24">
            <a-col :span="24">
              <span class="info-type">职务信息</span>
            </a-col>
          </a-row>
          <a-row :gutter="24" :span="24">
            <a-col :span="6" :key="index" v-for="(item, index) in selectData.list3">
              <a-checkbox :value="item.dataIndex" :disabled="item.disabled">{{ item.title }}</a-checkbox>
            </a-col>
          </a-row>
          <a-row :gutter="24" :span="24">
            <a-col :span="24">
              <span class="info-type">分发重要信息</span>
            </a-col>
          </a-row>
          <a-row :gutter="24" :span="24">
            <a-col :span="6" :key="index" v-for="(item, index) in selectData.list4">
              <a-checkbox :value="item.dataIndex" :disabled="item.disabled">{{ item.title }}</a-checkbox>
            </a-col>
          </a-row>
          <a-row :gutter="24" :span="24">
            <a-col :span="24">
              <span class="info-type">薪酬信息</span>
            </a-col>
          </a-row>
          <a-row :gutter="24" :span="24">
            <a-col :span="6" :key="index" v-for="(item, index) in selectData.list5">
              <a-checkbox :value="item.dataIndex" :disabled="item.disabled">{{ item.title }}</a-checkbox>
            </a-col>
          </a-row>
          <a-row :gutter="24" :span="24">
            <a-col :span="24">
              <span class="info-type">备注信息</span>
            </a-col>
          </a-row>
          <a-row :gutter="24" :span="24">
            <a-col :span="6" :key="index" v-for="(item, index) in selectData.list6">
              <a-checkbox :value="item.dataIndex" :disabled="item.disabled">{{ item.title }}</a-checkbox>
            </a-col>
          </a-row>
          <a-row :gutter="24" :span="24">
            <a-col :span="24">
              <span class="info-type">其他列</span>
            </a-col>
          </a-row>
          <a-row :gutter="24" :span="24">
            <a-col :span="6" :key="index" v-for="(item, index) in selectData.list0">
              <a-checkbox :value="item.dataIndex" :disabled="item.disabled">{{ item.title }}</a-checkbox>
            </a-col>
          </a-row>
        </a-checkbox-group>
      </a-form>
    </div>
  </div>
</template>

<script>
export default {
  name: 'selectFiled', // 首页消息
  // ['title', 'list']
  props: {
    title: {
      type: String,
      default: ''
    },
    list: {
      type: Array,
      default: null
    },
    columnsData: {
      // 父数据
      type: Array,
      default: null
    }
  },
  data() {
    return {
      checkedList: [], // 选择的数据
      plainOptions: [], // 配置表
      disabledValueAttr: [], // 固定列
      defaultValueAttr: [], // 默认选中
      checkAllValue: [], // 全选
      valueAttr: [],
      topList: [], // 头部内容
      selectData: {
        list0: [],
        list1: [],
        list2: [],
        list3: [],
        list4: [],
        list5: [],
        list6: []
      }, // 选择项数据
      indeterminate: true,
      checkAll: false,
      showCheck: true // 是否
    }
  },
  methods: {
    delCheck(index) {
      let checkedList = this.checkedList
      checkedList.splice(index, 1) // 删除当前元素选择框的数据
      console.log('删除数据：', index, '-----', checkedList)
      this.checkedList = checkedList

      let topList = this.topList
      topList.splice(index, 1) // 删除当前元素 top 的数据
      console.log('删除数据：', index, '-----', topList)
      this.topList = topList
      this.onChange(this.checkedList)
    },
    onChange(data) {
      console.log(`onchange数据:`, data)
      // debugger
      if (data.length < 44) {
        this.showCheck = true // 如果字段全选为选中 ，则置为false 。
      }
      if (data.length == 44) {
        this.showCheck = false // 如果字段全选为选中 ，则置为false 。
      }
      // this.indeterminate = !!this.checkedList.length && this.checkedList.length < this.plainOptions.length // 判断数据长度
      this.checkAll = this.checkedList.length === this.plainOptions.length // 选中项目
      this.valueAttr = this.checkedList.slice(this.defaultValueAttr.length) // 头部数据过滤
      let newTopList = []
      const { checkedList, columnsData } = this
      columnsData.map(item => {
        item.defaultChecked = false // 先把原字段全部置为不选择
      })
      checkedList.map(item => {
        columnsData.map(object => {
          if (object.dataIndex === item) {
            if (item === 'empName') {
              object.disabled = true //姓名不可选
            }
            object.defaultChecked = true // 已经选择的为选择项
            newTopList.push(object)
          }
        })
      }) // 把包含的过滤出来
      this.topList = newTopList
      console.log('选择后的数据：', newTopList)
      this.$emit('selectColumnsData', { saveTop: newTopList, saveColumns: columnsData })
    },
    onCheckAllChange(e) {
      this.checkedList = this.checkAllValue
      this.onChange(this.checkedList)
      this.showCheck = false
      // console.log(`父传过来的组件:`, this.columnsData)
      // console.log(`选中的数据：`, this.checkedList, `e:`, e)
      // Object.assign(this, {
      //   checkedList: e.target.checked ? this.plainOptions : [],
      //   indeterminate: false,
      //   checkAll: e.target.checked
      // })
    },
    cancelAllChange(e) {
      // 取消全选
      const CancelPlainOptionsOld = [...this.plainOptionsOld]
      this.plainOptions = CancelPlainOptionsOld
      this.checkedList = ['key', 'empName']
      this.onChange(this.checkedList)
      this.showCheck = true
    }
  },
  watch: {
    onChange(newValue, oldValue) {
      // 监听事件
      console.log(newValue, oldValue)
    }
  },
  mounted() {
    //初始状态
    let parentDT = [],
      defaultValueDT = [],
      checkAllValueDT = [],
      disabledValueAttr = [],
      topList = []

    console.log('ParentColumnsData:', this.columnsData)

    this.columnsData.map(item => {
      item.label = item.title
      item.value = item.dataIndex
      // item.disabled = item.disabled // 是否禁选
      // item.defaultChecked = item.defaultChecked // 是否默认选中
      if (item.dataIndex == 'empName') {
        item.disabled = true
      }
      parentDT.push(item) // 取到的名称

      if (item.defaultChecked) {
        // 默认选中的项
        defaultValueDT.push(item.dataIndex)
        topList.push(item)
      }
      if (item.disabled) {
        // 固定列 不可选
        disabledValueAttr.push(item.dataIndex)
      } else {
        checkAllValueDT.push(item.dataIndex) // 未选择数据
      }
      //要显示的数据分离
      if (item.infoType == 0) {
        this.selectData.list0.push(item)
      } else if (item.infoType == 1) {
        this.selectData.list1.push(item)
      } else if (item.infoType == 2) {
        this.selectData.list2.push(item)
      } else if (item.infoType == 3) {
        this.selectData.list3.push(item)
      } else if (item.infoType == 4) {
        this.selectData.list4.push(item)
      } else if (item.infoType == 5) {
        this.selectData.list5.push(item)
      } else if (item.infoType == 6) {
        this.selectData.list6.push(item)
      }
    })

    console.log('转换后的数据：', parentDT, defaultValueDT)

    this.plainOptions = parentDT // 父类传过来的可选数据
    this.plainOptionsOld = parentDT
    this.defaultValueAttr = defaultValueDT // 默认选中
    this.disabledValueAttr = disabledValueAttr // 固定列
    this.checkedList = defaultValueDT // 双向绑定数据
    this.checkAllValue = disabledValueAttr.concat(checkAllValueDT) // 全选数据
    this.topList = topList // 头部内容
    console.log('转换后的数据：', parentDT, defaultValueDT, checkAllValueDT)
    if (defaultValueDT.length == 44) {
      this.showCheck = false // 如果字段全选为选中 ，则置为false 。
    }
  }
}
</script>

<style lang="less" scoped>
.info-type {
  font-size: 12px;
  padding: 5px 10px;
  margin: 10px 0;
  color: #fff;
  background: #00b050;
  display: inline-block;
}
.select-field {
  ul,
  li {
    list-style: none;
  }

  .list {
    vertical-align: top;
    width: 630px;
    display: inline-block;
    li {
      margin: 0 10px 10px 0;
      padding: 5px 20px 1px 10px;
      border-radius: 4px;
      display: inline-block;
      position: relative;
      color: #51595f;
      background: #f0f0f0;
      span.close {
        position: absolute;
        top: -1px;
        right: 9px;
        i.anticon-close {
          font-size: 5px;
        }
      }
      &:hover {
        span.close {
          color: #f00;
          z-index: 1;
          cursor: pointer;
        }
      }
    }
  }
  .select-group {
    width: 860px;
    /deep/ label.ant-checkbox-group-item {
      width: 180px;
    }
  }
}
</style>
