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
            output: {
                filename: "bundle.js",
                chunkFilename: "[name].lazy-chunk.js",
            },
            plugins: [new HtmlWebpackPlugin(), new webpack.ProgressPlugin()],
        },
        modeConfig(mode),
        presetConfig({ mode, presets })
    );
};
