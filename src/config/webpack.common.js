const HTMLWebpackPlugin = require('html-webpack-plugin');
const ESLintPlugin = require('eslint-webpack-plugin');
const CopyWebpackPlugin = require('copy-webpack-plugin');
const path = require('path');

// This file defines most of the settings for the Webpack build.
// Both the webpack.dev.js and webpack.prod.js files include everything defined within this file, and add a few dev/prod-specific settings.
// Hence, everything in this file applies to both development and production builds.

module.exports = {

	// The src/tsx/index.tsx file is the main entry point.
	// We compile only index.tsx (and also any files referenced by index.tsx)
	entry: './tsx/index.tsx',

	plugins: [
		// We load the index.html file, injecting into it the compiled index.tsx file.
		new HTMLWebpackPlugin({
			template: './html/index.html'
		}),

		// We run eslint on any typescript file. eslint enforces code style, which helps us write consistent code.
		new ESLintPlugin({
			files: ['./**/*.tsx', './**/*.ts'],
		}),

		// We copy some static, uncompiled files to the output dist folder.
		new CopyWebpackPlugin({
			patterns: [
				{ from: './html/statusCodeResponse.html' },
				{ from: './favicon/favicon.*', to: '[name][ext]' },
			]
		})
	],

	module: {
		rules: [
			{
				// We compile any css or less files imported by index.tsx or any of its dependencies.
				test: /\.(less|css)$/,
				exclude: /node_modules/,
				use: [ 'style-loader', 'css-loader', 'less-loader' ]
			},
			{
				// We compile any ts or tsx files imported by index.tsx or any of its dependencies.
				test: /\.tsx?$/,
				exclude: /node_modules/,
				loader: 'ts-loader',
				options: {
					configFile: path.join(__dirname, './browser-tsconfig.json'),
				}
			}
		],
	},

	// If we don't specify an extension in an import statement, we will check for tsx, ts, or js files.
	resolve: {
		extensions: [ '.tsx', '.ts', '.js' ]
	},

	// We're compiling index.tsx into index.js.
	output: {
		filename: 'index.js',
		publicPath: '/'
	}
};
