<template>
    <div class="abnormal">
        <a-row :gutter="24">
            <a-col class="gutter-row" :span="14">
                <span class="title">{{title}}</span>
            </a-col>
            <a-col class="gutter-row" :span="5">
                <a-input-search placeholder="深圳总公司" style="width: 200px" @search="onSearch" />
            </a-col>
            <a-col class="gutter-row" :span="2">
                <a-select labelInValue :defaultValue="{ key: '2019' }" @change="handleChange">
                    <a-select-option value="2017">2017</a-select-option>
                    <a-select-option value="2018">2018</a-select-option>
                    <a-select-option value="2019">2019</a-select-option>
                </a-select>
            </a-col>
            <a-col class="gutter-row" :span="3">
                <a-select labelInValue :defaultValue="{ key: '所有级职' }" style="width:110px;" @change="handleChangeProfession">
                    <a-select-option value="所有级职">所有级职</a-select-option>
                    <a-select-option value="9">9</a-select-option>
                    <a-select-option value="10">10</a-select-option>
                    <a-select-option value="M1">M1</a-select-option>
                    <a-select-option value="M2">M2</a-select-option>
                    <a-select-option value="M3">M3</a-select-option>
                    <a-select-option value="M4">M4</a-select-option>
                    <a-select-option value="M5">M5</a-select-option>
                    <a-select-option value="M6">M6</a-select-option>
                </a-select>
            </a-col>
        </a-row>
        <a-row :gutter="24" style="margin:10px 0 0;">
            <a-col class="gutter-row chart-area" :span="12">
                <div class="link">
                    <p>异常总人数</p>
                    <router-link to="/list/table-list?table=12313&ok=true">{{ abnormalTatal }}</router-link>
                </div>
                <div id="myChartAbnormal" :style="{width: '510px', height: '150px' ,margin:'0'}"></div>
            </a-col>
            <a-col class="gutter-row" :span="5">
                <div>
                    异常人数实体社会调查报告
                </div>
                <div class="percent-value">
                    超预算
                    <span>{{ percent }}%</span>
                </div>
                <div class="progress">
                    <div class="progress-outer">
                        <div class="progress-inner" style="background: #5EC985;" :style="progressWidth">&nbsp;</div>
                    </div>
                </div>
            </a-col>
            <a-col class="gutter-row" :span="7">
                <div>
                    异常人数等级分布情况
                </div>
                <ul class="occupation-level">
                    <li>
                        <div class="occupation">11~13</div>
                        <div class="progress-line" style="background: #AFE688;" :style="{width:occupationLevel[0].progressWidth}"></div>
                        <span>{{ occupationLevel[0].value }}</span>人</li>
                    <li>
                        <div class="occupation">14~17</div>
                        <div class="progress-line" style="background: #5EC985;" :style="{width:occupationLevel[1].progressWidth}"></div>
                        <span>{{ occupationLevel[1].value }}</span>人</li>
                    <li>
                        <div class="occupation">M1~M3</div>
                        <div class="progress-line" style="background: #00A7A4;" :style="{width:occupationLevel[2].progressWidth}"></div>
                        <span>{{ occupationLevel[2].value }}</span>人</li>
                    <li>
                        <div class="occupation">M4~M6</div>
                        <div class="progress-line" style="background: #017E9D;" :style="{width:occupationLevel[3].progressWidth}"></div>
                        <span>{{ occupationLevel[3].value }}</span>人</li>
                </ul>
    
            </a-col>
        </a-row>
    </div>
</template>

<script>
import echarts from 'echarts'

