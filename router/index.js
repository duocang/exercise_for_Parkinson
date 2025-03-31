// router/index.js
const router = new VueRouter({
    mode: 'history',
    base: process.env.BASE_URL, // 会自动匹配 publicPath
    // 或显式设置：
    // base: '/action/',
    routes
})