<template>
    <div class="page-header-index-wide">
        <div class="head-line">----------demo页面--------------------------------------社会调查报告分发数据统计看板</div>
        <a-row class="line-mgb10" :gutter="24">
    
            <a-col class="gutter-row" :span="17">
                <div class="gutter-box">
                    <a-tabs class="content-right-left" defaultActiveKey="1" @change="mainTab">
                        <a-tab-pane tab="浮动人员社会调查报告看板" key="1" style="padding : 0 10px;">
                            <a-row :gutter="24">
                                <a-col class="gutter-row" :span="10">
                                    <div class="gutter-box h240">
                                        <main-bonus-budget title="2019年总预算和年终奖实体情况" :list="mainBudget" />
                                    </div>
                                </a-col>
                                <a-col class="gutter-row" :span="14">
                                    <div class="gutter-box h240">
                                        <main-bonus-comparison title="2019年实体社会调查报告和预算对比情况" :list="mainComparison" />
                                    </div>
                                </a-col>
                            </a-row>
                            <a-row :gutter="24">
                                <a-col class="gutter-row" :span="24">
                                    <div class="gutter-box h240">
                                        <main-bonus-average title="近两年人均实体社会调查报告对比情况" :list="mainBonusAverage" />
                                    </div>
                                </a-col>
                            </a-row>
                            <a-row :gutter="24">
                                <a-col class="gutter-row" :span="24">
                                    <div class="gutter-box h225">
                                        <main-bonus-abnormal title="2019年社会调查报告分发异常情况" :list="mainComparison" />
                                    </div>
                                </a-col>
                            </a-row>
                        </a-tab-pane>
                        <a-tab-pane tab="年薪制人员社会调查报告看板" key="2" forceRender>test-年薪制人员社会调查报告看板-test</a-tab-pane>
                    </a-tabs>
                </div>
            </a-col>
    
            <a-col class="gutter-row" :span="7">
                <div class="gutter-box">
                    <a-row class="border-sliod">
                        <a-col :xl="24" :lg="24" :md="24" :sm="24" :xs="24">
                            <main-message title="待办事项" :list="mainMessage" />
                        </a-col>
                    </a-row>
                    <a-row class="border-sliod">
                        <a-col :xl="24" :lg="24" :md="24" :sm="24" :xs="24">
                            <main-bonus-progress title="2019年各社会调查报告单元社会调查报告分发进度" :list="mainBonusProgress" />
                        </a-col>
                    </a-row>
                </div>
            </a-col>
        </a-row> 
    </div>
</template>

<script>
import moment from 'moment'
import {
    ChartCard,
    MiniArea,
    MiniBar,
    MiniProgress,
    RankList,
    Bar,
    Trend,
    NumberInfo,
    MiniSmoothArea,
    MainMessage,
    MainBonusProgress,
    MainBonusBudget,
    MainBonusComparison,
    MainBonusAverage,
    MainBonusAbnormal

} from '@/components'
import { mixinDevice } from '@/utils/mixin'
// import { loadLanguageAsync } from '@/lang' //’@‘为别名，可能有差异，以实际配置为准

// 此处代码copy自lang分支，
// SetLang({ commit }, lang){
//   return new Promise(resolve => {
//     commit('SET_LANG', lang)  // 因为lang分支，采用vuex和localstorege存储当前语言标识，若没有用到，此处可不写
//     loadLanguageAsync(lang)
//     resolve()
//   })
// }

const barData = []
const barData2 = []
for (let i = 0; i < 12; i += 1) {
    barData.push({
        x: `${i + 1}月`,
        y: Math.floor(Math.random() * 1000) + 200
    })
    barData2.push({
        x: `${i + 1}月`,
        y: Math.floor(Math.random() * 1000) + 200
    })
}

const rankList = []
for (let i = 0; i < 7; i++) {
    rankList.push({
        name: '白鹭岛 ' + (i + 1) + ' 号店',
        total: 1234.56 - i * 100
    })
}

const searchUserData = []
for (let i = 0; i < 7; i++) {
    searchUserData.push({
        x: moment()
            .add(i, 'days')
            .format('YYYY-MM-DD'),
        y: Math.ceil(Math.random() * 10)
    })
}
const searchUserScale = [{
        dataKey: 'x',
        alias: '时间'
    },
    {
        dataKey: 'y',
        alias: '用户数',
        min: 0,
        max: 10
    }
]

const searchTableColumns = [{
        dataIndex: 'index',
        title: '排名',
        width: 90
    },
    {
        dataIndex: 'keyword',
        title: '搜索关键词'
    },
    {
        dataIndex: 'count',
        title: '用户数'
    },
    {
        dataIndex: 'range',
        title: '周涨幅',
        align: 'right',
        sorter: (a, b) => a.range - b.range,
        scopedSlots: { customRender: 'range' }
    }
]
const searchData = []
for (let i = 0; i < 50; i += 1) {
    searchData.push({
        index: i + 1,
        keyword: `搜索关键词-${i}`,
        count: Math.floor(Math.random() * 1000),
        range: Math.floor(Math.random() * 100),
        status: Math.floor((Math.random() * 10) % 2)
    })
}

