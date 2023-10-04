const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin'); //after load we need to configer it
const MiniCssExtractPlugin = require("mini-css-extract-plugin");


module.exports = {
    mode: 'development',
    entry: './src/app.js',
    output: {
        path: path.resolve(__dirname, 'dist'), // from current directory (__dirname) to dist folder
        filename: 'bundle.js', //by default the name is main.js , but we change it to bundle
    },
    //configure options after we installed npm i -D webpack-dev-server
    //now we don't need to make 'npm run build' after every change
    devServer: {
        static: {
            directory: path.resolve(__dirname, 'dist')
        },
        port: 3000, //by default is 8080
        open: true,
        hot: true,
        compress: true,
        historyApiFallback: true,
    },
    module: {
        rules: [
            {
                test: /\.css$/, //where do you want the loader apply
                use: [MiniCssExtractPlugin.loader, 'css-loader'], // use any file that matches the above expresion
            },
            //after we installed the babel need to configure 
            {
                test: /\.js$/, //any file that ends vs js
                exclude: /node_modules/, //don't want to look the code in node_modele folder
                use: {
                    loader: 'babel-loader',
                    options: {
                        presets: ['@babel/preset-env'],
                    }
                }
            }
        ],
    },
    plugins: [
        new HtmlWebpackPlugin({
            title: 'Webpack App',
            filename: 'index.html', 
            template: './src/index.html',
        }),
        new MiniCssExtractPlugin(),
    ],
};