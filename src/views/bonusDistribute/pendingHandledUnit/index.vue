<template>
  <div class="main-content pending-bonus">
    <a-breadcrumb separator=">">
      <!-- <a-breadcrumb-item>首页</a-breadcrumb-item> -->
      <a-breadcrumb-item>
        <a href="javascript:void(0)" @click="$router.go(-1)">社会调查报告单元列表</a>
      </a-breadcrumb-item>
      <a-breadcrumb-item>{{ queryParam.status === 'pending' ? '待' : '已' }}处理社会调查报告单元</a-breadcrumb-item>
    </a-breadcrumb>

    <div class="content-layout warning-bar">
      <p>
        <a-icon type="exclamation-circle" class="warning warning-icon-fixed" theme="filled" />提醒: 跟钱相关的计量单位统一为人民币: 万元
      </p>
    </div>
    <!-- <div class="content-layout warning-bar">
      <p>
        <a-icon type="exclamation-circle" class="warning warning-icon-fixed" theme="filled" />提醒:
        <br /><a-icon type="exclamation-circle" class="warning warning-icon-fixed" style="visibility: hidden;"/>1、跟钱相关的计量单位统一为人民币: 万元
        <br /><a-icon type="exclamation-circle" class="warning warning-icon-fixed" style="visibility: hidden;"/>2、当前页面展示需要您直接分发和审核的组织，点击“开始分发”或“开始审核”按钮即可进入详细的人员界面
      </p>
    </div> -->
    <div class="content-layout">
      <div class="table-bonus-plan">
        <a-row :gutter="24">
          <a-col :md="20" :sm="24">
            <h3>【{{ dataSet[0] && dataSet[0].unitName}}】社会调查报告分发</h3>
          </a-col>
          <a-col :md="4" :sm="24" style="text-align:right;padding-right:20px">
            <label v-if="false">
              <a href="javascript: void(0)" @click="seachMember">
                <a-icon type="search" />
              </a> 查看全部人员
            </label>
            <label>
              &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
              <a href="javascript: void(0)" @click="keepFocusMembers">
                重点关注人员
              </a> 
            </label>
          </a-col>
        </a-row>
        <a-popover
          title="搜索社会调查报告单元"
          placement="rightTop"
          trigger="click"
          v-model="searchUnitVisible"
          class="unit-name-search"
        >
          <template slot="content">
            <a-select
              allowClear
              :showArrow="false"
              :showSearch="true"
              style="width: 250px;"
              v-model="searchedValue"
              optionFilterProp="children"
              placeholder="请输入社会调查报告单元"
              :filterOption="filterOption"
              :defaultActiveFirstOption="false"
              @change="handleClickSearch"
            >
              <a-select-option
                v-for="item in dataPlanSearch"
                :key="item.level"
                :value="item.level"
              >{{ item.unitName }}</a-select-option>
            </a-select>
          </template>
          <i
            class="font_family icon-btn_normal_seekjiangjin"
            style="color:#32d637; font-size:22px;"
          ></i>
        </a-popover>
        <a-table
          bordered
          align="center"
          rowKey="level"
          :loading="loading"
          :columns="columnsPlan"
          :dataSource="dataSet"
          :pagination="false"
          :scroll="scrollConfig"
          :expandedRowKeys="expandedRowKeys"
          :rowClassName="record => 'table-row'"
          @change="handleTableChange"
          @expand="expandicon"
          class="table-special-box"
        >
          <span slot="unitNameTitle" class="unit-name">
            社会调查报告单元
          </span>
          <template slot="unitName" slot-scope="text, record">
            <div class="bonus-unit">
              <i v-if="record.children" class="font_family icon-icon_layer2"></i>
              <i v-else class="font_family icon-icon_layer"></i>
              <div :style="{ background: searchedValue === record.level ? '#32D637' : 'none'}">
                <h4 class="bonus-unit-inner-title">{{ record.unitName }}</h4>
                <span class="bonus-unit-inner-content">{{ record.ownerName }}</span>
              </div>
            </div>
          </template>
          <!-- totleMeritsg 为预留包字段,只有第一层级显示预留包 -->
          <template slot="floatAllocBudget" slot-scope="text, record">
            <div v-if="Number.parseFloat(record.totleMeritsg) && record.level === '1'" style="word-wrap: break-word;word-break: break-all;">
              {{ text }} + <span class="unobvious">{{ record.totleMeritsg }}</span>
              <a-icon :title="'预留金额'" class="unobvious" type="question-circle" />
            </div>
            <span v-else>{{ text }}</span>
          </template>
          <template slot="differences" slot-scope="text">{{ text }}人</template>
          <template slot="floatDifferences" slot-scope="text">{{ text }}人</template>
          <template slot="yearlyDifferences" slot-scope="text">{{ text }}人</template>
          <template slot="totleFloatMembers" slot-scope="text">{{ text }}人</template>
          <template slot="totleYearlyMembers" slot-scope="text">{{ text }}人</template>
          <template slot="totleResidue" slot-scope="text">
            <span :class="text < 0 ? 'obvious' : ''">{{ text }}</span>
          </template>
          <template slot="totleFloatResidue" slot-scope="text">
            <span :class="text < 0 ? 'obvious' : ''">{{ text }}</span>
          </template>
          <template slot="totleYearlyResidue" slot-scope="text">
            <span :class="text < 0 ? 'obvious' : ''">{{ text }}</span>
          </template>
          <template slot="totleAllocExceed" slot-scope="text">
            <div v-if="text">
              <span v-if="text > 0">
                <span class="context obvious" :title="`${ text }`">{{ Math.abs(text) }}</span>
                <a-icon type="arrow-up" class="obvious" />
              </span>
              <span v-if="text < 0">
                <span class="context unobvious" :title="`${ text }`">{{ Math.abs(text) }}</span>
                <a-icon type="arrow-down" class="unobvious" />
              </span>
            </div>
            <div v-else-if="text === 0">0</div>
            <div v-else></div>
          </template>
          <template slot="floatAllocExceed" slot-scope="text">
            <div v-if="text">
              <span v-if="text > 0">
                <span class="context obvious" :title="`${ text }`">{{ Math.abs(text) }}</span>
                <a-icon type="arrow-up" class="obvious" />
              </span>
              <span v-if="text < 0">
                <span class="context unobvious" :title="`${ text }`">{{ Math.abs(text) }}</span>
                <a-icon type="arrow-down" class="unobvious" />
              </span>
            </div>
            <div v-else-if="text === 0">0</div>
            <div v-else></div>
          </template>
          <template slot="yearlyAllocExceed" slot-scope="text">
            <div v-if="text">
              <span v-if="text > 0">
                <span class="context obvious" :title="`${ text }`">{{ Math.abs(text) }}</span>
                <a-icon type="arrow-up" class="obvious" />
              </span>
              <span v-if="text < 0">
                <span class="context unobvious" :title="`${ text }`">{{ Math.abs(text) }}</span>
                <a-icon type="arrow-down" class="unobvious" />
              </span>
            </div>
            <div v-else-if="text === 0">0</div>
            <div v-else></div>
          </template>
          <template slot="floatRemark" slot-scope="text">
            <a-popover title="超额原因" v-if="text">
              <template slot="content">
                <div style="width:12rem;word-break: break-word;">{{ text }}</div>
              </template>
              <div style="text-align: left">
                <!-- 需求：最大展示10个字一行，最多两行 -->
                <span>{{ firstLineCommt(text) }}</span>
                <br>
                <span>{{ secondLineCommt(text) }}</span>
              </div>
            </a-popover>
          </template>
          <template slot="yearlyRemark" slot-scope="text">
            <a-popover title="超额原因" v-if="text">
              <template slot="content">
                <div style="width:12rem;word-break: break-word;">{{ text }}</div>
              </template>
              <div style="text-align: left">
                <!-- 需求：最大展示10个字一行，最多两行 -->
                <span>{{ firstLineCommt(text) }}</span>
                <br>
                <span>{{ secondLineCommt(text) }}</span>
              </div>
            </a-popover>
            <!-- <div class="ellipsis-tag" :title="text">{{ text }}</div> -->
          </template>
          <template slot="assignStatus" slot-scope="text, record">
            <StatusContent :record="record"/>
          </template>
          <template slot="checkOperation" slot-scope="text, record">
            <OperationButton
              :key="refreshOperationButton"
              :record="record"
              :rootTreeId="queryParam.treeId"
              :rootUnitId="queryParam.unitId"
              :rootUnitName="queryParam.unitName"
              :status="queryParam.status"
              @update="getData"
            />
          </template>
        </a-table>
      </div>
    </div>
    <div class="footer">
      <a-row class="footer-content" style="margin-bottom:20px">
        <a-col :md="24" :sm="24" align="center">
          <div>
            <!-- subAnable 为 0 不可提交，subAnable为 1 可提交 -->
            <a-button
              v-if="showSubmit"
              class="btn-primary"
              type="primary"
              @click="submit"
            >提交</a-button>
          </div>
        </a-col>
      </a-row>
    </div>
    <a-modal
      title="温馨提醒"
      class="confrim-modal"
      :visible="confirmModalVisible"
      @cancel="confirmModalVisible = false"
    >
      <!-- 如果时顶级节点，就直接提交到报告 -->
      <template v-if="confirmSubmitMsg.isTopNode">
        <div v-if="confirmSubmitMsg.floatAllocExceed < 0 || confirmSubmitMsg.yearlyAllocExceed < 0">
          <span>{{`${confirmSubmitMsg.unitName}已分社会调查报告`}}</span><span class="obvious">超预算</span><span>。其中</span>
          <span
            v-if="confirmSubmitMsg.floatAllocExceed < 0"
            class="important-text"
          >，{{`浮动制人员分发结果超预算 ${ fixedNumber(Math.abs(confirmSubmitMsg.floatAllocExceed))(2) } 万元`}}</span>
          <span
            v-if="confirmSubmitMsg.yearlyAllocExceed < 0"
            class="important-text"
          >，{{`年薪制人员分发结果超预算 ${ fixedNumber(Math.abs(confirmSubmitMsg.yearlyAllocExceed))(2) } 万元`}}</span>
          <span>，确认后提交</span>
        </div>
        <div v-else>{{`您即将提交数据给报告，请确认`}}</div>
      </template>
      <template v-else>
        <div v-if="confirmSubmitMsg.floatAllocExceed < 0 || confirmSubmitMsg.yearlyAllocExceed < 0">
          <span>{{ `${confirmSubmitMsg.unitName}已分社会调查报告` }}</span><span class="obvious">超预算</span><span>。其中</span>
          <span
            v-if="confirmSubmitMsg.floatAllocExceed < 0"
            class="important-text"
          >，{{`浮动制人员分发结果超预算 ${ fixedNumber(Math.abs(confirmSubmitMsg.floatAllocExceed))(2) } 万元`}}</span>
          <span
            v-if="confirmSubmitMsg.yearlyAllocExceed < 0"
            class="important-text"
          >，{{`年薪制人员分发结果超预算 ${ fixedNumber(Math.abs(confirmSubmitMsg.yearlyAllocExceed))(2) } 万元`}}</span>
          <span>{{`，请填写对应的超额原因，并与您的上级 ${confirmSubmitMsg.empName} 沟通。`}}</span>
        </div>
        <div v-else>{{`您即将提交数据给您的上级 ${confirmSubmitMsg.empName} 审核，请确认`}}</div>
      </template>
      <template slot="footer">
        <a-button type="primary" @click="confirmModalVisible = false;" ghost>重新分发</a-button>
        <a-button
          v-if="(confirmSubmitMsg.floatAllocExceed < 0 || confirmSubmitMsg.yearlyAllocExceed < 0) && !confirmSubmitMsg.isTopNode"
          type="primary"
          @click="confirmModalVisible = false;editorModalVisible = true;"
        >填写超额原因</a-button>
        <a-button v-else type="primary" @click="confirmModalVisible = false;confirmSubmit()">确认提交</a-button>
      </template>
    </a-modal>
    <a-modal title="填写超额原因" :visible="editorModalVisible" @cancel="editorModalVisible = false">
      <template>
        <div v-if="confirmSubmitMsg.floatAllocExceed < 0">
          <h4>
            <span class="obvious">*</span> 浮动制
          </h4>
          <a-textarea placeholder="请填写超额原因" v-model="floatRemark"></a-textarea>
        </div>
        <br />
        <div v-if="confirmSubmitMsg.yearlyAllocExceed < 0">
          <h4>
            <span class="obvious">*</span> 年薪制
          </h4>
          <a-textarea placeholder="请填写超额原因" v-model="yearlyRemark"></a-textarea>
        </div>
      </template>
      <template slot="footer">
        <a-button type="primary" @click="editorModalVisible = false;" ghost>重新分发</a-button>
        <a-button type="primary" @click="editorModalVisible = false;confirmSubmit()">确认提交</a-button>
      </template>
    </a-modal>
    <!-- <guide-page :from="'pendingHandledUnit'" /> -->
    <a-modal title="提示" :visible="tipsModalVisible">
      <!-- <span>如下三种状态的社会调查报告单元需处理完毕后，方可提交：</span> 
      <br>
      <span>1、【未送审】需您的下级送审，并审核通过；</span> 
      <br>
      <span>2、【待分发】需点击“开始分发”按钮，录入分发金额完成分发；</span> 
      <br>
      <span>3、【待审核】需点击“开始审核”按钮，审核下级送审分发金额并通过</span>  -->
      <span>{{ this.subErrorMsg }}</span>
      <div slot="footer">
        <a-button type="primary" @click="tipsModalVisible = false;">知道了</a-button>
      </div>
    </a-modal>
  </div>
