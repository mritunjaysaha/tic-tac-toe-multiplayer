const MiniCssExtractPlugin = require("mini-css-extract-plugin");

module.exports = () => ({
    output: {
        filename: "[name].js",
    },
    module: {
        rules: [
            {
                test: /\.css$/,
                use: [MiniCssExtractPlugin.loader, "css-loader"],
            },
        ],
    },

    plugins: [new MiniCssExtractPlugin()],
});
