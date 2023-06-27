<template>
  <div class="app-container">
    <!--搜索表单-->
    <el-form :inline="true" :model="searchEmp" class="demo-form-inline">
      <el-form-item label="Name">
        <el-input
          v-model="searchEmp.name"
          placeholder="Enter employee name"
        ></el-input>
      </el-form-item>
      <el-form-item label="Gender">
        <el-select v-model="searchEmp.gender" placeholder="Please select">
          <el-option label="Male" value="1"></el-option>
          <el-option label="Female" value="2"></el-option>
        </el-select>
      </el-form-item>

      <el-form-item label="Entry Date">
        <el-date-picker
          v-model="entrydate"
          clearable
          value-format="yyyy-MM-dd"
          type="daterange"
          placeholder="Select date"
          range-separator="to"
          start-placeholder="Start date"
          end-placeholder="End date"
          style="width: 400px; margin-left: 20px"
        ></el-date-picker>
      </el-form-item>

      <el-form-item>
        <el-button type="primary" @click="onSubmit">Search</el-button>
        <el-button type="info" @click="clear">Clear</el-button>
      </el-form-item>
    </el-form>

    <!--按钮-->
    <el-row>
      <el-button type="danger" size="medium" @click="deleteByIds"
        >- Batch Delete</el-button
      >
      <el-button
        type="primary"
        size="medium"
        @click="
          dialogVisible = true;
          emp = { image: '' };
        "
        >+ Add Employee</el-button
      >
    </el-row>

    <!--添加数据对话框表单-->
    <el-dialog
      ref="form"
      title="Edit Employee"
      :visible.sync="dialogVisible"
      width="30%"
    >
      <el-form ref="form" :model="emp" label-width="140px" size="mini">
        <el-form-item label="Username">
          <el-input v-model="emp.username"></el-input>
        </el-form-item>
        <el-form-item label="Employee Name">
          <el-input v-model="emp.name"></el-input>
        </el-form-item>

        <el-form-item label="Gender">
          <el-select
            v-model="emp.gender"
            placeholder="Please select"
            style="width: 100%"
          >
            <el-option
              v-for="item in genderList"
              :key="item.value"
              :label="item.name"
              :value="item.id"
            />
          </el-select>
        </el-form-item>

        <!-- <el-form-item label="头像">
          <el-upload
            class="avatar-uploader"
            action="/api/upload"
            :headers="token"
            name="image"
            :show-file-list="false"
            :on-success="handleAvatarSuccess"
            :before-upload="beforeAvatarUpload"
          >
            <img v-if="emp.image" :src="emp.image" class="avatar" />
            <i v-else class="el-icon-plus avatar-uploader-icon"></i>
          </el-upload>
        </el-form-item> -->

        <el-form-item label="Position">
          <el-select
            v-model="emp.job"
            placeholder="Please select"
            value-key="emp.job"
            style="width: 100%"
          >
            <el-option
              v-for="item in jobList"
              :key="item.value"
              :label="item.name"
              :value="item.id"
            />
          </el-select>
        </el-form-item>

        <el-form-item label="Entry Date">
          <el-date-picker
            v-model="emp.entrydate"
            clearable
            type="date"
            placeholder="Select date"
            size="small"
            style="width: 100%"
          ></el-date-picker>
        </el-form-item>

        <el-form-item label="Department">
          <el-select
            v-model="emp.deptId"
            placeholder="Please select"
            style="width: 100%"
          >
            <!-- 
        <el-option label="Department A" value="1"></el-option>
        <el-option label="Department B" value="2"></el-option>
         -->
            <el-option
              v-for="item in deptList"
              :key="item.value"
              :label="item.name"
              :value="item.id"
            />
          </el-select>
        </el-form-item>

        <el-form-item>
          <el-button type="primary" @click="add">Submit</el-button>
          <el-button @click="dialogVisible = false">Cancel</el-button>
        </el-form-item>
      </el-form>
    </el-dialog>

    <br />
    <!--表格-->
    <template>
      <el-table
        :data="tableData"
        style="width: 100%"
        border
        @selection-change="handleSelectionChange"
      >
        <el-table-column
          type="selection"
          width="55"
          align="center"
        ></el-table-column>
        <el-table-column
          prop="name"
          label="Name"
          align="center"
        ></el-table-column>
        <el-table-column align="center" label="Gender">
          <template slot-scope="scope">
            <span style="margin-right: 10px">
              {{ scope.row.gender == "1" ? "Male" : "Female" }}</span
            >
          </template>
        </el-table-column>

        <el-table-column align="center" label="Position">
          <template slot-scope="scope">
            <span style="margin-right: 10px" v-if="scope.row.job == 1"
              >Supervisor</span
            >
            <span style="margin-right: 10px" v-if="scope.row.job == 2"
              >Lecturer</span
            >
            <span style="margin-right: 10px" v-if="scope.row.job == 3"
              >Student Affairs</span
            >
            <span style="margin-right: 10px" v-if="scope.row.job == 4"
              >Research Manager</span
            >
          </template>
        </el-table-column>

        <el-table-column align="center" label="Entry Date">
          <template slot-scope="scope">
            {{ scope.row.entrydate }}
          </template>
        </el-table-column>
        <el-table-column align="center" label="Last Update Time">
          <template slot-scope="scope">
            {{
              scope.row.updateTime ? scope.row.updateTime.replace("T", " ") : ""
            }}
          </template>
        </el-table-column>

        <el-table-column align="center" label="Actions">
          <template slot-scope="scope">
            <el-button type="primary" size="small" @click="update(scope.row.id)"
              >Edit</el-button
            >
            <el-button
              type="danger"
              size="small"
              @click="deleteById(scope.row.id)"
              >Delete</el-button
            >
          </template>
        </el-table-column>
      </el-table>
    </template>

    <!--分页工具条-->
    <el-pagination
      @size-change="handleSizeChange"
      @current-change="handleCurrentChange"
      :background="background"
      :current-page="currentPage"
      :page-sizes="[5, 10, 15, 20]"
      :page-size="5"
      layout="total, sizes, prev, pager, next, jumper"
      :total="totalCount"
    >
    </el-pagination>
  </div>
