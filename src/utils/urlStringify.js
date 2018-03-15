


export default function urlStringify(action) {
  let a = action ? Object.entries(action) : '';
  let parms = a ? a.map(item=>{
    return item.join('=');
  }).join('&') : '';

  return parms
}