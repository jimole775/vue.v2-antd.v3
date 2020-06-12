<template>
    <div class="main-content ">
        <a-breadcrumb separator=">">
            <!-- <a-breadcrumb-item>首页</a-breadcrumb-item> -->
            <a-breadcrumb-item>
                报告导入
            </a-breadcrumb-item>
        </a-breadcrumb>
        <div class="content-layout">
            <div class="table-page-search-wrapper">
                <a-form layout="inline" :label-col="{span: 4}" :wrapper-col="{span: 20}">
                    <a-row :gutter="24">
                        <a-col :md="6" :sm="24">
                            <a-form-item label="计划名称" required>
                                <!-- :params="{flag: 1}" -->
                                <SingleSelect
                                    :url="'/plan/getSelectPlanList'" 
                                    v-model="queryParam.planId"
                                    @changeData="changePlan"
                                ></SingleSelect>
                            </a-form-item>
                        </a-col>
                        <a-col :md="5" :sm="24">
                            <a-button class="btn-primary" type="primary" @click="handleClickSearch">搜索</a-button>
                        </a-col>
                        <a-col :md="13" :sm="24" align="right">
                            <a-button style="margin-right:24px;" type="primary" ghost :loading="downloading" @click="downloadFile"><i class="font_family icon-btn_normal_download"/>下 载</a-button>
                            <a-button type="primary" ghost @click="showUploadChange"><i class="font_family icon-btn_normal_Import1"/>导 入</a-button>
                        </a-col>
                    </a-row>
                </a-form>
            </div>
            <div class="table-bonus-plan">
                <a-table
                    rowKey="index"
                    :loading="loading"
                    :columns="columnsPlan"
                    :dataSource="dataPlan"
                    :pagination="pagination"
                    @change="pageTurning"
                >
                  <template slot="empName" slot-scope="text, record">
                    {{ `${text}(${record['empNumber']})` }}
                  </template>
                </a-table>
            </div>
        </div>
        <a-modal title="导入" width="500px" v-model="showUpload" @ok="uploadConfirm">
            <up-load :urlSrc="`/payTaxes/lastImport${urlParam({planId: queryParam.planId})}`" > 
                <template slot="templateDownload">
                    <div class="link">
                        <a
                            :href="getURL('/template/上年实体导入模板V1.xls')"
                            target="_blank"
                            rel="noopener noreferrer"
                        >下载导入模板</a>
                    </div>
                </template>
            </up-load>
        </a-modal>
    </div>
</template>


<script>
import UpLoad from './UpLoad'
import SingleSelect from '@/components/Dropdown/SingleSelect'
import { downloadBlobFile,formatMoney } from '@/utils/util'
import { 
    getLastExport,
    getLastList
} from '@/api/bonusDistributeConfirm'
import { urlParam } from '@/utils/util'
const columnsPlan = [
    {
        title: '序号',
        dataIndex: 'index',
        align: 'center',
        scopedSlots: { customRender: 'index' },
        width: 80
    },
    // {
    //     title: '工号',
    //     dataIndex: 'empNumber',
    // },
    {
        title: '姓名(工号)',
        dataIndex: 'empName',
        scopedSlots: { customRender: 'empName' },
        width: 160
    },
    {
        title: '上年实体',
        dataIndex: 'lastMerits',
        width: 160
    }
]

export default {
    name: 'FinanceInfo',
    components: {
        UpLoad,
        SingleSelect,
    },
    data() {
        return {
            loading: false,
            downloading: false,
            pagination: {
                total: 0,
                defaultCurrent: 1,
                current:1,
                pages: 0,
                pageSize: 20,
                pageSizeOptions: ['20', '50', '100'],
                showSizeChanger: true,
                showQuickJumper: true,
                showTotal: (total) => {
                    return `共 ${total - this.pagination.pages} 条`
                }
            },
            // 查询参数
            queryParam: {
                planId: null,
            }, // 查询入参
            columnsPlan, // 表头
            dataPlan: [], // 表数据源
            fileName:'',    //导出文件名
            showUpload: false,  //显示下载弹框
        }
    },
    computed: {

    },
    created() {

    },
    mounted() {

    },
    methods: {
        urlParam,
        changePlan(val, text, item) {
            this.queryParam.planId = item.value
            this.fileName = item.text
        },

        handleTableChange(pagination, filters, sorter) {


        },
        getURL(url) {
        
            return process.env.VUE_APP_HOST_URL + url
        },
        downloadFile() {

            if(this.queryParam.planId == null){
                this.$message.warning('请先选择计划名称！')
                return
            }

            this.downloading = true

                getLastExport({
                    planId : this.queryParam.planId
                }).then(res => {

                if (res) {
                    downloadBlobFile(res, `${this.fileName}上年实体`)
                    this.$success({
                        title: '导出成功',
                        content: 'success!'
                    })
                } else {
                    this.$error({
                        title: '导出失败',
                        content: 'null'
                    })
                }

                this.downloading = false
            })
            
        },
        uploadConfirm() {
            this.showUpload = false
            this.pagination.current = 1
            this.search()
        },
        search () {
            this.loading = true
            getLastList({
                current: this.pagination.current,
                pageSize: this.pagination.pageSize,
                planId : this.queryParam.planId
            }).then(res => {
                let { code,msg,data:{ total,list } } = res
                this.pagination.total = total
                if(code == 200, msg == 'success'){
                    this.dataPlan = list.map((items,index) => {
                        let lastMerits = formatMoney(items.lastMerits)
                        let { current,pageSize } = this.pagination
                        let serialNumber = (current - 1) * pageSize
                        return {
                            index      : serialNumber + index + 1,
                            empNumber : items.empNumber,
                            empName : items.empName,
                            lastMerits
                        }
                    })
                }
                this.loading = false
            })
        },
        handleClickSearch(){

            if(this.queryParam.planId == null){
                this.$message.warning('请先选择计划名称！')
                return
            }

            this.pagination.current = 1
            this.search()
        },
        pageTurning(pagination){


            let { current,pageSize } = pagination
            this.pagination.current = current
            this.pagination.pageSize = pageSize
            this.search()
        },
        showUploadChange(){

            if(this.queryParam.planId == null){
                this.$message.warning('请先选择计划名称！')
                return
            }

            this.showUpload = true
        }

    }
}
</script>

<style lang="less" scoped>

</style>