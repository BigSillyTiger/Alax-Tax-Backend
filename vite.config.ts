import { defineConfig } from "vite";
import tsconfigPaths from "vite-tsconfig-paths";
//import path from "path";

// https://vitejs.dev/config/
export default defineConfig({
    plugins: [tsconfigPaths()],

    resolve: {
        alias: {
            //"@": path.resolve(__dirname, "./src"),
            "@": "/src",
        },
    },
    build: {
        outDir: "dist",
        lib: {
            entry: "src/index.ts",
            formats: ["cjs"], // CommonJS format for Node.js
        },
        rollupOptions: {
            //external: ["express", "mysql", "crypto"], // List other external packages if necessary
            external: ["crypto"],
            output: {
                format: "cjs", // CommonJS format suitable for Node.js
            },
        },
    },
});
