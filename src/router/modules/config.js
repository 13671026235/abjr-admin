import Main from '@/modules/common/main'

export default {
  path: '/config',
  name: 'config',
  meta: {
    icon: 'md-menu',
    title: '配置管理'
  },
  component: Main,
  children: [
    {
      path: 'dict-list',
      name: 'dict-list',
      meta: {
        icon: 'arrow-graph-up-right',
        title: '数据字典'
      },
      component: () => import('@/modules/config/dict')
    },
    {
      path: 'param-list',
      name: 'param-list',
      meta: {
        icon: 'arrow-graph-up-right',
        title: '系统参数'
      },
      component: () => import('@/modules/config/param')
    }
  ]
}
