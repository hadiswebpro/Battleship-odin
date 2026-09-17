const path = require("path");
const HtmlWebpackPlugin = require("html-webpack-plugin");

class ManifestPlugin {
    apply(compiler) {
        compiler.hooks.thisCompilation.tap("ManifestPlugin", (compilation) => {
            compilation.hooks.processAssets.tap(
                { name: "ManifestPlugin", stage: compiler.webpack.Compilation.PROCESS_ASSETS_STAGE_ADDITIONS },
                (assets) => {
                    const manifest = {
                        name: "Battleship",
                        short_name: "Battleship",
                        start_url: ".",
                        display: "standalone",
                        orientation: "landscape",
                        background_color: "#001e3c",
                        theme_color: "#001e3c",
                    };
                    assets["manifest.json"] = {
                        source: () => JSON.stringify(manifest, null, 2),
                        size: () => JSON.stringify(manifest, null, 2).length,
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
