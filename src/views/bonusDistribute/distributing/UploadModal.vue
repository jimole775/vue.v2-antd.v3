<template>
  <div>
    <a-modal title="导入" width="500px" v-model="showUpload" @ok="uploadConfirm">
      <up-load 
        :urlSrc="`/alloc/fouceon/import?unitId=${rootUnitId}&treeId=${rootTreeId}`"
        :customTips="true"
        @getFileTableData="reload"
      >
        <template slot="templateDownload">
          <div class="link">
            <a
              :href="spillDownloadUrl(`/template/重点关注人员导入模板V1.xls`)"
              target="_blank"
              rel="noopener noreferrer"
            >下载导入模板</a>
          </div>
        </template> 
      </up-load>
    </a-modal>
    <a-modal width="500px" v-model="showErrorModal">
      <h3 slot="title" style="margin: 0">
        导入失败<span>（{{msg}}）</span>
      </h3>
      <p>以下为异常人员:</p>
      <a-table
        rowKey="empNumber"
        :columns="columns"
        :pagination="false"
        :scroll="{y: 300}"
        :dataSource="dataSet">
      </a-table>
      <template slot="footer">
        <a-button class="btn-primary" type="primary" @click="showErrorModal = false">知道了</a-button>
      </template>  
    </a-modal>
  </div>
</template>

<script>
import UpLoad from '@/components/BonusCommon/UpLoad' // 引用选择列组件
export default {
  name: 'UploadModal', // 展开树表
  components: {
    UpLoad
  },
  props: {
    visiable: {
      type: Boolean,
      default: false
    },
    rootUnitId: {
      type: String | Number,
      default: null
    },
    rootTreeId: {
      type: String | Number,
      default: null
    }
  },
  data() {
    return {
      showUpload: false,
      showErrorModal: false,
      msg: '',
      dataSet: [],
      columns: [
        {
          title: '工号',
          dataIndex: 'empNumber',
        },{
          title: '姓名',
          dataIndex: 'empName',
        }]
    }
  },
  watch: {
    visiable(val) {
      this.showUpload = val
    },
    showUpload(val) {
      this.$emit('visiableEvent', val)
    },
  },
  computed: {
  },
  methods: {
    uploadConfirm() {
      this.showUpload = false
    },
    reload(res) {
      if (res.code === 200) {
        this.$success({
          title: '上传成功',
          content: res.msg
        })
      } else {
        this.showErrorModal = true
        this.dataSet = res.data
        this.msg = res.msg
      }
      this.$emit('reload')
    },
    spillDownloadUrl(target) {
      return process.env.VUE_APP_HOST_URL + target
    },
  }
}
</script>
<style lang="less" scoped>
</style>