</template>

<script>
import { getPendingHandledList, submitPendingUnit } from '@/api/bonusDistributeServer'
// import GuidePage from '@/components/Guide'
import OperationButton from '@/views/bonusDistribute/common/OperationButton'
import StatusContent from '@/views/bonusDistribute/common/StatusContent'
import { fixedNumber } from '@/utils/util'
const columnsPlan = [
  {
    // title: '社会调查报告单元',
    dataIndex: 'unitName',
    slots: { title: 'unitNameTitle' },
    scopedSlots: { customRender: 'unitName' },
    width: 320,
    fixed: 'left'
  },
  {
    title: '浮动制人员数据',
    children: [
      {
        title: '预算',
        dataIndex: 'floatAllocBudget',
        align: 'center',
        scopedSlots: { customRender: 'floatAllocBudget' },
        width: 160
      },
      {
        title: '已分社会调查报告',
        dataIndex: 'totleFloatAllocMoney',
        align: 'center',
        width: 100
      },
      {
        title: '剩余预算',
        dataIndex: 'totleFloatResidue',
        scopedSlots: { customRender: 'totleFloatResidue' },
        align: 'center',
        width: 100
      },
      {
        title: '总人数',
        dataIndex: 'totleFloatMembers',
        align: 'center',
        scopedSlots: { customRender: 'totleFloatMembers' },
        width: 70
      },
      {
        title: '异常人数',
        dataIndex: 'floatDifferences',
        align: 'center',
        scopedSlots: { customRender: 'floatDifferences' },
        width: 80
      },
      {
        title: '超额原因',
        dataIndex: 'floatRemark',
        align: 'center',
        scopedSlots: { customRender: 'floatRemark' },
        width: 180
      }
    ]
  },
  {
    title: '年薪制人员数据',
    children: [
      {
        title: '预算',
        dataIndex: 'yearlyAllocBudget',
        align: 'center',
        scopedSlots: { customRender: 'yearlyAllocBudget' },
        width: 100
      },
      {
        title: '已分社会调查报告',
        dataIndex: 'totleYearlyAllocMoney',
        align: 'center',
        width: 100
      },
      {
        title: '剩余预算',
        dataIndex: 'totleYearlyResidue',
        scopedSlots: { customRender: 'totleYearlyResidue' },
        align: 'center',
        width: 100
      },
      {
        title: '总人数',
        dataIndex: 'totleYearlyMembers',
        align: 'center',
        scopedSlots: { customRender: 'totleYearlyMembers' },
        width: 70
      },
      {
        title: '异常人数',
        dataIndex: 'yearlyDifferences',
        align: 'center',
        scopedSlots: { customRender: 'yearlyDifferences' },
        width: 80
      },
      {
        title: '超额原因',
        dataIndex: 'yearlyRemark',
        align: 'center',
        scopedSlots: { customRender: 'yearlyRemark' },
        width: 180
      }
    ]
  },
  {
    title: '状态',
    dataIndex: 'assignStatus',
    align: 'left',
    scopedSlots: { customRender: 'assignStatus' },
    width: 100,
    fixed: 'right'
  },
  {
    title: '分发/审核社会调查报告',
    dataIndex: 'checkOperation',
    align: 'center',
    scopedSlots: { customRender: 'checkOperation' },
    width: 120,
    fixed: 'right'
  }
]

