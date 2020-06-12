<template>
  <div class="clearfix">
    <div class="up-load">
      <a-upload :fileList="fileList" :remove="handleRemove" :beforeUpload="beforeUpload">
        <a-button>
          <a-icon type="upload" />选择文件
        </a-button>
      </a-upload>
      <a-button
        class="upload-btn"
        type="primary"
        @click="handleUpload"
        :disabled="fileList.length === 0"
        :loading="uploading"
      >{{ uploading ? '上传中' : '开始上传' }}</a-button>
    </div>
    <slot name="templateDownload"></slot>
    <div class="result">
      <h3>导入结果</h3>
      <template v-if="messageBox.length">
        <p v-if="failureTimes">
          {{failureTimes}} 条数据异常，
          <span style="color:#E02020;">请下载完整表查看异常信息</span>
        </p>
        <p v-for="(item, index) in messageBox" :key="index">
          <span :style="{color: item.type==='success' ? '#00B627' : '#E02020'}">{{ item.msg }}</span>&nbsp;&nbsp;
          <span style="color:rgba(0, 0, 0, 0.25)">{{ item.date }}</span>
        </p>
      </template>
      <template v-else>
        <p>暂无导入数据</p>
      </template>
    </div>
  </div>
</template>
<script>
import { axios } from '@/utils/request'
import { heartbeat, downloadBlobFile } from '@/utils/util'

export default {
  props: {
    urlSrc: {
      type: String | Array,
      default: null
    },
    id: {
      type: String | Array,
      default: null
    },
    heartbeatParams: {
      type: Object,
      default: null
    },
    customTips: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      fileList: [],
      uploading: false,
      failureTimes: 0,
      messageBox: [],
      uploadFileName: '',
      count: 0 // 调用次数
    }
  },
  computed: {},
  created() {
  },
  methods: {
    handleRemove(file) {
      const index = this.fileList.indexOf(file)
      const newFileList = this.fileList.slice()
      newFileList.splice(index, 1)
      this.fileList = newFileList
    },
    beforeUpload(file) {
      let FName = (this.uploadFileName = file.name)
      let fileName = file.name.lastIndexOf('.') //取到文件名开始到最后一个点的长度
      let fileNameLength = file.name.length //取到文件名长度
      let fileFormat = file.name.substring(fileName + 1, fileNameLength)
      if (fileFormat !== 'xlsx' && fileFormat !== 'xls') {
        this.$message.error('上传非法文件')
        return false
      }
      let sameName = false
      this.fileList.map(item => {
        if (item.name === FName) {
          sameName = true
          this.$message.error('上传了同名文件')
          return false
        }
      })
      if (!sameName) {
        // 一次只能上传一个文件
        this.fileList = [file]
      }
      return false
    },
    handleUpload() {
      this.uploading = true
      const { fileList } = this
      const formData = new FormData()
      fileList.forEach(file => {
        formData.append('multipartFile', file)
      })
      axios({
        url: this.urlSrc, // 上传地址
        method: 'post',
        processData: false,
        headers: { 'Content-Type': 'multipart/form-data' },
        timeout: 600000,
        responseType: 'blob',
        data: formData
      }).then(res => {
        // 现阶段，只有有心跳的 导入 需要下载导入结果
        if (this.heartbeatParams) {
          downloadBlobFile(res, '查看导入文件结果', 'txt')
          heartbeat(
            this.heartbeatParams.url,
            heartbeatRes => {
              this.handleResult(heartbeatRes)
            },
            this.heartbeatParams.breakMark || 2
          )
        } else {
          this.handleResult(res)
        }
      })
    },
    handleBolbRes(blobRes) {
      return new Promise((resovle, reject) => {
        const reader = new FileReader()
        reader.readAsText(blobRes)
        reader.onload = function() {
          return resovle(JSON.parse(this.result))
        }
      })
    },
    async handleResult(res) {
      if (Object.prototype.toString.call(res) === '[object Blob]') {
        res = await this.handleBolbRes(res)
      }
      this.uploading = false

      // 判断是否有自定义提示框
      // 因为后端反馈的导入结果信息不统一
      // 有时候就需要自定义一个反馈模板
      // 通过 this.$emit('getFileTableData', res) 进行触发
      if (!this.customTips) {
        if (res.code === 200) {
          this.fileList = [] // 置空文件
          if (this.$route.query && this.$route.query.planId) {
            this.$success({
              title: '操作完成',
              content: '导入结果请查看下载文件'
            })
          } else {
            this.$success({
              title: '上传成功',
              content: res.msg
            })
          }
        } else {
          this.$error({
            title: '上传失败',
            content: res.msg
          })
        }
      } else {
        if (res.code === 200) {
          this.fileList = [] // 置空文件
        }
      }
      this.$emit('getFileTableData', res) // 上抛数据
      this.handleResultView(res)
    },
    handleResultView(res) {
      if (this.messageBox.length >= 2) {
        this.messageBox.shift()
      }
      this.messageBox.push({
        type: res.code === 200 ? 'success' : 'failure',
        msg: `${this.uploadFileName} -- ${res.code === 200 ? '上传成功' : '上传失败'}`,
        date: `${new Date().getHours()}:${new Date().getMinutes()}:${new Date().getSeconds()}`
      })

      if (res.code !== 200) this.failureTimes++
    }
  }
}
</script>

<style lang="less" scoped>
div.up-load {
  position: relative;
  button.upload-btn {
    position: absolute !important;
    z-index: 5;
    left: 130px;
    top: 0;
  }
}
.link {
  margin: 5px 0;
  a {
    margin: 5px;
  }
}
.result {
  margin-top: 1rem;
}
</style>