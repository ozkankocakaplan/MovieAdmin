const TerserPlugin = require("terser-webpack-plugin");
const CssMinimizerPlugin = require("css-minimizer-webpack-plugin");
module.exports = {
    optimization: {
        removeAvailableModules: false,
        minimizer: [
            new TerserPlugin({
                terserOptions: {
                    parse: {
                        ecma: 8
                    },
                    compress: {
                        ecma: 5,
                        warnings: false,
                        comparisons: false,
                        inline: 2,
                        drop_console: true
                    },
                    mangle: {
                        safari10: true
                    },
                    output: {
                        ecma: 5,
                        comments: false,

                        ascii_only: true
                    }
                },
                cache: true,
                parallel: true,
                sourceMap: true,
            }),
            new CssMinimizerPlugin({
                exclude: /(node_modules)/,
            })
        ],
        runtimeChunk: true
    },
};