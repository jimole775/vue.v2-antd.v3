<template>
  <div class="rank">
    <h4 class="title">
      <span>{{title}}</span>
    </h4>
    <ul class="list">
      <li class="list-header">
        <span class="num">序号</span>
        <span class="name">社会调查报告单元</span>
        <span class="user-name">处理人</span>
        <span class="status">状态</span>
      </li>
      <li :key="index" v-for="(item, index) in list">
        <span :class="index < 3 ? 'num active' : 'num'">{{ index + 1 }}</span>
        <span class="name">
          <a :href="item.url" target="_blank">{{item.name}}</a>
        </span>
        <span class="user-name" title="处理人">{{ item.userName }}</span>
        <span class="status" title="状态">{{ item.statusText }}</span>
      </li>
    </ul>
  </div>
</template>

<script>
export default {
  name: 'MainBonusProgress', // 首页处理进度
  // ['title', 'list']
  props: {
    title: {
      type: String,
      default: ''
    },
    list: {
      // 传递过来的列表数据
      type: Array,
      default: null
    }
  }
}
</script>

<style lang="less" scoped>
.rank {
  padding: 0;
  .title {
    font-size: 0.875rem;
    color: #727272;
  }

  .list {
    margin: 0;
    padding: 0;
    list-style: none;
    .list-header {
      line-height: 22px;
      span {
        height: 22px;
        color: #727272;
      }
    }

    li {
      padding: 10px 0;
      border-bottom: #e6e8eb 1px solid;

      span {
        color: #3d464c;
        font-size: 14px;
        height: 22px;
        line-height: 22px;
        display: inline-block;
      }

      .num {
        width: 10%;
        text-align: center;
      }
      .name {
        width: 60%;
        a{
           color: #3d464c;
           &:hover{
             color:#057528;
           }
        }

      }
      .user-name {
        width: 20%;
      }
      .status {
        width: 10%;
        text-align: center;
        float: right;
      }
      &:hover{
        background: #F7F9FA;
      }
      &:last-child {
        border: none;
      }
    }
  }
}

.mobile .rank {
  padding: 0;
}
</style>
