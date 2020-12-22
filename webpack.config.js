module.exports = {
  mode: 'development',
  watch: true,
  entry: './src/index.js',
  target: 'node',
  module: {
    rules: [
      {
        test: /\.(graphql|gql)$/,
        exclude: /node_modules/,
        loader: '@graphql-tools/webpack-loader'
      },
      {
        test: /\.m?js$/,
        exclude: /(node_modules|bower_components)/,
        use: {
          loader: 'babel-loader',
          options: {
            presets: ['@babel/preset-env']
          }
        }
      }
    ]
  },
  externals: {
    "bufferutil": "bufferutil",
    "utf-8-validate": "utf-8-validate",
  }
}
