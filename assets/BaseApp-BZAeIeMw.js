var u=Object.defineProperty;var h=(o,e,t)=>e in o?u(o,e,{enumerable:!0,configurable:!0,writable:!0,value:t}):o[e]=t;var i=(o,e,t)=>h(o,typeof e!="symbol"?e+"":e,t);import{W as f,r as I,X as c}from"./index-BcHAHiWR.js";const v=f("storageManager",()=>{const o=I(new Map),e=(a,r,l)=>{const n={key:a,value:r,timestamp:Date.now(),expiry:l};o.value.set(a,n);try{localStorage.setItem(a,JSON.stringify(n))}catch(m){console.error("Failed to save to localStorage:",m)}c.emit({type:"storage:set",payload:n})},t=a=>{let r=o.value.get(a);if(!r){const l=localStorage.getItem(a);if(l)try{const n=JSON.parse(l);g(n)&&(r=n,o.value.set(a,r))}catch(n){console.error("Failed to parse stored item:",n)}}return r?r.expiry&&Date.now()-r.timestamp>r.expiry?(s(a),null):r.value:null},s=a=>{o.value.delete(a),localStorage.removeItem(a),c.emit({type:"storage:remove",payload:{key:a}})},p=()=>{o.value.clear(),localStorage.clear(),c.emit({type:"storage:clear",payload:null})},d=()=>Array.from(o.value.keys()),g=a=>a&&typeof a=="object"&&"key"in a&&"value"in a&&"timestamp"in a&&typeof a.timestamp=="number";return{setItem:e,getItem:t,removeItem:s,clear:p,keys:d}});class x{constructor(e){i(this,"context");i(this,"storage",v());i(this,"eventHandlers",new Map);this.context=e}emit(e){const t=this.eventHandlers.get(e.type);t&&t.forEach(s=>s(e)),c.emit({type:`app:${this.context.appId}:${e.type}`,payload:{...e.payload,context:this.context}})}on(e,t){let s=this.eventHandlers.get(e);s||(s=new Set,this.eventHandlers.set(e,s)),s.add(t)}off(e,t){const s=this.eventHandlers.get(e);s&&(s.delete(t),s.size===0&&this.eventHandlers.delete(e))}getState(e){const t=`${this.context.appId}:${e}`;return this.storage.getItem(t)}setState(e,t,s){const p=`${this.context.appId}:${e}`;this.storage.setItem(p,t,s)}clearState(e){const t=`${this.context.appId}:${e}`;this.storage.removeItem(t)}getAppId(){return this.context.appId}getWindowId(){return this.context.windowId}}export{x as B};
