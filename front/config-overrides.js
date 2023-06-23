const NodePolyfillPlugin = require("node-polyfill-webpack-plugin")

module.exports = function override(config, env) {
  // Add the polyfill plugin
  config.plugins.push(new NodePolyfillPlugin());
  // Return the updated config
  return config;
}
