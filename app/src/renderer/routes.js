export default [
  {
    path: '/',
    name: 'translate-window',
    component: require('components/TranslateWindowView')
  },
  {
    path: '/test',
    name: 'test-window',
    component: require('components/TestView')
  },
  {
    path: '/dict',
    name: 'dict-window',
    component: require('components/DictView')
  },
  {
    path: '*',
    redirect: '/'
  }
]
