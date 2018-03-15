
export default function urlStringify(action): string {
  let a = action ? Object.entries(action) : '';
  return a ? (<string[][]>a).map(item=>{
    return item.join('=');
  }).join('&') : '';
}
