const path = require('path')
const webpack = require('webpack')

module.exports = (env) => {
  return {
    mode: 'production',
    entry: './engine/index.ts',
    watch: true,
    target: 'web',
    output: {
      path: path.resolve(__dirname, 'build'),
      filename: 'chaos.js',
    },
    plugins: [
      new webpack.DefinePlugin({
        'process.env.DEBUG': JSON.stringify(env.DEBUG)
      })
    ],
    module: {
      rules: [
        {
          test: /\.ts$/,
          use: 'ts-loader',
          exclude: /node_modules/
        }
      ],
    },
    resolve: {
      extensions: ['.tsx', '.ts', '.js']
    }
  }
}
