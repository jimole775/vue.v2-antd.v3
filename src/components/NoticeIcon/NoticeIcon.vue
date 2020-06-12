<template>
	<a-popover
		v-model="visible"
		trigger="click"
		placement="bottomRight"
		:arrowPointAtCenter="true"
		:overlayStyle="{ width: '770px', top: '100px' }"
		:getPopupContainer="(triggerNode)=>{ return triggerNode.parentNode}"
	>
		<template slot="content">
			<a-spin :spinning="loading">
				<a-row>
					<a-col :md="20" :sm="24">
						<h3 style="font-size:1.3rem; color:rgba(66,70,86,1);">
						消息列表
						</h3>
					</a-col>
					<a-col :md="4" :sm="24" align="right">
						<a-icon @click="visible = false" type="close" :style="{ fontSize: '16px',display:'inline-block'}" />
					</a-col>
				</a-row>

				<div class="table-page-search-wrapper">

					<a-form layout="inline" class="filter-search">
						<a-row :gutter="10" type="flex" align="middle" >
							<a-col :md="3">
								<span style="font-size:14px; color:rgba(102,102,102,1);">筛选条件:</span>
							</a-col>
							<a-col :md="5" :sm="24">
								<a-form-item>
									<!-- <a-input placeholder="请输入分发计划" v-model="querySearch.bonusPlanName" /> -->
									<a-select 
										placeholder="请选择分发计划" 
										allowClear
										@change="bonusPlanChange"
										v-model="defaultPlan"
										:getPopupContainer="(triggerNode)=>{ return triggerNode.parentNode}"
									>
										<a-select-option 
											v-for="items in screenData.bonusPlan"  
											:value="items.value"
											:key="items.value"
											:title="items.text"
										>
											{{items.text}}
										</a-select-option>
									</a-select>

								</a-form-item>
							</a-col>
							<a-col :md="4" :sm="24" v-if="user.roleId == 1">
								<a-form-item>
									<!-- <a-input 
										placeholder="请输入姓名" 
										v-model="querySearch.createdName" 
									/> -->
									<a-select
										mode="default"
										allowClear
										:showSearch="true"
										:showArrow="false"
										:disabled="
											querySearch.bonusPlanId == undefined || 
											querySearch.bonusTreeId == undefined || 
											querySearch.bonusTreeId == 'null'
										"
										placeholder="请输入姓名"
										:filterOption="false"
										@search="searchName"
										@change="changeName"
										:notFoundContent="searchNameLoading ? undefined : null"
										:getPopupContainer="(triggerNode)=>{ return triggerNode.parentNode}"
									>
										<a-spin v-if="searchNameLoading" slot="notFoundContent" size="small" />
										<a-select-option 
											disabled 
											value=""
											v-else-if="screenData.createdName.length == 0"
										>
											暂无数据
										</a-select-option>
										<a-select-option 
											v-for="d in screenData.createdName" 
											:key="d.key"
											:title="d.text"
										>
											{{d.text}}
										</a-select-option>
									</a-select>
								</a-form-item>
							</a-col>
							<a-col :md="5" :sm="24">
								<a-form-item>
									<!-- <a-input placeholder="请输入社会调查报告单元" v-model="querySearch.bonusUnitId" /> -->
									<a-select
										mode="default"
										allowClear
										:showSearch="true"
										:showArrow="false"
										v-model="querySearch.bonusUnitId"
										:disabled="
											querySearch.bonusPlanId == undefined || 
											querySearch.bonusTreeId == undefined || 
											querySearch.bonusTreeId == 'null'
										"
										placeholder="请输入社会调查报告单元"
										:filterOption="false"
										@search="searchUnit"
										:notFoundContent="unitFetching ? undefined : null"
										:getPopupContainer="(triggerNode)=>{ return triggerNode.parentNode}"
									>
										<a-spin v-if="unitFetching" slot="notFoundContent" size="small" />
										<a-select-option 
											disabled 
											value=""
											v-else-if="screenData.bonusUnit.length == 0"
										>
											暂无数据
										</a-select-option>
										<a-select-option v-for="d in screenData.bonusUnit" :key="d.value">{{d.text}}</a-select-option>
									</a-select>
								</a-form-item>
							</a-col>
							<a-col :md="3" :sm="24">
								<a-form-item>
									<a-select 
										placeholder="请选择" 
										allowClear
										v-model="querySearch.feedbackStatus" 
										:getPopupContainer="(triggerNode)=>{ return triggerNode.parentNode}"
									>
										<a-select-option value="">全部</a-select-option>
										<a-select-option value="0">未处理</a-select-option>
										<a-select-option value="1">已处理</a-select-option>
									</a-select>
								</a-form-item>
							</a-col>
							<a-col :md="4" :sm="24">
								<span class="table-page-search-submitButtons">
								<a-form-item>
								<a-button class="btn-primary" type="primary" id="searchBtn" @click="handleClickSearch">搜索</a-button>
								</a-form-item>
								</span>
							</a-col>
						</a-row>
					</a-form>
				</div>
				
	
				<a-row :gutter="12" style="margin-bottom:12px; box-">
					<a-col :md="20" :sm="24">
						<span style="font-size:14px; color:rgba(102,102,102,1);">
						筛选结果（{{itemList.length}}条）：
						</span>
					</a-col>
					<!-- <a-col :md="4" :sm="24" align="center">
						<a href="javascript: void(0)">全部处理完毕</a> 
					</a-col> -->
				</a-row>

				<div class="item-list">
					<a-list itemLayout="horizontal" :dataSource="itemList">
						<a-list-item slot="renderItem" slot-scope="item">

							<a-list-item-meta 
								:description="`${item.bonusUnitName != null ? item.bonusUnitName + ':' : ''}${item.feedbackRemark}`"
							>
								<div slot="title">
									<a-row type="flex" justify="space-around" align="middle" :gutter="12">

										<a-col :md="20" :sm="24">
											<div class="list-title">
												<span style="color:#2E2E3B;">{{item.createdBy == -1 ? '系统消息' : item.createdName}}</span>
												<span style="color:#2E2E3B;" v-if="item.createdBy != -1">({{item.empJob}})</span>
												<span style="color:#7C7B80;"> {{item.createdDate}} </span>
												<span :style="{color: item.feedbackStatus == 1 ? '#00B627' : '#FA6400',margin:'0 12px'}">●</span> 
												<span style="color:#7C7B80;">{{item.feedbackStatus == "1" ? "已处理" : "未处理"}}</span>	
											</div>
										</a-col>

										<a-col :md="4" :sm="24">
											<a-button 
												:style="{width:'100%'}" 
												v-if="item.feedbackStatus == '0' && user.roleId == 1" 
												type="primary" 
												ghost
												@click="handleClickStatusChange(item)"
											>
												处理完毕
											</a-button>
										</a-col>
										
									</a-row>
								</div>
							</a-list-item-meta>
							
						</a-list-item>
					</a-list>
				</div>
			</a-spin>
		</template>
		<span  @click="visible = !visible">
			<a-badge :offset="[-4,16]" :style="{height:'100%',lineHeight:'inherit'}" :count="itemListNumber">
				<i class="font_family icon-ic_news" />
			</a-badge>
		</span>
	</a-popover>
