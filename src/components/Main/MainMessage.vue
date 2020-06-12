<template>
  <div class="rank">
    <h4 class="title">
      <span class="bell-num">
        <a-icon type="bell" />
        <span class="num">{{ list.length }}</span>
      </span>
      <span>{{title}}</span>
    </h4>
    <ul class="list">
      <li class="list-header">
        <span>序号</span>
        <span>待办事项</span>
        <span>提交时间</span>
      </li>
      <li :key="index" v-for="(item, index) in list">
        <span :class="index < 3 ? 'active' : null">{{ index + 1 }}</span>
        <span>
          <a :href="item.url" target="_blank">{{ item.name }}</a>
        </span>
        <span>{{ item.date }}</span>
      </li>
    </ul>
  </div>
</template>

<script>
export default {
  name: 'MainMessage', // 首页消息
  // ['title', 'list']
  props: {
    title: {
      type: String,
      default: ''
    },
    list: {
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
  }
  .bell-num {
    float: right;
    color: #faad14;
    .num {
      margin-left: 0.375rem;
    }
  }

  .list {
    margin: 0;
    padding: 0;
    list-style: none;
    .list-header {
      line-height: 22px;
      span {
        height: 22px;
      }
    }

    li {
      padding: 10px 0;
      border-bottom: #e6e8eb 1px solid;

      span {
        color: rgba(0, 0, 0, 0.65);
        font-size: 14px;
        height: 22px;
        line-height: 22px;
        display: inline-block;
        a {
          color: #3d464c;
          &:hover {
            color: #057528;
          }
        }

        &:first-child {
          // background-color: #f5f5f5;
          // border-radius: 20px;

          font-size: 12px;
          width: 10%;
          text-align: center;
        }
        &:nth-child(2) {
          width: 60%;
          overflow: hidden;
          text-overflow: ellipsis;
          vertical-align: middle;
        }
        // &.active {
        //   // background-color: #fff;
        //   // color: #fff;
        // }
        &:last-child {
          width: 30%;
          text-align: right;
          float: right;
        }
      }
      &:hover {
        background: #f7f9fa;
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
