var m=Object.defineProperty;var N=(s,t,e)=>t in s?m(s,t,{enumerable:!0,configurable:!0,writable:!0,value:e}):s[t]=e;var i=(s,t,e)=>N(s,typeof t!="symbol"?t+"":t,e);import{B as f}from"./BaseApp-BZAeIeMw.js";import{d as S,r as b,o as _,a as g,c as p,b as l,t as h,F as y,e as v,f as d,n as C,_ as k}from"./index-BcHAHiWR.js";class w{constructor(){i(this,"state",{display:"0",currentNumber:"",operator:"",previousNumber:"",newNumber:!0})}getState(){return{...this.state}}setState(t){this.state={...this.state,...t}}reset(){this.state={display:"0",currentNumber:"",previousNumber:"",operator:"",newNumber:!0}}calculate(){const{previousNumber:t,currentNumber:e,operator:u}=this.state;if(!t||!e||!u)return;const r=parseFloat(t),o=parseFloat(e);let a=0;switch(u){case"+":a=r+o;break;case"-":a=r-o;break;case"*":a=r*o;break;case"/":a=r/o;break}this.setState({display:a.toString(),currentNumber:a.toString(),previousNumber:"",operator:"",newNumber:!0})}handleInput(t){if(t==="C"){this.reset();return}t==="."&&this.state.currentNumber.includes(".")||(["+","-","*","/","="].includes(t)?t==="="?this.calculate():this.state.currentNumber&&(this.state.previousNumber&&this.calculate(),this.setState({previousNumber:this.state.currentNumber,operator:t,newNumber:!0})):this.state.newNumber?this.setState({currentNumber:t,display:t,newNumber:!1}):this.setState({currentNumber:this.state.currentNumber+t,display:this.state.currentNumber+t}))}}class O extends f{constructor(e){super(e);i(this,"core");this.core=new w}async init(){const e=this.getState("state");e&&this.core.setState(e),this.on("state:change",()=>{this.setState("state",this.core.getState())})}async destroy(){this.clearState("state")}getCalculatorState(){return this.core.getState()}handleInput(e){this.core.handleInput(e),this.emit({type:"state:change",payload:this.core.getState()})}}const I={class:"calculator"},B={class:"display"},x={class:"keypad"},F=["onClick"],A=S({__name:"Calculator",props:{app:{}},setup(s){const t=s,e=b(t.app.getCalculatorState()),u=["7","8","9","/","4","5","6","*","1","2","3","-","0",".","=","+","C"],r=c=>["+","-","*","/","="].includes(c),o=c=>{t.app.handleInput(c)},a=c=>{e.value=c.payload};return _(()=>{t.app.on("state:change",a)}),g(()=>{t.app.off("state:change",a)}),(c,z)=>(d(),p("div",I,[l("div",B,h(e.value.display),1),l("div",x,[(d(),p(y,null,v(u,n=>l("button",{key:n,onClick:D=>o(n),class:C({operator:r(n)})},h(n),11,F)),64))])]))}}),U=k(A,[["__scopeId","data-v-1920c01d"]]);export{U as Calculator,O as CalculatorApp,O as default};