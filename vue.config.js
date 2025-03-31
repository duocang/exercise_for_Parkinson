// vue.config.js
module.exports = {
    publicPath: '/action/',
    productionSourceMap: false,
    devServer: {
        // 开发环境下需要配置路径匹配
        publicPath: '/action/',
        historyApiFallback: {
            disableDotRule: true,
            rewrites: [
                { from: /./, to: '/action/index.html' } // 将所有请求重定向到 index.html
            ]
        }
    }
}
