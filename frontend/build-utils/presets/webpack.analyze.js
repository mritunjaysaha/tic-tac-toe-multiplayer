const WebpackBundlerAnalyzer = require("webpack-bundle-analyzer")
    .BundleAnalyzerPlugin;

module.exports = () => ({
    plugins: [new WebpackBundlerAnalyzer()],
});
