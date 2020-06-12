<template>
  <a-modal title="筛选人员" width="800px" height="600px" v-model="showModal" @ok="confirm">
    <div class="bonus-filter-filed">
      <div>
        <p>
          已选条件（共 {{ fieldsList.length }} 个）
          <a href="javascript: void(0)" @click="clearFields">清空</a>
        </p>
        <ul class="list-select">
          <li v-for="(item, index) in fieldsList" :key="index">
            <span>{{ item.val }}</span>
            <a-icon type="close" @click="delFiled(item)" />
          </li>
        </ul>
        <p>全部条件（16个）</p>
        <div class="form-data">
          <a-form>
            <a-row :gutter="24">
              <a-col :span="8">
                <a-form-item label="人 员:" :label-col="labelCol" :wrapper-col="wrapperCol">
                  <multi-select
                    v-model="formData.empNums"
                    :url="'/treeMember/allot/memberList'"
                    :params="{
                      treeId : treeId,
                      unitId : unitId,
                      empName: formData.empNums instanceof Array ? formData.empNums.toString() : formData.empNums,
                      deep: true }"
                    :method="'post'"
                    :showSearch="true"
                    :remoteFilter="true"
                    :getField="'empNumber'"
                    :showField="'empName'"
                    :placeholder="'请输入'"
                    @changeData="(vals, texts, items) => signSelectedValuesMulti('empNums', 'empNumber', 'empName', vals, items)"
                  >
                  </multi-select>
                </a-form-item>
              </a-col>
              <a-col :span="8">
                <a-form-item label="处理方式:" :label-col="labelCol" :wrapper-col="wrapperCol">
                  <single-select
                    v-model="formData.entryWay"
                    :url="'/lookup/lookList'"
                    :params="{ LookupName: 'entryWay' }"
                    :getField="'lookupCode'"
                    :showField="'lookupDisplay'"
                    @changeData="(val, text, item) => signSelectedValuesSingle('entryWay', val, text, item)"
                  >
                  </single-select>
                </a-form-item>
              </a-col>
              <a-col :span="8">
                <a-form-item label="系 统:" :label-col="labelCol" :wrapper-col="wrapperCol">
                  <!-- <a-input placeholder="请输入" allowClear v-model="formData.belongSystem" @change="(evt) => signSelectedValuesSingle('belongSystem', formData.belongSystem, formData.belongSystem)"/> -->
                  <single-select
                    ref="BelongSystem"
                    v-model="formData.belongSystem"
                    :url="'/treeMember/allot/lookupList'"
                    :params="{
                      lookupType: 'system',
                      bonusType,
                      treeId,
                      unitId,
                      focusOn,
                      deep }"
                    :method="'post'"
                    :getField="'lookupCode'"
                    :showField="'lookupDisplay'"
                    @changeData="(val, text, item) => signSelectedValuesSingle('belongSystem', val, text, item)"
                  >
                  </single-select>
                </a-form-item>
              </a-col>
            </a-row>
            <a-row :gutter="24">
              <a-col :span="8">
                <a-form-item label="中 心:" :label-col="labelCol" :wrapper-col="wrapperCol">
                  <!-- <a-input placeholder="请输入" allowClear v-model="formData.center" @change="(evt) => signSelectedValuesSingle('center', formData.center, formData.center)"/> -->
                    <single-select
                    ref="Center"
                    v-model="formData.center"
                    :url="'/treeMember/allot/lookupList'"
                    :params="{
                      lookupType: 'center',
                      bonusType,
                      treeId,
                      unitId,
                      focusOn,
                      deep }"
                    :method="'post'"
                    :getField="'lookupCode'"
                    :showField="'lookupDisplay'"
                    @changeData="(val, text, item) => signSelectedValuesSingle('center', val, text, item)"
                  >
                  </single-select>
                </a-form-item>
              </a-col>
              <a-col :span="8">
                <a-form-item label="部 门:" :label-col="labelCol" :wrapper-col="wrapperCol">
                  <single-select
                    ref="EmpDepartment"
                    v-model="formData.empDepartment"
                    :url="'/treeMember/allot/lookupList'"
                    :params="{
                      lookupType: 'C_DEPT_DESCR3',
                      bonusType,
                      treeId,
                      unitId,
                      focusOn,
                      deep }"
                    :method="'post'"
                    :showSearch="true"
                    :placeholder="'请输入'"
                    :getField="'lookupCode'"
                    :showField="'lookupDisplay'"
                    @changeData="(val, text, item) => signSelectedValuesSingle('empDepartment', val, text, item)"
                  >
                  </single-select>
                </a-form-item>
              </a-col>
              <a-col :span="8">
                <a-form-item label="小 组:" :label-col="labelCol" :wrapper-col="wrapperCol">
                  <single-select
                    ref="GroupName"
                    v-model="formData.groupName"
                    :url="'/treeMember/allot/lookupList'"
                    :params="{
                      lookupType: 'C_DEPT_DESCR4',
                      bonusType,
                      treeId,
                      unitId,
                      focusOn,
                      deep }"
                    :method="'post'"
                    :showSearch="true"
                    :placeholder="'请输入'"
                    :getField="'lookupCode'"
                    :showField="'lookupDisplay'"
                    @changeData="(val, text, item) => signSelectedValuesSingle('groupName', val, text, item)"
                  >
                  </single-select>
                </a-form-item>
              </a-col>
            </a-row>
            <a-row :gutter="24">
              <a-col :span="8">
                <a-form-item label="社会调查报告单元:" :label-col="labelCol" :wrapper-col="wrapperCol">
                  <single-select
                    v-model="formData.searchChildUnitId"
                    :url="'/treeMember/units/fatch'"
                    :params="{
                      treeId,
                      unitId,
                      bonusType
                    }"
                    :showSearch="true"
                    :method="'get'"
                    :getField="'bonusUnitId'"
                    :showField="'bonusUnitName'"
                    :placeholder="'请输入'"
                    @changeData="(val, text, item) => signSelectedValuesSingle('searchChildUnitId', val, text, item)"
                  ></single-select>
                  <!-- <a-select
                    mode="default"
                    allowClear
                    :showSearch="true"
                    placeholder="请输入社会调查报告单元"
                    :filterOption="false"
                    :showArrow="false"
                    @change="(val, target) => item && signSelectedValuesSingle('searchChildUnitId', val, item.label, item)"
                  >
                    <a-select-option
                      v-for="d in searchUnitData"
                      :key="d.value"
                      :title="d.label"
                    >{{d.label}}</a-select-option>
                  </a-select> -->
                </a-form-item>
              </a-col>
              <a-col :span="8">
                <a-form-item label="职 级:" :label-col="labelCol" :wrapper-col="wrapperCol">
                  <multi-select
                    ref="EmpLevels"
                    v-model="formData.empLevels"
                    :url="'/treeMember/allot/lookupList'"
                    :params="{
                      lookupType: 'empLevel',
                      bonusType,
                      treeId,
                      unitId,
                      focusOn,
                      deep }"
                    :method="'post'"
                    :showSearch="false"
                    :getField="'lookupCode'"
                    :showField="'lookupDisplay'"
                    @changeData="(vals, texts, items) => signSelectedValuesMulti('empLevels', 'lookupCode', 'lookupDisplay', vals, items)"
                  >
                  </multi-select>
                </a-form-item>
              </a-col>
              <a-col :span="8">
                <a-form-item label="岗 位:" :label-col="labelCol" :wrapper-col="wrapperCol">
                  <single-select
                    ref="EmpJob"
                    v-model="formData.empJob"
                    :url="'/treeMember/allot/lookupList'"
                    :params="{
                      lookupType: 'JOBCODE_DESCR',
                      bonusType,
                      treeId,
                      unitId,
                      focusOn,
                      deep }"
                    :method="'post'"
                    :showSearch="true"
                    :getField="'lookupCode'"
                    :showField="'lookupDisplay'"
                    :placeholder="'请输入'"
                    @changeData="(val, text, item) => signSelectedValuesSingle('empJob', val, text, item)"
                  >
                  </single-select>
                </a-form-item>
              </a-col>
            </a-row>
            <a-row :gutter="24">
              <a-col :span="8">
                <a-form-item label="是否升级:" :label-col="labelCol" :wrapper-col="wrapperCol">
                  <single-select
                    v-model="formData.upLevel"
                    :url="'/lookup/lookList'"
                    :params="{ LookupName: 'upLevel' }"
                    :getField="'lookupCode'"
                    :showField="'lookupDisplay'"
                    @changeData="(val, text, item) => signSelectedValuesSingle('upLevel', val, text, item)"
                  >
                  </single-select>
                </a-form-item>
              </a-col>
              <a-col :span="8">
                <a-form-item label="通 道:" :label-col="labelCol" :wrapper-col="wrapperCol">
                  <single-select
                    ref="EmpPassageway"
                    v-model="formData.empPassageway"
                    :url="'/treeMember/allot/lookupList'"
                    :params="{
                      lookupType: 'JOB_FUNCTION',
                      bonusType,
                      treeId,
                      unitId,
                      focusOn,
                      deep }"
                    :method="'post'"
                    :getField="'lookupCode'"
                    :showField="'lookupDisplay'"
                    :showSearch="true"
                    :placeholder="'请输入'"
                    @changeData="(val, text, item) => signSelectedValuesSingle('empPassageway', val, text, item)"
                  >
                  </single-select>
                </a-form-item>
              </a-col>
              <a-col :span="8">
                <a-form-item label="绩 效:" :label-col="labelCol" :wrapper-col="wrapperCol">
                  <single-select
                    v-model="formData.bonusBudget"
                    :url="'/lookup/lookList'"
                    :params="{ LookupName: 'bonusBudget' }"
                    :getField="'lookupCode'"
                    :showField="'lookupDisplay'"
                    @changeData="(val, text, item) => signSelectedValuesSingle('bonusBudget', val, text, item)"
                  >
                  </single-select>
                </a-form-item>
              </a-col>
            </a-row>
            <a-row :gutter="24">
              <a-col :span="8">
                <a-form-item label="在职状态:" :label-col="labelCol" :wrapper-col="wrapperCol">
                  <single-select
                    v-model="formData.onWork"
                    :url="'/lookup/lookList'"
                    :params="{ LookupName: 'onWork' }"
                    :getField="'lookupCode'"
                    :showField="'lookupDisplay'"
                    @changeData="(val, text, item) => signSelectedValuesSingle('onWork', val, text, item)"
                  >
                  </single-select>
                </a-form-item>
              </a-col>
              <a-col :span="8">
                <a-form-item label="分发异常:" :label-col="labelCol" :wrapper-col="wrapperCol">
                  <a-select
                    v-model="formData.difference"
                    allowClear
                    :placeholder="'请选择'"
                    @change="(val) => signSelectedValuesSingle('difference', val, val == 1 ? '是' : '否')"
                  >
                    <a-select-option value="1">是</a-select-option>
                    <a-select-option value="0">否</a-select-option>
                  </a-select>
                </a-form-item>
              </a-col>
              <a-col :span="8">
                <a-form-item label="沟通确认:" :label-col="labelCol" :wrapper-col="wrapperCol">
                  <a-select
                    v-model="formData.communicated"
                    allowClear
                    :placeholder="'请选择'"
                    @change="(val) => signSelectedValuesSingle('communicated', val, val == 'Y' ? '已沟通' : '待沟通')"
                  >
                    <a-select-option value="N">待沟通</a-select-option>
                    <a-select-option value="Y">已沟通</a-select-option>
                  </a-select>
                </a-form-item>
              </a-col>
            </a-row>
            <a-row :gutter="24">
              <a-col :span="12">
                <a-form-item label="较上年月均增幅:" :label-col="labelCol" :wrapper-col="wrapperCol">
                  <RangeInputNumber ref="lastIncreased" v-model="formData.lastIncreased" :suffix="'%'"
                  @changeData="(val) => signSelectedValuesSingle('lastIncreased', val ? val : undefined, val ? val : undefined, {})"/>
                </a-form-item>
              </a-col>
            </a-row>
          </a-form>
        </div>
      </div>
    </div>
  </a-modal>
