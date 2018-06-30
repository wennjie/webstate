<template>
    <div>
        <el-table align="center" v-loading="loading" ref="multipleTable" :data="dataList" tooltip-effect="dark" style="width: 100%" @selection-change="handleMsgSelectionChange">
            <!-- <el-table-column type="selection" width="55">
            </el-table-column> -->
            <el-table-column prop="name" label="留言者" width="100">
            </el-table-column>
            <el-table-column prop="telphone" label="电话" width="150" show-overflow-tooltip>
                <template slot-scope="scope">{{scope.row.telphone}}</template>
            </el-table-column>
            <el-table-column prop="email" label="邮箱" width="150">
                <template slot-scope="scope">{{scope.row.email}}</template>
            </el-table-column>
            <el-table-column prop="date" label="时间" width="100">
                <template slot-scope="scope">{{scope.row.date }}</template>
            </el-table-column>
            <el-table-column prop="content" label="内容">
                <template slot-scope="scope">{{scope.row.content}}</template>
            </el-table-column>
            <!-- <el-table-column label="操作" width="150" fixed="right">
                <template slot-scope="scope">
                    <el-button size="mini" type="primary" plain round @click="replyContentMessage(scope.$index, dataList)"><i class="fa fa-mail-reply" aria-hidden="true"></i></el-button>
                    <el-button size="mini" type="danger" plain round icon="el-icon-delete" @click="deleteContentMessage(scope.$index, dataList)"></el-button>
                </template>
            </el-table-column> -->
        </el-table>
    </div>
</template>

<script>
import services from "../../store/services.js";
export default {
  props: {
    dataList: Array,
    pageInfo: Object
  },
  data() {
    return {
      loading: false,
      multipleSelection: []
    };
  },

  methods: {
    handleMsgSelectionChange(val) {
      if (val && val.length > 0) {
        let ids = val.map((item, index) => {
          return item._id;
        });
        this.multipleSelection = ids;
        this.$emit("changeMsgSelectList", ids);
      }
    },
    replyContentMessage(index, rows) {
      let rowData = rows[index];
      this.$store.dispatch("showContentMessageForm", {
        edit: true,
        parentformData: rowData
      });
    },
    deleteContentMessage(index, rows) {
      this.$confirm("此操作将永久删除该留言, 是否继续?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(() => {
          let targetId = [];
          return services.deleteContentMessage({
            ids: rows[index]._id
          });
        })
        .then(result => {
          if (result.data.state === "success") {
            this.$store.dispatch("getContentMessageList", this.pageInfo);
            this.$message({
              message: "删除成功",
              type: "success"
            });
          } else {
            this.$message.error(result.data.message);
          }
        })
        .catch(err => {
          this.$message({
            type: "info",
            message: "已取消删除" + err
          });
        });
    }
  }
};
</script>