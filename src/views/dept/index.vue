<template>
  <div style="margin-top: 20px; margin: 50px; margin-right: 100px">
    <!-- 按钮 -->
    <el-row>
      <el-button
        style="float: right"
        type="primary"
        @click="
          dialogFormVisible = true;
          dept = {};
        "
        >Add Department</el-button
      >
    </el-row>
    <br />
    <!-- 数据表格 -->
    <template>
      <el-table
        highlight-current-row
        ref="multipleTable"
        :data="tableData"
        tooltip-effect="dark"
        style="width: 100%"
        border
      >
        <el-table-column
          type="index"
          width="100"
          label="Number"
          header-align="center"
          align="center"
        ></el-table-column>
        <el-table-column
          prop="name"
          label="Department Name"
          header-align="center"
          align="center"
        ></el-table-column>
        <el-table-column
          label="Last Operation Time"
          header-align="center"
          align="center"
        >
          <template slot-scope="scope">
            {{
              scope.row.updateTime ? scope.row.updateTime.replace("T", " ") : ""
            }}
          </template>
        </el-table-column>

        <el-table-column
          label="Action"
          width="420"
          header-align="center"
          align="center"
        >
          <template slot-scope="scope">
            <el-button
              size="mini"
              type="danger"
              plain
              @click="deleteById(scope.row.id)"
              >Delete</el-button
            >
          </template>
        </el-table-column>
      </el-table>
    </template>

    <!-- 新建对话框 -->

    <el-dialog title="Add Department" :visible.sync="dialogFormVisible">
      <el-form :model="dept">
        <el-form-item label="Name" :label-width="formLabelWidth">
          <el-input
            v-model="dept.name"
            placeholder="Please enter department name"
            autocomplete="off"
          ></el-input>
        </el-form-item>
      </el-form>

      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisible = false">Cancel</el-button>
        <el-button type="primary" @click="add()">Confirm</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import { findAll, add, update, deleteById } from "@/api/dept.js"

export default {
  data () {
    return {
      formLabelWidth: "120px",
      dialogFormVisible: false, //控制对话框是否可见
      dept: {
        name: "",
      },
      tableData: [],
    }
  },

  methods: {
    // Delete department
    deleteById (id) {
      this.$confirm("Are you sure you want to delete?", "Confirmation", {
        confirmButtonText: "Confirm",
        cancelButtonText: "Cancel",
        type: "warning",
      })
        .then(() => {
          deleteById(id).then((result) => {
            if (result.data.code == 1) {
              this.$message({
                message: "Congratulations, delete successful",
                type: "success",
              })
            } else {
              this.$message.error(result.data.msg)
            }
            // Refresh data
            this.init()
          })
        })
        .catch(() => {
          this.$message({
            type: "info",
            message: "Deletion canceled",
          })
        })
    },

    // Save method
    add () {
      let method // Add
      if (this.dept.id) {
        method = update(this.dept) // Update
      } else {
        method = add(this.dept) // Add
      }
      method.then((result) => {
        if (result.data.code == 1) {
          // Update successful
          this.$message.success("Congratulations, save successful")
          // Refresh data
          this.init()
        } else {
          this.$message.error(result.data.msg)
        }
      })
      // Close the dialog
      this.dialogFormVisible = false

      // Clear the model data
      this.dept = {}
    },

    // Initialize - Query all
    init () {
      findAll().then((result) => {
        console.log(result)
        if (result.data.code == 1) {
          this.tableData = result.data.data
        }
      })
    },
  },
  mounted () {
    // Automatically execute after the page is loaded
    this.init()
  },
}

</script>
<style></style>
