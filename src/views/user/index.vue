<template>
    <div class="user-manger-container">
      <el-form :inline="true" :model="form" label-position="left">
        <el-form-item>
          <el-input v-model="form.username" placeholder="请输入用户名"></el-input>
        </el-form-item>
        <el-form-item>
          <el-input v-model="form.number" placeholder="请输入手机号"></el-input>
        </el-form-item>
        <el-form-item>
          <el-button size="small" type="primary" icon="el-icon-search" @click="onSubmit">查找</el-button>
          <el-button size="small" icon="el-icon-download">导出</el-button>
        </el-form-item>
      </el-form>
      <div class="table-container">
          <el-table :data="tableData" :default-sort="{prop:'userId'}" border>
            <el-table-column align="center" prop="userId" label="用户id" sortable/>
            <el-table-column align="center" prop="name" label="用户名" />
            <el-table-column align="center" prop="phone" label="手机号"/>
            <el-table-column align="center" prop="gender" label="性别" />
            <el-table-column align="center" prop="birthday" label="生日" />
            <el-table-column align="center" prop="grade" label="用户等级" />
            <el-table-column align="center" prop="status" label="状态" />
            <el-table-column align="center" prop="operating" label="操作" />
          </el-table>
      </div>
    </div>
</template>

<script>
    export default {
        name: "index",
      data(){
          return{
            form:{
              username:'',
              number:''
            },
            tableData: [{
              userId:'5555',
              name:'jmjmjmj',
              phone:'14525252522525',
              gender:'男',
              birthday:'1998',
              grade:'普通用户',
              status:'可用',
              operating:'dddd'
            },
              {
                userId:'666',
                name:'jmjmjmj',
                phone:'14525252522525',
                gender:'男',
                birthday:'1998',
                grade:'普通用户',
                status:'可用',
                operating:'dddd'
              }
            ]
          }
      },
      methods:{
        onSubmit(){
          console.log('dddd')
        }
      }
    }
</script>

<style lang="scss" scoped>
.user-manger-container{
  .el-form{
    margin-top: 20px;
    margin-left: 20px;
  }
  .table-container{
    margin-left: 20px;
    margin-right: 20px;
  }
}
.flip-list-move {
  transition: transform 1s;
}
</style>
