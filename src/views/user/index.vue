<template>
  <div class="user-manger-container">
    <!-- 查询和其他操作 -->
    <div class="filter-container">
      <el-input v-model="listQuery.username" clearable class="filter-item" style="width: 200px;" placeholder="请输入用户名"/>
      <el-input v-model="listQuery.mobile" clearable class="filter-item" style="width: 200px;" placeholder="请输入手机号"/>
      <el-button class="filter-item" size="mini" type="primary" icon="el-icon-search" @click="handleFilter">查找</el-button>
      <el-button :loading="downloadLoading" size="mini" class="filter-item" type="primary" icon="el-icon-download" @click="handleDownload">导出</el-button>
    </div>
    <div class="table-container">
      <el-table v-loading="listLoading" element-loading-text="正在查询中。。。" :data="tableData" :default-sort="{prop:'id'}" border fit highlight-current-r>
        <el-table-column align="center" prop="id" label="用户id" sortable/>
        <el-table-column align="center" prop="username" label="用户名">
          <template #default="scope">
            <span>{{scope.row.username | userNameFilter}}</span>
          </template>
        </el-table-column>
        <el-table-column align="center" prop="mobile" label="手机号"/>
        <el-table-column align="center" label="性别">
          <template #default="scope">
            <el-tag>{{genderDic[scope.row.gender]}}</el-tag>
          </template>
        </el-table-column>
        <el-table-column align="center" prop="birthday" label="生日"/>
        <el-table-column align="center" label="用户等级">
          <template #default="scope">
            {{levelDic[scope.row.userLevel]}}
          </template>
        </el-table-column>
        <el-table-column align="center" label="状态">
          <template #default="scope">
            {{statusDic[scope.row.status]}}
          </template>
        </el-table-column>
        <el-table-column align="center" prop="shareUserId" label="操作">
          <template #default="scope">
            <el-button v-permission="['GET /admin/user/detailApprove']" v-if="scope.row.status==0 && scope.row.userLevel==2" size="mini" type="primary" @click="handleDetail(scope.row)">推广代理</el-button>
            <el-button v-permission="['POST /admin/user/approveAgency']" v-else-if="scope.row.status==3" type="primary" size="mini" @click="handleApproveAgency(scope.row)">审批</el-button>
            <el-button v-permission="['GET /admin/user/detailApprove']" v-else type="info" size="mini" >非代理</el-button>
          </template>
        </el-table-column>
      </el-table>
      <pagination class="pagination-container" v-show="total>0" :total="total" :page.sync="listQuery.page" :limit.sync="listQuery.limit" @pagination="getList" />
      <!-- 详情对话框 -->
      <el-dialog :visible.sync="detailDialogVisible" title="代理详情" width="700">
        <el-form :data="agencyDetail" label-position="left">
          <el-form-item label="佣金比例(%)">
            <span>{{agencyDetail.settlementRate}}</span>
          </el-form-item>
          <el-form-item label="推广二维码">
            <img :src="agencyDetail.shareUrl" width="300">
          </el-form-item>
        </el-form>
      </el-dialog>
      <!-- 代理审批 -->
      <el-dialog :visible.sync="approveDialogVisible" title="代理审批">
        <el-form ref="approveForm" :model="approveForm"status-icon label-position="left" label-width="100px" style="width: 400px;margin-left: 50px">
          <el-form-item label="佣金比例(%)" prop="settlementRate">
            <el-input v-model="approveForm.settlementRate"/>
          </el-form-item>
        </el-form>
        <div class="dialog-footer" slot="footer">
          <el-button @click="approveDialogVisible = false">取消</el-button>
          <el-button type="primary" @click="confirmApprove">确定</el-button>
        </div>
      </el-dialog>
    </div>
  </div>
</template>

<script>
  import Pagination from '@/components/Pagination'
  import {approveAgency, detailApprove, fetchList} from "@/api/user"
  import ScrollPane from "@/components/ScrollPane/index";

  export default {
  name: "index",
    components:{ScrollPane, Pagination},
    filters:{
      userNameFilter(value){
        let result;
        const reg = /[a-zA-Z0-9_-]+/;  //[a-zA-Z]表示匹bai配字母，g表示全du局匹配
        while (result = value.match(reg)) { //判断str.match(reg)是否没有字母了
          value = value.replace(result[0], ''); //替换掉字母  result[0] 是 str.match(reg)匹配到的字母
        }
        return value;
      }
    },
  data() {
    return {
      total: 0,
      listQuery:{
        username:'',
        mobile:'',
        page: 1,
        limit: 20,
        sort: 'add_time',
        order: 'desc'
      },
      tableData: [],
      genderDic: ['未知', '男', '女'],
      levelDic: ['普通用户', 'VIP用户', '代理'],
      statusDic: ['可用', '禁用', '注销', '代理申请'],
      listLoading: true,
      detailDialogVisible: false,
      agencyDetail: {},
      approveDialogVisible: false,
      downloadLoading: false,
      approveForm: {
        userId: undefined,
        settlementRate: undefined
      }
    }
  },
    created() {
      this.getList()
    },
    methods: {
      getList() {
        this.listLoading = true
        fetchList(this.listQuery).then(response => {
          this.tableData = response.data.items
          this.total = response.data.total
          this.listLoading = false
        }).catch(() => {
          this.tableData = []
          this.total = 0
          this.listLoading = false
        })
      },
    onSubmit() {
      console.log('dddd')
    },
      handleFilter(){
        this.listQuery.page=1
        this.getList()
      },
      handleDetail(row){
        this.agencyDetail = {
          shareUrl:undefined,
          settlementRate:undefined
        }
        detailApprove(row.id).then(response => {
          this.agencyDetail = response.data
        })
        this.detailDialogVisible = true
      },
      handleApproveAgency(row){
        this.approveForm.userId = row.id
        this.approveDialogVisible = true
        // this.$nextTick(() => {
        //   this.$refs['approveForm'].clearValidate()
        // })
      },
      confirmApprove(){
        this.$refs['approveForm'].validate((value) => {
          if (value){
            approveAgency(this.approveForm).then(response => {
              this.approveDialogVisible = false
              this.$notify.success({
                title:'成功',
                message:'审批成功'
              })
              this.getList()
            }).catch(response => {
              this.$notify.error({
                title:'审批失败',
                message:response.data.errmsg
              })
            })
          }
        })
      },
      handleDownload(){
        this.downloadLoading = true
        import('@/vendor/Export2Excel').then(excel => {
          const tHeader = ['用户名', '手机号码', '性别', '生日', '状态']
          const filterVal = ['username', 'mobile', 'gender', 'birthday', 'status']
          excel.export_json_to_excel2(tHeader, this.tableData, filterVal, '用户信息')
          this.downloadLoading = false
        })
      }
  }
}
</script>

<style lang="scss" scoped>
  .user-manger-container {
    .el-form {
      margin-top: 20px;
      margin-left: 20px;
    }

    .table-container {
      margin-left: 20px;
      margin-right: 20px;
    }
  }

  .flip-list-move {
    transition: transform 1s;
  }
  .filter-container {
    padding: 20px;
    :nth-child(2){
      margin-left: 20px;
    }
    :nth-child(3){
      margin-left: 20px;
    }
    :nth-child(4){
      background-color: #3a835d;
      border-color: #3a835d;
    }
    .el-button{
      width: 60px;
      padding-left: 8px;
      :nth-child(2){
        margin-left: 5px;
      }
    }
  }

</style>
