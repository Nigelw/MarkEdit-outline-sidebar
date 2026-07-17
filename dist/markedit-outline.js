"use strict";var j=Object.defineProperty;var $=(t,e,i)=>e in t?j(t,e,{enumerable:!0,configurable:!0,writable:!0,value:i}):t[e]=i;var d=(t,e,i)=>$(t,typeof e!="symbol"?e+"":e,i);const s=require("markedit-api"),x=require("@codemirror/view"),p=require("@codemirror/language"),D=require("@codemirror/state"),c={position:"right",width:280,onLaunch:"remember",pushEditor:!0,syncPreviewScroll:!0,shortcut:{key:"l",modifiers:["Command","Shift"]}},P=["Shift","Control","Command","Option"];function F(){var i;let t={};try{const o=(i=s.MarkEdit.userSettings)==null?void 0:i["outline-sidebar"];o&&typeof o=="object"&&(t=o)}catch{}const e=(()=>{const o=t.shortcut;if(!o||typeof o!="object")return c.shortcut;const n=o,r=typeof n.key=="string"&&n.key.length>0?n.key:c.shortcut.key,l=Array.isArray(n.modifiers)?n.modifiers.filter(a=>P.includes(a)):c.shortcut.modifiers;return{key:r,modifiers:l.length>0?l:c.shortcut.modifiers}})();return{position:t.position==="left"?"left":c.position,width:H(t.width,160,600,c.width),onLaunch:t.onLaunch==="open"||t.onLaunch==="closed"?t.onLaunch:c.onLaunch,pushEditor:g(t.pushEditor,c.pushEditor),syncPreviewScroll:g(t.syncPreviewScroll,c.syncPreviewScroll),shortcut:e}}function g(t,e){return typeof t=="boolean"?t:e}function H(t,e,i,o){return typeof t!="number"||!Number.isFinite(t)?o:Math.min(i,Math.max(e,t))}const B=/^(?:ATX|Setext)Heading([1-6])$/;function R(t){const e=p.ensureSyntaxTree(t,t.doc.length,300)??p.syntaxTree(t),i=[];return e.iterate({from:0,to:t.doc.length,enter:o=>{const n=B.exec(o.name);if(n===null)return;const r=t.sliceDoc(o.from,o.to),l=o.name.startsWith("Setext");let a;l?a=r.split(t.lineBreak)[0].trim():a=r.replace(/^\s{0,3}#+\s+/,"").replace(/\s+#+\s*$/,"").trim(),i.push({title:a.length>0?a:"(untitled)",level:parseInt(n[1],10),from:o.from,to:o.to})}}),i}function _(t,e){let i=-1;for(let o=0;o<t.length&&e>=t[o].from;o++)i=o;return i}function z(t,e,i){const o=t[e];if(o===void 0)return;const n=s.MarkEdit.editorView,r=Math.max(0,Math.min(o.from,n.state.doc.length));n.dispatch({selection:D.EditorSelection.cursor(r),effects:x.EditorView.scrollIntoView(r,{y:"start",yMargin:8})}),q(n)&&n.focus(),i&&K(t,e)}function q(t){return t.scrollDOM.clientHeight>0&&t.scrollDOM.clientWidth>0}function K(t,e){try{const i=J();if(i.length===0)return;let o;if(i.length===t.length&&(o=i[e]),o===void 0){const n=b(t[e].title);o=i.find(r=>b(r.textContent??"")===n)}o!==void 0&&(o.scrollIntoView({block:"start",behavior:"auto"}),G(o))}catch{}}function G(t){t.classList.remove("meo-flash"),t.offsetWidth,t.classList.add("meo-flash");const e=()=>{t.classList.remove("meo-flash"),t.removeEventListener("animationend",e)};t.addEventListener("animationend",e)}function J(){return Array.from(document.querySelectorAll(".markdown-body h1, .markdown-body h2, .markdown-body h3, .markdown-body h4, .markdown-body h5, .markdown-body h6")).filter(Y)}function Y(t){return t.offsetWidth>0||t.offsetHeight>0||t.getClientRects().length>0}function b(t){return t.replace(/\s+/g," ").trim().toLowerCase()}const y="markedit-outline-styles",W=`
.meo-sidebar {
  position: fixed;
  top: 0;
  bottom: 0;
  width: var(--meo-width, 280px);
  display: flex;
  flex-direction: column;
  box-sizing: border-box;
  z-index: 2147483000;
  background: var(--meo-bg, #ffffff);
  color: var(--meo-fg, #1a1a1a);
  font-family: -apple-system, BlinkMacSystemFont, "SF Pro Text", system-ui, sans-serif;
  font-size: 13px;
  line-height: 1.35;
  -webkit-user-select: none;
  user-select: none;
  transition: transform 180ms ease;
  will-change: transform;
}
.meo-sidebar[data-position="right"] {
  right: 0;
  border-left: 1px solid var(--meo-border, rgba(127, 127, 127, 0.25));
  box-shadow: -6px 0 18px rgba(0, 0, 0, 0.12);
  transform: translateX(100%);
}
.meo-sidebar[data-position="left"] {
  left: 0;
  border-right: 1px solid var(--meo-border, rgba(127, 127, 127, 0.25));
  box-shadow: 6px 0 18px rgba(0, 0, 0, 0.12);
  transform: translateX(-100%);
}
.meo-sidebar.meo-open {
  transform: translateX(0);
}

.meo-header {
  display: flex;
  align-items: center;
  padding: 10px 12px 8px 14px;
  flex: 0 0 auto;
}
.meo-title {
  font-size: 11px;
  font-weight: 600;
  letter-spacing: 0.06em;
  text-transform: uppercase;
  opacity: 0.6;
}

.meo-list {
  flex: 1 1 auto;
  overflow-y: auto;
  overflow-x: hidden;
  padding: 2px 6px 12px 6px;
}
.meo-item {
  display: block;
  width: 100%;
  box-sizing: border-box;
  text-align: left;
  appearance: none;
  border: none;
  background: transparent;
  color: inherit;
  font: inherit;
  cursor: pointer;
  padding: 4px 8px;
  border-radius: 6px;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  border-left: 2px solid transparent;
}
.meo-item:hover {
  background: var(--meo-hover, rgba(127, 127, 127, 0.16));
}
.meo-item.meo-active {
  background: var(--meo-active-bg, rgba(0, 122, 255, 0.14));
  border-left-color: var(--meo-accent, AccentColor);
  font-weight: 600;
}
.meo-item[data-level="1"] { padding-left: 8px; font-weight: 600; }
.meo-item[data-level="2"] { padding-left: 20px; }
.meo-item[data-level="3"] { padding-left: 32px; }
.meo-item[data-level="4"] { padding-left: 44px; opacity: 0.92; }
.meo-item[data-level="5"] { padding-left: 56px; opacity: 0.85; }
.meo-item[data-level="6"] { padding-left: 68px; opacity: 0.8; }
.meo-item.meo-active[data-level] { opacity: 1; }

.meo-empty {
  padding: 16px 16px;
  opacity: 0.5;
  font-style: italic;
}

/* Brief highlight flashed on the matching preview heading after navigation. */
@keyframes meo-flash {
  from { background-color: var(--meo-flash, rgba(255, 209, 71, 0.6)); }
  to { background-color: transparent; }
}
.meo-flash {
  animation: meo-flash 1.2s ease-out;
  border-radius: 4px;
  box-decoration-break: clone;
  -webkit-box-decoration-break: clone;
}
`,f="Toggle Outline Sidebar",k="markedit-outline.visible";class X{constructor(e){d(this,"settings");d(this,"mounted",!1);d(this,"opened",!1);d(this,"root");d(this,"list");d(this,"empty");d(this,"headings",[]);d(this,"items",[]);d(this,"activeIndex",-1);this.settings=e}mount(){this.mounted||(this.mounted=!0,this.injectStyles(),this.buildSidebar(),this.applyTheme(),matchMedia("(prefers-color-scheme: dark)").addEventListener("change",()=>this.applyTheme()))}isOpen(){return this.opened}shouldStartOpen(){switch(this.settings.onLaunch){case"open":return!0;case"closed":return!1;case"remember":return U()??!1}}open(){!this.mounted||this.opened||(this.opened=!0,this.applyTheme(),this.refresh(),this.root.classList.add("meo-open"),this.pushEditor(!0),this.persistVisibility())}close(){!this.mounted||!this.opened||(this.opened=!1,this.root.classList.remove("meo-open"),this.pushEditor(!1),this.persistVisibility())}persistVisibility(){if(this.settings.onLaunch==="remember")try{localStorage.setItem(k,this.opened?"1":"0")}catch{}}toggle(){this.opened?this.close():this.open()}refresh(){this.mounted&&this.opened&&(this.headings=R(s.MarkEdit.editorView.state),this.renderList(),this.updateActive())}updateActive(){if(!this.mounted||!this.opened||this.items.length===0)return;const e=s.MarkEdit.editorView.state.selection.main.head,i=_(this.headings,e);i!==this.activeIndex&&(this.activeIndex>=0&&this.items[this.activeIndex]&&this.items[this.activeIndex].classList.remove("meo-active"),this.activeIndex=i,i>=0&&this.items[i]&&(this.items[i].classList.add("meo-active"),this.ensureItemVisible(this.items[i])))}injectStyles(){if(document.getElementById(y))return;const e=document.createElement("style");e.id=y,e.textContent=W,document.head.appendChild(e)}buildSidebar(){const e=document.createElement("div");e.className="meo-sidebar",e.setAttribute("data-position",this.settings.position),e.style.setProperty("--meo-width",`${this.settings.width}px`),e.style.width=`${this.settings.width}px`;const i=document.createElement("div");i.className="meo-header";const o=document.createElement("span");o.className="meo-title",o.textContent="Outline",i.append(o);const n=document.createElement("div");n.className="meo-list",n.setAttribute("role","tree"),n.addEventListener("click",l=>this.onListClick(l));const r=document.createElement("div");r.className="meo-empty",r.textContent="No headings in this document.",r.style.display="none",e.append(i,n,r),document.body.appendChild(e),this.root=e,this.list=n,this.empty=r}renderList(){if(this.list.textContent="",this.items=[],this.activeIndex=-1,this.headings.length===0){this.empty.style.display="";return}this.empty.style.display="none";const e=document.createDocumentFragment();this.headings.forEach((i,o)=>{const n=document.createElement("button");n.className="meo-item",n.setAttribute("data-level",String(i.level)),n.setAttribute("data-index",String(o)),n.title=i.title,n.textContent=i.title,this.items.push(n),e.appendChild(n)}),this.list.appendChild(e)}onListClick(e){var n;const i=(n=e.target)==null?void 0:n.closest(".meo-item");if(i===null)return;const o=parseInt(i.getAttribute("data-index")??"",10);Number.isNaN(o)||z(this.headings,o,this.settings.syncPreviewScroll)}ensureItemVisible(e){const i=this.list.scrollTop,o=i+this.list.clientHeight,n=e.offsetTop-this.list.offsetTop,r=n+e.offsetHeight;n<i?this.list.scrollTop=n-4:r>o&&(this.list.scrollTop=r-this.list.clientHeight+4)}pushEditor(e){if(!this.settings.pushEditor)return;const i=this.settings.width,o=this.settings.position==="right",n=document.body.style,r=document.documentElement.style;e?(n.width=`calc(100vw - ${i}px)`,n.marginLeft=o?"":`${i}px`,n.marginRight="",r.setProperty("--markedit-content-inset",o?`0 ${i}px 0 0`:`0 0 0 ${i}px`)):(n.width="",n.marginLeft="",n.marginRight="",r.removeProperty("--markedit-content-inset")),s.MarkEdit.editorView.requestMeasure()}applyTheme(){if(!this.mounted)return;const e=s.MarkEdit.editorView,i=getComputedStyle(e.dom),o=getComputedStyle(e.contentDOM??e.dom),n=v([i.backgroundColor,getComputedStyle(document.body).backgroundColor])??"#ffffff",r=v([o.color,i.color])??"#1a1a1a",l=Q(n),a=(N,V)=>this.root.style.setProperty(N,V);a("--meo-bg",n),a("--meo-fg",r),a("--meo-border",l?"rgba(255, 255, 255, 0.14)":"rgba(0, 0, 0, 0.12)"),a("--meo-hover",l?"rgba(255, 255, 255, 0.10)":"rgba(0, 0, 0, 0.06)"),a("--meo-active-bg",l?"rgba(255, 255, 255, 0.13)":"rgba(0, 0, 0, 0.06)"),a("--meo-accent","AccentColor")}}function U(){try{const t=localStorage.getItem(k);if(t==="1")return!0;if(t==="0")return!1}catch{}}function v(t){for(const e of t){const i=E(e);if(i!==void 0&&i.a>.05)return e}}function Q(t){const e=E(t);return e===void 0?matchMedia("(prefers-color-scheme: dark)").matches:(.299*e.r+.587*e.g+.114*e.b)/255<.5}function E(t){const e=/rgba?\(([^)]+)\)/.exec(t);if(e===null)return;const i=e[1].split(",").map(o=>parseFloat(o.trim()));if(!(i.length<3||i.some(o=>Number.isNaN(o))))return{r:i[0],g:i[1],b:i[2],a:i.length>=4?i[3]:1}}const Z="settings.json",m="editor.customToolbarItems";function S(){return`${s.MarkEdit.getDirectoryPath("documents")}/${Z}`}function T(t){return{title:"Outline",icon:t.position==="left"?"sidebar.left":"sidebar.right",actionName:f}}function C(t){return typeof t=="object"&&t!==null&&t.actionName===f}async function M(){const t=await s.MarkEdit.getFileContent(S());if(t===void 0||t.trim().length===0)return{};try{const e=JSON.parse(t);return typeof e!="object"||e===null||Array.isArray(e)?void 0:e}catch{return}}async function A(t){return s.MarkEdit.createFile({path:S(),string:`${JSON.stringify(t,null,2)}
`,overwrites:!0})}async function L(t){await s.MarkEdit.showAlert({title:"Couldn't update settings.json automatically",message:`Your settings.json couldn't be parsed as JSON, so it was left untouched.

Add this object to the "${m}" array yourself:

${JSON.stringify(t)}`,buttons:["OK"]})}async function tt(t){const e=T(t),i=await M();if(i===void 0){await L(e);return}const o=Array.isArray(i[m])?i[m]:[];if(o.some(C)){await s.MarkEdit.showAlert({title:"Toolbar button already configured",message:`A toolbar toggle for the Outline Sidebar is already in your settings.json.

If you don’t see it, restart MarkEdit and add it via View → Customize Toolbar….`,buttons:["OK"]});return}i[m]=[...o,e];const n=await A(i);await s.MarkEdit.showAlert({title:n?"Toolbar button added":"Failed to write settings.json",message:n?"Restart MarkEdit, then drag the “Outline” item into the toolbar via View → Customize Toolbar…. Clicking it toggles the sidebar.":`Could not write settings.json. Check permissions in the MarkEdit Documents folder, or add this item to "${m}" manually:

${JSON.stringify(e)}`,buttons:["OK"]})}async function et(t){const e=await M();if(e===void 0){await L(T(t));return}const i=Array.isArray(e[m])?e[m]:[],o=i.filter(r=>!C(r));if(o.length===i.length){await s.MarkEdit.showAlert({title:"Nothing to remove",message:"No Outline Sidebar toolbar item was found in settings.json.",buttons:["OK"]});return}o.length===0?delete e[m]:e[m]=o;const n=await A(e);await s.MarkEdit.showAlert({title:n?"Toolbar button removed":"Failed to write settings.json",message:n?"Restart MarkEdit to apply. You can also remove it from the toolbar via View → Customize Toolbar….":"Could not write settings.json.",buttons:["OK"]})}function it(t,e){s.MarkEdit.addMainMenuItem({title:"Outline Sidebar",children:[{title:f,key:t.shortcut.key,modifiers:t.shortcut.modifiers,action:()=>e.toggle(),state:()=>({isSelected:e.isOpen()})},{separator:!0},{title:"Add Toolbar Button to settings.json…",action:()=>void tt(t)},{title:"Remove Toolbar Button…",action:()=>void et(t)}]})}const I=F(),h=new X(I);it(I,h);let u;s.MarkEdit.addExtension(x.EditorView.updateListener.of(t=>{t.docChanged?(u!==void 0&&clearTimeout(u),u=setTimeout(()=>h.refresh(),250)):t.selectionSet&&h.updateActive()}));let w=!1;function O(){w||(w=!0,h.mount(),h.shouldStartOpen()&&h.open())}s.MarkEdit.onEditorReady(()=>O());try{s.MarkEdit.editorView!==void 0&&O()}catch{}