</template>

<script>
import { page, add, update, deleteById, selectById } from "@/api/emp.js"
import { findAll } from "@/api/dept.js"
import { getToken } from '@/utils/auth'

export default {
  data () {
    return {
      background: true,
      pageSize: 5,
      totalCount: 100,
      currentPage: 1,
      dialogVisible: false,
      searchEmp: {
        name: "",
        gender: "",
      },
      emp: {
        image: "",
      },
      deptList: [],
      genderList: [{ id: 1, name: "Male" }, { id: 2, name: "Female" }],
      jobList: [
        {
          id: 1,
          name: "Head Teacher",
        },
        {
          id: 2,
          name: "Lecturer",
        },
        {
          id: 3,
          name: "Student Affairs Supervisor",
        },
        {
          id: 4,
          name: "Academic Research Supervisor",
        }
      ],
      beginTime: "",
      endTime: "",
      entrydate: "",
      selectedIds: [],
      multipleSelection: [],
      tableData: [],
      token: { token: getToken() }
    }
  },

  mounted () {
    this.page() //当页面加载完成后，发送异步请求，获取数据
    findAll().then((result) => {
      this.deptList = result.data.data
    })
  },

  methods: {
    // 查询分页数据
    page () {
      page(
        this.searchEmp.name,
        this.searchEmp.gender,
        this.beginTime,
        this.endTime,
        this.currentPage,
        this.pageSize
      ).then((res) => {
        this.totalCount = res.data.data.total
        this.tableData = res.data.data.rows
      })
    },

    // 复选框选中后执行的方法
    handleSelectionChange (val) {
      this.multipleSelection = val
    },

    // 查询方法
    onSubmit () {
      this.currentPage = 1
      this.page()
    },

    clear () {
      this.searchEmp = { name: "", gender: "" }
      this.beginTime = "",
        this.endTime = ""
      this.entrydate = ""
      this.page()
    },
    // 添加数据
    add () {
      let operator

      if (this.emp.id) {
        //修改
        operator = update(this.emp)
      } else {
        operator = add(this.emp)
      }

      operator.then((resp) => {
        if (resp.data.code == "1") {
          this.dialogVisible = false
          this.page()
          this.$message({ message: "Congratulations, saved successfully", type: "success" })
          this.emp = { image: "" }
        } else {
          this.$message.error(resp.data.msg)
        }
      })
    },
    update (id) {
      //1. 打开窗口
      this.dialogVisible = true
      //2. 发送请求

      selectById(id).then((result) => {
        if (result.data.code == 1) {
          this.emp = result.data.data
          this.emp
        }
      })
    },


    //分页
    handleSizeChange (val) {
      // 重新设置每页显示的条数
      this.pageSize = val
      this.page()
    },

    handleCurrentChange (val) {
      // 重新设置当前页码
      this.currentPage = val
      this.page()
    },


    //删除员工信息
    deleteById (id) {
      this.$confirm("This operation will delete the data, continue?", "Prompt", {
        confirmButtonText: "Confirm",
        cancelButtonText: "Cancel",
        type: "warning",
      }).then(() => {
        //2. Send AJAX request
        deleteById(id).then((resp) => {
          if (resp.data.code == 1) {
            // Deletion successful
            this.$message.success("Congratulations, deleted successfully")
            this.page()
          } else {
            this.$message.error(resp.data.msg)
          }
        })
      }).catch(() => {
        // User clicked the cancel button
        this.$message.info("Deletion canceled")
      })
    },

    // Batch delete employee information
    deleteByIds () {
      // Show confirmation dialog
      this.$confirm("This operation will delete the data, continue?", "Prompt", {
        confirmButtonText: "Confirm",
        cancelButtonText: "Cancel",
        type: "warning",
      }).then(() => {
        // User clicked the confirm button
        // 1. Create an id array from this.multipleSelection
        for (let i = 0; i < this.multipleSelection.length; i++) {
          this.selectedIds[i] = this.multipleSelection[i].id
        }

        // 2. Send AJAX request
        deleteById(this.selectedIds).then((resp) => {
          if (resp.data.code == "1") {
            // Deletion successful
            this.$message.success("Congratulations, deleted successfully")
            this.page()
          } else {
            this.$message.error(resp.data.msg)
          }
        })
      }).catch(() => {
        // User clicked the cancel button
        this.$message.info("Deletion canceled")
      })
    },

    // File upload related
    handleAvatarSuccess (res, file) {
      this.emp.image = res.data
    },
    beforeAvatarUpload (file) {
      const isJPG = file.type === "image/jpeg"
      const isLt2M = file.size / 1024 / 1024 < 2
      if (!isJPG) {
        this.$message.error("Avatar image can only be in JPG format!")
      }
      if (!isLt2M) {
        this.$message.error("Avatar image size cannot exceed 2MB!")
      }
      return isJPG && isLt2M
    },
  },


  watch: {
    // watch 监听器，用于监控 entrydate 数据的变化，将当前 entrydate 的值作为参数 val 传入
    entrydate (val) {
      if (val && val.length >= 2) {
        this.beginTime = val[0]
        this.endTime = val[1]
      } else {
        this.beginTime = ""
        this.endTime = ""
      }
    },
  },
};
</script>
<style>
.avatar-uploader .el-upload {
  border: 1px dashed #d9d9d9;
  border-radius: 6px;
  cursor: pointer;
  position: relative;
  overflow: hidden;
}

.avatar-uploader .el-upload:hover {
  border-color: #409eff;
}

.avatar-uploader-icon {
  font-size: 28px;
  color: #8c939d;
  width: 100px;
  height: 100px;
  line-height: 100px;
  text-align: center;
}

.avatar {
  width: 100px;
  height: 100px;
  display: block;
}
</style>
