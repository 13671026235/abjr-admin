import Main from '@/modules/common/main'

export default {
  path: '/rbac',
  name: 'rbac',
  meta: {
    icon: 'md-menu',
    title: '权限管理'
  },
  component: Main,
  children: [
    {
      path: 'user-list',
      name: 'userList',
      meta: {
        icon: 'arrow-graph-up-right',
        title: '系统用户'
      },
      component: () => import('@/modules/rbac/user/list.vue')
    },
    {
      path: 'user/:id?',
      name: 'user',
      props: true,
      meta: {
        title: '用户',
        icon: 'arrow-graph-up-right',
        hideInMenu: true
      },
      component: () => import('@/modules/rbac/user/card.vue')
    },
    {
      path: 'permission-list',
      name: 'permissionList',
      meta: {
        icon: 'arrow-graph-up-right',
        title: '系统权限'
      },
      component: () => import('@/modules/rbac/permission/list.vue')
    },
    {
      path: 'permission/:id?',
      name: 'permission',
      props: true,
      meta: {
        title: '权限',
        icon: 'arrow-graph-up-right',
        hideInMenu: true
      },
      component: () => import('@/modules/rbac/permission/card.vue')
    },
    {
      path: 'role-list',
      name: 'roleList',
      meta: {
        icon: 'arrow-graph-up-right',
        title: '系统角色'
      },
      component: () => import('@/modules/rbac/role/list.vue')
    },
    {
      path: 'role/:id?',
      name: 'role',
      props: true,
      meta: {
        title: '角色',
        icon: 'arrow-graph-up-right',
        hideInMenu: true
      },
      component: () => import('@/modules/rbac/role/card.vue')
    }
  ]
}
