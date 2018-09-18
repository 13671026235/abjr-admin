import Main from '@/modules/common/main'

export default {
  path: '/security',
  name: 'security',
  meta: {
    icon: 'md-menu',
    title: '安全配置'
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
      component: () => import('@/modules/security/user/list.vue')
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
      component: () => import('@/modules/security/user/card.vue')
    },
    {
      path: 'permission-list',
      name: 'permissionList',
      meta: {
        icon: 'arrow-graph-up-right',
        title: '系统权限'
      },
      component: () => import('@/modules/security/permission/list.vue')
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
      component: () => import('@/modules/security/permission/card.vue')
    },
    {
      path: 'role-list',
      name: 'roleList',
      meta: {
        icon: 'arrow-graph-up-right',
        title: '系统角色'
      },
      component: () => import('@/modules/security/role/list.vue')
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
      component: () => import('@/modules/security/role/card.vue')
    }
  ]
}
