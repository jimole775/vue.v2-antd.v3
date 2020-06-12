<template>
  <div class="home-page">
    <div class="content-layout">
      <div class="carousel">
        <Banner/>
      </div>
    </div>
    <div class="content-layout">
      <div class="page-title">
        <span>
          待办事项({{ dataItem.length }})
          <!-- <a-icon :style="{fontSize:'14px', color:'#FAAD14'}" type="bell" /> -->
          <i class="font_family icon-ic_search" />
        </span>
      </div>
      <div class="item-list">
        <div v-if="listLoading" class="list-loading">
          <a-spin />
        </div>
        <ul v-else-if="dataItem.length != 0">
          <li v-for="(item, index) in dataItem" :key="index">
            <div>
              <span>事项：</span><a @click="viewDetail(item)">{{ item.bonusName }}</a>
            </div>
            <!-- <div><span>委派人：</span>{{item.personnel}}</div>
						<div><span>提交时间：</span>{{item.date}}</div> -->
          </li>
        </ul>
        <div v-else>
          <div style="margin:32px 0;">
            <a-empty :image="require('@/assets/pic_Nodata.png')" />
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { getIndexNeedToDO } from '@/api/bonusDistributeConfirm'
import Banner from './Banner'
// import img1 from '@/assets/slide/banner1.jpg'
// import img2 from '@/assets/slide/banner2.jpg'
const columnsToDo = [
  {
    title: '事项名称',
    dataIndex: 'bonusName',
    scopedSlots: { customRender: 'bonusName' }
  }
  /* {
      title: '提交人',
      dataIndex: 'personnel',
      width:'30%'
    },
    {
      title: '提交时间',
      dataIndex: 'date',
      width:'30%'
    } */
]

const dataItem = [
  /* {
    key: '0',
    bonusName: '2019年年度社会调查报告分发人确认',
    personnel: '张某某（薪酬管理岗位）',
    date: '2019-11-10 15:35',
  } */
]
let loadedBanner = {}
export default {
	name: 'BonusIndex',
	components: {
		Banner,
	},
  data() {
    return {
      columnsToDo: columnsToDo,
      dataItem, // 表数据源
			listLoading: false,
			// slide: [],
			// prevImg: {},
      // imgList: [
      // ]
    }
  },
  created() {
    this.getData()
  },
  methods: {
    viewDetail(rowData) {
      let { dataSource, bonusTreeId, bonusUnitId } = rowData

      if (dataSource == 1) {
        this.$router.push({
          name: 'PendingConfirm',
          params: {
            treeId: bonusTreeId,
            unitId: bonusUnitId
          },
          query: {
            status: '0'
          }
        })
      } else if (dataSource == 2) {
        this.$router.push({
          path: '/bonusDistribute/pendingHandledUnit',
          query: {
            bonusTreeId: bonusTreeId,
            bonusUnitId: bonusUnitId,
            status: 'pending'
          }
        })
      }
    },
    getData() {
			this.listLoading = true
      getIndexNeedToDO().then(res => {
        let { code, data, msg } = res

        if ((code == 200, msg == 'success')) {
          this.dataItem = data.map((items, index) => {
            let {
              bonusTreeId,
              bonusUnitId,
              bonusUnitName,
              /* approver,
							empJob,
							approvalTime, */
              dataSource,
              belongMonth,
              belongQuarter,
              belongYear
            } = items

            let bonusPlanType = ''
            let unitName = ''
            let describe = ''

            switch (items.bonusPlanType) {
              case 1:
                bonusPlanType = '年度'
                unitName = ''
                break
              case 2:
                bonusPlanType = '季度'
                unitName = belongQuarter
                break
              case 3:
                bonusPlanType = '月度'
                unitName = belongMonth
                break
            }

            switch (dataSource) {
              case 1:
                describe = '社会调查报告分发人确认'
                break
              case 2:
                describe = '社会调查报告分发'
                break
                break
            }

            return {
              index,
              /* date: approvalTime, */
              bonusName: `${belongYear}年${unitName}${bonusPlanType}${describe}(${bonusUnitName})`,
              /* personnel:`${approver}(${empJob})`, */
              bonusTreeId,
              bonusUnitId,
              dataSource
            }
          })
        }

        this.listLoading = false
      })
    },
  }
}
</script>

<style lang="less">
.home-page {
  .carousel {
    min-height: 330px;
    height: auto;
    .ant-carousel {
      height: 100%;
    }
    .slick-slider {
      div {
        height: 100%;
        /* background:linear-gradient(350deg,rgba(51,175,144,0.2) 0%,rgba(51,185,183,0.44) 100%); */
        cursor: pointer;
        img {
          object-fit: cover;
          object-position: left top;
          width: 100%;
          height: 100%;
        }
      }
      height: 100%;
    }
    .slick-list {
      height: 100%;
    }
    .slick-track {
      height: 100%;
    }
  }
  .ant-empty-image {
    height: 70px;
  }
}
</style>

<style lang="less" scoped>
.list-loading {
  align-items: center;
  display: flex;
  justify-content: center;
  min-height: 190px;
}

.content-layout {
  margin-bottom: 24px;
  overflow: hidden;
  box-sizing: border-box;
  display: flex;
  flex-direction: column;

  .page-title {
    .font_family {
      font-size: 20px;
      color: rgb(250, 173, 20);
      padding: 0 6px;
    }
    span {
      display: flex;
      align-items: center;
      color: #424656;
      font-size: 1.3rem;
    }
    margin-bottom: 1rem;
  }
  .item-list {
    min-height: 190px;
    max-height: 395px;
    overflow-x: hidden;
    overflow-y: auto;
    ul {
      padding-right: 12px;
      li {
        display: flex;
        margin-bottom: 12px;
        background-color: rgba(247, 249, 253, 1);
        padding: 12px;
        border-left: 2px solid transparent;
        & > div {
          &:nth-child(1) {
            flex: 4;
          }
          &:nth-child(2) {
            flex: 3;
          }
          &:nth-child(3) {
            flex: 2;
          }
          color: #2e2e3b;
          font-size: 14px;
          padding: 0 12px;
          span {
            color: #7c7b80;
          }
        }
        &:hover {
          border-left: 2px solid #00b627;
        }
      }
    }
  }
}
</style>
