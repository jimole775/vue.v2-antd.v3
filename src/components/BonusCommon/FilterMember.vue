<template>
  <div class="bonus-filter-filed">
    <div class="form-data table-page-search-wrapper">
      <a-form layout="inline">
        <a-row :gutter="24">
          <a-col :sm="8">
            <a-form-item label="姓名" :label-col="labelCol" :wrapper-col="wrapperCol">
              <a-input v-model="formDT.empName" placeholder="请输入姓名" allowClear />
            </a-form-item>
          </a-col>
          <a-col :sm="8">
            <a-form-item label="工号" :label-col="labelCol" :wrapper-col="wrapperCol">
              <a-input v-model="formDT.empNumber" placeholder="请输入工号" allowClear />
            </a-form-item>
          </a-col>
          <a-col :sm="8">
            <a-form-item label="系统" :label-col="labelCol" :wrapper-col="wrapperCol">
              <!-- <a-input allowClear v-model="formDT.belongSystem" placeholder="请输入系统" /> -->
              <a-select allowClear v-model="formDT.belongSystem" placeholder="请选择">
                <a-select-option
                  v-for="(item,index) in lookupData.belongSystemData"
                  :key="index"
                  :value="item.lookupCode"
                >{{item.lookupDisplay}}</a-select-option>
              </a-select>
            </a-form-item>
          </a-col>
        </a-row>
        <a-row :gutter="24">
          <a-col :sm="8">
            <a-form-item label="部门" :label-col="labelCol" :wrapper-col="wrapperCol">
              <!-- <a-input v-model="formDT.empDepartment" placeholder="请输入部门" allowClear /> @change="handleChange"   -->
              <a-select
                v-model="formDT.empDepartment"
                placeholder="请输入部门"
                showSearch
                :defaultActiveFirstOption="false"
                :showArrow="false"
                :filterOption="false"
                @search="empDepartmentSearch"
                :notFoundContent="null"
                allowClear
              >
                <a-select-option value>全部</a-select-option>
                <a-select-option
                  v-for="items in lookupData.empDepartmentData"
                  :key="items.pkLookupId"
                  :value="items.lookupCode"
                >{{items.lookupDisplay}}</a-select-option>
              </a-select>
            </a-form-item>
          </a-col>
          <a-col :sm="8">
            <a-form-item label="等级" :label-col="labelCol" :wrapper-col="wrapperCol">
              <a-select allowClear v-model="formDT.empLevel" placeholder="请选择">
                <a-select-option value>全部</a-select-option>
                <a-select-option
                  v-for="items in lookupData.empLevelData"
                  :key="items.pkLookupId"
                  :value="items.lookupCode"
                >{{items.lookupDisplay}}</a-select-option>
              </a-select>
            </a-form-item>
          </a-col>
          <a-col :sm="8">
            <a-form-item label="管理等级" :label-col="labelCol" :wrapper-col="wrapperCol">
              <a-select allowClear v-model="formDT.manageLevel" placeholder="请选择">
                <a-select-option value>全部</a-select-option>
                <a-select-option
                  v-for="items in lookupData.empManagerData"
                  :key="items.pkLookupId"
                  :value="items.lookupCode"
                >{{items.lookupDisplay}}</a-select-option>
              </a-select>
            </a-form-item>
          </a-col>
        </a-row>
        <a-row :gutter="24">
          <a-col :sm="8">
            <a-form-item label="薪酬模式" :label-col="labelCol" :wrapper-col="wrapperCol">
              <a-select allowClear v-model="formDT.bonusType" placeholder="请选择">
                <a-select-option value>全部</a-select-option>
                <a-select-option value="1">年薪制</a-select-option>
                <a-select-option value="2">浮动制</a-select-option>
                <a-select-option value="3">无社会调查报告</a-select-option>
              </a-select>
            </a-form-item>
          </a-col>

          <a-col :sm="8">
            <a-form-item label="效率" :label-col="labelCol" :wrapper-col="wrapperCol">
              <a-select v-model="formDT.bonusBudget" placeholder="请选择" allowClear>
                <a-select-option value>全部</a-select-option>
                <a-select-option
                  v-for="items in  lookupData.bonusBudgetData"
                  :key="items.pkLookupId"
                  :value="items.lookupCode"
                >{{items.lookupDisplay}}</a-select-option>
              </a-select>
            </a-form-item>
          </a-col>
          <a-col :sm="8">
            <a-form-item label="社会调查报告单元" :label-col="labelCol" :wrapper-col="wrapperCol">
              <a-input v-model="formDT.bounsUnitName" placeholder="请输入社会调查报告单元" allowClear />
            </a-form-item>
          </a-col>
        </a-row>
        <a-row :gutter="24">
          <a-col :sm="8">
            <a-form-item label="在职状态" :label-col="labelCol" :wrapper-col="wrapperCol">
              <a-select v-model="formDT.onWork" placeholder="请选择在职状态" allowClear>
                <a-select-option value>全部</a-select-option>
                <a-select-option value="1">有效</a-select-option>
                <a-select-option value="2">无效</a-select-option>
              </a-select>
            </a-form-item>
          </a-col>

          <a-col :sm="8">
            <a-form-item label="处理方式" :label-col="labelCol" :wrapper-col="wrapperCol">
              <a-select v-model="formDT.entryWay" placeholder="请选择处理方式" allowClear>
                <a-select-option value>全部</a-select-option>
                <a-select-option
                  v-for="items in lookupData.entryWayData"
                  :key="items.pkLookupId"
                  :value="items.lookupCode"
                >{{items.lookupDisplay}}</a-select-option>
              </a-select>
            </a-form-item>
          </a-col>
          <a-col :sm="8"></a-col>
        </a-row>
      </a-form>
    </div>
  </div>
