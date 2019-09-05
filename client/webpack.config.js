const path = require('path');
	const htmlWebpackPlugin = require('html-webpack-plugin');

	module.exports = {
    	entry : './src/index.js',
    	output : {
        		path : path.join(process.cwd(), '/dist'),
        		filename : 'index_bundle.js'
    	},
    	module : {
        		rules : [
            		{
                			test : /.js$/,
                			exclude : /node_modules/,
                			use : {
                    		loader : 'babel-loader'
                			}
            		},
		{
			test : /.css$/,
                			exclude : /node_modules/,
			loader : ['style-loader', 'css-loader']	
		}
        		]
    	},
    	plugins : [
        		new htmlWebpackPlugin({
            		template : './src/index.html'
        		})
    	]
	}