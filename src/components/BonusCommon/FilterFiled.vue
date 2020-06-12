<template>
  <div class="bonus-filter-filed">
    <p>筛选字段</p>
    <div>
      <p>已选条件（共1个）</p>
      <ul class="list-select">
        <li :key="index" v-for="(item,index) in FList">
          负责人：
          <span :id="index">{{ item.name }}</span>
          <a-icon type="close" @click="delFiled(index)" />
        </li>
      </ul>
      <p>全部条件（4个）</p>
      <div class="form-data">
        <a-form layout="inline">
          <a-row :gutter="24">
            <a-col :span="12">
              <a-form-item label="社会调查报告单元">
                <a-input v-model="formDT.name" placeholder="请输入名称" />
              </a-form-item>
            </a-col>
            <a-col :span="12">
              <a-form-item label="层级">
                <a-input v-model="formDT.level" placeholder="层级" />
              </a-form-item>
            </a-col>
          </a-row>
          <a-row :gutter="24">
            <a-col :span="12">
              <a-form-item label="负 责 人">
                <a-input v-model="formDT.person" placeholder="负 责 人" />
              </a-form-item>
            </a-col>
            <a-col :span="12">
              <a-form-item label="状态">
                <a-input v-model="formDT.stutas" placeholder="状态" />
              </a-form-item>
            </a-col>
          </a-row>
          <a-row :gutter="24">
            <a-col :span="24" align="center">
              <a-button class="btn-primary" type="cannel" @click="cannel">取消</a-button>
              <a-button
                class="btn-primary"
                type="primary"
                @click="addFiled"
                style=" margin-left: 8px"
              >添加</a-button>
            </a-col>
          </a-row>
        </a-form>
      </div>
    </div>
  </div>
</template>

<script>
const FList = []
export default {
  name: 'FilterFiled', // 展开树表

  props: {
    dataTreeList: {
      // 父数据
      type: Array,
      default: []
    }
  },
  data() {
    return {
      formDT: {}, //数据
      FList: FList //已经添加数据
    }
  },
  methods: {
    addFiled() {
      // console.log('添加：')
      const { formDT, FList } = this
      const newData = {
        level: formDT.level,
        name: formDT.name,
        person: formDT.person,
        stutas: formDT.stutas
      }
      this.FList = [...FList, newData] // 数据更新到表
      this.emit()
    },
    delFiled(index) {
      // console.log('删除已选：')
      let checkedList = this.FList
      checkedList.splice(index, 1) // 删除当前元素选择框的数据
      this.FList = checkedList
      this.emit()
    },
    emit() {
      this.$emit('getFilterData', this.FList)
    },
    cannel() {
      // console.log('取消：', this.formDT)
    }
  },
  watch: {
    // value(value) {
    //   console.log('你选中的值：', value)
    // }
  }
}
</script>
<style lang="less" scoped>
.bonus-tree {
  height: 500px;
}
ul,
li,
ol {
  list-style: none;
}
.list-select {
  position: relative;
  li {
    min-width: 80px;
    max-width: 130px;
    padding: 3px 4px;
    margin: 5px;
    position: relative;
    background: #efefef;
    display: inline-block;

    i.anticon {
      position: absolute;
      top: -6px;
      right: -6px;
      &:hover {
        color: red;
      }
    }
  }
}
</style>