</template>

<script>
import { 
	getMessageList,
	getStatusChange,
	getDropdownList,
	getSearchSSOName,
	getUnitFuzzySearch
} from '@/api/bonusDistributeConfirm'
import { 
	deDuplication
} from '@/utils/util'
import debounce from 'lodash/debounce'
import { mapState } from 'vuex'
const itemList = [
    /* {
		name:'张三',
		date:'2019-11-11 10:36',
		message: 'Ant Design Title 1Ant Design Titl',
		state:'1'
    } */
];
export default {
	name: 'HeaderNotice',
	data () {
		this.lastFetchIdName = 0
		this.lastFetchIdUnit = 0
		this.searchName = debounce(this.searchName, 800)
		this.searchUnit = debounce(this.searchUnit, 800)
		return {
			loading: false,
			visible: false,
			busy: false,
			defaultPlan:undefined,
			itemList:itemList,
			searchNameLoading: false,		//筛选人员输入框loading显示控制阀门
			unitFetching: false,			//社会调查报告单元模糊查询loading显示控制阀门
			querySearch:{
				bonusPlanId: '',
				bonusTreeId: undefined,
				createdBy: undefined,
				bonusUnitId: undefined,
				feedbackStatus	: '0'
			},
			screenData:{
				bonusPlan:[],
				createdName:[],
				bonusUnit:[]
			}
		}
	},
	computed:{
		//未处理消息数量
		itemListNumber: function(){
			let untreatedArr = this.itemList.filter(res => res.feedbackStatus == 0)
			return untreatedArr.length
		},
		...mapState(['user'])
	},
	watch:{
		visible: function (val) {
			if(val === true){
				setTimeout(() => {
					this.getData()
				},800)
			}
		}
	},
	async created(){

		//第一次打开组件默认显示最上面的一条帆船计划
		await getDropdownList().then(res => {

			let {code,msg,data} = res

			if(code == 200 && msg == 'success' && data != null){
				this.screenData.bonusPlan = data.map((item,index) => {
					if(index == 0){
						this.defaultPlan = `${item.value}/${item.treeId}`
						this.querySearch.bonusPlanId = item.value
						this.querySearch.bonusTreeId = item.treeId
					}
					return {
						text : item.text,
						value: `${item.value}/${item.treeId}`
					}
				})
			}
		})

		//初始化未读消息的小红点是否显示
		await getMessageList(this.querySearch).then(res => {
			let {code,data,msg} = res
			if(code == 200, msg == 'success'){
				/* let nb = data.filter(res => res.feedbackStatus == 0).length */
				this.itemList = data
			}
		})
	},
	methods: {
		handleClickSearch(){

			this.getData()

		},
		async getData(){

			await this.getBonusPlan()

			this.loading = true
			
            await getMessageList(this.querySearch).then(res => {
				this.loading = false
                let {code,data,msg} = res
                if(code == 200, msg == 'success'){
                    this.itemList = data
                    this.loading = false
				}
			})
			
		},
		handleClickStatusChange(data){
			this.loading = true
			let params = data
			params.feedbackStatus = 1
			getStatusChange(params).then(res => {
				let {code,msg} = res
				if(code == 200, msg == 'success'){
					this.$message.success('反馈处理成功！');
				}
				this.loading = false
			})
		},
		getBonusPlan(){
			getDropdownList().then(res => {

				let {code,msg,data} = res

				if(code == 200 && msg == 'success' ){

					this.screenData.bonusPlan = data.map((item,index) => {
						return {
							text : item.text,
							value: `${item.value}/${item.treeId}`
						}
					})
					
				}
			})
		},
		searchName(value){

			this.lastFetchIdName += 1;

			const fetchId = this.lastFetchIdName;
			
			this.searchNameLoading = true;
			
			getSearchSSOName({nickname: value}).then(res =>{

				if (fetchId !== this.lastFetchIdName) {
                    // for fetch callback order
                    return;
				}

				let { code, msg , data } = res

				if(code == 200 && msg == 'success'){

					let newarr = deDuplication(data,'value')	//数组去重

					this.screenData.createdName = newarr.map((res,index) => {

						let { text,value,empJob } = res

						return {
							text  : `${text}/${value}/${empJob}`,
							key : `${text}/${value}`
						}
					})

				}

				this.searchNameLoading = false;
			})
		},
		changeName(items){
			if(items){
				let [ name, id ] = items.split("/")
				this.querySearch.createdBy = id
			}else{
				this.querySearch.createdBy = undefined
			}
			
		},
		searchUnit(keyword){
			this.lastFetchIdUnit += 1;
            const fetchId = this.lastFetchIdUnit;
            this.unitFetching = true;
			getUnitFuzzySearch({
				treeId: this.querySearch.bonusTreeId,
  				unitIdOrName: keyword
			}).then(res => {
				if (fetchId !== this.lastFetchIdUnit) {
                    // for fetch callback order
                    return;
                }
				let {code,msg,data} = res
				if(code == 200 && msg == 'success'){
					this.screenData.bonusUnit = data.map(items => {
						return {
							text: items.text,
							value:items.value
						}
					})
				}
				this.unitFetching = false;
			})
		},

		bonusPlanChange(val){
			if(val){
				let [planId,treeId] = val.split("/")
				this.querySearch.bonusPlanId = planId
				this.querySearch.bonusTreeId = treeId
			}else{
				this.querySearch.bonusPlanId = undefined
				this.querySearch.bonusTreeId = undefined
			}
			
		}
	}
}
</script>

<style lang="less">
	.filter-search{
		.ant-form-item-control-wrapper{
			width:100%;
		}
	}
</style>
<style lang="less" scoped>
	
	.table-page-search-wrapper{
		margin:24px 0;
	}
	.item-list{
		overflow-y: auto;
		overflow-x: hidden;
		height: 315px;
		padding-right:12px;
	}
	.btn-primary{
		width:100%;
	}
	.ant-list-item-meta-description{
		font-size:14px;
		font-weight:bold;
		color:#2E2E3B;
	}
	.list-title{
		font-size:14px;
		margin-bottom:8px;
		span{
			font-size:14px;
		}
	}
	.font_family{
		font-size:30px;
	}
</style>
