const webpack = require("webpack");
const HtmlWebpackPlugin = require("html-webpack-plugin");
const webpackMerge = require("webpack-merge");
const CssMinimizerPlugin = require("css-minimizer-webpack-plugin");

const modeConfig = (env) => require(`./build-utils/webpack.${env}`)(env);
const presetConfig = require("./build-utils/loadPresets");

module.exports = ({ mode, presets } = { mode: "production", presets: [] }) => {
    return webpackMerge(
        {
            devtool: "source-map",
            mode,
            module: {
                rules: [
                    {
                        test: /\.html$/,
                        use: [
                            {
                                loader: "html-loader",
                                options: { minimize: true },
                            },
                        ],
                    },
                    {
                        test: /\.jpe?g$/,
                        use: [
                            {
                                loader: "url-loader",
                                options: {
                                    limit: 5000,
                                },
                            },
                        ],
                    },
                    {
                        test: /\.scss$/,
                        use: ["style-loader", "css-loader", "sass-loader"],
                    },
                ],
            },
            optimization: {
                minimize: true,
                minimizer: [new CssMinimizerPlugin()],
            },
            output: {
                filename: "bundle.js",
            },
            plugins: [
                new HtmlWebpackPlugin({
                    template: "./src/index.html",
                    filename: "./index.html",
                }),
                new webpack.ProgressPlugin(),
            ],
        },
        modeConfig(mode),
        presetConfig({ mode, presets })
    );
};
