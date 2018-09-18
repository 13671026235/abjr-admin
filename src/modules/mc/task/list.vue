<template>
  <div>
    <card>
      <Form :model="condition" :label-width="60" inline>
        <Row>
          <FormItem label="任务类型">
              <Select v-model="condition.taskType" style="width:200px" >
                  <Option value="system">系统任务</Option>
                  <Option value="manual">人工任务</Option>
              </Select>
          </FormItem>
          <FormItem label="关键词">
              <Input type="text" v-model="condition.keyword" placeholder="关键词" style="width: 200px"/>
          </FormItem>
          <FormItem label="创建日期">
              <DatePicker type="daterange" v-model="temp.daterange" placement="bottom-end" placeholder="创建日期" style="width: 200px" @on-change="changeCreatedDate"></DatePicker>
          </FormItem>
          <FormItem label="消息分类">
              <Select v-model="condition.msgCategory" style="width:200px" >
                  <Option value="">全部</Option>
                  <Option :value="category.code" v-for="category in msgCategory" :key="category.id">{{category.name}}</Option>
              </Select>
          </FormItem>
          <FormItem label="发送类型">
              <Select v-model="condition.sendType" style="width:200px" >
                  <Option value="">全部</Option>
                  <Option value="real">实时</Option>
                  <Option value="timing">定时</Option>
              </Select>
          </FormItem>
          <FormItem label="任务状态">
              <Select v-model="condition.taskStatus" style="width:200px" >
                  <Option value="">全部</Option>
                  <Option value="draft">草稿</Option>
                  <Option value="auditable">待审批</Option>
                  <Option value="waiting">等待执行</Option>
                  <Option value="running">执行中</Option>
                  <Option value="finish">执行完成</Option>
              </Select>
          </FormItem>
          <FormItem label="目标用户">
              <Input type="text" v-model="condition.user" placeholder="目标用户" style="width: 200px"/>
          </FormItem>
        </Row>
        <Row style="padding:10px 0">
            <Button type="primary" icon="ios-plus-outline" @click="addTask()">新增</Button>
            <Button type="primary" icon="ios-minus-outline" @click="deleteTask()">删除</Button>
            <div style="float:right">
                <Button type="primary" icon="ios-search" @click="search(1,condition.pageSize)">查 询</Button>
                <Button icon="ios-refresh-empty" @click="reset()">重置</Button>
            </div>
        </Row>
      </Form>

      <Table highlight-row border stripe :columns="tableColumns" :data="taskRecordList" @on-current-change="changeCurrentRow"></Table>
      <div class="clearfix">
          <Page :current="condition.pageNum" :total="taskList.total" :page-size="condition.pageSize" placement="top" show-sizer style="margin-top:5px;float:right" @on-page-size-change="changePageSize" @on-change="goPage"></Page>
      </div>
    </card>
    <approve-dialog :visible="showApproveDialog" :task="currentItem" @close="showApproveDialog=false" @on-status-change="changeTaskStatus"/>
  </div>
</template>

<script>
import moment from 'moment'
import mcApi from '../api'
import axios from '@/libs/api.request'
import ApproveDialog from './approveDialog.vue'
import ExtendRow from './extendRow.vue'