</template>

<script>
import SingleSelect from '@/components/Dropdown/SingleSelect'
import MultiSelect from '@/components/Dropdown/MultiSelect'
import RangeInputNumber from '@/components/RangeInputNumber'
import { isEmpty, isArray, isEmptyArray, isNotEmptyArray } from '@/utils/util'
import {
  getDistributingMemberList
} from '@/api/bonusDistributeServer'
export default {
  name: 'DistributingFilterModal',
  components: {
    SingleSelect,
    RangeInputNumber,
    MultiSelect
  },
  props: {
    visiable: {
      type: Boolean,
      default: false
    },
    moduleName: {
      type: String,
      default: 'FilterModal'
    },
    bizType: {
      type: String | Number,
      default: null
    },
    bonusType: {
      type: String | Number,
      default: null
    },
    treeId: {
      type: String | Number,
      default: null
    },
    unitId: {
      type: String | Number,
      default: null
    },
    focusOn: {
      type: String | Number,
      default: null
    },
    deep: {
      type: String | Number,
      default: true
    },
  },
  data() {
    return {
      formData: {}, // 默认的没有字段，必须用户设置了，才赋字段
      selectedMap: {
        // 已选的字段，用于输出到父级使用，1和2代表两个tab页的下标
        1: {},
        2: {}
      },
      selectedView: {
        1: {},
        2: {}
      },
      selectItemsCache: {
        1: {},
        2: {}
      },
      searchUnitData: [],
      fieldsList: [], // 已选中的项，用作视图展示，是由监听 formData 的变更，自动拼装出来的，不用关心它的存储逻辑
      showModal: false,
      labelCol: { span: 8 },
      wrapperCol: { span: 16 },
      fieldMap: {
        empNums: '人员',
        entryWay: '处理方式',
        belongSystem: '系统',
        center: '中心',
        empDepartment: '部门',
        groupName: '小组',
        searchChildUnitId: '社会调查报告单元',
        empLevels: '等级',
        empJob: '职务',
        upLevel: '是否升级',
        empPassageway: '通道',
        bonusBudget: '效率',
        onWork: '在职状态',
        difference: '分发异常',
        communicated: '沟通确认',
        lastIncreased: '较上年月均增幅',
      }
    }
  },
  watch: {
    visiable(val) {
      this.showModal = val
    },
    showModal(val) {
      if (val) this.rollback()
      this.$emit('visiableEvent', val)
    },
    formData: {
      deep: true,
      handler(newData) {
        const res = []
        Object.keys(newData).forEach(key => {
          if (newData[key] || newData[key] == 0 || isNotEmptyArray(newData[key])) {
            const model = {}
            const selectorName = this.fieldMap[key]
            const selectorVal = this.selectedView[this.bonusType][key]
            model.key = key
            model.val = `${selectorName}: ${selectorVal}`
            selectorVal && res.push(model)
          }
        })
        this.fieldsList = res
      }
    },
    bonusType(_new, _old) {
      if (_new !== _old) {
        const selectedValue = this.selectedMap[_new]
        this.formData = {}
        this.reloadDataSet()
        Object.keys(selectedValue).forEach(key => {
          this.$set(this.formData, key, selectedValue[key])
        })
        this.$emit('getFilterData', this.formData)
      }
    }
  },
  computed: {},
  methods: {
    /**
     * 未确定操作的回滚逻辑：
     * 如果this.formData有属性字段，但是值为undefined，
     * 可以从 this.selectItemsCache 中回滚
     */
    rollback() {
      Object.keys(this.formData).forEach((key) => {
        if (this.formData[key] === undefined) {
          this.selectItemsCache[this.bonusType][key] && 
          this.selectItemsCache[this.bonusType][key].forEach((cacheItem) => {
            this.formData[key] = cacheItem.val
            this.selectedView[this.bonusType][key] = cacheItem.text
            this.selectedMap[this.bonusType][key] = cacheItem.text
          })
        }
        if (isEmptyArray(this.formData[key])) {
          const formDataVals = []
          const selectedMaps = []
          const selectedViews = []
          this.selectItemsCache[this.bonusType][key] && 
          this.selectItemsCache[this.bonusType][key].forEach((cacheItem) => {
            formDataVals.push(cacheItem.val)
            selectedMaps.push(cacheItem.val)
            selectedViews.push(cacheItem.text)
          })

          this.formData[key] = formDataVals
          this.selectedView[this.bonusType][key] = selectedViews.join(',')
          this.selectedMap[this.bonusType][key] = selectedMaps
        }
      })
    },
    async getUnitList() {
      
        // 年薪制人员列表
        const response = await getDistributingMemberList({
          bonusType: this.bonusType, //否	年薪制=1 ，浮动制=2
          bizType: this.bizType,
          deep: this.deep,
          current: 1,
          pageSize: 9999,
          focusOn: this.focusOn,
          treeId: this.treeId, //是 社会调查报告树ID
          unitId: this.unitId //是 社会调查报告单元ID
        })
        const wholeList = response.data.list.map((item) => {
          return {
            value: item.bounsUnitId,
            label: item.bounsUnitName
          }
        })

        this.searchUnitData = []
        wholeList.forEach((item) => {
          let already = false
          for (let _item of this.searchUnitData) {

            if (item.value === _item.value) {
              already = true
              break
            }
          }
          !already && this.searchUnitData.push(item)
        })
    },
    signSelectedValuesSingle(key, val, text, item) {
      if (isEmpty(val)) val = undefined
      if (isEmpty(text)) text = ''
      if (key === 'lastIncreased') {
        if (this.formData['lastIncreased']) {
          this.formData['lastIncreased'] = val
        } else {
          this.$set(this.formData, 'lastIncreased', val)
        }
      }
      this.selectedMap[this.bonusType][key] = val
      this.selectedView[this.bonusType][key] = text 
      if (val && text) this.selectItemsCache[this.bonusType][key] = [{
        val,
        text
      }]
    },
    signSelectedValuesMulti(key, getField, showField, vals, items) {
      if (vals.length === 0) {
        // 默认为undefined,使得placeholder可以生效
        this.selectedMap[this.bonusType][key] = []
        this.selectedView[this.bonusType][key] = undefined
        return false
      }

      // 需要存储，所以转换一下字段
      // 只保留 val, text 两个字段
      items = items.map((_item) => {
        return {
          val: _item[getField],
          text: _item[showField]
        }
      })
      /**
       * 由于多选框支持【输入搜索】，
       * 每次搜索返回的整张表都不是全量的，
       * 所以匹配到的【items】也都是单独的
       * 现在就需要把它存储起来
       **/
      if (!this.selectItemsCache[this.bonusType][key]) {
        this.selectItemsCache[this.bonusType][key] = items
      } else {
        items.forEach((item) => {
          let already = false
          for (let i = 0; i < this.selectItemsCache[this.bonusType][key].length; i++) {
            const cacheItem = this.selectItemsCache[this.bonusType][key][i]
            if (cacheItem.val === item.val) {
              already = true
              break
            }
          }
          if (!already) this.selectItemsCache[this.bonusType][key].push(item)
        }) 
      }

      // 存储选中的code
      this.selectedMap[this.bonusType][key] = vals
      
      // 处理选中的视图
      const views = []
      this.selectItemsCache[this.bonusType][key].forEach((cacheItem) => {
        if (cacheItem.val && vals.includes(cacheItem.val)) {
          views.push(cacheItem.text)
        }
      })
      this.selectedView[this.bonusType][key] = views.join(',')
    },
    confirm() {
      Object.keys(this.formData).forEach((key) => {
        const val = this.formData[key]
        if (isEmpty(val) || isEmptyArray(val)) {
          delete this.formData[key]
          delete this.selectedMap[this.bonusType][key]
        }
      })
      this.formData = { ...this.formData }
      this.selectedMap[this.bonusType] = { ...this.selectedMap[this.bonusType] }
      this.$emit('getFilterData', this.formData)
      this.showModal = false
    },
    clearFields() {
      Object.keys(this.formData).forEach((key) => {
        this.formData[key] = isArray(this.formData[key]) ? [] : undefined
      })
      Object.keys(this.selectedMap[this.bonusType]).forEach((key) => {
        this.selectedMap[this.bonusType][key] = isArray(this.selectedMap[this.bonusType][key]) ? [] : undefined
      })
      Object.keys(this.selectedView[this.bonusType]).forEach((key) => {
        this.selectedView[this.bonusType][key] = undefined
      })
    },
    delFiled(item) {
      this.formData[item.key] = isArray(this.formData[item.key]) ? [] : undefined
      this.selectedMap[this.bonusType][item.key] = isArray(this.selectedMap[this.bonusType][item.key]) ? [] : undefined
      this.selectedView[this.bonusType][item.key] = undefined
    },
    reloadDataSet() {
        // BelongSystem: '系 统',
        // Center: '中 心',
        // EmpDepartment: '部 门',
        // GroupName: '小 组',
        // EmpLevels: '职 级',
        // EmpJob: '职 务',
        // EmpPassageway: '通 道',
        this.$refs.BelongSystem && this.$refs.BelongSystem.getData()
        this.$refs.Center && this.$refs.Center.getData()
        this.$refs.EmpDepartment && this.$refs.EmpDepartment.getData()
        this.$refs.GroupName && this.$refs.GroupName.getData()
        this.$refs.EmpLevels && this.$refs.EmpLevels.getData()
        this.$refs.EmpJob && this.$refs.EmpJob.getData()
        this.$refs.EmpPassageway && this.$refs.EmpPassageway.getData()
        this.getUnitList()
    },
    cannel() {
      console.log('取消：', this.formData)
    }
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
