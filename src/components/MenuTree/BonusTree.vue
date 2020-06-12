<template>
  <div class="bonus-tree">
    <a-table
      rowKey="key"
      :bordered="false"
      :columns="columnsTree"
      :dataSource="menuTreeData"
      :pagination="false"
      :scroll="{ y: 450 }"
      :rowClassName="record => rowClassName(record)"
      :expandedRowKeys="expandedRowKeys"
      key="{ record => record.key }"
      @expand="expandicon"
    >
      <template slot="bonusUnitId" slot-scope="text, record">
        <div class="bonusTreeName" :class="{'tree-no-child-text':record.children.length==0}">
          <i v-if="record.children && record.children.length" class="font_family icon-icon_layer2"></i>
          <i v-else class="font_family icon-icon_layer"></i>
          <span
            class="bonusTreeName-inner-content"
            :title=" record.title+'-'+text"
          >{{ record.title }}</span>
        </div>
      </template>
    </a-table>
  </div>
</template>

<script>
import { string } from 'prop-types'
const columnsTree = [
  {
    title: '树层级结构',
    dataIndex: 'bonusUnitId',
    width: 400,
    scopedSlots: { customRender: 'bonusUnitId' }
  }
]
export default {
  name: 'BonusTree', // 展开树表 :treeDefaultExpandAll="treeDefaultExpandAll"

  props: {
    menuTreeData: {
      // 父数据
      type: Array,
      default: []
    },
    // menuTreeKey: {
    //   // 父数据-关键词
    //   type: String,
    //   default: ''
    // },
    expandedChildRowKeys: {
      // 父数据-关键词
      type: Array,
      default: []
    }
  },
  data() {
    return {
      columnsTree,
      value: undefined,
      treeDefaultExpandAll: true,
      showSearch: true,
      expandedRowKeys: []
    }
  },
  methods: {
    // 折叠展开图标点击事件
    expandicon(expanded, record) {
      console.log('折叠展开图标:', expanded, record)
      // debugger
      if (expanded) {
        this.expandedRowKeys.push(record.key)
      } else {
        let expandedRowKeys = this.expandedRowKeys.filter(RowKey => RowKey !== record.key)
        this.expandedRowKeys = expandedRowKeys
      }
    },
    rowClassName(record) {
      // console.log('行数据：', record)
      let classname = 'table-row'
      if (record.children.length == 0) classname = 'table-row tree-no-child'
      return classname
    }
  },
  mounted() {
    console.log('展开key：', this.expandedChildRowKeys)

    this.expandedRowKeys = this.expandedChildRowKeys
  },
  watch: {
    // value(value) {
    //   console.log('你选中的值：', value)
    // },
    // menuTreeKey: value => {
    //   console.log('你的值menuTreeKey：', value)
    // }
  }
}
</script>
<style lang="less" scoped>
.bonus-tree {
  height: 500px;
  // /deep/ table,
  /deep/ .ant-table .ant-table-content .ant-table-thead > tr > th,
  /deep/ .ant-table .ant-table-content .ant-table-tbody > tr > td {
    border: none;
  }
}
/deep/ .tree-no-child {
  .ant-table-row-collapsed:after {
    content: '-';
  }
}
/deep/ .table-row {
  > td:nth-child(1) {
    // display: flex;
    // align-items: center;
  }
  .bonusTreeName {
    line-height: 2;
    display: inline-block;
    // align-items: center;
    .font_family {
      vertical-align: middle;
    }
    .bonusTreeName-inner-content {
      max-width: 600px;
      display: inline-block;
      white-space: nowrap;
      text-overflow: ellipsis;
      overflow: hidden;
      vertical-align: middle;
    }
    > i {
      font-size: 1.4rem;
      margin-right: 0.4rem;
      cursor: pointer;
    }
  }
}
</style>