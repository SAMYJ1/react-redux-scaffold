import urlStringify from './urlStringify'

const ssoCfg = {
  endPoint: process.env.NODE_ENV === 'development'? 'http://10.9.15.164' :'https://connect.zto.com',
  // appid: 'ztn0M_aDHbUHuZ77RY4kSV5w',
  appid: 'ztBZV5ljDpUOyqXNJxP9Dtjg',

};

const host = process.env.NODE_ENV ==='development'? 'http://10.10.200.189:8287/api': '';


global.host = host;
global.ssoCfg = ssoCfg;

const randomString = function(length: number): string {
  let text = "";
  const possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
  for(let i = 0; i < length; i++) {
    text += possible.charAt(Math.floor(Math.random() * possible.length));
  }
  return text;
};

export const jumpToOAuth2 = (): void => {
  window.location.href = `${ssoCfg.endPoint}/oauth2/authorize?appid=${ssoCfg.appid}&redirect_uri=` +
    `${encodeURIComponent(`${host}/oauth2/callback?redirect_uri=${encodeURIComponent(window.location.href)}`)}` +
    `&response_type=code&scope=userinfo&state=${randomString(16)}`;
};

type Options = {
  headers?: object;
  body?: object;
  form?: boolean;
  [propName: string]: any;
}

export const request = async  ( url: string, options?: Options, count = 0 ) => {

  let _options = {
    headers: {
      "Content-Type": "application/json; charset=utf-8"
    }
  };
  if (options){
    const { headers, body, form, ...rest } = options;

    if (headers){
      Object.assign(_options.headers, headers);
    }
    if (form === true){
      Object.assign(_options.headers, { 'Content-Type': 'application/x-www-form-urlencoded;charset=utf-8'})
    }


    Object.assign(_options, {body: form === true ? urlStringify(body): JSON.stringify(body)}, rest);
  }

  if (url.indexOf('http') === -1){
    url = host + url
  }



  try {
    let response = await fetch(url, {
      method: 'get',
      cache: 'default',
      credentials: 'include',
      ..._options,
    });

    let status = response.status;

    let result = await response.json();

    if (status === 401){
      jumpToOAuth2()
    }
    if (status === 403 && count < 3){
      await request(url, options, count + 1);

      return
    }

    return result
  } catch (e){

  }
};
