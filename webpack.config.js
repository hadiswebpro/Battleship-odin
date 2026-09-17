const path = require("path");
const HtmlWebpackPlugin = require("html-webpack-plugin");
const CopyWebpackPlugin = require("copy-webpack-plugin");

class ManifestPlugin {
    apply(compiler) {
        compiler.hooks.thisCompilation.tap("ManifestPlugin", (compilation) => {
            compilation.hooks.processAssets.tap(
                { name: "ManifestPlugin", stage: compiler.webpack.Compilation.PROCESS_ASSETS_STAGE_ADDITIONS },
                (assets) => {
                    const manifest = {
                        name: "Battleship",
                        short_name: "Battleship",
                        id: ".",
                        start_url: ".",
                        scope: ".",
                        display: "standalone",
                        orientation: "landscape",
                        background_color: "#001e3c",
                        theme_color: "#001e3c",
                        icons: [
                            {
                                src: "./favicon/android-chrome-192x192.png",
                                sizes: "192x192",
                                type: "image/png",
                            },
                            {
                                src: "./favicon/android-chrome-512x512.png",
                                sizes: "512x512",
                                type: "image/png",
                            },
                        ],
                    };
                    const content = JSON.stringify(manifest, null, 2);
                    assets["manifest.json"] = {
                        source: () => content,
                        size: () => Buffer.byteLength(content),
                    };
                }
            );
        });
    }
}

module.exports = {
    mode: "development",
    entry: "./src/index.js",
    output: {
        filename: "main.js",
        path: path.resolve(__dirname, "dist"),
        clean: true,
    },
    plugins: [
        new HtmlWebpackPlugin({
            template: "./src/index.html",
            meta: {
                viewport: "width=device-width, initial-scale=1, viewport-fit=cover",
            },
            link: [{ rel: "manifest", href: "manifest.json" }],
        }),
        new ManifestPlugin(),
        new CopyWebpackPlugin({
            patterns: [
                { from: "src/favicon", to: "favicon" },
                { from: "src/sw.js", to: "sw.js" },
            ],
        }),
    ],
    devServer: {
        static: "./dist",
        open: true,
    },
    module: {
        rules: [
            {
                test: /\.js$/,
                exclude: /node_modules/,
                use: "babel-loader",
            },
            {
                test: /\.(png|jpe?g|gif|webp|svg)$/i,
                type: "asset/resource",
            },
            {
                test: /\.(mp3|wav|ogg|m4a)$/i,
                type: "asset/resource",
            },
        ],
    },
};