</template>

<script>
export default {
  name: 'FilterMember', // 展开树表
  props: {
    // visiable: {
    //   type: Boolean,
    //   default: false
    // },
    // moduleName: {
    //   type: String,
    //   default: 'FilterModal'
    // },
    // value: {
    //   type: Object,
    //   required: true
    // }
  },
  data() {
    return {
      getInputText: '', // 输入查询
      empNameData: [], // 人员搜索
      lookupData: {
        centerData: [], // 中心
        belongSystemData: [], // 系统
        authGradeData: [], // 认证等级
        taxDepartmentData: [], // 纳利部门
        empRealmData: [], //领域
        bonusBudgetData: [], // 效率
        empLevelData: [], // 等级
        empManagerData: [], // 管理等级
        entryWayData: [], // 处理方式
        empDepartmentData: [], // 部门
        groupNameData: [], // 小组
        empPassagewayData: [], // 通道
        empJobData: [] // 岗位（职务）
      }, // 码表全量数据
      labelCol: { span: 8 },
      wrapperCol: { span: 16 },
      formDT: {
        bounsUnitName: '', //社会调查报告单元名
        empLevel: '',
        manageLevel: '',
        bonusType: '',
        bonusBudget: '',
        onWork: '',
        entryWay: ''
      }, //数据
      unitLevelData: [],
      entryWayData: [],
      bonusBudgetData: [],
      manageLevelData: []
    }
  },
  methods: {
    empDepartmentSearch(value) {
      console.log('查找部门:', value)

      this.$http.get('/lookup/lookList?LookupName=C_DEPT_DESCR3&lookupDisplay=' + value).then(res => {
        console.log('请求返回的lookList数据', res)
        if (res.code === 200) {
          this.lookupData['empDepartmentData'] = res.data //选择上级单元数据
        } else {
          this.$error({
            title: '出错了',
            content: res.msg
          })
        }
      })
    }
  },
  created() {
    this.$http.get('/lookup/list').then(res => {
      if (res.code === 200) {
        const lookupList = res.data //选择用户列表数据
        lookupList.forEach((item) => {
          switch(item.lookupName) {
            case 'C_DEPT_DESCR1': { this.lookupData.belongSystemData.push(item) }break
            case 'C_DEPT_DESCR2': { this.lookupData.centerData.push(item) }break
            case 'C_RATE_RANK': { this.lookupData.authGradeData.push(item) }break
            case 'DESCR5': { this.lookupData.empRealmData.push(item) }break
            case 'COMPANY_DESCR': { this.lookupData.taxDepartmentData.push(item) }break
            case 'bonusBudget': { this.lookupData.bonusBudgetData.push(item) }break
            case 'empLevel': { this.lookupData.empLevelData.push(item) }break // 等级
            case 'rankTypeM': { this.lookupData.empManagerData.push(item) }break // 管理等级
            case 'entryWay': { this.lookupData.entryWayData.push(item) }break
          }
        })
      } else {
        this.$error({
          title: '出错了',
          content: res.msg
        })
      }
    })

    // this.$http.get('/lookup/lookList?LookupName=empLevel').then(res => {
    //   // console.log('等级数据', res)
    //   if (res.code === 200) {
    //     this.unitLevelData = res.data
    //   } else {
    //     this.$error({
    //       title: '出错了',
    //       content: res.msg
    //     })
    //   }
    // })
    // this.$http.get('/lookup/lookList?LookupName=entryWay').then(res => {
    //   // console.log('处理方式', res)
    //   if (res.code === 200) {
    //     this.entryWayData = res.data
    //   } else {
    //     this.$error({
    //       title: '出错了',
    //       content: res.msg
    //     })
    //   }
    // })
    // this.$http.get('/lookup/lookList?LookupName=bonusBudget').then(res => {
    //   // console.log('效率', res)
    //   if (res.code === 200) {
    //     this.bonusBudgetData = res.data
    //   } else {
    //     this.$error({
    //       title: '出错了',
    //       content: res.msg
    //     })
    //   }
    // })
    // this.$http.get('/lookup/lookList?LookupName=manageLevel').then(res => {
    //   // console.log('管理等级', res)
    //   if (res.code === 200) {
    //     this.manageLevelData = res.data
    //   } else {
    //     this.$error({
    //       title: '出错了',
    //       content: res.msg
    //     })
    //   }
    // })
  },
  mounted() {
    if (this.$route.query.unitName) {
      // 透传过来的是否有单元名称
      this.formDT.bounsUnitName = this.$route.query.unitName
    }
  },
  watch: {},
  computed: {}
}
</script>
<style lang="less">
.form-data {
  .ant-form-item {
    .ant-form-item-label {
      width: 33.333333% !important;
    }
  }
}
</style>
<style lang="less" scoped>
.bonus-tree {
  height: 500px;
}
.form-data {
  .ant-row {
    margin-bottom: 12px;
  }
}
ul,
li,
ol {
  list-style: none;
}
.list-select {
  position: relative;
  margin: 0 0 1rem 0;
  li {
    margin-right: 10px;
    padding: 3px 10px 3px 10px;
    display: inline-block;
    position: relative;
    background: #f0f0f0;
    border-radius: 4px;
    margin: 0.3rem;
    i.anticon {
      cursor: pointer;
      font-size: 0.5rem;
      position: relative;
      top: -0.5rem;
      &:hover {
        color: red;
      }
    }
  }
}
/deep/ .ant-row {
  margin: 0.3rem 0;
}
</style>
