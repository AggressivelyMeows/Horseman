import esbuild from 'esbuild'

esbuild.build({
    logLevel: "info",
    entryPoints: ["src/index.js"],
    bundle: true,
    minify: false,
    format: 'esm',
    platform: 'browser',
    outfile: "dist/index.js",
    plugins: [

    ],
})

