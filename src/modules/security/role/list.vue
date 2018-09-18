<template>
    <div>
      <Card>
        <div style="padding:10px;">
          <!--查询条件表单-->
              <Form :model="condition" label-position="left" :label-width="60" inline>
                  <Row>
                      <FormItem label="角色编码">
                          <Input type="text" v-model="condition.code" placeholder="角色编码" style="width: 160px"/>
                      </FormItem>
                      <FormItem label="角色名称">
                          <Input type="text" v-model="condition.name" placeholder="角色名称" style="width: 160px"/>
                      </FormItem>
                  </Row>
                  <Row style="padding:10px 0" class="inline-space">
                      <Button type="primary" icon="ios-plus-outline" @click="addRole()">新增</Button>
                      <Button type="primary" icon="ios-minus-outline" @click="deleteRole()">删除</Button>
                      <Button type="primary" icon="ios-list-outline" @click="openAssignPermissionDialog()">分配权限</Button>
                      <Button type="primary" icon="ios-person-outline" @click="openAssignUserDialog()">分配用户</Button>
                      <div style="float:right"  class="inline-space">
                          <Button type="primary" icon="ios-search" @click="search(1,condition.pageSize)">查 询</Button>
                          <Button icon="ios-refresh-empty" @click="reset()">重置</Button>
                      </div>
                  </Row>
              </Form>

              <Table ref="roleTable" highlight-row border stripe :columns="tableColumns" :data="roleRecordList" @on-current-change="changeCurrentRow"></Table>

              <div class="clearfix">
                  <Page :current="condition.pageNum" :total="roleList.total" :page-size="condition.pageSize" show-sizer style="margin-top:5px;float:right" @on-page-size-change="changePageSize" @on-change="goPage"></Page>
              </div>
        </div>
      </Card>

      <assign-user-dialog :visible="showAssignUserDialog" :role="currentItem" @close="showAssignUserDialog = false"/>

      <assign-permission-dialog :visible="showAssignPermissionDialog" :role="currentItem" @close="showAssignPermissionDialog = false"/>

  </div>
</template>

<script>

import moment from 'moment'
import axios from '@/libs/api.request'
import qs from 'qs'
import AssignUserDialog from './assign-user-dialog.vue'
import AssignPermissionDialog from './assign-permission-dialog.vue'

export default {
  components: {
    AssignUserDialog,
    AssignPermissionDialog
  },
  data () {
    return {
      'condition': {
        'pageNum': 1,
        'pageSize': 10
      },
      'currentItem': null,
      'showAssignUserDialog': false,
      'showAssignPermissionDialog': false,
      'roleList': {},
      'tableColumns': [
        {
          'title': '#',
          'width': 60,
          'render': (h, params) => {
            let rowNum = (this.condition.pageNum - 1) * this.condition.pageSize + params.index + 1
            return h('span', rowNum)
          }
        }, {
          'title': 'ID',
          'key': 'id',
          'width': 100
        }, {
          'title': '角色编码',
          'key': 'roleCode',
          'width': 120,
          'render': (h, params) => {
            return h('a',
              {
                on: {
                  click: () => {
                    this.editRole(params.row)
                  }
                }
              }
              , params.row.roleCode)
          }
        }, {
          'title': '角色名称',
          'key': 'roleName',
          'width': 160,
          'render': (h, params) => {
            return h('a',
              {
                on: {
                  click: () => {
                    this.editRole(params.row)
                  }
                }
              }
              , params.row.roleName)
          }
        }, {
          'title': '描述',
          'key': 'description'
        }, {
          'title': '创建日期',
          'width': 150,
          'render': (h, params) => {
            if (params.row.createdAt) {
              return h('span', moment(params.row.createdAt).format('YYYY-MM-DD HH:mm:ss'))
            }
          }
        }, {
          'title': '状态',
          'width': 80,
          'render': (h, params) => {
            return h('i-switch', {
              'props': {
                'value': params.row.status === 'Y'
              },
              'on': {
                'on-change': (status) => {
                  this.changeStatus(params.row, status)
                }
              }
            })
          }
        }]
    }
  },
  computed: {
    'roleRecordList': function () {
      return this.roleList.list
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
      query.code = this.condition.code
      query.name = this.condition.name
      query.pageNum = pageNum
      query.pageSize = pageSize

      this.$router.replace({name: 'roleList', query})
    },
    searchRoleList: function () {
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

      axios.request({
        method: 'get',
        url: '/security/role',
        params: query
      }).then(response => {
        this.roleList = response.data
        this.currentItem = null
      })
    },
    'reset': function (name) {
      var c = {'pageNum': this.condition.pageNum, 'pageSize': this.condition.pageSize}
      this.condition = c
    },
    'addRole': function () {
      this.$router.push({ name: 'role' })
    },
    'changeStatus': function (item, status) {
      let data = {status1: status}
      axios.request({
        method: 'patch',
        url: `/security/role/${item.id}/status`,
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded'
        },
        data: qs.stringify(data)
      }).then(response => {
        item.status = status ? 'Y' : 'N'
        this.$Message.success('状态已变更！')
      })
    },
    'editRole': function (item) {
      this.$router.push({ name: 'role', params: { id: '' + item.id } })
    },
    'deleteRole': function () {
      if (!this.currentItem) {
        this.$Message.warning('请在列表中选择一个角色')
        return
      }

      this.$Modal.confirm({
        title: '',
        content: `确定删除 ${this.currentItem.roleName} 角色吗？`,
        onOk: () => {
          axios.request({
            method: 'delete',
            url: `/security/role/${this.currentItem.id}`
          }).then(response => {
            this.$Message.success(this.currentItem.roleName + '角色已删除！')
            this.searchUserList()
          })
        }})
    },
    'openAssignPermissionDialog': function () {
      if (!this.currentItem) {
        this.$Message.warning('请在列表中选择一个角色')
        return
      }

      this.showAssignPermissionDialog = true
    },
    'openAssignUserDialog': function () {
      if (!this.currentItem) {
        this.$Message.warning('请在列表中选择一个角色')
        return
      }

      this.showAssignUserDialog = true
    }
  },
  created () {
    this.searchRoleList()
  },
  watch: {
    '$route': function (newValue, oldValue) {
      if (newValue.name === 'roleList') {
        this.searchRoleList()
      }
    }
  }
}
</script>
