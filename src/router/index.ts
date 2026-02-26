import { createRouter, createWebHashHistory, RouteRecordRaw } from 'vue-router';
import main from '../views/main.vue';
import { pathToRegexp } from 'path-to-regexp';
import { userService } from '@/hook/user.service';
const modules = import.meta.glob('../views/main/*.vue');

const mainRoutes: RouteRecordRaw[] = [];

for (let key in modules) {
  const name = key.replace('../views/', '').replace('.vue', '');
  let obj = {
    path: `/${name}`,
    name: `${name.replace(/\/+/, '-')}`,
    component: modules[key]
  };
  mainRoutes.push(obj);
}


function exportWhiteListFromRouter(router: RouteRecordRaw[]): (RouteRecordRaw & { regex: RegExp })[] {
	const res: (RouteRecordRaw & { regex: RegExp })[] = []
	for (const item of router) {
		// 生成路由的路径正则表达式（解构出正则表达式对象）
		const { regexp } = pathToRegexp(item.path)
		res.push({
			...item,
			regex: regexp  // 使用解构后的正则表达式
		})
	}
	return res
}

const whiteListRouters: RouteRecordRaw[] = [
	{ path: '/login', name: 'login', component: () => import('../views/login/login.vue') },
  { path: '/register', name: 'register', component: () => import('../views/login/register.vue') },
]
const whiteList = exportWhiteListFromRouter(whiteListRouters)

const routes: RouteRecordRaw[] = [
  ...whiteList,
  {
    path: '/main',
    name: 'main',
    redirect: '/main/data-entry',
    component: main,
    meta: { title: '主页' },
    children: mainRoutes
  }
];

const router = createRouter({
  history: createWebHashHistory(''),
  routes
});

router.beforeEach((to, from, next) => {
  if (to.path === '/' && userService.isLogin() ) {
    next({ name: 'main' });
    return;
  }

  const isWhiteList = whiteList.some(item => item.regex.test(to.path));
  if (isWhiteList || userService.isLogin() ) {
    next();
  } else {
    next({ name: 'login' });
  }
});

export default router;
