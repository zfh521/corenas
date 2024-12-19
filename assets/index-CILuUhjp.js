var W=Object.defineProperty;var K=(h,e,t)=>e in h?W(h,e,{enumerable:!0,configurable:!0,writable:!0,value:t}):h[e]=t;var f=(h,e,t)=>K(h,typeof e!="symbol"?e+"":e,t);import{d as O,r as d,o as X,c as g,b as s,t as b,F as Y,e as q,L as H,P as J,R as C,K as z,V as A,f as x,_ as Q}from"./index-BcHAHiWR.js";import{B as Z}from"./BaseApp-BZAeIeMw.js";class tt{constructor(){f(this,"nodes");f(this,"root","/");this.nodes=new Map,this.nodes.set(this.root,{name:"",type:"directory",path:this.root,createdAt:Date.now(),modifiedAt:Date.now(),children:[]})}validatePath(e){return e=e.startsWith("/")?e:`/${e}`,e=e.replace(/\/+/g,"/"),e===""?"/":e}getParentPath(e){const t=this.validatePath(e);return t==="/"?"/":this.dirname(t)}async ensureParentExists(e){const t=this.getParentPath(e);if(!await this.exists(t))throw new Error(`Parent directory does not exist: ${t}`);if((await this.stat(t)).type!=="directory")throw new Error(`Parent path is not a directory: ${t}`)}async createFile(e,t=""){const a=this.validatePath(e);if(await this.ensureParentExists(a),await this.exists(a))throw new Error(`File already exists: ${a}`);const o=this.getParentPath(a),r=await this.stat(o),c={name:this.basename(a),type:"file",path:a,createdAt:Date.now(),modifiedAt:Date.now(),content:t,size:t instanceof ArrayBuffer?t.byteLength:t.length,parent:o};this.nodes.set(a,c),r.children=r.children||[],r.children.push(a),r.modifiedAt=Date.now(),this.nodes.set(o,r)}async createDirectory(e){const t=this.validatePath(e);if(await this.ensureParentExists(t),await this.exists(t))throw new Error(`Directory already exists: ${t}`);const a=this.getParentPath(t),o=await this.stat(a),r={name:this.basename(t),type:"directory",path:t,createdAt:Date.now(),modifiedAt:Date.now(),children:[],parent:a};this.nodes.set(t,r),o.children=o.children||[],o.children.push(t),o.modifiedAt=Date.now(),this.nodes.set(a,o)}async delete(e){var o;const t=this.validatePath(e);if(!await this.exists(t))throw new Error(`Path does not exist: ${t}`);const a=await this.stat(t);if(a.type==="directory"&&a.children&&a.children.length>0)for(const r of a.children)await this.delete(r);if(a.parent){const r=await this.stat(a.parent);r.children=(o=r.children)==null?void 0:o.filter(c=>c!==t),r.modifiedAt=Date.now(),this.nodes.set(a.parent,r)}this.nodes.delete(t)}async move(e,t){const a=this.validatePath(e),o=this.validatePath(t);if(!await this.exists(a))throw new Error(`Source path does not exist: ${a}`);await this.copy(a,o),await this.delete(a)}async copy(e,t){const a=this.validatePath(e),o=this.validatePath(t),r=await this.stat(a);if(r.type==="file"){const c=await this.readFile(a);await this.createFile(o,c)}else if(await this.createDirectory(o),r.children)for(const c of r.children){const y=this.basename(c),m=this.join(o,y);await this.copy(c,m)}}async readFile(e){const t=this.validatePath(e),a=await this.stat(t);if(a.type!=="file")throw new Error(`Path is not a file: ${t}`);return a.content||""}async readDirectory(e){const t=this.validatePath(e),a=await this.stat(t);if(a.type!=="directory")throw new Error(`Path is not a directory: ${t}`);return a.children||[]}async exists(e){const t=this.validatePath(e);return this.nodes.has(t)}async stat(e){const t=this.validatePath(e),a=this.nodes.get(t);if(!a)throw new Error(`Path does not exist: ${t}`);return{...a}}async writeFile(e,t){const a=this.validatePath(e);if(await this.exists(a)){const o=await this.stat(a);if(o.type!=="file")throw new Error(`Path is not a file: ${a}`);o.content=t,o.size=t instanceof ArrayBuffer?t.byteLength:t.length,o.modifiedAt=Date.now(),this.nodes.set(a,o)}else await this.createFile(a,t)}join(...e){return this.validatePath(e.join("/"))}dirname(e){const t=this.validatePath(e);return t==="/"?"/":t.split("/").slice(0,-1).join("/")||"/"}basename(e){const t=this.validatePath(e);if(t==="/")return"";const a=t.split("/");return a[a.length-1]}}const et={class:"finder"},at={class:"finder-toolbar"},it={class:"navigation-buttons"},st=["disabled"],nt=["disabled"],ot=["disabled"],rt={class:"path-bar"},lt={class:"finder-content"},ct={class:"sidebar"},dt={class:"favorites"},ht={class:"file-list"},ut=["onClick","onContextmenu"],wt={class:"icon"},vt={class:"name"},ft={class:"dialog-buttons"},yt={class:"dialog-buttons"},mt=O({__name:"Finder",props:{app:{}},setup(h){const t=h.app.core,a=d([]),o=d("/"),r=d(["/"]),c=d(0),y=d(null),m=d(null),p=d(""),P=d(""),F=d(!1),k=d({top:"0px",left:"0px"}),u=d(null),v=async()=>{try{const n=await t.getCurrentDirectory(),i=await Promise.all(n.map(l=>t.getItemDetails(l)));a.value=i}catch(n){console.error("Failed to load directory:",n)}},w=async n=>{try{await t.navigateTo(n),o.value=n,r.value=r.value.slice(0,c.value+1),r.value.push(n),c.value=r.value.length-1,await v()}catch(i){console.error("Navigation failed:",i)}},E=async n=>{n.type==="directory"&&await w(n.path)},N=(n,i)=>{u.value=i,F.value=!0,k.value={top:`${n.clientY}px`,left:`${n.clientX}px`}},_=async()=>{c.value>0&&(c.value--,await w(r.value[c.value]))},S=async()=>{c.value<r.value.length-1&&(c.value++,await w(r.value[c.value]))},U=async()=>{t.canGoUp()&&await w(t.getParentPath())},B=()=>{var n;(n=y.value)==null||n.showModal()},M=()=>{var n;(n=m.value)==null||n.showModal()},D=n=>{var i,l;n==="newFolderDialog"?(p.value="",(i=y.value)==null||i.close()):(P.value="",(l=m.value)==null||l.close())},j=async()=>{if(p.value)try{await t.createFolder(p.value),await v(),D("newFolderDialog")}catch(n){console.error("Failed to create folder:",n)}},I=async()=>{if(P.value)try{await t.createFile(P.value),await v(),D("newFileDialog")}catch(n){console.error("Failed to create file:",n)}},G=async()=>{if(u.value){const n=prompt("Enter new name:",u.value.name);if(n&&n!==u.value.name)try{await t.rename(u.value.path,n),await v()}catch(i){console.error("Failed to rename:",i)}}F.value=!1},L=async()=>{if(u.value&&confirm(`Are you sure you want to delete ${u.value.name}?`))try{await t.delete(u.value.path),await v()}catch(n){console.error("Failed to delete:",n)}F.value=!1},T=()=>c.value>0,V=()=>c.value<r.value.length-1,R=()=>t.canGoUp();return X(()=>{v(),document.addEventListener("click",()=>{F.value=!1})}),(n,i)=>(x(),g("div",et,[s("div",at,[s("div",it,[s("button",{onClick:_,disabled:!T},i[8]||(i[8]=[s("span",null,"←",-1)]),8,st),s("button",{onClick:S,disabled:!V},i[9]||(i[9]=[s("span",null,"→",-1)]),8,nt),s("button",{onClick:U,disabled:!R},i[10]||(i[10]=[s("span",null,"↑",-1)]),8,ot)]),s("div",rt,b(o.value),1),s("div",{class:"actions"},[s("button",{onClick:B},"New Folder"),s("button",{onClick:M},"New File")])]),s("div",lt,[s("div",ct,[s("div",dt,[i[11]||(i[11]=s("div",{class:"section-title"},"Favorites",-1)),s("div",{class:"favorite-item",onClick:i[0]||(i[0]=l=>w("/Users"))},"Users"),s("div",{class:"favorite-item",onClick:i[1]||(i[1]=l=>w("/Applications"))},"Applications"),s("div",{class:"favorite-item",onClick:i[2]||(i[2]=l=>w("/Documents"))},"Documents"),s("div",{class:"favorite-item",onClick:i[3]||(i[3]=l=>w("/Downloads"))},"Downloads")])]),s("div",ht,[(x(!0),g(Y,null,q(a.value,l=>(x(),g("div",{key:l.path,class:"file-item",onClick:$=>E(l),onContextmenu:C($=>N($,l),["prevent"])},[s("div",wt,b(l.type==="directory"?"📁":"📄"),1),s("div",vt,b(l.name),1)],40,ut))),128))])]),F.value?(x(),g("div",{key:0,class:"context-menu",style:H(k.value)},[s("div",{onClick:G},"Rename"),s("div",{onClick:L},"Delete")],4)):J("",!0),s("dialog",{ref_key:"newFolderDialog",ref:y},[s("form",{onSubmit:C(j,["prevent"])},[i[13]||(i[13]=s("h3",null,"New Folder",-1)),z(s("input",{"onUpdate:modelValue":i[4]||(i[4]=l=>p.value=l),placeholder:"Folder name"},null,512),[[A,p.value]]),s("div",ft,[s("button",{type:"button",onClick:i[5]||(i[5]=l=>D("newFolderDialog"))},"Cancel"),i[12]||(i[12]=s("button",{type:"submit"},"Create",-1))])],32)],512),s("dialog",{ref_key:"newFileDialog",ref:m},[s("form",{onSubmit:C(I,["prevent"])},[i[15]||(i[15]=s("h3",null,"New File",-1)),z(s("input",{"onUpdate:modelValue":i[6]||(i[6]=l=>P.value=l),placeholder:"File name"},null,512),[[A,P.value]]),s("div",yt,[s("button",{type:"button",onClick:i[7]||(i[7]=l=>D("newFileDialog"))},"Cancel"),i[14]||(i[14]=s("button",{type:"submit"},"Create",-1))])],32)],512)]))}}),gt=Q(mt,[["__scopeId","data-v-553f0606"]]);class pt{constructor(){f(this,"fs");f(this,"currentPath","/");this.fs=new tt,this.initializeFileSystem()}async initializeFileSystem(){try{await this.fs.createDirectory("/Users"),await this.fs.createDirectory("/Applications"),await this.fs.createDirectory("/Documents"),await this.fs.createDirectory("/Downloads"),await this.fs.writeFile("/Documents/welcome.txt","Welcome to Finder!"),await this.fs.writeFile("/Documents/readme.md",`# Finder
A file browser application`)}catch(e){console.error("Failed to initialize file system:",e)}}async getCurrentDirectory(){return await this.fs.readDirectory(this.currentPath)}async getItemDetails(e){return await this.fs.stat(e)}async navigateTo(e){if(!await this.fs.exists(e))throw new Error(`Path does not exist: ${e}`);if((await this.fs.stat(e)).type!=="directory")throw new Error(`Path is not a directory: ${e}`);this.currentPath=e}async createFolder(e){const t=this.fs.join(this.currentPath,e);await this.fs.createDirectory(t)}async createFile(e,t=""){const a=this.fs.join(this.currentPath,e);await this.fs.createFile(a,t)}async delete(e){await this.fs.delete(e)}async rename(e,t){const a=this.fs.dirname(e),o=this.fs.join(a,t);await this.fs.move(e,o)}getParentPath(){return this.fs.dirname(this.currentPath)}canGoUp(){return this.currentPath!=="/"}}class xt extends Z{constructor(t){super(t);f(this,"core");this.core=new pt}async init(){}async destroy(){}}export{gt as Finder,xt as default};
