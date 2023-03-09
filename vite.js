// vite.config.js

import { defineConfig } from 'vite'
export default defineConfig({
    module.exports = {
    input: "index.js",
    output: {
        dir: "dist",
    },
    plugins: [
        copy({
        targets: [{ src: ["index.html", "assets"], dest: "dist" }],
        }),
        nodeResolve(),
    ],
    };
})