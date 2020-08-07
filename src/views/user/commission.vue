<template>
    <div class="commission-container">
      <el-form ref="form" inline="true" :model="listQuery" label-position="left">
        <el-form-item prop="userName">
          <el-input v-model="listQuery.userName" clearable placeholder="请输入用户名"/>
        </el-form-item>
        <el-form-item prop="mobile">
          <el-input v-model="listQuery.mobile" clearable placeholder="请输入手机号" />
        </el-form-item>
        <el-form-item>
          <el-select v-model="listQuery.statusArray" placeholder="请选择" multiple style="width: 220px">
            <el-option v-for="(key, value) in statusMap" :key="key" :label="key" :value="value"/>
          </el-select>
        </el-form-item>
        <el-form-item>
          <el-button class="filter-item" size="small" type="primary" icon="el-icon-search" @click="handleFilter">查找</el-button>
        </el-form-item>
      </el-form>
        <el-table :data="tableData" border fit highlight-current-row>
          <el-table-column prop="id" align="center" label="记录ID" sortable/>
          <el-table-column prop="traceSn" label="申请流水" align="center"/>
          <el-table-column prop="type" label="类型" align="center"/>
          <el-table-column prop="id" label="用户编号" align="center"/>
          <el-table-column prop="mobile" label="手机号码" align="center"/>
          <el-table-column prop="amount" label="提现金额" align="center"/>
          <el-table-column prop="totalAmount" label="已提总额" align="center"/>
          <el-table-column prop="status" label="审批状态" align="center"/>
          <el-table-column prop="traceMsg" label="审批备注" align="center"/>
          <el-table-column prop="status" label="操作" align="center"/>
        </el-table>
      <pagination/>
    </div>
</template>

<script>
  import pagination from '@/components/Pagination'

  const statusMap = {
    0:'提现申请',
    1:'审批通过',
    2:'审批拒绝'
  }

    export default {
      name: "commission",
      components:{
        pagination
      },
      data() {
        return {
          form: {
            userName: '',
            mobile: ''
          },
          listQuery:{
            userName: '',
            mobile: '',
            statusArray:[],
            page: 1,
            limit: 20,
            sort: 'add_time',
            order: 'desc'
          },
          statusMap,
        }
      }
    }
</script>

<style scoped>
  .commission-container{
    margin: 20px;
  }
</style>
