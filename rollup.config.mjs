import resolve from '@rollup/plugin-node-resolve';
import terser from '@rollup/plugin-terser';
import serve from 'rollup-plugin-serve';
import copy from 'rollup-plugin-copy';
import postcss from 'rollup-plugin-postcss';

const dev = process.env.ROLLUP_WATCH;
const name = 'cart-progress-bar';

// Shared CSS/SCSS plugin config
const cssPlugin = postcss({
	extract: `${name}.css`,
	minimize: false,
	sourceMap: dev,
	extensions: ['.scss', '.css'],
	use: ['sass'],
});

// Shared CSS/SCSS plugin config (minimized version)
const cssMinPlugin = postcss({
	extract: `${name}.min.css`,
	minimize: true,
	sourceMap: dev,
	extensions: ['.scss', '.css'],
	use: ['sass'],
});

// Shared copy plugin for SCSS files
const copyScssPlugin = copy({
	targets: [{ src: 'src/cart-progress-bar.scss', dest: 'dist', rename: `${name}.scss` }],
});

export default [
	// ESM build
	{
		input: 'src/cart-progress-bar.js',
		output: {
			file: `dist/${name}.esm.js`,
			format: 'es',
			sourcemap: true,
		},
		plugins: [resolve(), cssPlugin, copyScssPlugin],
	},
	// CommonJS build
	{
		input: 'src/cart-progress-bar.js',
		output: {
			file: `dist/${name}.cjs.js`,
			format: 'cjs',
			sourcemap: true,
			exports: 'named',
		},
		plugins: [resolve(), cssPlugin],
	},
	// UMD build
	{
		input: 'src/cart-progress-bar.js',
		output: {
			file: `dist/${name}.js`,
			format: 'umd',
			name: 'CartProgressBar',
			sourcemap: true,
		},
		plugins: [resolve(), cssPlugin],
	},
	// Minified UMD for browsers
	{
		input: 'src/cart-progress-bar.js',
		output: {
			file: `dist/${name}.min.js`,
			format: 'umd',
			name: 'CartProgressBar',
			sourcemap: false,
		},
		plugins: [
			resolve(),
			cssMinPlugin,
			terser({
				keep_classnames: true,
				format: {
					comments: false,
				},
			}),
		],
	},
	// Development build
	...(dev
		? [
				{
					input: 'src/cart-progress-bar.js',
					output: {
						file: `dist/${name}.esm.js`,
						format: 'es',
						sourcemap: true,
					},
					plugins: [
						resolve(),
						cssMinPlugin,
						serve({
							contentBase: ['dist', 'demo'],
							open: true,
							port: 3001,
						}),
						copy({
							targets: [
								{
									src: `dist/${name}.esm.js`,
									dest: 'demo',
								},
								{
									src: `dist/${name}.esm.js.map`,
									dest: 'demo',
								},
								{
									src: `dist/${name}.min.css`,
									dest: 'demo',
								},
							],
							hook: 'writeBundle',
						}),
					],
				},
			]
		: []),
];
