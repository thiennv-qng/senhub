module.exports = {
  name: 'senos',
  filename: 'index.js',
  shared: {
    react: { singleton: true, requiredVersion: '^17.0.2' },
    'react-dom': { singleton: true, requiredVersion: '^17.0.2' },
    'react-router-dom': { singleton: true, requiredVersion: '^5.3.0' },
    '@reduxjs/toolkit': { singleton: true, requiredVersion: '^1.6.2' },
    'react-redux': { singleton: true, requiredVersion: '^7.2.5' },
    antd: { singleton: true, requiredVersion: '^4.17.0-alpha.5' },
  },
  remotes: {
    senos: 'senos@http://https://tuphan-dn.github.io/2mf/index.js',
  },
  exposes: {
    // Your app
    './': 'app/view',
    // SenOS
    './store': 'store',
    './store/ui.reducer': 'store/ui.reducer',
  },
}
