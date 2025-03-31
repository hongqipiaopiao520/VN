import { createRouter, createWebHistory, RouteRecordRaw } from 'vue-router';
// 快消门店审批页

const routes: Array<RouteRecordRaw> = [
	{
		path: `/`,
		redirect: `/index` // 重定向到 applyRecord 路由
	},
	{
		path: '/index',
		component: () => import('../views/index.vue')
	},
	{
		path: '/player',
		component: () => import('../views/player.vue')
	},
	{
		path: '/article',
		component: () => import('../components/videoItem.vue')
	}
];

// const history = import.meta.env.VITE_BASE_URL ? createWebHistory(import.meta.env.VITE_BASE_URL) : createWebHistory();

const router = createRouter({
	history: createWebHistory(),
	routes
});

// router.beforeEach((to, from, next) => {
//   // 修改页面标题
//   if (to.meta.title ) {
//     if (window.retailIndustrySolutionType) {
//       let title = to.meta.title as string
//       title = title.replaceAll('客户', window.retailIndustrySolutionType.user)
//       document.title = String(title)
//     }
//   }
//   next();
// });

export default router;
