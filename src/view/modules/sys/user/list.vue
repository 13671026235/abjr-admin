<template>
  <div>
      <Card>
        <!--查询条件表单-->
        <Form :model="condition" :label-width="60" inline>
          <Row>
            <FormItem label="用户名">
                <Input type="text" v-model="condition.username" placeholder="用户名" style="width: 160px"/>
            </FormItem>
            <FormItem label="姓名">
                <Input type="text" v-model="condition.realname" placeholder="姓名" style="width: 160px"/>
            </FormItem>
            <FormItem label=" 手机号">
                <Input type="text" v-model="condition.mobile" placeholder=" 手机号" style="width: 160px"/>
            </FormItem>
            <FormItem label="状态">
                <Select v-model="condition.status" style="width:200px" >
                    <option value="">全部</option>
                    <option value="Y">可用</option>
                    <option value="N">不可用</option>
                </Select>
            </FormItem>
          </Row>
          <Row style="padding:10px 0" class="inline-space">
              <Button type="primary" icon="ios-plus-outline" @click="addUser()">新增</Button>
              <Button type="primary" icon="ios-minus-outline" @click="deleteUser()">删除</Button>
              <div style="float:right" class="inline-space">
                  <Button type="primary" icon="ios-search" @click="search(1,condition.pageSize)">查 询</Button>
                  <Button icon="ios-refresh-empty" @click="reset()">重置</Button>
              </div>
          </Row>
        </Form>

        <Table highlight-row border stripe :columns="tableColumns" :data="userRecordList" @on-current-change="changeCurrentRow"></Table>
        <div class="clearfix">
          <Page :current="condition.pageNum" :total="userList.total" :page-size="condition.pageSize" show-sizer style="margin-top:5px;float:right;" @on-page-size-change="changePageSize" @on-change="goPage"></Page>
        </div>
      </Card>
  </div>
</template>

<script>
import moment from 'moment'
import axios from '@/libs/api.request'
import UserCard from '@/view/modules/sys/user/card.vue'

export default {
  name: 'user_list',
  components: {
    UserCard
  },
  data () {
    return {
      condition: {
        pageNum: 1,
        pageSize: 10
      },
      currentItem: null,
      userList: {},
      tableColumns: [
        {
          title: '#',
          width: 60,
          render: (h, params) => {
            let rowNum = (this.condition.pageNum - 1) * this.condition.pageSize + params.index + 1
            return h('span', rowNum)
          }
        },
        {
          title: 'ID',
          key: 'id',
          width: 100
        },
        {
          title: '用户名',
          key: 'username',
          width: 90,
          render: (h, params) => {
            return h(
              'a',
              {
                on: {
                  click: () => this.editUserInfo(params.row)
                }
              },
              params.row.username
            )
          }
        },
        {
          title: '姓名',
          key: 'realname',
          width: 120
        },
        {
          title: '手机号',
          key: 'mobile',
          width: 120
        },
        {
          title: '工作邮箱',
          key: 'email'
        },
        {
          title: '创建日期',
          width: 100,
          render: function (h, params) {
            if (params.row.createdAt) {
              return h('span', moment(params.row.createdAt).format('YYYY-MM-DD HH:mm:ss'))
            }
          }
        },
        {
          title: '上次登录',
          width: 100,
          render: function (h, params) {
            if (params.row.lastLoginAt) {
              return h('span', moment(params.row.lastLoginAt).format('YYYY-MM-DD HH:mm:ss'))
            }
          }
        },
        {
          title: '状态',
          width: 80,
          render: (h, params) => {
            return h('i-switch', {
              props: {
                value: params.row.status === 'Y'
              },
              on: {
                'on-change': (status) => {
                  this.changeStatus(params.row, status)
                }
              }
            })
          }
        }
      ]
    }
  },
  computed: {
    userRecordList: function () {
      return this.userList.list
    }
  },
  methods: {
    goPage: function (pageNum) {
      this.search(pageNum, this.condition.pageSize)
    },
    changePageSize: function (pageSize) {
      this.search(this.condition.pageNum, pageSize)
    },
    changeCurrentRow: function (currentRow) {
      this.currentItem = currentRow
    },
    search: function (pageNum, pageSize) {
      let query = {}
      query.username = this.condition.username
      query.realname = this.condition.realname
      query.mobile = this.condition.mobile
      query.pageNum = pageNum
      query.pageSize = pageSize

      this.$router.replace({name: 'user-list', query})
    },
    searchUserList: function () {
      let query = {...this.$route.query}
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

      axios
        .request({
          method: 'get',
          url: '/sys/user',
          params: query
        })
        .then(res => {
          this.userList = res.data
          this.currentItem = null
        })
    },
    reset: function (name) {
      var c = {
        pageNum: this.condition.pageNum,
        pageSize: this.condition.pageSize
      }
      this.condition = c
    },
    addUser: function () {
      this.$router.push({ name: 'user' })
    },
    deleteUser: function () {
      if (!this.currentItem) {
        this.$Message.warning('请在列表中选择一个用户')
        return
      }
      this.$Modal.confirm({
        title: '',
        content: '确定删除' + this.currentItem.username + '用户吗？',
        onOk: () => {
          axios.request({
            method: 'delete',
            url: `/sys/user/${this.currentItem.id}`
          }).then(res => {
            this.$Message.success(this.currentItem.username + '用户已删除！')
            this.search(this.condition.pageNum, this.condition.pageSize)
          })
        }
      })
    },
    editUserInfo: function (item) {
      this.$router.push({ name: 'user', params: { id: '' + item.id } })
    },
    changeStatus: function (item, status) {
      axios
        .request({
          method: 'patch',
          url: `/sys/user/${item.id}/status`,
          headers: {
            'Content-Type': 'application/x-www-form-urlencoded'
          },
          data: `status=${status}`
        }).then(res => {
          item.status = status ? 'Y' : 'N'
          this.$Message.success('状态已变更！')
        })
    }
  },
  created () {
    this.searchUserList()
  },
  watch: {
    '$route': 'searchUserList'
  }
}
</script>
