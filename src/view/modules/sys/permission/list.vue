<template>
    <div>
      <Card>
        <div style="padding:10px;">
              <Form :model="condition" label-position="left" :label-width="60" inline>
                  <Row>
                      <FormItem label="权限编码">
                          <Input type="text" v-model="condition.code" placeholder="权限编码" style="width: 160px"/>
                      </FormItem>
                      <FormItem label="权限名称">
                          <Input type="text" v-model="condition.name" placeholder="权限名称" style="width: 160px"/>
                      </FormItem>
                  </Row>
                  <Row style="padding:10px 0" class="inline-space">
                      <Button type="primary" icon="ios-plus-outline" @click="addPermission()">新增</Button>
                      <Button type="primary" icon="ios-minus-outline" @click="deletePermission()">删除</Button>
                      <div style="float:right"  class="inline-space">
                          <Button type="primary" icon="ios-search" @click="search(1)">查 询</Button>
                          <Button icon="ios-refresh-empty" @click="reset()">重置</Button>
                      </div>
                  </Row>
              </Form>

              <Table ref="permissionTable" highlight-row border stripe :columns="tableColumns" :data="permissionRecordList" @on-current-change="changeCurrentRow"></Table>

              <div class="clearfix">
                  <Page :current="condition.pageNum" :total="permissionList.total" :page-size="condition.pageSize" show-sizer style="margin-top:5px;float:right" @on-page-size-change="changePageSize" @on-change="goPage"></Page>
              </div>
        </div>
      </Card>
  </div>
</template>

<script>

import moment from 'moment'
import axios from '@/libs/api.request'
import qs from 'qs'
import PermissionCard from '@/view/modules/sys/permission/card.vue'

export default {
  name: 'permission_list',
  components: {
    PermissionCard
  },
  data () {
    return {
      'condition': {
        'pageNum': 1,
        'pageSize': 10
      },
      'currentItem': null,
      'permissionList': {},
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
          'title': '权限编码',
          'key': 'permissionCode',
          'width': 120,
          'render': (h, params) => {
            return h('a',
              {
                on: {
                  click: () => {
                    this.editPermission(params.row)
                  }
                }
              }
              , params.row.permissionCode)
          }
        }, {
          'title': '权限名称',
          'key': 'permissionName',
          'width': 160,
          'render': (h, params) => {
            return h('a',
              {
                on: {
                  click: () => {
                    this.editPermission(params.row)
                  }
                }
              }
              , params.row.permissionName)
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
    'permissionRecordList': function () {
      return this.permissionList.list
    }
  },
  mounted: function () {
    this.search()
  },
  methods: {
    'goPage': function (pageNum) {
      this.search(pageNum)
    },
    'changePageSize': function (pageSize) {
      this.search(null, pageSize)
    },
    'changeCurrentRow': function (currentRow) {
      this.currentItem = currentRow
    },
    'search': function (pageNum, pageSize) {
      if (pageNum) {
        this.condition.pageNum = pageNum
      }
      if (pageSize) {
        this.condition.pageSize = pageSize
      }
      axios.request({
        method: 'get',
        url: '/sys/permission',
        params: this.condition
      })
        .then(response => {
          this.permissionList = response.data
          this.currentItem = null
        })
    },
    'reset': function (name) {
      var c = {'pageNum': this.condition.pageNum, 'pageSize': this.condition.pageSize}
      this.condition = c
    },
    'addPermission': function () {
      this.$router.push({ name: 'permission' })
    },
    'changeStatus': function (item, status) {
      let data = {status1: status}
      axios.request({
        method: 'patch',
        url: `/sys/permission/${item.id}/status`,
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded'
        },
        data: qs.stringify(data)
      }).then(response => {
        item.status = status ? 'Y' : 'N'
        this.$Message.success('状态已变更！')
      })
    },
    'editPermission': function (item) {
      this.$router.push({ name: 'permission', params: { id: '' + item.id } })
    },
    'deletePermission': function () {
      if (!this.currentItem) {
        this.$Message.warning('请在列表中选择一个权限')
        return
      }

      this.$Modal.confirm({
        title: '',
        content: `确定删除 ${this.currentItem.permissionName} 权限吗？`,
        onOk: () => {
          axios.request({
            method: 'delete',
            url: `/sys/permission/${this.currentItem.id}`
          }).then(response => {
            this.$Message.success(this.currentItem.permissionName + '权限已删除！')
            this.search()
          })
        }})
    }
  }
}
</script>

<style lang="less">
</style>
