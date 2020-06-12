<template>
  <div>
    <!-- 如果第一个节点为空节点，就不给任何操作按钮 -->
    <!-- <div v-if="isFirstNode() && isEmptyNode()">
    </div> -->
    <!-- 如果是顶级节点（顶级节点也必然是第一个节点），非空的话，只有查看按钮，因为顶级节点不需要分发 -->
    <!-- <div v-else-if="isTopNode()">
      <div v-if="isEmptyNode()"> </div>
      <div v-else><a-button @click="view()">查看</a-button></div>
    </div> -->
    <!-- 分发人节点 -->
    <div v-if="isDistributeNode()">
      <div v-if="canDistributing()"><a-button type="primary" @click="startDistribute()">开始分发</a-button></div>
      <div v-else-if="canRedistributing()"><a-button @click="startDistribute()" >重新分发</a-button></div>
      <!-- <div v-else-if="canViewByDistribute()"><a-button type="primary" @click="view()" ghost>查看</a-button></div> -->
      <div v-else><a-button @click="view()">查看</a-button></div>
      <!-- <div v-else> </div> -->
    </div>
    <!-- 被审核节点 -->
    <div v-else>
      <div v-if="canApproval()"><a-button type="primary" @click="approvalBarVisible = true" ghost>开始审核</a-button></div>
      <div v-else-if="canReApproval()"><a-button @click="approvalBarVisible = true" >重新审核</a-button></div>
      <!-- <div v-else-if="canViewByApproval()"><a-button type="primary" @click="view()" ghost>查看</a-button></div> -->
      <div v-else><a-button @click="view()">查看</a-button></div>
      <!-- <div v-else> </div> -->
    </div>

    <a-modal
      title="请确认操作"
      v-model="approvalBarVisible"
      :footer="null"
    >
      <a-row span="24" class="button-bar">
        <a-col span="8" style="text-align: center;"><a-button type="primary" ghost @click="startApproval();approvalBarVisible = false">查看详情</a-button></a-col>
        <a-col span="8" style="text-align: center;"><a-button @click="rejectModalVisiable = true;approvalBarVisible = false">直接驳回</a-button></a-col>
        <a-col span="8" style="text-align: center;"><a-button type="primary" @click="passApproval();approvalBarVisible = false">直接通过</a-button></a-col>
      </a-row>
    </a-modal>
    
    <reject-modal
      :visiable="rejectModalVisiable"
      @confirm="handleReject"
      @visiableEvent="
        val => {
          this.rejectModalVisiable = val
        }
      "
    />
  </div>
