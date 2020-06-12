<template>
  <div class="main-content distribute-module" style="overflow:hidden">
    <a-breadcrumb separator=">">
      <!-- <a-breadcrumb-item>首页</a-breadcrumb-item> -->
      <a-breadcrumb-item>
        <a href="javascript:void(0)" @click="$router.go(-2)">社会调查报告单元列表</a>
      </a-breadcrumb-item>
      <a-breadcrumb-item>
        <a href="javascript:void(0)" @click="$router.go(-1)">{{`${queryParam.status === 'pending' ? '待' : '已'}`}}处理社会调查报告单元</a>
      </a-breadcrumb-item>
      <a-breadcrumb-item>{{ `${queryParam.type === 'keepFocus' ? '重点关注人员' : '分发社会调查报告单元'}` }}</a-breadcrumb-item>
    </a-breadcrumb>
    <SummaryBar
      ref="SummaryBar"
      :bizType="queryParam.bizType"
      :stateType="queryParam.type"
      :summaryNotDeep="queryParam.summaryNotDeep"
      :summaryTreeId="queryParam.summaryTreeId"
      :summaryUnitId="queryParam.summaryUnitId"
      :rootUnitName="queryParam.rootUnitName"
      :floatRemark="queryParam.floatRemark"
      :yearlyRemark="queryParam.yearlyRemark"
    />
    <div class="content-layout">
      <div style="position: relative">
        <a-tabs :defaultActiveKey="tabsActive" @change="tabsChange">
          <a-tab-pane :tab="`浮动制人员(${this.floatMembers.total || 0})`" key="2"></a-tab-pane>
          <a-tab-pane :tab="`年薪制人员(${this.fixedMembers.total || 0})`" key="1"></a-tab-pane>
        </a-tabs>
        <a
          v-if="canAjustFocusMember"
          href="javascript: void(0)"
          @click="uploadModalVisiable = true"
          style="position: absolute; bottom: 2rem; right: 2rem;"
        >
          + 添加重点关注人员
        </a>
      </div>
      <div class="operation-bar">
        <a-row :gutter="24">
          <a-col :md="1" :sm="24">
            <a
                href="javascript: void(0)"
                title="筛选人员"
                class="operation-icon"
                style="position:relative"
                @click="filterModalVisiable = true"
              >
                <i class="font_family icon-btn_normal_screen"></i>
                <div v-if="filtersLength" class="badge-pop">{{ filtersLength }}</div>
              </a>
          </a-col>
          <a-col :md="1" :sm="24">
            <a
              href="javascript: void(0)"
              title="冻结列表"
              class="operation-icon"
              @click="freezeFieldModalVisiable = true"
            >
              <i class="font_family icon-btn_normal_Frozen"></i>
            </a>
          </a-col>
          <a-col :md="1" :sm="24">
            <a
              href="javascript: void(0)"
              title="自定义列"
              class="operation-icon"
              @click="fieldsModalVisiable = true"
            >
              <i class="font_family icon-btn_normal_batch"></i>
            </a>
          </a-col>
          <a-col :md="1" :sm="24" v-if="queryParam.type !== 'readOnly'">
            <a
              href="javascript: void(0)"
              title="批量分发金额"
              class="operation-icon"
              @click="openBatchEditorModal"
            >
              <i class="font_family icon-btn_normal_custom"></i>
            </a>
          </a-col>
          <a-col :md="1" :sm="24" v-if="canAjustFocusMember">
            <a
              href="javascript: void(0)"
              title="删除重点关注人员"
              class="operation-icon"
              @click="deleteFocusMembers()"
            >
              <i class="font_family icon-btn_normal_delete"></i>
            </a>
          </a-col>
          <a-col :md="14" :sm="24">
            <FeedbackModal
              :unitName="unitName"
              :planId="planId"
              :queryParam="queryParam"
            />
          </a-col>
          <!-- <a-col :md="2" :sm="24"> -->
            <!-- <a-button class="operation-bar-none-btn" :disabled="cancelQueryStatusCanEdit" @click="cancelQueryStatus"
            >取消筛选</a-button>-->
          <!-- </a-col> -->
          <!-- <a-col :md="3" :sm="24"> -->
          <!-- <a-button
              class="operation-bar-none-btn"
              :disabled="showAllFieldsCanEdit()"
              @click="showAllFields"
          >切换至完整列表</a-button>-->
          <!-- <a-button
              v-if="!showAllFieldsCanEdit()"
              class="operation-bar-none-btn"
              @click="showAllFields"
            >切换至完整列表</a-button>
            <a-button
              v-else
              class="operation-bar-none-btn"
              @click="rollbackFields"
          >默认列表</a-button>-->
          <!-- </a-col> -->
        </a-row>
      </div>
      <a-table
        rowKey="empNumber"
        :loading="loading"
        :columns="columnsPlan"
        :dataSource="dataPlan"
        :pagination="pagination"
        :rowSelection="{ selectedRowKeys: selectedRowKeys, onChange: onSelectChange }"
        :scroll="scrollConfig"
        :style="{ width: scrollConfig.x + 'px', maxWidth:'100%' }"
        @change="handleTableChange"
      >
        <span slot="preBonusMoneyTitle" class="important-field">
          利{{preOrAfterTax === 1 ? '前' : '后'}}实体社会调查报告(万)
          <br />
          <span>(下级的意见)</span>
        </span>
        <span slot="assigneeJudgeBonusTitle" class="important-field">
          利{{preOrAfterTax === 1 ? '前' : '后'}}实体社会调查报告(万)
          <br />
          <span>(最新意见)</span>&nbsp;
          <a-popover title="提示">
            <template slot="content">
              <div>
                <span>“最新意见”指的是【当前处理人】出示的意见：</span><br>
                <span>1.如果在分发阶段，指的是您出示的意见</span><br>
                <span>2.如果在审核阶段，指的是最新审批人确认的审批意见</span><br>
              </div>
            </template>
            <a-icon type="question-circle" />
          </a-popover>
        </span>
        <span slot="currApprBonusMoneyTitle" class="important-field">
          利{{preOrAfterTax === 1 ? '前' : '后'}}实体社会调查报告(万)
          <br />
          <span>(我的意见)</span>
        </span>
        <span slot="financeJudgeBonusTitle">利{{preOrAfterTax === 1 ? '前' : '后'}}社会调查报告(报告)</span>
        <template slot="empName" slot-scope="text, record">
          <span>{{ `${text}(${record['empNumber']})` }}</span>
        </template>
        <template slot="empLevelName" slot-scope="text, record">
          <span v-if="text">{{ text }}</span>
          <span v-else>{{ record['empLevel'] }}</span>
        </template>
        <template slot="difference" slot-scope="text, record">
          <!-- {{ record.isOverBudget === 1 ? '是' : '否'}} -->
          {{ overBonusTips(record, record.currApprBonusMoney).length ? '是' : '否'}}
        </template>
        <template slot="upLevel" slot-scope="text">
          <span v-if="text">{{ text === 1 ? '是' : '否' }}</span>
        </template>
        <template slot="taxDepartmentName" slot-scope="text, record">
          <span v-if="text">{{ text }}</span>
          <span v-else>{{ record['taxDepartment'] }}</span>
        </template>
        <template slot="taxUnitName" slot-scope="text, record">
          <span v-if="text">{{ text }}</span>
          <span v-else>{{ record['taxUnit'] }}</span>
        </template>
        <template slot="empJobName" slot-scope="text, record">
          <span v-if="text">{{ text }}</span>
          <span v-else>{{ record['empJob'] }}</span>
        </template>
        <template slot="payTaxSalary1" slot-scope="text">
          <span >{{ fixedNumber(text)(2) }}</span>
        </template>
        <template slot="prePayTaxSalary1" slot-scope="text">
          <span >{{ fixedNumber(text)(2) }}</span>
        </template>
        <template slot="assigneeJudgeBonus" slot-scope="text">
          <span >{{ fixedNumber(text)(2) }}</span>
        </template>
        <template slot="financeJudgeBonus" slot-scope="text">
          <span >{{ fixedNumber(text)(2) }}</span>
        </template>
        <template slot="empSalary" slot-scope="text">
          <span>{{ fixedNumber(text)(2) }}</span>
        </template>
        <template slot="driftBonusBase" slot-scope="text">
          <span>{{ fixedNumber(text)(2) }}</span>
        </template>
        <template slot="merits" slot-scope="text">
          <span>{{ fixedNumber(text)(2) }}</span>
        </template>
        <template slot="countSalary" slot-scope="text">
          <span>{{ fixedNumber(text)(2) }}</span>
        </template>
        <template slot="lastMerits" slot-scope="text">
          <span>{{ fixedNumber(text)(2) }}</span>
        </template>
        <template slot="preBonusMoney" slot-scope="text, record">
          <div>
            <a-popover
              v-if="overBonusTips(record, record.preBonusMoney).length"
              title
              trigger="hover"
              placement="bottom"
            >
              <div slot="content" style="width: 300px">
                <div>
                  <h4>预警信息</h4>
                  <p>
                    <span
                      v-for="(item, index) in overBonusTips(record, record.preBonusMoney)"
                      :key="index"
                    >
                      <a-icon type="exclamation-circle" />
                      &nbsp;{{ item }}
                      <br />
                    </span>
                  </p>
                  <h4>预警原因</h4>
                  <p>{{ record['preApproverOpinion'] }}</p>
                </div>
              </div>
              <span>
                <a
                  href="javascript:void(0)"
                  class="obvious"
                  style="font-size: 1.2rem"
                >{{ fixedNumber(text)(2) }}</a>
              </span>
            </a-popover>
            <div v-else style="font-size: 1.2rem">{{ fixedNumber(text)(2) }}</div>
          </div>
        </template>
        <template slot="currApprBonusMoney" slot-scope="text, record">
          <div v-if="queryParam.type === 'readOnly' || queryParam.status === 'handled'">
              <span
                class="important-field"
                style="font-size: 1.2rem"
              >{{ fixedNumber(text)(2) }}</span>
              <img v-if="record.isTheSameMoney == 1 && text" :src="warningIcon" title="该人员的分发金额上级意见与您的意见不一致" alt="" class="warningIcon" style="top: -2px;">  
          </div>
          <a-row v-else span="24">
            <a-col span="20">
              <InputNumber
                class="important-field"
                style="font-size: 1.2rem"
                placeholder="请输入"
                :recordLastValue="true"
                :title="disabledTitleForInput(record)"
                :disabled="isDisabledForKeepFocusInput(record)"
                :value="record['currApprBonusMoney']"
                @blur="(val) => editBonusConfirm(record, val)"
              />
            </a-col>
            <a-col span="4">
              <img v-if="record.isTheSameMoney == 1 && text" :src="warningIcon" title="该人员的分发金额上级意见与您的意见不一致" alt="" class="warningIcon">  
            </a-col>
          </a-row>
          <!-- <img v-if="record.isTheSameMoney == 1" :src="warningIcon" alt="">   -->
          <!-- <img :src="warningIcon" alt="" class="warningIcon">   -->
        </template>
        <template slot="judgeBonusRange" slot-scope="text, record">
          <span>{{ countJudgeBonusRange(record) }}</span>
        </template>
        <template
          slot="bonusCoefficientInFact"
          slot-scope="text, record"
        >{{ factBonusCoeff(record) }}</template>
        <template
          slot="lastIncreased"
          slot-scope="text, record"
        >{{ countLastIncreased(record) }}</template>
        <template slot="warningTips" slot-scope="text, record">
          <div v-if="overBonusTips(record, record.currApprBonusMoney).length">
            <span
              v-for="(item, index) in overBonusTips(record, record.currApprBonusMoney)"
              :key="index"
            >
              <a-icon type="exclamation-circle" class="warning warning-icon-fixed" theme="filled" />
              {{ item }}
              <br />
            </span>
          </div>
        </template>
        <template slot="currApproverOpinion" slot-scope="text, record, index">
          <div :title="text">
            <span v-if="queryParam.type === 'readOnly' || queryParam.status === 'handled'">{{ text }}</span>
            <a-input
              v-else
              placeholder="请填写特殊说明"
              :disabled="queryParam.type === 'readOnly' || queryParam.status === 'handled'"
              :value="text"
              @click="openRemarkEditor(text, record, index)"
            />
          </div>
        </template>
        <template slot="communicated" slot-scope="text, record">
          <!-- 为空 显示为“待沟通”（按钮） ，为“Y”显示为已沟通 （文本） -->
          <span v-if="text === 'Y'">已沟通</span>
          <a-button class="btn-primary" type="primary" ghost v-else @click="communicateConfim(record)">待沟通</a-button>
        </template>
      </a-table>
      <p v-if="iShowKeepFocusTips" style="text-align: center;font-size: 1.3rem;">
        暂未添加重点关注人员，请点击右上角 <span style="color: #00B627">"添加"按钮</span> 添加人员
      </p>
    </div>
    <a-row v-if="fixedMembers.length + floatMembers.length" style="margin-bottom:10px">
        <a-col :md="24" :sm="24" align="center">
          <div v-if="queryParam.type === 'distribute'">
            <a-button class="btn-primary" type="primary" @click="saveHandler" style="margin-right:10px">保存</a-button>
            <a-button class="btn-primary" type="primary" @click="completionHandler">完成分发</a-button>
          </div>
          <!-- 在重点关注的状态下，只有保存按钮 -->
          <div v-if="canEditForKeepFocus">
            <a-button class="btn-primary" type="primary" @click="saveHandler" style="margin-right:10px">保存</a-button>
          </div>
          <div v-if="queryParam.type === 'approval'">
            <a-button class="btn-primary" type="primary" @click="rejectModalVisiable = true" style="margin-right:10px">驳回</a-button>
            <a-button
              class="btn-primary"
              type="primary"
              @click="passApproval"
            >通过</a-button>
          </div>
        </a-col>
      </a-row>
    <custom-field
      ref="CustomFieldComponent"
      :version="version"
      :hasCheckBox="true"
      :moduleName="'DistributingCustomField'"
      :relativeColumns="columnsPlan"
      :defaultFields="defaultFields"
      :disabledFields="disabledFields"
      :groupInfo="groupInfo"
      :visiable="fieldsModalVisiable"
      @changeEvent="getCheckedCols"
      @visiableEvent="
        val => {
          this.fieldsModalVisiable = val
        }
      "
    />
    <freeze-field
      :visiable="freezeFieldModalVisiable"
      :relativeColumns="columnsPlan"
      :version="version"
      :moduleName="'DistributingFreezeField'"
      :hasCheckBox="true"
      :defaultFields="['empName']"
      :freezeFields="['empName']"
      @changeEvent="changeFreezeField"
      @visiableEvent="
        val => {
          this.freezeFieldModalVisiable = val
        }
      "
    />
    <filter-modal
      ref="FilterModalComponent"
      :treeId="queryParam.treeId"
      :unitId="queryParam.unitId"
      :bizType="queryParam.bizType"
      :focusOn="queryParam.type === 'keepFocus' ? 1 : null"
      :deep="queryParam.deep"
      :visiable="filterModalVisiable"
      :moduleName="'PendingDisTributedUnitFilterModal'"
      :bonusType="tabsActive"
      @getFilterData="getFilterData"
      @visiableEvent="
        val => {
          this.filterModalVisiable = val
        }
      "
    />
      <!-- if (this.queryParam.type === 'keepFocus') {
        if (this.queryParam.status === 'pending' &&  this.queryParam.rootAssignStatus != '25') { -->
    <batch-editor-modal
      :visiable="writeQuotaModalVisiable"
      :selectedRows="selectedRows"
      :columnsPlan="columnsPlan"
      :editField="'currApprBonusMoney'"
      :type="queryParam.type"
      :status="queryParam.status"
      :rootAssignStatus="queryParam.rootAssignStatus"
      @changeEvent="confirmBatchEditted"
      @visiableEvent="
        val => {
          this.writeQuotaModalVisiable = val
        }
      "
    />
    <reject-modal
      :visiable="rejectModalVisiable"
      @confirm="handleReject"
      @visiableEvent="
        val => {
          this.rejectModalVisiable = val
        }
      "
    />
    <remark-editor-modal
      :input="editRow.value"
      :visiable="remarkChangeModalVisiable"
      @confirm="editRemarkConfirm"
      @visiableEvent="
        val => {
          this.remarkChangeModalVisiable = val
        }
      "
    />
    <upload-modal 
      :rootUnitId="queryParam.rootUnitId"
      :rootTreeId="queryParam.rootTreeId"
      :visiable="uploadModalVisiable"
      @reload="() => { getData('double') }"
      @visiableEvent="
        val => {
          this.uploadModalVisiable = val
        }
      "
    >
    </upload-modal>
    <!-- <guide-page :from="queryParam.type" /> -->
  </div>
</template>
<script>
import CustomField from '@/components/CustomField/CustomField'
import FreezeField from '@/components/FreezeField/FreezeField'
import InputNumber from '@/components/InputNumber'
import FilterModal from './FilterModal'
import UploadModal from './UploadModal'
import BatchEditorModal from './BatchEditorModal'
// import RejectModal from './RejectModal'
import RejectModal from '@/views/bonusDistribute/common/RejectModal'
// import BonusEditorModal from './BonusEditorModal'
import RemarkEditorModal from './RemarkEditorModal'
import FeedbackModal from './FeedbackModal'
import SummaryBar from './SummaryBar'
// import GuidePage from '@/components/Guide'
import { fixedNumber } from '@/utils/util'
import {
  defaultFields,
  disabledFields,
  version,
  columnsMap,
  floatColumns,
  fixedColumns,
  dynamicColumn,
  groupInfo
} from './data.config.js'
import { countJudgeBonusRange, overBonusTips, countLastIncreased } from '../common/common'
import {
  getDistributingSummary,
  getDistributingMemberList,
  save,
  approval,
  distributeCompletion,
  getFeedbackList,
  getSaveFeedback,
  communicateServe,
  deleteFocusMemberServe
} from '@/api/bonusDistributeServer'
import warningIcon from '@/assets/warning_bill.png'
export default {
  name: 'DisTributing',
  components: {
    CustomField,
    BatchEditorModal,
    FilterModal,
    RejectModal,
    FreezeField,
    SummaryBar,
    RemarkEditorModal,
    FeedbackModal,
    InputNumber,
    UploadModal
  },
  data() {
    return {
      iShowKeepFocusTips: false,
      feedbackLoading: false,
      feedbackVisible: false, //反馈功能框是否打开
      remarkChangeModalVisiable: false,
      bonusChangeModalVisiable: false,
      freezeFieldModalVisiable: false,
      uploadModalVisiable: false,
      rejectModalVisiable: false,
      writeQuotaModalVisiable: false,
      filterModalVisiable: false,
      scrollConfig: { x: 1500, y: 360 },
      fieldsModalVisiable: false,
      warningIcon,
      defaultFields,
      disabledFields,
      version,
      groupInfo,
      unitName: null,
      planId: null,
      loading: false,
      // 查询参数
      queryParam: {
        treeId: null, // 点击进来的节点的 treeId
        unitId: null, // 点击进来的节点的 unitId
        rootUnitId: null, // 点击进来的时的树的第一级节点的 unitId
        rootTreeId: null, // 点击进来的时的树的第一级节点的 treeId
        rootUnitName: null, // 点击进来的时的树的第一级节点的 unitName
        floatRemark: null, // 点击进来的时的节点的 floatRemark
        yearlyRemark: null, // 点击进来的时的节点的 yearlyRemark
        rootAssignStatus: null, // 点击进来的时的节点的 assignStatus
        status: null, // pending | handled
        summaryTreeId: null, // 用来查询头部汇总数据的
        summaryUnitId: null, // 用来查询头部汇总数据的
        summaryNotDeep: null, // 用来查询头部汇总数据的
        deep: null, // true | false, 是否查询所有人
        type: null, // distribute | approval | readOnly | keepFocus
        bizType: null, // alloct | appr
        current: 1,
        pageSize: 20
      },
      pagination: {
        total: 0,
        pageSize: 20, // 每页中显示20条数据
        showSizeChanger: true,
        showQuickJumper: true,
        pageSizeOptions: ['20', '50', '100'], // 每页中显示的数据
        showTotal: total => `共有 ${total} 条数据` // 分页中显示总的数据
      },
      columnsPlan: columnsMap, // 表头
      dataPlan: [], // 表数据源
      filterFieldsObject: {},
      floatMembers: [],
      fixedMembers: [],
      dataMessage: [],
      editRow: {
        index: 0,
        value: 0
      },
      tabsActive: null,
      selectedRows: [],
      selectedRowKeys: [],
      onSelectChange: (selectedRowKeys, selectedRows) => {
        this.selectedRowKeys = selectedRowKeys
        this.selectedRows = selectedRows
      }
    }
  },
  computed: {
    canEditForKeepFocus() {
      return this.queryParam.type === 'keepFocus' &&　this.queryParam.rootAssignStatus != '25' && this.queryParam.status === 'pending'
    },
    canAjustFocusMember() {
      return this.queryParam.type === 'keepFocus'
    },
    filtersLength() {
      if (!this.filterFieldsObject) {
        return 0
      } else {
        return Object.keys(this.filterFieldsObject).length
      }
    },
    cancelQueryStatusCanEdit() {
      let res = false
      if (this.columnsPlan) {
        if (this.$refs.FilterModalComponent) {
          if (this.$refs.FilterModalComponent.activeFields && this.$refs.FilterModalComponent.activeFields.length) {
            res = true
          }
        }
      }
      return !res
    },
    preApprovalPepole() {
      let name = ''
      if (this.dataPlan[0] && this.dataPlan[0]['preApprOwnerName']) {
        name = this.dataPlan[0]['preApprOwnerName']
      }
      return name
    },
    preOrAfterTax() {
      let res = 1
      this.dataPlan.forEach(item => {
        if (item['preOrAfterTax']) {
          res = item['preOrAfterTax']
        }
      })
      return res
    }
  },
  watch: {
    columnsPlan: {
      handler(_new) {
        this.$nextTick(() => {
          this.scrollConfig.x = 0
          _new.forEach(colItem => {
            this.scrollConfig.x += colItem.width ? colItem.width : 0
          })
          this.scrollConfig.x += 60
        })
      },
      deep: true,
    },
    tabsActive(_new, _old) {
      const checkedFields = this.$refs.CustomFieldComponent && this.$refs.CustomFieldComponent.shareData()
      const curCheckedCols = []
      this.selectedRowKeys = []
      this.selectedRows = []
      columnsMap.forEach(colItem => {
        if (checkedFields.includes(colItem['dataIndex'])) {
          curCheckedCols.push(colItem)
        }
      })
      this.rebuildCols(_new, curCheckedCols)
    }
  },
  mounted() {
    this.$nextTick(() => {
      this.scrollConfig.y = document.body.offsetHeight - 360
    })
  },
  beforeCreate() {
    this.feekForm = this.$form.createForm(this, { name: 'feekback' })
  },
  created() {
    this.queryParam.treeId = this.$route.query.treeId
    this.queryParam.unitId = this.$route.query.unitId
    this.queryParam.rootUnitId = this.$route.query.rootUnitId // 上个页面的根节点的unitId
    this.queryParam.rootTreeId = this.$route.query.rootTreeId // 上个页面的根节点的treeId
    this.queryParam.rootUnitName = this.$route.query.rootUnitName // 上个页面的根节点的treeId
    this.queryParam.summaryTreeId = this.$route.query.summaryTreeId
    this.queryParam.summaryUnitId = this.$route.query.summaryUnitId
    this.queryParam.summaryNotDeep = this.$route.query.summaryNotDeep
    this.queryParam.floatRemark = this.$route.query.floatRemark
    this.queryParam.yearlyRemark = this.$route.query.yearlyRemark
    this.queryParam.totalMembers = this.$route.query.totalMembers
    this.queryParam.rootAssignStatus = Number.parseInt(this.$route.query.rootAssignStatus)
    this.queryParam.status = this.$route.query.status // pending | handled
    this.queryParam.deep = eval(this.$route.query.deep)
    this.queryParam.bizType = this.$route.query.bizType
    this.queryParam.type = this.$route.query.type // distribute | approval | readOnly | keepFocus
    this.getData('double')
  },
  methods: {
    countJudgeBonusRange,
    overBonusTips,
    fixedNumber,
    countLastIncreased,
    communicateConfim(record) {
      this.$confirm({
        title: '与员工沟通社会调查报告信息',
        content: '请确认您已经与员工沟通过社会调查报告信息',
        onOk: async() => {
          const res = await communicateServe({
            pkBounsPlanId: record['pkBounsPlanId'],
            empNumber: record['empNumber'],
          })
          if (res.code === 200) {
            this.$message.success('提交成功')
            record['communicated'] = 'Y'
          } else {
            this.$message.error(res.msg)
          }
        },
        onCancel() {}
      })
    },
    // isDisabledForKeepFocusInput 和 canEditForKeepFocus 不是同一个管理机制
    // isDisabledForKeepFocusTyping：只负责管理每条数据是否具有输入权限的
    // canEditForKeepFocu：负责管理重点关注模块的所有操作权限（除了输入框）
    isDisabledForKeepFocusInput(record) {
      if (this.queryParam.type === 'keepFocus') {
        if (this.queryParam.status === 'pending' &&  this.queryParam.rootAssignStatus != '25') {
          if (record.apprId == this.$store.state.user.userId) {
            // 可分发单元
            // 40: '被驳回',
            return record.unitStatus == 40
          } else {
            // 被审核单元
            // 10: '未送审',
            // 20: '未送审',
            // 40: '已驳回',
            return record.unitStatus == 40 || record.unitStatus == 10 || record.unitStatus == 20
          }
        } else {
          return true
        }
      } else {
        return false
      }
    },
    disabledTitleForInput(record) {
      if (this.queryParam.type === 'keepFocus') {
        if (this.queryParam.status === 'pending' &&  this.queryParam.rootAssignStatus != '25') {
           if (record.apprId == this.$store.state.user.userId) {
            // 可分发单元
            // 40: '被驳回',
            if (record.unitStatus == 40) {
              return '该人员分发金额被驳回，暂时无法编辑'
            }
          } else {
            if (record.unitStatus == 40) {
              return '该人员分发金额已驳回，暂时无法编辑'
            }

            if (record.unitStatus == 10 || record.unitStatus == 20) {
              return '该人员分发金额下级未送审，暂时无法编辑'
            }
          }
        } else {
          return '该人员分发金额审批中，暂时无法编辑'
        }
      }
    },
    deleteFocusMembers() {
      if (!this.selectedRowKeys.length) return this.$message.warning('请先勾选人员')
      this.$confirm({
        title: '提示',
        content: `你已选 ${this.selectedRowKeys.length} 个人员，请确认是否从重点关注列表中删除？`,
        okText: '确认',
        cancelText: '取消',
        onOk: async() => {
          const res = await deleteFocusMemberServe({
            treeId: this.queryParam.rootTreeId,
            members: this.selectedRowKeys
          })
          if (res.code === 200) {
            this.$message.success('删除成功')
            this.getData('double')
          } else {
            this.$message.error('删除失败')
          }
        },
        onCancel: () => {
          console.log('Cancel')
        }
      })
    },
    showAllFieldsCanEdit() {
      let res = false
      if (this.$refs.CustomFieldComponent) {
        const checkedFields = this.$refs.CustomFieldComponent.shareData()
        if (checkedFields.length < columnsMap.length) {
          res = true
        }
      }
      return !res
    },
    requeueCols(originCols) {
      // 把作浮动的col排序到左边
      const leftCols = []
      const rightCols = []
      originCols.forEach((colItem) => {
        if (colItem.fixed === 'left') {
          leftCols.push(colItem)
        } else {
          rightCols.push(colItem)
        }
      })

      return leftCols.concat(rightCols)
    },
    getCheckedCols(checkedFields) {
      const curCheckedCols = []
      columnsMap.forEach(colItem => {
        if (checkedFields.includes(colItem['dataIndex'])) {
          curCheckedCols.push(colItem)
        }
      })
      this.rebuildCols(this.tabsActive, curCheckedCols)
    },
    rebuildCols(tabsActive, _columnsPlan) {
      let newCols = []
      // let breakIndex = 0
      const expl = this.floatMembers.concat(this.fixedMembers)[0] || {}
      // 插入前半部分的cols，以warningTips为界，用 breakIndex 记录位置
      for (let i = 0; i < _columnsPlan.length; i++) {
        const colItem = _columnsPlan[i]
        if (colItem.dataIndex === 'currApprBonusMoney') {
          // 如果 preBonusMoney 有值，就插入 preBonusMoney 的视图栅格
          if (expl['preBonusMoney'] || expl['preBonusMoney'] === 0) {
            newCols.push(dynamicColumn['preBonusMoney'])
          }
        }

        newCols.push(colItem)

        if (colItem.dataIndex === 'lastMerits') {
          // 合并动态字段
          if (tabsActive == 1) {
            newCols.push(fixedColumns['baseMerits'])
          } else {
            newCols.push(floatColumns['merits'])
          }
        }
      }

      this.columnsPlan = this.requeueCols(newCols)

      // 切换数据的视图，并且刷新分页信息
      this.dataPlan = tabsActive == 1 ? this.fixedMembers : this.floatMembers
      this.pagination.total = this.dataPlan.total || 0
      this.queryParam.current = this.dataPlan.current || 0
      this.queryParam.pageSize = this.dataPlan.pageSize || 0
    },
    changeFreezeField(checkedFields) {
      const leftCols = []
      const rightCols = []
      checkedFields = checkedFields.concat(['empName'])
      this.columnsPlan.forEach((colItem, index) => {
        if (checkedFields.includes(colItem.dataIndex)) {
          leftCols.push(colItem)
        } else {
          rightCols.push(colItem)
        }
      })
      this.$nextTick(() => {
        this.columnsPlan = leftCols.concat(rightCols)
      })
    },
    factBonusCoeff(record) {
      // 实际分发系数
      const currApprBonusMoney = Number.parseFloat(record['currApprBonusMoney'] || 0)
      const baseMerits = Number.parseFloat(record['baseMerits'] || 0)
      const merits = Number.parseFloat(record['merits'] || 0)
      if (record['bonusType'] === 1) {
        // 年薪制
        if (!baseMerits) return 0
        return fixedNumber(currApprBonusMoney / baseMerits)(2)
      } else {
        // 浮动制
        if (!merits) return 0
        return fixedNumber(currApprBonusMoney / merits)(2)
      }
    },
    prevHandleForFields(allMembers) {
      allMembers &&
        allMembers.forEach(member => {
          // 克隆上一个人的"审核意见"
          if (!member['currApproverOpinion'] && member['preApproverOpinion']) {
            member['currApproverOpinion'] = member['preApproverOpinion']
          }
          // // 如果 "分发金额" 字段未填值（0也算已填），就赋 "预算值"
          // if (!member['currApprBonusMoney'] && member['currApprBonusMoney'] !== 0) {
          //   member['currApprBonusMoney'] = member['bonusType'] === 1 ? member['baseMerits'] : member['merits'] 
          // }
        })
    },
    cancelQueryStatus() {
      this.$refs.FilterModalComponent.clearFields()
      this.$refs.FilterModalComponent.confirm()
    },
    getFilterData(filterData) {
      this.filterFieldsObject = filterData
      this.selectedRowKeys.length = 0
      this.selectedRows.length = 0
      this.getData('single')
    },
    showAllFields() {
      this.$refs.CustomFieldComponent.onCheckAllChange()
      this.$refs.CustomFieldComponent.confirm()
    },
    rollbackFields() {
      this.$refs.CustomFieldComponent.rollback()
      this.$refs.CustomFieldComponent.confirm()
    },
    openBatchEditorModal() {
      if (this.selectedRows.length) {
        this.writeQuotaModalVisiable = true
      } else {
        this.$message.warning('请先勾选人员')
      }
    },
    async saveHandler() {
      const allMembers = this.floatMembers.concat(this.fixedMembers)
      this.loading = true
      const res = await save({
        treeId: this.queryParam.rootTreeId,
        unitId: this.queryParam.rootUnitId,
        planId: this.planId,
        type: this.queryParam.type,
        bonusList: [allMembers[0]]
      }) // 只象征性的保存一条
      if (res.code === 200) {
        this.$message.success('保存成功')
        this.$refs.SummaryBar.update()
      } else {
        this.$message.error(res.msg)
      }
      this.loading = false
    },
    async completionHandler() {
      // const members = this.floatMembers.concat(this.fixedMembers)
      // let pass = this.hasBonus(members)
      // if (!pass) {
      //   const summary = this.$refs.SummaryBar.shareData()
      //   const msg = `您还有 ${summary.nopayAll} 个员工未分发社会调查报告，其中浮动制 ${summary.nopayFloat} 人， 年薪制 ${summary.nopayYearly} 人`
      //   return this.$message.warning(msg)
      // }
      this.loading = true
      const res = await distributeCompletion({
        treeId: this.queryParam.treeId,
        unitId: this.queryParam.unitId,
        planId: this.planId
      })
      if (res.code === 200) {
        this.$message.success('分发成功', res.msg)
        this.goback()
      } else {
        this.$message.error(res.msg)
      }
      this.loading = false
    },
    /**
     * @type single | double
     */
    async getData(type) {
      this.iShowKeepFocusTips = false
      this.loading = true
      let loadingHide = null
      if (this.queryParam.totalMembers >= 100 && this.queryParam.type !== 'keepFocus') {
        loadingHide = this.$message.loading('人员数据信息量比较大，预计数据在30秒左右加载完成，请耐心等待', 0)
      }
      if (type === 'single') {
        if (this.tabsActive == 1) {
          this.fixedMembers = await this.getFixedMember()
        } 
        if (this.tabsActive == 2) {
          this.floatMembers = await this.getFloatMember()
        }
      } else {
        this.floatMembers = await this.getFloatMember()
        this.fixedMembers = await this.getFixedMember()
        this.tabsChange('2')
      }

      loadingHide && loadingHide()
      const allMembers = this.floatMembers.concat(this.fixedMembers)
      this.unitName = allMembers.length ? allMembers[0].bounsUnitName : ''
      this.planId = allMembers.length ? allMembers[0].pkBounsPlanId : ''
      if (allMembers.length === 0 && this.canEditForKeepFocus) this.iShowKeepFocusTips = true
      this.loading = false
      // 预处理一些字段
      this.prevHandleForFields(allMembers)

      this.dataPlan = this.tabsActive == 2 ? this.floatMembers : this.fixedMembers
      this.pagination.total = this.dataPlan.total
      this.queryParam.current = this.dataPlan.current
      this.queryParam.pageSize = this.dataPlan.pageSize
    },
    getFixedMember() {
      return new Promise(async (resolve, reject) => {
        let result = []
        // 年薪制人员列表
        const response = await getDistributingMemberList({
          ...this.filterFieldsObject,
          bonusType: 1, //否	年薪制=1 ，浮动制=2
          bizType: this.queryParam.bizType,
          current: this.queryParam.current,
          pageSize: this.queryParam.pageSize,
          deep: this.queryParam.deep,
          focusOn: this.queryParam.type === 'keepFocus' ? 1 : null,
          treeId: this.queryParam.treeId, //是 社会调查报告树ID
          unitId: this.queryParam.unitId //是 社会调查报告单元ID
        })

        if (response.code === 200) {
          if (response.data && response.data.list) {
            result = response.data.list
            result.total = response.data.total
            result.current = response.data.pageNum
            result.pageSize = response.data.pageSize
          } else {
            result = []
            result.total = 0
            result.current = 1
            result.pageSize = 20
          }
        } else {
          this.$message.error('数据获取失败')
        }
        return resolve(result)
      })
    },
    getFloatMember() {
      return new Promise(async (resolve, reject) => {
        let result = []
        // 浮动制人员列表
        const response = await getDistributingMemberList({
          ...this.filterFieldsObject,
          bonusType: 2, //否	年薪制=1 ，浮动制=2
          // deep: false,	//否	深度查询
          // difference: '',	//否	异常人员名单=1
          current: this.queryParam.current,
          pageSize: this.queryParam.pageSize,
          deep: this.queryParam.deep,
          // current: 1, //当前页
          // pageSize: 20,
          focusOn: this.queryParam.type === 'keepFocus' ? 1 : null,
          bizType: this.queryParam.bizType,
          treeId: this.queryParam.treeId, //是 社会调查报告树ID
          unitId: this.queryParam.unitId //是 社会调查报告单元ID
        })
        if (response.code === 200) {
          if (response.data && response.data.list) {
            result = response.data.list
            result.total = response.data.total
            result.current = response.data.pageNum
            result.pageSize = response.data.pageSize
          } else {
            result = []
            result.total = 0
            result.current = 1
            result.pageSize = 20
          }
        } else {
          this.$message.error('数据获取失败')
        }
        return resolve(result)
      })
    },
    adjustCols(_columnsPlan) {
      // this.columnsPlan = []
      const preBonusMoneyModel = {
        title_model: `利${this.preOrAfterTax === 1 ? '前' : '后'}实体社会调查报告(他人意见)`,
        dataIndex: 'preBonusMoney',
        width: 160,
        slots: { title: 'preBonusMoneyTitle' },
        sorter: (a, b) => Number.parseFloat(b.preBonusMoney) - Number.parseFloat(a.preBonusMoney),
        scopedSlots: {
          customRender: 'preBonusMoney'
        }
      }

      // 最终意见 字段暂时不处理 @2019-12-14 by rongxis
      const finalBonusMoneyModel = {
        title_model: `利${this.preOrAfterTax === 1 ? '前' : '后'}实体社会调查报告(最终意见)`,
        dataIndex: 'finalBonusMoney',
        width: 160,
        slots: { title: 'finalBonusMoneyTitle' },
        scopedSlots: {
          customRender: 'finalBonusMoney'
        }
      }

      switch (this.queryParam.type) {
        case 'distribute': 
        case 'keepFocus': 
        {
          // 如果是 distribute 类型， 隐藏 preBonusMoney 字段
          columnsMap.forEach((colItem, index) => {
            if (colItem.dataIndex !== 'preBonusMoney') {
              this.columnsPlan.push(colItem)
            }
          })
          break
        }
        case 'readOnly':
        case 'approval': {
          let hasPrevBonus = true
          this.dataPlan.forEach(item => {
            if (item.preBonusMoney === null || item.preBonusMoney === undefined || item.preBonusMoney === '') {
              hasPrevBonus = false
            }
          })
          columnsMap.forEach((colItem, index) => {
            if (colItem.dataIndex === 'currApprBonusMoney' && hasPrevBonus) {
              // 如果有上个分发人的分发数据，就显示 preBonusMoney 字段
              this.columnsPlan.push(preBonusMoneyModel)
            }
            this.columnsPlan.push(colItem)
          })
          break
        }
        default:
          this.columnsPlan = [...columnsMap]
          break
      }
    },
    tabsChange(key) {
      this.tabsActive = key
    },
    handleTableChange(pagination, filters, sorter) {
      // 排序会导致本函数被调用，为了避免重复多次访问服务器，在这里判断分页信息是否有变动再访问服务器
      if (this.queryParam.current !== pagination.current || this.queryParam.pageSize !== pagination.pageSize) {
        this.queryParam.current = pagination.current
        this.queryParam.pageSize = pagination.pageSize
        this.getData('single')
      }
    },
    openRemarkEditor(text, record, index) {
      this.editRow.index = index
      this.editRow.value = text
      this.remarkChangeModalVisiable = true
    },
    async editRemarkConfirm(val) {
      const chooseItem = this.dataPlan[this.editRow.index]
      chooseItem['currApproverOpinion'] = val
      this.editRow.index = null
      this.editRow.value = null
      let pass = this.hasBonus([chooseItem])
      if (!pass) return this.$message.warning('请先输入分发社会调查报告')
      // pass = this.hasOverBonusAndReason([chooseItem])
      // if (!pass) return this.$message.warning('请填写特殊说明')
      // 每改一个，就保存一个
      const res = await save({
        treeId: this.queryParam.rootTreeId,
        unitId: this.queryParam.rootUnitId,
        planId: this.planId,
        type: this.queryParam.type,
        bonusList: [chooseItem]
      })
      if (res.code === 200) {
        this.$message.success('保存成功')
        this.$refs.SummaryBar.update()
      } else {
        this.$message.error(res.msg)
      }
    },
    async editBonusConfirm(row, val) {
      row['currApprBonusMoney'] = val
      row['assigneeJudgeBonus'] = val
      this.editRow.index = null
      this.editRow.value = null
      let pass = this.hasBonus([row])
      if (!pass) return this.$message.warning('请先输入分发社会调查报告')
      // 每改一个，就保存一个
      const res = await save({
        treeId: this.queryParam.rootTreeId,
        unitId: this.queryParam.rootUnitId,
        planId: this.planId,
        type: this.queryParam.type,
        bonusList: [row]
      })
      if (res.code === 200) {
        this.$message.success('保存成功')
        this.$refs.SummaryBar.update()
      } else {
        this.$message.error(res.msg)
      }
    },
    handleReject(rejectReason) {
      // const summary = this.$refs.SummaryBar.shareData()
      const allMembers = this.floatMembers.concat(this.fixedMembers)
      this.$confirm({
        title: '提示',
        content: `您确认将 "${this.unitName}" 社会调查报告分发信息驳回给 ${allMembers[0]['preApprOwnerName']}？`,
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
        treeId: this.queryParam.treeId,
        unitId: this.queryParam.unitId
      })
      if (res.code === 200) {
        this.$message.success('驳回成功')
        this.goback()
      } else {
        this.$message.error('驳回失败')
      }
      this.loading = false
    },
    async passApproval() {
      const all = this.floatMembers.concat(this.fixedMembers)
      let pass = this.hasBonus(all)
      if (!pass) {
        const summary = this.$refs.SummaryBar.shareData()
        const msg = `您还有 ${summary.nopayAll} 个员工未分发社会调查报告，其中浮动制 ${summary.nopayFloat} 人， 年薪制 ${summary.nopayYearly} 人`
        return this.$message.warning(msg)
      }
      // opType	 操作类型，1 驳回；2 通过
      // treeId	 社会调查报告单元树ID
      // unitId	 社会调查报告单元ID
      this.loading = true
      const res = await approval({
        opType: 2,
        treeId: this.queryParam.treeId,
        unitId: this.queryParam.unitId
      })
      if (res.code === 200) {
        this.$message.success('审核成功')
        this.goback()
      } else {
        this.$message.error('审核失败')
      }
      this.loading = false
    },
    hasBonus(data /**Array*/) {
      let pass = true
      for (let i = 0; i < data.length; i++) {
        const record = data[i]
        // console.log('assigneeJudgeBonus:', record['currApprBonusMoney'])
        if (
          record['currApprBonusMoney'] === '' ||
          record['currApprBonusMoney'] === undefined ||
          record['currApprBonusMoney'] === null
        ) {
          pass = false
          break
        }
      }
      return pass
    },
    async confirmBatchEditted(changeRows, changeRowKeys) {
      this.selectedRows = [...changeRows]
      this.selectedRowKeys = [...changeRowKeys]
      changeRows.forEach(changedItem => {
        this.dataPlan.forEach(dataItem => {
          if (dataItem['empNumber'] === changedItem['empNumber']) {
            dataItem['currApprBonusMoney'] = changedItem['currApprBonusMoney']
            dataItem['assigneeJudgeBonus'] = changedItem['currApprBonusMoney']
          }
        })
      })
      let pass = this.hasBonus(changeRows)
      if (!pass) return this.$message.warning('请先输入分发社会调查报告')
      // 每改一次，就保存一次
      const res = await save({
        treeId: this.queryParam.rootTreeId,
        unitId: this.queryParam.rootUnitId,
        planId: this.planId,
        type: this.queryParam.type,
        bonusList: [...changeRows]
      })
      if (res.code === 200) {
        this.$message.success('保存成功')
        this.$refs.SummaryBar.update()
      } else {
        this.$message.error(res.msg)
      }
    },
    goback() {
      this.$router.push({
        path: '/bonusDistribute/pendingHandledUnit',
        query: {
          bonusTreeId: this.queryParam.rootTreeId,
          bonusUnitId: this.queryParam.rootUnitId,
          status: 'pending'
        }
      })
    }
  }
}
</script>

<style lang="less" scoped>
.content-layout {
  .ant-card-wider-padding {
    .ant-card-body {
      margin: 0;
    }
  }
}

@warningColor: #f7b500;
.warning {
  color: @warningColor;
}
.warning-icon-fixed {
  margin: 0 7px;
}
/deep/ .ant-table {
  /deep/ .ant-table-content {
    /deep/ .ant-table-thead > tr > th > div.ant-table-column-sorters {
      margin-right: -1rem;
    }
  }
}
.obvious {
  color: #e02020 !important;
}
.bonus-unit-col-layout {
  display: inline-block;
  .bonus-unit-inner-layout {
    display: table;
    .bonus-unit-icon {
      display: table-cell;
      vertical-align: middle;
    }
    .bonus-unit-card {
      text-indent: 0.5rem;
      display: table-cell;
      vertical-align: middle;
      .bonus-unit-title {
        font-weight: 600;
        font-size: 0.95rem;
        color: #2e2e3b;
        display: block;
      }
      .bonus-unit-desc {
        color: #7c7b80;
        font-size: 0.9rem;
        display: block;
      }
    }
  }
}
.important-field {
  color: #00b627;
  /deep/ input {
    color: #00b627;
    cursor: pointer;
  }
}
.required-field {
  border: 1px solid#e02020;
  border-radius: 3px;
}
.operation-bar {
  margin-bottom: 1rem;
  .operation-icon {
    // color: #777B87;
    text-decoration: none;
    > i {
      font-size: 24px;
      margin-left: 12px;
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
    i.fixed-spec-icon {
      font-size: 18px;
      padding: 3px;
      top: 4px;
      position: relative;
    }
  }
  .operation-bar-none-btn {
    border: 0;
    background: none;
    color: #16a944;
    &:hover {
      color: #32d637;
    }
    &:disabled {
      color: rgba(0, 0, 0, 0.25);
    }
  }
}
.badge-pop {
  position: absolute;    
  top: -4px;
  right: 0;
  z-index: 10;
  min-width: 20px;
  height: 20px;
  color: #fff;
  font-weight: normal;
  font-size: 12px;
  line-height: 22px;
  white-space: nowrap;
  text-align: center;
  background: #f5222d;
  border-radius: 10px;
  -webkit-box-shadow: 0 0 0 1px #fff;
  box-shadow: 0 0 0 1px #fff;
  -webkit-transform: translate(50%, -50%);
  transform: translate(50%, -50%);
  -webkit-transform-origin: 100% 0%;
  transform-origin: 100% 0%;
}
.warningIcon {
  width: 1.2rem;
  position: relative;
  top: 0.4rem;
}    
</style>
