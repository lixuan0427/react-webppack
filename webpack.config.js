const NODE_ENV = process.env.NODE_ENV;//生产环境

const path = require('path');
const webpack = require('webpack');

const CleanWebpackPlugin = require('clean-webpack-plugin');//用于清空dist文件夹，方便重新打包
const ExtractTextWebpackPlugin = require('extract-text-webpack-plugin');//这个插件是把css从js中分离出来的插件
const HtmlWebpackPlugin = require('html-webpack-plugin');//模板导入工具
const OptimizeCssAssetsWebpackPlugin = require('optimize-css-assets-webpack-plugin');//css打包样式最小化,性能优化一方面

//filename 配置提取出来的css名称 
const PROJECT_LESS = new ExtractTextWebpackPlugin({ filename: 'css/[name].css', allChunks: true });


module.exports ={
    devtool: 'source-map',//source-map 是为了解决开发代码与实际运行代码不一致时帮助我们debug到原始开发代码的技术
    entry:{
        vendor: ['react', 'react-dom', 'redux', 'react-redux',
        'react-router', 'autoprefixer',
        'add-dom-event-listener', 'axios'],
        main:path.join(__dirname,'src/entry')//在 src/entry 目录下新建index.js,指定入口文件，程序从这里开始编译
    },
    output:{
        path:path.resolve(__dirname,'dist'),//输出路径
        publicPath:'/', //为编译文件的路径，一般在index.html引入外部文件时路径的前缀
        ourceMapFilename: 'map/[name].map',//.map文件都放到map文件夹下
        filename:'js/[name].js',//打包后的文件
    },
    resolve:{//不是必备的 配置引入文件不用带后缀和路径别名
        extensions: ['.js', '.jsx', '.json'],// 配置在尝试引入文件没带尾缀过程中用到的后缀列表
        modules: [//配置webpack去哪些目录下寻找第三方模块
            path.join('node_modules')
        ],
        alias: {//配置项通过别名来把原来导入路径映射成一个新的导入路径
            '@': path.join(__dirname, 'src'),
            'components': path.join(__dirname, 'src/components'),
            'images': path.join(__dirname, 'src/images'),
            'lib': path.join(__dirname, 'src/lib'),
            'masters': path.join(__dirname, 'src/masters'),
            'pages': path.join(__dirname, 'src/pages'),
            'router': path.join(__dirname, 'src/router'),
            'store': path.join(__dirname, 'src/store'),
            'theme': path.join(__dirname, 'src/theme'),
            'config': path.join(__dirname, 'config')
        }
    },
    module:{//处理各种文件的loader
        rules:[
            {
                test: /\.jsx?$/,
                loader: 'babel-loader',
                exclude: /node_modules/
            },
            {
                test:/\.js$/,
                loader:'babel-loader',
                exclude:/node_modules/
            },
            {
                test: /\.(png|jpe?g|gif|svg)$/,// 匹配特定文件的正则表达式或正则表达式数组
                exclude: /node_modules/,// 指定转译时忽略的文件夹
                loader: 'file-loader', // 依赖的loader
                options: {
                    limit: 512,
                    name: 'images/[name].[ext]'
                }
            },
            {
                test: /\.(woff|svg|ttf|eot)$/,
                loader: 'file-loader',
                query: {
                    name: 'fonts/[name].[ext]'
                }
            },
            {
                test: /\.json$/,
                exclude: /node_modules/,
                loader: 'json-loader'
            },
            {
                test: /\.less$/,
                exclude: /node_modules/,
                loader: PROJECT_LESS.extract({
                    fallback: 'style-loader',
                    use: [// 应用于模块的 loader 使用列表
                        {
                            loader: 'css-loader',
                            options: {
                                importLoaders: 2
                            }
                        },
                        {
                            loader: 'postcss-loader',
                            options: {
                                plugins: [
                                    require('autoprefixer')()
                                ]
                            }
                        },
                        {
                            loader: 'less-loader'
                        }
                    ]
                })
            }
        ]
    },
    plugins: [//webpack用到的插件
        new webpack.DefinePlugin({
            'process.env': {
                'NODE_ENV': JSON.stringify(NODE_ENV)
            }
        }),
        new CleanWebpackPlugin(),
        new webpack.optimize.CommonsChunkPlugin({ // 公共代码提取
            name: ['vendor', 'runtime'],
            filename: 'js/[name].js',
            minChunks: Infinity
        }),
        new HtmlWebpackPlugin({
            title: 'lxReact',
            template: path.join(__dirname, 'src/views/template.html'), // 模板文件，必须
            filename: 'index.html',
            //favicon: path.join(__dirname, 'src/views/favicon.ico'), // favicon文件，非必须
            inject: true,
            chunks: ['vendor','runtime','main'], // 需要引入的包
            minify: NODE_ENV == 'production' ? {
                removeComments: true,//清理html中的注释。默认为false
                removeAttributeQuotes: true,// 去掉标签上属性的引号
                collapseWhitespace: true//清理html中的空格、换行符。
            } : false
        }),
        PROJECT_LESS,
    ].concat(NODE_ENV == 'production' ? [
        /**
         * 生产模式下的配置
         */
        new webpack.optimize.UglifyJsPlugin({ // js代码压缩
            compress: {
                warnings: false
            }
        }),
        new OptimizeCssAssetsWebpackPlugin({ // css代码压缩
            assetNameRegExp: /\.css$/g,
            cssProcessor: require('cssnano'),
            cssProcessorPluginOptions: {
                preset: ['default', { discardComments: { removeAll: true } }],
            },
            canPrint: true
        })
    ] : [])
}