</template>
<script>
import RejectModal from '@/views/bonusDistribute/common/RejectModal'
import {
  approval
} from '@/api/bonusDistributeServer'
export default {
  name: 'OperationButton',
  components: {
    RejectModal
  },
  props: {
    // rootUnitId // 根节点的unitId
    // rootTreeId // 根节点的treeId
    rootTreeId: {
      type: Number | String,
      default: null
    },
    rootUnitId: {
      type: Number | String,
      default: null
    },
    rootUnitName: {
      type: Number | String,
      default: null
    },
    record: {
      type: Object,
      default: null
    },
    status: {
      type: String,
      default: null
    }
  },
  data() {
    return {
      loading: false,
      userId: null, 
      approvalBarVisible: false,
      rejectModalVisiable: false
    }
  },
  mounted(){
    const { userId } = this.$store.state.user
    this.userId = userId 
  },
  created() {
    
  },
  methods: {
    isFirstNode() {
      return this.record.level == 1
    },
    isTopNode() {
      return this.record.isTopNode === 1
    },
    isEmptyNode() {
      // isNullNode 1 为可分发节点， 2 为空节点（不需要分发）
      return this.record.isNullNode === 2
    },
    isDistributeNode() {
      return this.record.ownerId === this.userId
    },
    canDistributing() {
      // isNullNode 1 为可分发节点， 2 为空节点（不需要分发）
      return !this.isEmptyNode() && this.record.assignStatus === 10
    },
    canRedistributing() {
      // isNullNode 1 为可分发节点， 2 为空节点（不需要分发）
      return !this.isEmptyNode() && (this.record.assignStatus === 20 || this.record.assignStatus === 40)
    },
    isFatherDistributeNode() {
      return this.record.fatherOwnerId === this.userId
    },
    canApproval() {
      return this.record.assignStatus === 25 && this.isFatherDistributeNode()
    },
    canReApproval() {
      return this.record.assignStatus === 50 
      && (this.record.fatherAssignStatus === 10 || this.record.fatherAssignStatus === 20 || this.record.fatherAssignStatus === 40)
      && this.isFatherDistributeNode()
    },
    // canViewByDistribute() {
      // 空节点改为可查看@2020/1/15
      // if (this.isEmptyNode()) {
      //   return false
      // } else {
        // return ['审核中', '已通过'].includes(this.superiorStatusTxt())
      // }
    // },
    // canViewByApproval() {
    //   return ['已驳回', '已通过'].includes(this.subordinateStatusTxt())
    // },
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
    startDistribute() {
      this.$router.push({
        path: '/bonusDistribute/distributing',
        query: {
          totalMembers: Number.parseInt(this.record.totleFloatMembers) + Number.parseInt(this.record.totleYearlyMembers),
          rootTreeId: this.rootTreeId,
          rootUnitId: this.rootUnitId,
          rootUnitName: this.rootUnitName,
          rootAssignStatus: this.record.assignStatus,
          summaryTreeId: this.record.treeId,
          summaryUnitId: this.record.unitId,
          yearlyRemark: this.record.yearlyRemark,
          floatRemark: this.record.floatRemark,
          bizType: 'allocation',
          summaryNotDeep: 1, // 汇总头部【分发】时只查询当前节点
          treeId: this.record.treeId,
          unitId: this.record.unitId,
          status: this.status, // pending | handled
          deep: false, // 人员列表【分发】时只查询当前节点
          type: 'distribute', // 分发
        }
      })
    },
    startApproval() {
      this.$router.push({
        path: '/bonusDistribute/distributing',
        query: {
          totalMembers: Number.parseInt(this.record.totleFloatMembers) + Number.parseInt(this.record.totleYearlyMembers),
          rootTreeId: this.rootTreeId,
          rootUnitId: this.rootUnitId,
          rootUnitName: this.rootUnitName,
          rootAssignStatus: this.record.assignStatus,
          summaryTreeId: this.record.treeId,
          summaryUnitId: this.record.unitId,
          yearlyRemark: this.record.yearlyRemark,
          floatRemark: this.record.floatRemark,
          bizType: 'appr',
          summaryNotDeep: 0, // 汇总头部【审核】时带出所有子节点数据
          treeId: this.record.treeId,
          unitId: this.record.unitId,
          deep: true, // 人员列表【审核】时带出所有子节点数据
          type: 'approval', // 审核
          status: this.status, // pending | handled
        }
      })
    },
    view() {
      this.$router.push({
        path: '/bonusDistribute/distributing',
        query: {
          totalMembers: Number.parseInt(this.record.totleFloatMembers) + Number.parseInt(this.record.totleYearlyMembers),
          rootTreeId: this.rootTreeId,
          rootUnitId: this.rootUnitId,
          rootUnitName: this.rootUnitName,
          rootAssignStatus: this.record.assignStatus,
          summaryTreeId: this.record.treeId,
          summaryUnitId: this.record.unitId,
          yearlyRemark: this.record.yearlyRemark,
          floatRemark: this.record.floatRemark,
          treeId: this.record.treeId,
          unitId: this.record.unitId,
          summaryNotDeep: 0, // 汇总头部【查看】时带出所有子节点数据
          bizType: this.status === 'pending' ? 'appr' : 'allocation',
          deep: true, // 人员列表【查看】时带出所有子节点数据
          status: this.status, // pending | handled
          type: 'readOnly', // 查看
        }
      })
    },    
    handleReject(rejectReason) {
      this.$confirm({
        title: '提示',
        content: `请确认是否将 "${this.record.unitName}" 社会调查报告分发驳回？`,
        okText: '确认',
        cancelText: '取消',
        onOk: () => {
          this.rejectConfirm(rejectReason)
        },
        onCancel: () => {
          console.log('Cancel')
        }
      })
    },
    async rejectConfirm(rejectReason) {
      // message 备注/意见信息
      // opType	 操作类型，1 驳回；2 通过
      // treeId	 社会调查报告单元树ID
      // unitId	 社会调查报告单元ID
      this.loading = true
      const res = await approval({
        message: rejectReason || '',
        opType: 1,
        treeId: this.record.treeId,
        unitId: this.record.unitId,
      })
      if (res.code === 200) {
        this.$message.success('驳回成功')
        this.$emit('update')
      } else {
        this.$message.error('驳回失败')
      }
      this.loading = false
    },
    async passApproval() {
      // opType	 操作类型，1 驳回；2 通过
      // treeId	 社会调查报告单元树ID
      // unitId	 社会调查报告单元ID
      this.loading = true
      const res = await approval({
        opType: 2,
        treeId: this.record.treeId,
        unitId: this.record.unitId,
      })
      if (res.code === 200) {
        this.$message.success('审核成功')
        this.$emit('update')
      } else {
        this.$message.error('审核失败')
      }
      this.loading = false
    },
  }
}
</script>
<style lang="less" scoped>
.button-bar{  
  button {
    min-width: 7.14rem;
    height: 2.85rem;
  }  
}
</style>