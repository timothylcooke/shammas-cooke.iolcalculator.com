const path = require('path');
const { merge } = require('webpack-merge');

// We're using this file, which means we're building a production build of the site.
// We start with the default webpack.common.js file, and specify a couple of prod-build-specific things.
module.exports = merge(require('./webpack.common'), {
	mode: 'production',

	output: {
		path: path.join(__dirname, '../dist/prod'),
	},
});
