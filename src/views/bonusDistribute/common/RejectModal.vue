<template>
<a-modal title="驳回原因" width="750px" height="600px" v-model="showModal" @ok="confirm">
  <div>
    <a-textarea v-model="message" placeholder="请填写驳回意见" :autosize="{ minRows: 3, maxRows: 9 }" />
  </div>
</a-modal>
</template>

<script>
export default {
  name: 'RejectModal',
  props: {
    visiable: {
        type: Boolean,
        default: false
    },
  },
  data() {
    return {
      showModal: false,
      message: ''
    }
  },
  watch: {
    visiable(val){
        this.showModal = val
    }, 
    showModal(val) {
        this.$emit('visiableEvent', val)
    },
  },
  computed: {
  },
  methods: {
    confirm() {
      if (!this.message) return this.$message.warning('请填写驳回意见')
      this.showModal = false
      this.$emit('confirm', this.message)
    },
  },
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
    background: #F0F0F0;
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
