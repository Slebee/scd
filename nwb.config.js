module.exports = {
  type: 'react-component',
  npm: {
    esModules: true,
    umd: {
      global: 'scd',
      externals: {
        react: 'React'
      }
    }
  }
}