const DataSet = require('@antv/data-set')

const sourceData = [
    { item: '家用电器', count: 32.2 },
    { item: '食用酒水', count: 21 },
    { item: '个护健康', count: 17 },
    { item: '服饰箱包', count: 13 },
    { item: '母婴产品', count: 9 },
    { item: '其他', count: 7.8 }
]

const pieScale = [{
    dataKey: 'percent',
    min: 0,
    formatter: '.0%'
}]

const dv = new DataSet.View().source(sourceData)
dv.transform({
    type: 'percent',
    field: 'count',
    dimension: 'item',
    as: 'percent'
})
const pieData = dv.rows
// 消息数据
const mainMessage = [{
        name: '2019年度社会调查报告分发人名单审核A',
        url: 'http://www.baidu.com/',
        date: '2019-01-03'
    },
    {
        name: '2019年度社会调查报告分发人名单审核B',
        url: 'http://www.sina.com/',
        date: '2019-01-03'
    },
    {
        name: '2019年度社会调查报告分发人名单审核C',
        url: 'http://www.qq.com/',
        date: '2019-01-03'
    },
    {
        name: '2019年度社会调查报告分发人名单审核D',
        url: 'http://www.rongxis.com/',
        date: '2019-01-03'
    },
    {
        name: '2019年度社会调查报告分发人名单审核E',
        url: 'http://www.huawei.com/',
        date: '2019-01-09'
    }
]

// 社会调查报告分发进度
const mainBonusProgress = [{
        name: '单元名称-1',
        url: 'http://www.baidu.com/',
        userName: '张三',
        status: 0,
        statusText: '未提交',
        mark: 1
    },
    {
        name: '单元名称-2',
        url: 'http://www.baidu.com/',
        userName: '李四',
        status: 1,
        statusText: '待审批',
        mark: 0
    },
    {
        name: '单元名称-3',
        url: 'http://www.baidu.com/',
        userName: '王五',
        status: 2,
        statusText: '审批中',
        mark: 0
    },
    {
        name: '单元名称-4',
        url: 'http://www.baidu.com/',
        userName: '赵六',
        status: 3,
        statusText: '已完成',
        mark: 0
    },
    {
        name: '单元名称-5',
        url: 'http://www.baidu.com/',
        userName: '李一',
        status: 4,
        statusText: '驳回',
        mark: 0
    },
    {
        name: '单元名称-6',
        url: 'http://www.baidu.com/',
        userName: '唐二唐二',
        status: 1,
        statusText: '待审批',
        mark: 1
    },
    {
        name: '单元名称-7',
        url: 'http://www.baidu.com/',
        userName: '张三佬',
        status: 4,
        statusText: '驳回',
        mark: 0
    },
    {
        name: '单元名称-8',
        url: 'http://www.baidu.com/',
        userName: '张三1',
        status: 1,
        statusText: '待审批',
        mark: 0
    },
    {
        name: '单元名称-9',
        url: 'http://www.baidu.com/',
        userName: '张三2',
        status: 1,
        statusText: '待审批',
        mark: 0
    },
    {
        name: '单元名称-10',
        url: 'http://www.baidu.com/',
        userName: '张三3',
        status: 1,
        statusText: '待审批',
        mark: 0
    }
]
// 社会调查报告预算发放
const mainBudget = {
    year: 2018,
    total: 2303.58,
    budget: 1476.65
}
//
const mainComparison = [{
    year: 2019,
    bonusName: '理论实践',
    budget: 500,
    pay: 188
}, {
    year: 2019,
    bonusName: '技术管理',
    budget: 100,
    pay: 188
}, {
    year: 2019,
    bonusName: '销售华南区',
    budget: 800,
    pay: 188
}, {
    year: 2019,
    bonusName: '社会调查报告单元4',
    budget: 900,
    pay: 788
}, {
    year: 2019,
    bonusName: '社会调查报告单元5',
    budget: 100,
    pay: 18
}, {
    year: 2019,
    bonusName: '社会调查报告单元6',
    budget: 100,
    pay: 188
}, {
    year: 2019,
    bonusName: '社会调查报告单元名称7',
    budget: 700,
    pay: 488
}]
const mainBonusAverage = [{
    bonusName: '理论实践1',
    year: [2018, 2019],
    oldYear: 322.66,
    nowYear: 646.23,
}, {
    bonusName: 'IT管理处2',
    year: [2018, 2019],
    oldYear: 522,
    nowYear: 236.12,
}, {
    bonusName: '销售部3',
    year: [2018, 2019],
    oldYear: 272.19,
    nowYear: 166.00,
}, {
    bonusName: '业务部4',
    year: [2018, 2019],
    oldYear: 22,
    nowYear: 266,
}, {
    bonusName: '采购5',
    year: [2018, 2019],
    oldYear: 322.23,
    nowYear: 66,
}, {
    bonusName: '理论实践6',
    year: [2018, 2019],
    oldYear: 222,
    nowYear: 566,
}, {
    bonusName: '理论实践7',
    year: [2018, 2019],
    oldYear: 162,
    nowYear: 86,
}, {
    bonusName: '理论实践8',
    year: [2018, 2019],
    oldYear: 722,
    nowYear: 236,
}, {
    bonusName: '理论实践9',
    year: [2018, 2019],
    oldYear: 522,
    nowYear: 686,
}, {
    bonusName: '理论实践0',
    year: [2018, 2019],
    oldYear: 322,
    nowYear: 1266,
}, {
    bonusName: '理论实践19',
    year: [2018, 2019],
    oldYear: 522,
    nowYear: 686,
}, {
    bonusName: '理论实践10',
    year: [2018, 2019],
    oldYear: 322,
    nowYear: 1266,
}]

