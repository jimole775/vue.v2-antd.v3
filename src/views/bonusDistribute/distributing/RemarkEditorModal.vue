<template>
  <a-modal title="分发人备注" width="750px" height="600px" v-model="showModal" @ok="confirm">
    <div>
      <a-textarea v-model="output" placeholder="请填写" :autosize="{ minRows: 3, maxRows: 9 }" />
    </div>
  </a-modal>
</template>

<script>
export default {
  name: 'RemarkEditorModal',
  props: {
    visiable: {
        type: Boolean,
        default: false
    },
    input: {
        type: String | Number,
        default: undefined
    },
  },
  data() {
    return {
      showModal: false,
      output: ''
    }
  },
  watch: {
    visiable(val){
        this.showModal = val
    }, 
    input(val) {
        this.output = val
    },
    showModal(val) {
        this.$emit('visiableEvent', val)
    },
  },
  computed: {
  },
  methods: {
    confirm() {
        this.$emit('confirm', this.output)
        this.showModal = false
        this.output = undefined
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
