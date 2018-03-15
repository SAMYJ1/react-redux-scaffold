
const context = require.context('./', true, /\.ts$/);
const keys = context.keys().filter(item => item !== './index.ts');

const reducersKeys = keys.reduce((memo, key) => {

  //eslint-disable-next-line
  memo[key.match(/([^\/]+)\.ts$/)[1]] = context(key).default;
  return memo;
}, {});

declare global{
  interface Actions {
    type?: string
    types?: string[]
    promise?: any
    action?: object
  }
}

export default reducersKeys;

