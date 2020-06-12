<template>
  <div class="rank">
    <h4 class="title">
      <span class="float-right">
        <span class="year"> {{ list.year }} </span> 
      </span>
      <span class="head-title">{{title}}</span>
    </h4>
    <ul class="budget">
      <li><div class="budget-li budget-total"></div> <span class="rmb"> RMB </span><span class="num">{{ list.total }}</span></li>
      <li><div class="budget-li budget-actually" id='idProportion' :style="proportion"></div> <span class="rmb"> RMB </span><span class="num">{{ list.budget }}</span></li>
    </ul>
    <div class="budget-foot">
      <span>计量单位：万元</span>
      <span class="fang" style=" background:#E1EDE9; "></span><span>年终奖总预算</span>
      <span class="fang" style=" background:#5EC985; "></span><span>年终奖总实体</span>
    </div>
  </div>
</template>

<script>

export default {
  name: 'MainBonusBudget', // 首页 社会调查报告预算
  props: {
    title: {
      type: String,
      default: ''
    },
    list: {
      type: Object,
      default: null
    }
  },
  components: {
  },
  mounted () {
    this.calculatePercentage()
  },
  data() {
    return {
      proportion: { width: 155}, // 实体社会调查报告比例
      haow: { width: '155px'}
    }
  },
  methods: {
    mainTab (key) {
      console.log('首页切换内容', key)
    },
    calculatePercentage () {
      console.log(this.list)
      let partentData = this.list
      let partent = partentData.budget/partentData.total
      this.proportion = { width: parseInt(168*partent) + 'px'}  // 修改样式   
    }
  }
}
</script>

<style lang="less" scoped>
.rank {
  padding: 0;
  .title {
    font-size: 0.875rem;
    .head-title{
      color: #727272;
    }
    .float-right{ float: right;}
    .year{ 
      margin-left: 26px; 
      font-size:16px;
      font-weight:500;
      line-height:22px;  
      color: #057528;
    } 
  }
  .fang{width: 14px;
    height: 14px;
     
    border-radius: 2px;
    display: inline-block;
    vertical-align: middle;}
  .bell-num {
    float: right;
    color: #faad14;
    .num {
      margin-left: 0.375rem;
    }
  }

  .budget {
    list-style: none;
    margin:25px 0 0;
    padding:  0;
    border-left: #a6a6a6 1px solid;
    width: 100%;
    height: 110px;
    li{ 
      padding: 20px 0 0;
      .budget-li{ 
        float: left;
        margin-right: 10px;
        display: inline-block;
        
      }
      .rmb{ margin-right: 10px; color: #7F7F7F;}
        .num{ font-size:20px; font-weight:500; color: #717171;}

      .budget-total{
        width:168px;
        height:20px;
        background:rgba(216,216,216,1);
        border-radius:0px 5px 5px 0px;
      }
      .budget-actually{         
        height:20px;
        background:rgba(94,201,133,1);
        border-radius:0px 5px 5px 0px;
      }
    }
    
     
  }
  .budget-foot{
    padding-top: 26px;
    line-height: 22px;
    span{ margin-right: 10px;}
  }
}

.mobile .rank {
  padding: 0;
}
</style>
