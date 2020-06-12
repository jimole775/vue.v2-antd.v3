<template>
  <div>
    <!-- 顶级节点 -->
    <div v-if="isTopNode()">
      <a-badge :status="statusIcon()" />
      <span>{{ topNodeStatusTxt() }}</span>
    </div>
    <!-- 分发人的空节点 -->
    <div v-else-if="isDistributeNode() && isEmptyNode()">
      <a-badge :status="statusIcon()" />
      <span>{{ superiorEmptyNodeStatusTxt() }}</span>
      <span v-if="record.assignStatus === 40">
        <a-popover title="驳回原因">
          <template slot="content">
            <div style="width:11rem;">{{ record.treeComment }}</div>
          </template>
          <a-icon type="message" style="color: #32d637"/>
        </a-popover>
      </span>
    </div>
    <!-- 分发人的非空节点 -->
    <div v-else-if="isDistributeNode() && !isEmptyNode()">
      <a-badge :status="statusIcon()" />
      <span>{{ superiorStatusTxt() }}</span>
      <span v-if="record.assignStatus === 40">
        <a-popover title="驳回原因">
          <template slot="content">
            <div style="width:11rem;">{{ record.treeComment }}</div>
          </template>
          <a-icon type="message" style="color: #32d637"/>
        </a-popover>
      </span>
    </div>
    <!-- 被审核的节点 -->
    <div v-else>
      <a-badge :status="statusIcon()" />
      <span>{{ subordinateStatusTxt() }}</span>
      <span v-if="record.assignStatus === 40">
        <a-popover title="驳回原因">
          <template slot="content">
            <div style="width:11rem;">{{ record.treeComment }}</div>
          </template>
          <a-icon type="message" style="color: #32d637"/>
        </a-popover>
      </span>
    </div>
  </div>
</template>
<script>
export default {
  name: 'StatusContent',
  props: {
    record: {
      type: Object,
      default: null
    }
  },
  data() {
    return {
      loading: false,
    }
  },
  methods: {
    isTopNode() {
      return this.record.isTopNode === 1
    },
    isEmptyNode() {
      return this.record.isNullNode === 2
    },
    isDistributeNode() {
      const { userId } = this.$store.state.user
      // 非空节点显示 分发状态，空节点显示 审核状态
      return this.record.ownerId === userId
    },
    statusIcon() {
      // success | error | warning
      // 10: '待分发',
      // 20: '已分发',
      // 25: '审核中',
      // 40: '被驳回',
      // 50: '已通过'
      // 10: '分发中',
      // 20: '未送审',
      // 25: '待审核',
      // 40: '已驳回',
      // 50: '已通过'
      const map = {
        '10': 'warning',
        '20': 'success',
        '25': 'warning',
        '40': 'error',
        '50': 'success'
      }
      return map[this.record.assignStatus]
    },
    topNodeStatusTxt() {
      return this.record.assignStatus === 50 ? '已完成' : '待提交'
    },
    superiorEmptyNodeStatusTxt() {
      // 可分发但是是空节点的节点状态
      const statMap = {
        10: '待提交',
        20: '待提交',
        25: '审核中',
        40: '被驳回',
        50: '已通过'
      }
      return statMap[this.record.assignStatus]
    },
    superiorStatusTxt() {
      // 可分发的节点状态
      const statMap = {
        10: '待分发',
        20: '已分发',
        25: '审核中',
        40: '被驳回',
        50: '已通过'
      }
      return statMap[this.record.assignStatus]
    },
    subordinateStatusTxt() {
      // 可审核节点状态
      const statMap = {
        10: '未送审',
        20: '未送审',
        25: '待审核',
        40: '已驳回',
        50: '已通过'
      }
      return statMap[this.record.assignStatus]
    },
  }
}
</script>