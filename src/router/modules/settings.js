import Main from '@/modules/common/main'

export default {
  path: '/settings',
  name: 'settings',
  meta: {
    icon: 'md-menu',
    title: '配置管理'
  },
  component: Main,
  children: [
    {
      path: 'dict',
      name: 'dict',
      meta: {
        icon: 'arrow-graph-up-right',
        title: '数据字典'
      },
      component: () => import('@/modules/settings/dict')
    },
    {
      path: 'dict-entry/:category/:id?',
      name: 'dictEntry',
      props: true,
      meta: {
        icon: 'arrow-graph-up-right',
        title: '字典条目',
        hideInMenu: true
      },
      component: () => import('@/modules/settings/dict/card.vue')
    },
    {
      path: 'param',
      name: 'param',
      meta: {
        icon: 'arrow-graph-up-right',
        title: '系统参数'
      },
      component: () => import('@/modules/settings/param')
    },
    {
      path: 'param-entry/:category/:id?',
      name: 'paramEntry',
      props: true,
      meta: {
        icon: 'arrow-graph-up-right',
        title: '系统参数',
        hideInMenu: true
      },
      component: () => import('@/modules/settings/param/card.vue')
    }
  ]
}
