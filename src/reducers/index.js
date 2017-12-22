
const context = require.context('./', true, /\.js$/);
const keys = context.keys().filter(item => item !== './index.js');

const reducersKeys = keys.reduce((memo, key) => {
  memo[key.match(/([^\/]+)\.js$/)[1]] = context(key).default;
  return memo;
}, {});



export default reducersKeys;