export default {
  components: {
    ApproveDialog,
    ExtendRow
  },
  data () {
    return {
      condition: {
        pageNum: 1,
        pageSize: 10,
        taskType: 'manual',
        taskStatus: null,
        sendType: null,
        msgCategory: null
      },
      temp: { daterange: null },
      showApproveDialog: false,
      currentItem: null,
      msgCategory: [],
      msgCase: [],
      taskList: {},
      tableColumns: [
        {
          title: '#',
          width: 60,
          render: (h, params) => {
            let rowNum =
              (this.condition.pageNum - 1) * this.condition.pageSize +
              params.index +
              1
            return h('span', rowNum)
          }
        },
        {
          type: 'expand',
          width: 50,
          render: function (h, params) {
            return h('extend-row', {
              props: {
                task: params.row
              }
            })
          }
        },
        {
          title: '任务号',
          key: 'taskNo',
          width: 160,
          render: (h, params) => {
            return h(
              'a',
              {
                on: {
                  click: function () {
                    this.editTaskInfo(params.row)
                  }
                }
              },
              params.row.taskNo
            )
          }
        },
        {
          title: '消息分类',
          key: 'msgCategory',
          width: 90,
          render: (h, params) => {
            var i
            for (i in this.msgCategory) {
              var item = this.msgCategory[i]
              if (item.code === params.row.msgCategory) {
                return item.name
              }
            }
            return params.row.msgCategory
          }
        },
        {
          title: '业务场景',
          key: 'msgCase',
          width: 90,
          render: (h, params) => {
            let i
            for (i in this.msgCase) {
              let item = this.msgCase[i]
              if (item.code === params.row.msgCase) {
                return item.name
              }
            }
            return params.row.msgCase
          }
        },
        {
          title: '业务系统',
          key: 'msgClient',
          width: 90,
          render: (h, params) => {
            let i
            for (i in this.msgClient) {
              let item = this.msgClient[i]
              if (item.code === params.row.msgClient) {
                return item.name
              }
            }
            return params.row.msgClient
          }
        },
        {
          title: '用户',
          width: 120,
          render: (h, params) => {
            if (params.row.users) {
              return params.row.users
            } else if (params.row.userGroupId === 0) {
              return '全部用户'
            } else {
              return '定向发送'
            }
          }
        },
        {
          title: '发送类型',
          key: 'sendType',
          width: 120,
          render: (h, params) => {
            if (params.row.sendType === 'real') {
              return '实时'
            } else if (params.row.sendType === 'timing') {
              return '定时'
            }
          }
        },
        {
          title: '发送时间',
          width: 100,
          render: (h, params) => {
            if (params.row.sendTime) {
              return moment(params.row.sendTime).format('YYYY-MM-DD HH:mm:ss')
            }
          }
        },
        {
          title: '创建日期',
          width: 100,
          render: (h, params) => {
            if (params.row.createdAt) {
              return moment(params.row.createdAt).format('YYYY-MM-DD HH:mm:ss')
            }
          }
        },
        {
          title: '状态',
          width: 90,
          render: (h, params) => {
            switch (params.row.taskStatus) {
              case 'draft':
                return '草稿'
              case 'auditable':
                return '待审批'
              case 'waiting':
                return '等待执行'
              case 'running':
                return '执行中'
              case 'finish':
                return '执行完成'
            }
          }
        },
        {
          title: '操作',
          width: 130,
          render: (h, params) => {
            var ops = []
            if (
              params.row.taskStatus === 'auditable' &&
              this.hasPermission('Task:Approve')
            ) {
              var passButton = h(
                'Button',
                {
                  props: {
                    type: 'primary',
                    size: 'small'
                  },
                  style: {
                    marginRight: '5px'
                  },
                  on: {
                    click: () => {
                      this.showApproveDialog = true
                    }
                  }
                },
                '审批'
              )
              ops.push(passButton)
            }
            if (
              params.row.taskStatus === 'running' ||
              params.row.taskStatus === 'finish'
            ) {
              var sendDetailButton = h(
                'Button',
                {
                  props: {
                    type: 'primary',
                    size: 'small'
                  },
                  style: {
                    marginRight: '5px'
                  },
                  on: {
                    click: () => {
                      this.showTaskRunningInfo(params.row)
                    }
                  }
                },
                '发送详情'
              )
              ops.push(sendDetailButton)
            }
            return h('div', ops)
          }
        }
      ]
    }
  },
  computed: {
    taskRecordList: function () {
      if (this.taskList && this.taskList.list) {
        return this.taskList.list
      }
      return []
    }
  },
  methods: {
    changeCreatedDate: function (value) {
      this.condition.startCreatedAt = value[0]
      this.condition.endCreatedAt = value[1]
    },
    goPage: function (pageNum) {
      this.search(pageNum)
    },
    changePageSize: function (pageSize) {
      this.search(this.condition.pageNum, pageSize)
    },
    changeCurrentRow: function (currentRow) {
      this.currentItem = currentRow
    },
    findMsgCategory: function () {
      axios
        .request({
          method: 'get',
          url: '/settings/dict-entry?category=MSG_CATEGORY'
        })
        .then(response => {
          this.msgCategory = response.data.list
        })
    },
    findMsgCase: function () {
      axios
        .request({
          method: 'get',
          url: '/settings/dict-entry?category=MSG_CASE'
        })
        .then(response => {
          this.msgCase = response.data.list
        })
    },
    findMsgClient: function () {
      axios
        .request({
          method: 'get',
          url: '/settings/dict-entry?category=client'
        })
        .then(response => {
          this.msgClient = response.data.list
        })
    },
    search: function (pageNum, pageSize) {
      this.condition.pageNum = pageNum
      this.condition.pageSize = pageSize

      let query = { ...this.condition }

      this.$router.replace({ name: 'taskList', query })
    },
    searchTask () {
      let query = { ...this.$route.query }
      if (query.pageNum) {
        query.pageNum = parseInt(query.pageNum)
      } else {
        query.pageNum = 1
      }
      if (query.pageSize) {
        query.pageSize = parseInt(query.pageSize)
      } else {
        query.pageSize = 10
      }

      this.condition = query

      mcApi
        .request({
          method: 'get',
          url: '/task',
          params: this.condition
        })
        .then(response => {
          this.taskList = response.data
          this.currentItem = null
        })
    },
    reset: function (name) {
      this.condition = {
        pageNum: this.condition.pageNum,
        pageSize: this.condition.pageSize,
        taskType: 'manual'
      }
      this.temp.daterange = null
    },
    addTask: function () {
      this.$router.push({
        name: 'task'
      })
    },
    deleteTask: function () {
      if (!this.currentItem) {
        this.$Message.warning('请在列表中选择一个任务')
        return
      }
      this.$Modal.confirm({
        title: '',
        content: '确定删除任务【' + this.currentItem.taskNo + '】吗？',
        onOk: () => {
          mcApi
            .request({ method: 'delete', url: `/task/${this.currentItem.id}` })
            .then(response => {
              this.$Message.success(this.currentItem.taskNo + '任务已删除！')
              this.search()
            })
        }
      })
    },
    changeTaskStatus (id, taskStatus, auditDesc) {
      this.currentItem.taskStatus = taskStatus
      this.currentItem.auditDesc = auditDesc
    },
    editTaskInfo: function (item) {
      this.$router.push({ name: 'task', params: { id: '' + item.id } })
    },
    showTaskRunningInfo: function (item) {
      this.$router.push({
        name: 'taskRunningInfo',
        params: { id: '' + item.id }
      })
    }
  },
  created () {
    this.findMsgCategory()
    this.findMsgCase()
    this.findMsgClient()
    this.searchTask()
  },
  watch: {
    '$route': function (newValue, oldValue) {
      if (newValue.name === 'taskList') {
        this.searchTask()
      }
    }
  }
}
</script>
