<template>
  <div class="rank">
    <div class="title">
      <a-select  labelInValue  :defaultValue="{ key: '2019' }"  style="width: 80px"  @change="handleChange"  >         
        <a-select-option value="2017">2017</a-select-option>
        <a-select-option value="2018">2018</a-select-option>
        <a-select-option value="2019">2019</a-select-option>
      </a-select>     
    </div>
    <a-row :gutter="24">
      <a-col class="gutter-row" :span="24">
          <div id="myChartComparsion" :style="{width: '100%',maxWidth:'610px', height: '220px'}"></div>  
      </a-col>
    </a-row>    
  </div>
</template>

<script>
import echarts from 'echarts'

export default {
  name: 'MainBonusComparison', // 首页社会调查报告实体比较
  props: {
    title: {
      type: String,
      default: ''
    },
    list: {
      type: Array,
      default: null
    }
  },
  components: {
  },
  mounted () {
    this.calculatePercentage()
    this.echartBar(this.list)
  },
  data () {
    return {
      year:2018, // 年份      
    }
  },
  methods: {
    mainTab (key) {
      console.log('首页切换内容', key)
    },
    handleChange (value) {
      var getDataA = [
        {
          bonusName: '理论实践',
          budget: 950,
          year: 2019,
          pay: 588
        },
        {
          bonusName: '技术管理',
          budget: 2100,
          year: 2019,
          pay: 188
        },
        {
          bonusName: '销售华南区',
          budget: 800,
          year: 2019,
          pay: 188
        },
        {
          bonusName: '社会调查报告单元4',
          budget: 400,
          year: 2019,
          pay: 788
        },
        {
          bonusName: '社会调查报告单元5',
          budget: 100,
          year: 2019,
          pay: 18
        },
        {
          bonusName: '社会调查报告单元6',
          budget: 100,
          year: 2019,
          pay: 188
        },
        {
          bonusName: '社会调查报告单元名称7',
          budget: 700,
          year: 2019,
          pay: 488
        }
      ]
      var getDataB= [
        {
          bonusName: '社会调查报告单元5',
          budget: 1100,
          year: 2019,
          pay: 18
        },
        {
          bonusName: '社会调查报告单元6',
          budget: 2100,
          year: 2019,
          pay: 188
        },
        {
          bonusName: '社会调查报告单元名称7',
          budget: 3700,
          year: 2019,
          pay: 488
        }
      ]
      var getDataC= [
        {
          bonusName: '社会调查报告单元5',
          budget: 300,
          year: 2019,
          pay: 18
        },
        {
          bonusName: '社会调查报告单元6',
          budget: 700,
          year: 2019,
          pay: 188
        },
        {
          bonusName: '社会调查报告单元名称7',
          budget: 400,
          year: 2019,
          pay: 488
        },
        {
          bonusName: '社会调查报告单元6',
          budget: 700,
          year: 2019,
          pay: 188
        },
        {
          bonusName: '社会调查报告单元名称7',
          budget: 1400,
          year: 2019,
          pay: 688
        }
      ]
      // 判断条件对应处理
      switch (value.key) {
        case '2017':
          this.echartBar(getDataA)
          break
        case '2018':
          this.echartBar(getDataB)
          break
        case '2019':
          this.echartBar(getDataC)
          break
        default:
          this.echartBar([])
      }
      
    },
    calculatePercentage () {
      let partentData=this.list
      let partent=partentData.budget/partentData.total
      this.proportion={ width:parseInt(168*partent) + 'px' } // 修改样式   
    },
    echartBar(data){
      // 基于准备好的dom，初始化echarts实例
      const myChart = echarts.init(document.getElementById('myChartComparsion'))
      // 接收到的数据
      this.year = data[0].year
      let bonusUnit = data
      let xData = [], yData1 = [], yData2 = []
      bonusUnit.map(item => {
        xData.push(item.bonusName)
        yData1.push(item.budget)
        yData2.push(item.pay)
      })
      // 绘制图表
      let option = {
        title: { 
          text: '2019年实体社会调查报告和预算对比情况',
          textStyle: {
            color:'#727272',
            fontSize: 16,
            fontWeight: 400,
          },     
        },
        legend: 
        {
          top: '0%',
          right: '15%',
          itemWidth: 14, // 图例的宽度
          itemHeight: 14, // 图例的高度
          data: [
            {
              name: '预算值',
              // 强制设置图形为圆。
              icon: 'roundRect',
              // 设置文本为
              textStyle: {
                color: '#727272'
              }
            },
            {
              name: '实体社会调查报告',
              // 强制设置图形为圆。
              icon: 'roundRect',
              // 设置文本为
              textStyle: {
                color: '#727272'
              }
            }
          ]
        },
        color: ['#E1EDE9', '#5EC985'],
        grid: {
          top: '15%',
          left: '3%',
          right: '3%',
          bottom: '5%',
          containLabel: true
        },
        tooltip: {
          trigger: 'axis', // 合并提示
          axisPointer: {            // 坐标轴指示器，坐标轴触发有效
            type: 'line' ,       // 默认为直线，可选为：'line' | 'shadow' 
            shadowStyle: {
              // color: 'rgba(247,249,250,0.1)' // 阴影色
            }                
          },
        },
        xAxis: {
          type: 'category',
          axisLabel: {
            color:'#5D5D5D' // 轴标签文字 颜色    
          },
          axisTick: { 
            show:false  //  轴分隔线
          }, 
          axisLine: {
            lineStyle: {
              color: '#EDEDED'
            }
          },        
          data: xData, // ['衬衫', '羊毛衫', '雪纺衫', '裤子', '高跟鞋', '袜子']
        },
        yAxis: {
          type: 'value',
          axisLabel: {
            color: '#5D5D5D'    //  轴标签文字    颜色    
          },
          axisTick: { 
            show: false  //  轴分隔线
          },
          splitLine: {
            lineStyle: {
              color: '#EDEDED'
            }
          },
          axisLine: {
            lineStyle: {
              color: '#EDEDED'
            }
          }, 
        },
        series: [
          {
            name: '预算值',
            type: 'bar',
            data: yData1 // [5, 20, 36, 10, 10, 20]
          },
          {
            name: '实体社会调查报告',
            type: 'bar',
            data: yData2 // [5, 20, 36, 10, 10, 20]
          }
        ]
      }
      myChart.setOption(option)
    },
  }
}
</script>

<style lang="less" scoped>
.rank {
  padding: 0;
  position: relative;
  .title {
    font-size: 0.875rem;
    position:absolute ;
    top: 0; right: 0;
    z-index: 1;
    width:80px;
    height: 30px;
    .float-right{ float: right;}
  }
  .fang{
    margin: 0 10px;
    width: 14px;
    height: 14px;     
    border-radius: 2px;
    display: inline-block;
    vertical-align: middle;
    }
  .text{ font-size: 12px;}
  .year{ 
    margin-left: 26px; 
    font-size:16px;
    font-weight:500;
    line-height:22px;  
    color: #057528;
  } 
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
      .budget-li {
        float: left; 
        margin-right: 10px;
        display: inline-block;
      }
      .rmb{ margin-right: 10px; color: #7F7F7F; }
        .num{ font-size:20px; font-weight:500; color: #717171; }

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