export default {
    name: 'MainBonusAbnormal', // 首页社会调查报告实体比较
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
    },
    data() {
        return {
            year: 2018, // 年份  
            abnormalTatal: 0, // 异常总数
            strokeWidth: 14,
            percent: 78.93, // 异常发放
            progressWidth: { width: '1px' }, // 实体社会调查报告比例
            progressWidthA: { width: '31px' }, // 级绩数组
            progressWidthB: { width: '131px' }, // 级绩数组
            progressWidthC: { width: '61px' }, // 级绩数组
            progressWidthD: { width: '160px' }, // 级绩数组             
            occupationLevel: [
                { level: '11~13', value: 10, progressWidth: "10px" },
                { level: '14~17', value: 20, progressWidth: "20px" },
                { level: 'M1~M3', value: 30, progressWidth: "30px" },
                { level: 'M4~M6', value: 40, progressWidth: "40px" }
            ], // 级绩数组

        }
    },
    methods: {
        onSearch(value) {
            console.log('搜索职位：', value);
        },
        // 挑转 
        lookUrl(value) {
            console.log('挑转：', value);
            location.href = '/index'
        },
        handleChangeProfession(value) {
            console.log(value);
        },
        handleChange(value) {
            console.log(value); // {key: "2018", label: "2018"}
            let getDataA = {
                baseValue: 25,
                previousYear: 12,
                performance: 53
            }
            let getDataB = {
                baseValue: 15,
                previousYear: 22,
                performance: 33
            }
            let getDataC = {
                baseValue: 2,
                previousYear: 36,
                performance: 11
            }
            let yearLevelA = [
                { level: '11~13', value: 36 },
                { level: '14~17', value: 216 },
                { level: 'M1~M3', value: 6 },
                { level: 'M4~M6', value: 23 }
            ]
            let yearLevelB = [
                { level: '11~13', value: 76 },
                { level: '14~17', value: 16 },
                { level: 'M1~M3', value: 146 },
                { level: 'M4~M6', value: 23 }
            ]
            let yearLevelC = [
                { level: '11~13', value: 46 },
                { level: '14~17', value: 33 },
                { level: 'M1~M3', value: 9 },
                { level: 'M4~M6', value: 523 }
            ]

            // 判断条件对应处理
            switch (value.key) {
                case '2017':
                    this.echartBar(getDataA);
                    this.calculatePercentage(33.33);
                    this.getOccupationLevel(yearLevelA);
                    break;
                case '2018':
                    this.echartBar(getDataB);
                    this.calculatePercentage(73.33);
                    this.getOccupationLevel(yearLevelB);
                    break;
                case '2019':
                    this.echartBar(getDataC);
                    this.calculatePercentage(93.33);
                    this.getOccupationLevel(yearLevelC);
                    break;
                default:
                    this.echartBar({
                        baseValue: 5,
                        previousYear: 2,
                        performance: 3
                    });
            }


            // this.percent

        },
        calculatePercentage(data) {
            this.percent = data
            let pp = data / 100 * 200
            this.progressWidth = { width: pp + '18px' } // 修改样式
        },
        echartBar(data) {


            // 接收到的数据
            console.log(data)
            this.abnormalTatal = data.baseValue + data.previousYear + data.performance // 总数
            let pie1 = data.baseValue,
                pie2 = data.previousYear,
                pie3 = data.performance
            // 基于准备好的dom，初始化echarts实例
            const myChart = echarts.init(document.getElementById('myChartAbnormal'))


            // 绘制图表
            let option = {

                title: {
                    show: false,
                    text: '2019年社会调查报告分发异常情况',
                    textStyle: {
                        color: '#727272',
                        fontSize: 16,
                        fontWeight: 400,
                    },
                },
                legend: {
                    orient: 'vertical',
                    x: '65%',
                    y: 'middle',
                    // top: '0%',
                    // right: '15%',
                    itemWidth: 14, // 图例的宽度
                    itemHeight: 14, // 图例的高度
                    formatter: function(name) {
                        // 获取legend显示内容
                        let data = option.series[0].data;
                        let total = 0;
                        let tarValue = 0;
                        for (let i = 0, l = data.length; i < l; i++) {
                            total += data[i].value;
                            if (data[i].name == name) {
                                tarValue = data[i].value;
                            }
                        }
                        // let p = (tarValue / total * 100).toFixed(2);
                        // return name + ' ' + ' ' + p + '%';
                        let str = ' ' + name + '    ' + tarValue + ' 人'
                        return str
                    },
                    data: [{
                        name: '超基准值增幅',
                        // 强制设置图形为圆。
                        icon: 'roundRect',
                        // 设置文本为
                        textStyle: {
                            color: '#717171'
                        }
                    }, {
                        name: '超上一年度增幅',
                        // 强制设置图形为圆。
                        icon: 'roundRect',
                        // 设置文本为
                        textStyle: {
                            color: '#717171'
                        }
                    }, {
                        name: '超效率区间增幅',
                        // 强制设置图形为圆。
                        icon: 'roundRect',
                        // 设置文本为
                        textStyle: {
                            color: '#717171'
                        }
                    }]
                },
                // color:['#017E9D','#5EC985'],

                color: ['#9edfc6', '#5EC985', '#00A7A4'],
                grid: {
                    top: '15%',
                    left: '3%',
                    right: '3%',
                    bottom: '5%',
                    containLabel: true
                },

                tooltip: {
                    trigger: 'item',
                    formatter: "{b}: {c} ({d}%)"
                    // function name(params) {
                    //   console.log(params)
                    //  return  "{a} <br/>{b}: {c} ({d}%)"  
                    // }

                },
                series: [{
                    name: '异常总人数',
                    type: 'pie',
                    center: ['30%', '50%'], // 位置座标
                    radius: ['60%', '85%'],
                    avoidLabelOverlap: false,
                    itemStyle: {
                        normal: {
                            label: {
                                show: true,
                                formatter: '{d}%'
                            },
                            labelLine: { show: false }
                        }
                    },
                    data: [
                        { value: pie1, name: '超基准值增幅' },
                        { value: pie2, name: '超上一年度增幅' },
                        { value: pie3, name: '超效率区间增幅' }

                    ]
                }]
            }
            myChart.setOption(option)
        },
        maxValue(array) {
            //传入的数组
            // console.log('传入的数组:', array)
            let maxValue = Math.max.apply(Math, array.map(item => {
                return item.value
            }))
            // console.log('传入的数组 最大值:', maxValue)
            return maxValue
        },
        getOccupationLevel(data) {
            // console.log(data)
            let maxValue = this.maxValue(data)
            console.log(maxValue)

            let newData = data.map(item => {
                let progressWidth = (item.value / maxValue * 150).toFixed(2) + 'px'
                item.progressWidth = progressWidth
                return item
            })
            this.occupationLevel = newData
            console.log(newData)

        }

    },
    mounted() {
        this.calculatePercentage(78.56);
        this.getOccupationLevel([
            { level: '11~13', value: 10, progressWidth: "10px" },
            { level: '14~17', value: 20, progressWidth: "20px" },
            { level: 'M1~M3', value: 30, progressWidth: "30px" },
            { level: 'M4~M6', value: 40, progressWidth: "40px" }
        ]);
        this.echartBar({
            baseValue: 5,
            previousYear: 2,
            performance: 3
        });
    }
}
</script>

