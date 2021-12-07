require('esbuild').build({
    entryPoints: ['macrolight.js'],
    bundle: true,
    outfile: 'dist/macrolight.cjs.js',
    target: ['es6'],
    format: 'cjs',
    minify: true,
}).catch(() => process.exit(1))

require('esbuild').build({
    entryPoints: ['macrolight.js'],
    bundle: true,
    outfile: 'dist/macrolight.esm.js',
    target: ['es6'],
    format: 'esm',
    minify: true,
}).catch(() => process.exit(1))