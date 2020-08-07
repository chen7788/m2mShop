import router from './router'
import store from './store'
import { Message } from 'element-ui'
import NProgress from 'nprogress' // progress bar
import 'nprogress/nprogress.css' // progress bar style
import { getToken } from '@/utils/auth' // get token from cookie
import getPageTitle from '@/utils/get-page-title'

NProgress.configure({ showSpinner: false }) // NProgress Configuration

// permission judge function
function hasPermission(perms, permissions) {
  if (perms.indexOf('*') >= 0) return true // admin permission passed directly
  if (!permissions) return true
  return perms.some(perm => permissions.indexOf(perm) >= 0)
}

const whiteList = ['/login', '/auth-redirect'] // no redirect whitelist

router.beforeEach((to, from, next) => {
  // start progress bar
  NProgress.start()
  // determine whether the user has logged in
  const hasToken = getToken()
  if (hasToken) {
    if (to.path === '/login') {
      // if is logged in, redirect to the home page
      next({ path: '/' })
      NProgress.done()
    } else {
      if (store.getters.perms.length === 0){// 判断当前用户是否已拉取完user_info信息
        store.dispatch('user/getInfo').then(res => { // 拉取user_info
          const perms = res.data.perms
          store.dispatch('GenerateRoutes', { perms }).then(() => {// 根据perms权限生成可访问的路由表
            router.addRoutes(store.getters.addRouters)// 动态添加可访问路由表
            next({ ...to, replace: true }) // hack方法 确保addRoutes已完成 ,set the replace: true so the navigation will not leave a history record
          }).catch((err) => {
            console.log(err)
          })
        }).catch((err) => {
          store.dispatch('user/fedLogOut').then(() => {
            Message.error(err || 'Verification failed, please login again')
            next({ path: '/' })
          })
        })
      }else {
        //没有动态改变权限的需求可直接next() 删除下方权限判断 ↓
        if (hasPermission(store.getters.perms, to.meta.perms)) {
          next()
        } else {
          next({ path: '/401', replace: true, query: { noGoBack: true }})
        }
        //可删 ↑
      }
    }
  } else {
    /* has no token*/

    if (whiteList.indexOf(to.path) !== -1) {
      // in the free login whitelist, go directly
      next()
    } else {
      // other pages that do not have permission to access are redirected to the login page.
      next(`/login?redirect=${to.path}`)
      NProgress.done()
    }
  }
})

router.afterEach(() => {
  // finish progress bar
  NProgress.done()
})