<style lang="less" scoped>
.abnormal {
    padding: 0;
    .title {
        font-size: 16px;
        color: #727272;
    }
    .chart-area {
        position: relative;
        .link {
            position: absolute;
            width: 80px;
            top: 53px;
            left: 124px;
            z-index: 1;
            text-align: center;
            p {
                font-size: 9px;
                margin: 0;
            }
            a {
                font-size: 32px;
                font-weight: 500;
                color: #5EC985;
                text-decoration: underline;
                line-height: 23px;
            }
        }
    }
    .percent-value {
        margin: 20px 0 15px;
        span {
            margin-left: 12px;
            font-size: 36px;
            line-height: 50px;
            font-weight: 500;
        }
    }
    .progress {
        .progress-outer {
            width: 200px;
            height: 14px;
            background: #E9ECEF;
            border-radius: 0px 5px 5px 0px;
            .progress-inner {
                float: left;
                border-radius: 0px 5px 5px 0px;
                height: 14px;
                background: #5EC985;
            }
        }
    }
    .occupation-level {
        list-style: none;
        margin: 0;
        padding: 0;
        li {
            margin-top: 10px;
        }
        div {
            display: inline-block;
        }
        .occupation {
            width: 60px;
        }
        .progress-line {
            margin-right: 10px;
            border-radius: 0px 5px 5px 0px;
            height: 10px;
        }
    }
}

.mobile .abnormal {
    padding: 0;
}
</style>
