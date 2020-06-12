<template>
  <div class="rank">     
    <a-row :gutter="24">
      <a-col class="gutter-row" :span="24">
        <div id="myChartAverage" :style="{width: '100%',maxWidth:'1080px', height: '220px'}"></div>
      </a-col>
    </a-row>
    
  </div>
</template>

<script>
import echarts from 'echarts'

export default {
  name: 'MainBonusAverage', // 首页社会调查报告实体人均数
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
  },
  components: {
    // $, 
  },
  data() {
    return {
      year:['2018年'], // 年份     
      
    }
  },
  methods: {
    mainTab(key) {
      console.log('首页切换内容', key)
    },
    calculatePercentage(){
      console.log(this.list)
      let partentData=this.list
      let partent=partentData.budget/partentData.total
      this.proportion={ width:parseInt(168*partent)+'px'}  // 修改样式   
       
    },
    echartBar () {
       
      // 基于准备好的dom，初始化echarts实例
      const myChart = echarts.init(document.getElementById('myChartAverage'))
      // 接收到的数据
      console.log(this.list)
      let yearAttr=this.list[0].year
      let bonusUnit=this.list
      let xData=[],yData1=[],yData2=[],twoYear=[]
      yearAttr.map( item =>{
        twoYear.push(item+'年')
      })
      this.year=twoYear
      bonusUnit.map( item => {
        xData.push(item.bonusName)
        yData1.push(item.oldYear)
        yData2.push(item.nowYear)
      } )
      // 绘制图表
      let option={
        title: { 
          text: '近两年人均实体社会调查报告对比情况',
          textStyle:{
            color:'#727272',
            fontSize:16,
            fontWeight:400,
          },        
        },
        legend: {
            // data:twoYear,
            top:'0%',
            right:'3%',
            itemWidth:14, // 图例的宽度
            itemHeight:14, // 图例的高度
            data: [{
              name: '2018年',
              // 强制设置图形为圆。
              icon: 'roundRect',
              // 设置文本为
              textStyle: {
                  color: '#727272'
              }
            },{
              name: '2019年',
              // 强制设置图形为圆。
              icon: 'roundRect',
              // 设置文本为
              textStyle: {
                  color: '#727272'
              }
            }]
        },
        color:['#017E9D','#5EC985'],
        grid: {
            top:'20%',
            left: '3%',
            right: '3%',
            bottom: '5%',            
            containLabel: true
        },
         
        tooltip : {
            trigger: 'axis', // 合并提示
            axisPointer : {            // 坐标轴指示器，坐标轴触发有效
                type : 'line' ,       // 默认为直线，可选为：'line' | 'shadow' 
                shadowStyle: {
                  // color: 'rgba(247,249,250,0.1)' // 阴影色
                }                
            },
            formatter: function(params) { //自定义函数修改折线图给数据加单位
              var str = '';//声明一个变量用来存储数据

              str += '<div>'+ params[0].name +'</div>'; //显示X的函数

              for(var i=0; i<params.length; i++) { //图显示的数据较多时需要循环数据，这样才可以成功的给多条数据添加单位 
              str += '<span style="display:inline-block;margin-right:5px;border-radius:10px;width:10px;height:10px;background-color:'+params[i].color+';"></span>'+ params[i].seriesName +'</span> : <span>'+ (params[i].data ? params[i].data+'W' : '暂无') +'</br>';
              }
              return str;
            }          
        },
        xAxis: {
          type : 'category',
          boundaryGap : false, // 区域面积 靠边
          axisLabel:{              
              color:'#5D5D5D'    //  轴标签文字    颜色    
          },  
          axisTick:{ 
             show:false  //  轴分隔线
          }, 
          axisLine:{
            lineStyle:{
              color:'#EDEDED'
            }
          },        
          data: xData, // ['衬衫', '羊毛衫', '雪纺衫', '裤子', '高跟鞋', '袜子']
        },
        yAxis:  {
          type : 'value',
          splitLine :{
            show:false,// 隐藏分隔线
          },
          axisLabel:{              
              color:'#5D5D5D'    //  轴标签文字    颜色    
          },  
          axisTick:{ 
             show:false  //  轴分隔线
          }, 
          axisLine:{
            lineStyle:{
              color:'#EDEDED'
            }
          }, 
        },
        series: [
          {
            name: twoYear[0], // '预算值',
            type: 'line',
            smooth: true,
            areaStyle: {
              opacity:0.10 
            },
            data: yData1 // [5, 20, 36, 10, 10, 20]
          },
          {
            name: twoYear[1], // '实体社会调查报告',
            type: 'line',
            smooth: true,
            areaStyle: {
              opacity:0.12 
            },
            data: yData2 // [5, 20, 36, 10, 10, 20]
          }
        ]
      }
      myChart.setOption(option)
    },
  },
  mounted() {
    this.calculatePercentage();
    this.echartBar();
  }
}
</script>

<style lang="less" scoped>
.rank {
  padding: 0;
  .title {
    font-size: 0.875rem;
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
