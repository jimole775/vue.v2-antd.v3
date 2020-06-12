<template>
  <a-popover
    trigger="click"
    v-model="feedbackVisible"
    placement="right"
    overlayClassName="feedback-window-wrapper"
    :arrowPointAtCenter="true"
    :overlayStyle="{ width: '420px' }"
  >
    <template slot="content">
      <div class="feedback">
        <a-spin :spinning="feedbackLoading">
          <a-row type="flex" justify="center" align="middle">
            <a-col :md="5" :sm="24">
              <h3>反馈记录</h3>
            </a-col>
            <a-col :md="18" :sm="24">
              <h3><a href="javascript: void(0)" @click="handleClickOpen(true)">查看全部</a></h3>
            </a-col>
            <a-col :md="1" :sm="24" align="right">
              <h3><a-icon @click="feedbackVisible = false" type="close" /></h3>
            </a-col>
          </a-row>
          <div>
            <h4>社会调查报告单元：{{ unitName }}</h4>
            <p>
              <a-icon type="exclamation-circle" :style="{ color: '#f7b500' }" />
              请在HR将您的反馈信息调整到系统后,再确认人员名单是否正确
            </p>
            <a-form :form="feekForm" @submit="handleClickSubmitFeedback">
              <div>
                <a-form-item>
                  <a-textarea
                    style="margin:14px 0 7px 0;"
                    placeholder="请填写您要反馈的信息"
                    :rows="2"
                    v-decorator="['message', { rules: [{ required: true, message: '请输入正确的反馈信息!' }] }]"
                  />
                </a-form-item>
              </div>
              <a-row>
                <a-col :md="24" :sm="24" align="center">
                  <a-button type="primary" html-type="submit">
                    提交
                  </a-button>
                </a-col>
              </a-row>
            </a-form>
            <div class="message-list">
              <a-list itemLayout="horizontal" :dataSource="dataMessage">
                <a-list-item slot="renderItem" slot-scope="item">
                  <a-list-item-meta :description="item.content">
                    <span slot="title">{{ item.date }}</span>
                  </a-list-item-meta>
                </a-list-item>
              </a-list>
            </div>
          </div>
        </a-spin>
      </div>
    </template>
    <a href="javascript: void(0)" title="人员调整" class="operation-icon" @click="feedbackVisible = !feedbackVisible">
      <!-- <i class="font_family icon-btn_normal_adjust1"> </i> -->
      <a-icon 
          style="
            font-size: 18px; 
            margin-top:5px;
            padding:3px;
            margin-bottom:0;
          "
          title="反馈"
          type="customer-service" 
      />
    </a>
  </a-popover>
</template>

<script>
import {
  getDistributingSummary,
  getDistributingMemberList,
  save,
  approval,
  distributeCompletion,
  getFeedbackList,
  getSaveFeedback
} from '@/api/bonusDistributeServer'
export default {
  name: 'FeedbackModal',
  props: {
    unitName: {
      type: String,
      default: null
    },
    planId: {
      type: String | Number,
      default: null
    },
    queryParam: {
      type: Object,
      default: null
    }
  },
  data() {
    return {
      feedbackLoading: false,
      feedbackVisible: false, //反馈功能框是否打开
      dataMessage: [],
    }
  },
  watch: {
  },
  computed: {
  },
  beforeCreate() {
    this.feekForm = this.$form.createForm(this, { name: 'feekback' })
  },
  mounted() {
    this.handleClickOpen()
  },
  methods: {
    handleClickOpen(isAll = false) {
      let params = {
        bonusUnitId: this.queryParam.unitId,
        bonusTreeId: this.queryParam.treeId,
        feedbackType: 1,
        feedbackStatus: 0 //默认查看未处理
      }

      //查看全部删除条件
      if (isAll == true) {
        delete params.feedbackStatus
      }

      this.feedbackLoading = true

      getFeedbackList(params).then(res => {
        let { code, data, msg } = res
        if ((code == 200, msg == 'success')) {
          this.dataMessage = data.map((res, index) => {
            return {
              index: res.pkFeedbackId,
              date: res.createdDate,
              content: res.feedbackRemark
            }
          })
          this.feedbackLoading = false
        }
      })
    },
    handleClickSubmitFeedback(e) {
      e.preventDefault()
      this.feekForm.validateFields((err, values) => {
        if (!err) {
          let params = {
            bonusPlanId: this.planId,
            bonusTreeId: this.queryParam.treeId,
            bonusUnitId: this.queryParam.unitId,
            feedbackRemark: values.message,
            feedbackType: 1,
            feedbackStatus: 0
          }

          this.feedbackLoading = true

          getSaveFeedback(params).then(res => {
            let { code, msg } = res
            if (code == 200 && msg == 'success') {
              this.handleClickOpen()
              this.$message.success('信息提交成功！')
              this.feekForm.resetFields()
            }
            this.feedbackLoading = false
          })
        }
      })
    },
  }
}
</script>
<style lang="css">
.ant-popover {    
  /* 为了使提示语不换行 */
  width: 33rem !important;
}
</style>
<style lang="less" scoped>
.message-list {
  min-height: 260px;
  .ant-list.ant-list-split {
    /deep/ div.ant-spin-container {
      max-height: 300px;
      overflow: auto;
    }
  }
}
.operation-icon {
  // color: #777B87;
  text-decoration: none;
  > i {
    font-size: 24px;
    margin-left: 10px;
    margin-bottom: 12px;
    color: #fff;
    border: 0;
    border-radius: 100%;
    background: #777b87;
    &:hover {
      background: #2dc84d;
    }
    &::before {
      position: relative;
      z-index: 1;
    }
  }
}
</style>