export default {
    name: 'Main',
    mixins: [mixinDevice],
    components: {
        ChartCard,
        MiniArea,
        MiniBar,
        MiniProgress,
        RankList,
        Bar,
        Trend,
        NumberInfo,
        MiniSmoothArea,
        MainMessage,
        MainBonusProgress,
        MainBonusBudget,
        MainBonusComparison,
        MainBonusAverage,
        MainBonusAbnormal
    },
    data() {
        return {
            loading: true,
            rankList,
            // 搜索用户数
            searchUserData,
            searchUserScale,
            searchTableColumns,
            searchData,

            barData,
            barData2,

            //
            pieScale,
            pieData,
            sourceData,
            pieStyle: {
                stroke: '#fff',
                lineWidth: 1
            },
            mainMessage, // 消息数据
            mainBonusProgress, // 社会调查报告分发进度
            mainBudget, //社会调查报告预算与实体
            mainComparison, // /社会调查报告预算对比
            mainBonusAverage, // 近两年人均
        }
    },
    methods: {
        mainTab(key) {
            console.log('首页切换内容', key)
        }
    },
    created() {
        setTimeout(() => {
            this.loading = !this.loading
        }, 1000)
    }
}
</script>

<style lang="less" scoped>
.page-header-index-wide {
    background: #fff;
    .head-line {
        width: 160px;
        height: 22px;
        font-size: 16px;
        font-family: PingFangSC-Regular, PingFangSC;
        font-weight: 400;
        color: rgba(114, 114, 114, 1);
        line-height: 22px;
        margin: 0 0 10px;
        display: none;
    }
    .line-mgb10 {
        margin-bottom: 22px;
    }
    .h225 {
        margin-bottom: 22px;
        padding: 10px;
        min-height: 222px;
        background: #fff;
        border-radius: 6px;
        border: 1px solid rgba(230, 232, 235, 1);
    }
    .h240 {
        margin-bottom: 22px;
        padding: 10px;
        min-height: 255px;
        background: #fff;
        border-radius: 6px;
        border: 1px solid rgba(230, 232, 235, 1);
    }
    .h260,
    .border-sliod {
        margin-bottom: 22px;
        padding: 10px;
        min-height: 310px;
        background: rgba(255, 255, 255, 1);
        border-radius: 6px;
        border: 1px solid rgba(230, 232, 235, 1);
    }
    .content-right-left {
        margin-bottom: 22px;
        padding: 0;
        min-height: 310px;
        background: rgba(255, 255, 255, 1);
        border-radius: 6px;
        border: 1px solid rgba(230, 232, 235, 1);
    }
}

.extra-wrapper {
    line-height: 55px;
    padding-right: 24px;
    .extra-item {
        display: inline-block;
        margin-right: 24px;
        a {
            margin-left: 24px;
        }
    }
}

.antd-pro-pages-dashboard-analysis-twoColLayout {
    position: relative;
    display: flex;
    display: block;
    flex-flow: row wrap;
}

.antd-pro-pages-dashboard-analysis-salesCard {
    height: calc(100% - 24px);
    /deep/ .ant-card-head {
        position: relative;
    }
}

.dashboard-analysis-iconGroup {
    i {
        margin-left: 16px;
        color: rgba(0, 0, 0, 0.45);
        cursor: pointer;
        transition: color 0.32s;
        color: black;
    }
}

.analysis-salesTypeRadio {
    position: absolute;
    right: 54px;
    bottom: 12px;
}
</style>
