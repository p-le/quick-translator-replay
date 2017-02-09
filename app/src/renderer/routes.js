export default [
  {
    path: '/',
    name: 'translate-window',
    component: require('components/TranslateWindow')
  },
  {
    path: '*',
    redirect: '/'
  },
  {
    path: '/search',
    name: 'search-window',
    component: require('components/SearchWindow')
  }
]