export default {
  name: 'PendingHandledUnit',
  components: {
    OperationButton,
    StatusContent
  },
  data() {
    return {
      loading: false,
      refreshOperationButton: 1, // 用于刷新按钮组件，每次刷新就 +1
      subErrorMsg: '',
      // 查询参数
      queryParam: {
        treeId: null, // 社会调查报告单元树ID
        unitId: null, // 社会调查报告单元ID
        status: null // 'pending' 未处理， 'handled' 已处理
      },
      columnsPlan, // 表头
      expandedRowKeys: [],
      dataPlanSearch: [],
      searchUnitVisible: false,
      confirmModalVisible: false, // 超额提示悬浮框
      editorModalVisible: false, // 编辑超额原因悬浮框
      tipsModalVisible: false,
      confirmSubmitMsg: {},
      searchedValue: undefined,
      floatRemark: undefined,
      yearlyRemark: undefined,
      dataSet: [], // 表数据源
      scrollConfig: { x: 1860, y: 360 }
    }
  },
  computed: {
    showSubmit() {
      return this.queryParam.status === 'pending' 
      && this.dataSet[0]
      && this.dataSet[0].assignStatus !== 25 
      && this.dataSet[0].assignStatus !== 50
    },
    canSubmit() {
      return this.dataSet[0] && this.dataSet[0].subAnable === 1
    },
  },
  watch: {},
  mounted() {
    /**由于table多层表头 + 固定表头的关系，
     * 导致在头部内的嵌套组件会发生异常情况，
     * a-popover组件内的输入框，获取焦点后，整个 a-popover 就会消失
     * 为了避免这样的情况，只能把 a-popover组件 放在table外面
     * 然后根据表头的位置，进行动态布局*/
    const unitNameSearchModule = document.querySelector('.unit-name-search')
    const unitNameModule = document.querySelector('.unit-name')
    const {width, height} = this.countTextReact(unitNameModule.innerHTML.toString())
    unitNameSearchModule.style.top = '44px' // 双层表头高:110px，搜索图标高:22px，所以垂直居中的位置为44px
    unitNameSearchModule.style.left = (width + 10) + 'px'
    this.$nextTick(() => {
      this.scrollConfig.y = document.body.offsetHeight - 300
    })
  },
  created() {
    if (this.$route.query) {
      this.queryParam.treeId = this.$route.query.bonusTreeId
      this.queryParam.unitId = this.$route.query.bonusUnitId
      this.queryParam.unitName = this.$route.query.bonusUnitName
      this.queryParam.status = this.$route.query.status // 'pending' 未处理， 'handled' 已处理
      this.getData()
    }
  },
  methods: {
    fixedNumber,
    countTextReact(text) {
      text = text.trim()
      const a = document.createElement('span')
      a.style.visibility = 'hidden'
      a.innerHTML = text
      document.body.append(a)
      const width = a.offsetWidth
      const height = a.offsetHeight
      a.remove()
      return {width, height}
    },
    keepFocusMembers() {
      this.$router.push({
        path: '/bonusDistribute/distributing',
        query: {
          totalMembers: Number.parseInt(this.dataSet[0].totleFloatMembers) + Number.parseInt(this.dataSet[0].totleYearlyMembers),
          rootTreeId: this.queryParam.treeId,
          rootUnitId: this.queryParam.unitId,
          rootUnitName: this.queryParam.unitName,
          rootAssignStatus: this.dataSet[0].assignStatus,
          summaryTreeId: this.dataSet[0].treeId,
          summaryUnitId: this.dataSet[0].unitId,
          yearlyRemark: this.dataSet[0].yearlyRemark,
          floatRemark: this.dataSet[0].floatRemark,
          treeId: this.dataSet[0].treeId,
          unitId: this.dataSet[0].unitId,
          summaryNotDeep: 0, // 汇总头部【查看】时带出所有子节点数据
          bizType: 'allocation',
          status: this.queryParam.status,
          deep: true, // 人员列表【查看】时带出所有子节点数据
          type: 'keepFocus',
        }
      })
    },
    firstLineCommt(text) {
      // 中文长度为2，英文长度为1
      if (!text) return ''
      if (text.length <= 10) return text
      let res = ''
      let realIndex = 0
      for (let loop = 0; loop < 20; loop++) {
        const char = text[realIndex] || ''
        if (char.charCodeAt() > 256) {
          loop++
        }
        realIndex++
        res += char
      }
      return res
    },
    secondLineCommt(text) {
      // 中文长度为2，英文长度为1
      if (!text) return ''
      const firstLineLength = this.firstLineCommt(text).length
      if (text.length <= firstLineLength) return ''
      if (text.length - firstLineLength <= 10) return text.substring(firstLineLength, text.length)
      let res = ''
      let realIndex = firstLineLength
      for (let loop = firstLineLength; loop < firstLineLength + 17; loop++) {
        const char = text[realIndex] || ''
        if (char.charCodeAt() > 256) {
          loop++
        }
        realIndex++
        res += char
      }
      return res + '...'
    },
    goback() {
      this.$router.push({
        path: '/bonusDistribute',
      })
    },
    async submit() {
      // if (!this.canSubmit) {
      //   return this.tipsModalVisible = true
      // }
      const res = await submitPendingUnit({
        treeId: this.queryParam.treeId,
        unitId: this.queryParam.unitId
      })
      if (res.code === 200) {
        this.confirmSubmitMsg = res.data || {}
        this.confirmModalVisible = true
      } else {
        this.subErrorMsg = res.msg
        this.tipsModalVisible = true
        // this.$message.error(res.msg)
      }
    },
    async confirmSubmit() {
      const pass = this.verify()
      if (!pass) return this.$warning({ content: '请先填写超额原因!' })
      const res = await submitPendingUnit({
        conform: 1,
        treeId: this.queryParam.treeId,
        unitId: this.queryParam.unitId,
        floatRemark: this.floatRemark,
        yearlyRemark: this.yearlyRemark
      })
      if (res.code === 200) {
        this.$success({
          title: '提示',
          content: '提交成功',
          onOk: () => {
            this.goback()
          }
        })
      } else {
        this.$message.error(res.msg)
      }
    },
    verify() {
      let res = true
      if (this.confirmSubmitMsg.floatOverBudget > 0) {
        res = this.floatRemark.length > 0
      }

      if (this.confirmSubmitMsg.yearlyOverBudget > 0) {
        res = this.yearlyRemark.length > 0
      }
      return res
    },
    async getData() {
      this.loading = true
      const res = await getPendingHandledList({ ...this.queryParam })
      ++this.refreshOperationButton
      if (res.code === 200 && res.data) {
        this.dataSet = [res.data]
        this.dataPlanSearch = await this.getUnitNamesFromTree(this.dataSet)
        // 默认展开所有分发人的第一层子级
        this.defaultExpands()
      }
      this.loading = false
    },
    defaultExpands(){
      if (this.dataSet && this.dataSet.length) {
        this.expandedRowKeys = []
        loop(this.dataSet, this.expandedRowKeys, this.$store.state.user.userId)
      }
      function loop(nodes, expandedRowKeys, usrId) {
        nodes.forEach((node) => {
          if (usrId == node.ownerId) {
            expandedRowKeys.push(node.level)
          }
          if (node.children && node.children.length) {
            return loop(node.children, expandedRowKeys, usrId)
          }
        })
      }
    },
    // 折叠展开图标点击事件
    expandicon(expanded, record) {
      if (expanded) {
        this.expandedRowKeys.push(record.level)
      } else {
        var expandedRowKeys = this.expandedRowKeys.filter(RowKey => RowKey !== record.level)
        this.expandedRowKeys = expandedRowKeys
      }
    },
    getUnitNamesFromTree(arr = []) {
      const newArr = []
      for (let items of arr) {
        const loop = data => {
          newArr.push({
            level: data.level,
            unitName: data.unitName
          })
          let child = data.children
          if (child) {
            for (let i = 0; i < child.length; i++) {
              loop(child[i])
            }
          }
        }
        loop(items)
      }
      return newArr
    },
    //模糊搜索社会调查报告单元下拉框的内容匹配
    filterOption(input, option) {
      return option.componentOptions.children[0].text.toLowerCase().indexOf(input.toLowerCase()) >= 0
    },
    seachMember() {
      this.$router.push({
        path: '/bonusDistribute/searchMember',
        query: {
          treeId: this.queryParam.treeId,
          unitId: this.queryParam.unitId,
          bizType: 'appr',
          deep: true
        }
      })
    },
    handleTableChange(pagination, filters, sorter) {},
    handleClickSearch(value) {
      if (value != undefined && value != null && value != '') {
        /* let { unitName, level } = this.getSearch(this.dataPlan,value) */

        let levelArr = value.split('-')

        let expandedRowKeys = [this.dataSet[0].level]

        //将要展开的数组根据levelArr记录的路径依次从最顶级进行展开
        levelArr.reduce((prev, cur) => {
          let current = prev + '-' + cur

          expandedRowKeys.push(current)

          return current
        })

        //找到搜索的树表项目
        let currentItem = levelArr.reduce((prev, cur, index) => {
          if (index == 0) {
            return prev[index]
          } else {
            return prev['children'][cur - 1]
          }
        }, this.dataSet)

        //给其添加高亮字段的控制属性
        currentItem.isHighlight = true

        this.expandedRowKeys = expandedRowKeys
      }

      this.searchUnitVisible = false
    }
  }
}
</script>
<style lang="less" scoped>
.table-special-box{
  margin-top: -2rem; 
}
.unit-name {
  display:flex; align-items:center;
}
.unit-name-search {
  position: relative;
  top: 0;
  left: 0;
  z-index: 1111
}
.confrim-modal {
  span {
    font-size: 1.1rem;
  }
  span.important-text {
    font-size: 1.15rem;
    color: #2eca4a;
  }
}
/deep/ .table-row {
  > td:nth-child(1) {
    // display: flex;
    // align-items: center;
    .ant-table-row-expand-icon {
      position: relative;
      top: -50%;
      line-height: 17px;
    }

    .bonus-unit {
      line-height: 2;
      display: inline-block;
      > i {
        display: table-cell;
        vertical-align: middle;
        font-size: 1.4rem;
        margin-right: 0.4rem;
        cursor: pointer;
      }
      > div {
        padding-left: 0.5rem;
        display: table-cell;
        vertical-align: middle;
        h4.bonus-unit-inner-title {
          color: #2e2e3b;
          margin: 0;
        }
        span.bonus-unit-inner-content {
          color: #7c7b80;
          font-size: 0.9rem;
        }
      }
    }
  }
  td {
    white-space: nowrap;
  }
}

@warningColor: #f7b500;
.warning {
  color: @warningColor;
}
.warning-icon-fixed {
  margin: 0 7px;
}

.obvious {
  color: #e02020 !important;
}

.unobvious {
  color: #16a944 !important;
}

div.warning-bar {
  padding: 0.5rem !important;
  border-left: 1px solid @warningColor;
  border-radius: 0 6px 6px 0 !important;
  margin-top: 18px;
  p {
    margin: 0;
    font-size: 1rem;
  }
}
.ellipsis-tag {
  width: 5rem;
  white-space: no-wrap;
  overflow: hidden;
  text-overflow: ellipsis;
}
/deep/ .ant-table-fixed-left {
  .ant-table-body-inner {
    margin-right: -9.5px;
  }
}
/deep/ .ant-table-fixed-right {
  .ant-table-header {
    padding-right: 9px;
    padding-bottom: 0;
  }
  .ant-table-body-inner {
    margin-left: -9px;
    padding-left: 10px;
  }
}
</style>
