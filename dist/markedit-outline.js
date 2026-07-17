"use strict";var H=Object.defineProperty;var B=(e,t,i)=>t in e?H(e,t,{enumerable:!0,configurable:!0,writable:!0,value:i}):e[t]=i;var c=(e,t,i)=>B(e,typeof t!="symbol"?t+"":t,i);const s=require("markedit-api"),S=require("@codemirror/view"),b=require("@codemirror/language"),F=require("@codemirror/state"),d={position:"right",width:280,onLaunch:"remember",pushEditor:!0,syncPreviewScroll:!0,shortcut:{key:"l",modifiers:["Command","Shift"]}},D=["Shift","Control","Command","Option"];function R(){var i;let e={};try{const o=(i=s.MarkEdit.userSettings)==null?void 0:i["outline-sidebar"];o&&typeof o=="object"&&(e=o)}catch{}const t=(()=>{const o=e.shortcut;if(!o||typeof o!="object")return d.shortcut;const n=o,r=typeof n.key=="string"&&n.key.length>0?n.key:d.shortcut.key,a=Array.isArray(n.modifiers)?n.modifiers.filter(l=>D.includes(l)):d.shortcut.modifiers;return{key:r,modifiers:a.length>0?a:d.shortcut.modifiers}})();return{position:e.position==="left"?"left":d.position,width:q(e.width,160,600,d.width),onLaunch:e.onLaunch==="open"||e.onLaunch==="closed"?e.onLaunch:d.onLaunch,pushEditor:v(e.pushEditor,d.pushEditor),syncPreviewScroll:v(e.syncPreviewScroll,d.syncPreviewScroll),shortcut:t}}function v(e,t){return typeof e=="boolean"?e:t}function q(e,t,i,o){return typeof e!="number"||!Number.isFinite(e)?o:Math.min(i,Math.max(t,e))}const _=/^(?:ATX|Setext)Heading([1-6])$/;function z(e){const t=b.ensureSyntaxTree(e,e.doc.length,300)??b.syntaxTree(e),i=[];return t.iterate({from:0,to:e.doc.length,enter:o=>{const n=_.exec(o.name);if(n===null)return;const r=e.sliceDoc(o.from,o.to),a=o.name.startsWith("Setext");let l;a?l=r.split(e.lineBreak)[0].trim():l=r.replace(/^\s{0,3}#+\s+/,"").replace(/\s+#+\s*$/,"").trim(),i.push({title:l.length>0?l:"(untitled)",level:parseInt(n[1],10),from:o.from,to:o.to})}}),i}function K(e,t){let i=-1;for(let o=0;o<e.length&&t>=e[o].from;o++)i=o;return i}function Y(e,t,i){const o=e[t];if(o===void 0)return;const n=s.MarkEdit.editorView,r=Math.max(0,Math.min(o.from,n.state.doc.length));if(n.dispatch({selection:F.EditorSelection.cursor(r),effects:S.EditorView.scrollIntoView(r,{y:"start",yMargin:8})}),G()||n.focus(),i){const a=U(e,t);a!==void 0&&(J()||(document.querySelectorAll(".markdown-body span.meo-flash").forEach(p),X(a)),Q(a))}}function G(){const e=document.querySelector(".markdown-body.overlay");return e!==null&&C(e)}function J(){var e;try{const t=(e=s.MarkEdit.userSettings)==null?void 0:e["extension.markeditPreview"];if(t!==null&&typeof t=="object"){const i=t.syncScroll;if(typeof i=="boolean")return i}}catch{}return!0}function X(e){const t=W(e);if(t===void 0){e.scrollIntoView({block:"start",behavior:"auto"});return}const i=8,o=t.scrollTop,n=e.getBoundingClientRect().top-t.getBoundingClientRect().top,r=t.scrollHeight-t.clientHeight,a=Math.max(0,Math.min(r,Math.round(o+n-i)));Math.abs(a-o)>1&&(t.scrollTop=a)}function W(e){let t=e.parentElement;for(;t!==null&&t!==document.body;){const i=getComputedStyle(t).overflowY;if((i==="auto"||i==="scroll")&&t.scrollHeight>t.clientHeight)return t;t=t.parentElement}}function U(e,t){const i=tt();if(i.length===0)return;if(i.length===e.length)return i[t];const o=w(e[t].title);return i.find(n=>w(n.textContent??"")===o)}function Q(e){Z(e);const t=document.createElement("span");for(t.className="meo-flash";e.firstChild!==null;)t.appendChild(e.firstChild);e.appendChild(t);const i=()=>{t.removeEventListener("animationend",i),p(t)};t.addEventListener("animationend",i)}function Z(e){e.querySelectorAll(":scope > span.meo-flash").forEach(p)}function p(e){const t=e.parentElement;if(t!==null){for(;e.firstChild!==null;)t.insertBefore(e.firstChild,e);e.remove()}}function tt(){return Array.from(document.querySelectorAll(".markdown-body h1, .markdown-body h2, .markdown-body h3, .markdown-body h4, .markdown-body h5, .markdown-body h6")).filter(C)}function C(e){return e.offsetWidth>0||e.offsetHeight>0||e.getClientRects().length>0}function w(e){return e.replace(/\s+/g," ").trim().toLowerCase()}const x="markedit-outline-styles",et=`
.meo-sidebar {
  position: fixed;
  top: 0;
  bottom: 0;
  width: var(--meo-width, 280px);
  display: flex;
  flex-direction: column;
  box-sizing: border-box;
  z-index: 2147483000;
  background: var(--meo-bg, #fafafa);
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
  transform: translateX(100%);
}
.meo-sidebar[data-position="left"] {
  left: 0;
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
}
.meo-item:hover {
  background: var(--meo-hover, #f0f0f0);
}
.meo-item.meo-active {
  background: var(--meo-active-bg, #e8e8e8);
  /* Inset shadow rather than a left border: it respects border-radius, so it
     can't leave dark fringes at the rounded corners. */
  box-shadow: inset 2px 0 0 0 var(--meo-accent, AccentColor);
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

/* Brief highlight + subtle bounce flashed on the matching preview heading. */
@keyframes meo-flash {
  0%   { background-color: var(--meo-flash, rgba(255, 209, 71, 0.6)); transform: scale(1); }
  12%  { transform: scale(1.04); }
  28%  { transform: scale(0.99); }
  40%  { transform: scale(1); }
  100% { background-color: transparent; transform: scale(1); }
}
.meo-flash {
  display: inline-block;
  padding: 0 0.25em;
  margin: 0 -0.25em;
  border-radius: 4px;
  animation: meo-flash 1.2s ease-out;
  transform-origin: left center;
}
`,g="Toggle Outline Sidebar",M="markedit-outline.visible";class it{constructor(t){c(this,"settings");c(this,"mounted",!1);c(this,"opened",!1);c(this,"root");c(this,"list");c(this,"empty");c(this,"headings",[]);c(this,"items",[]);c(this,"activeIndex",-1);this.settings=t}mount(){this.mounted||(this.mounted=!0,this.injectStyles(),this.buildSidebar(),this.applyTheme(),matchMedia("(prefers-color-scheme: dark)").addEventListener("change",()=>this.applyTheme()))}isOpen(){return this.opened}shouldStartOpen(){switch(this.settings.onLaunch){case"open":return!0;case"closed":return!1;case"remember":return ot()??!1}}open(){!this.mounted||this.opened||(this.opened=!0,this.applyTheme(),this.refresh(),this.root.classList.add("meo-open"),this.pushEditor(!0),this.persistVisibility())}close(){!this.mounted||!this.opened||(this.opened=!1,this.root.classList.remove("meo-open"),this.pushEditor(!1),this.persistVisibility())}persistVisibility(){if(this.settings.onLaunch==="remember")try{localStorage.setItem(M,this.opened?"1":"0")}catch{}}toggle(){this.opened?this.close():this.open()}refresh(){this.mounted&&this.opened&&(this.headings=z(s.MarkEdit.editorView.state),this.renderList(),this.updateActive())}updateActive(){if(!this.mounted||!this.opened||this.items.length===0)return;const t=s.MarkEdit.editorView.state.selection.main.head,i=K(this.headings,t);i!==this.activeIndex&&(this.activeIndex>=0&&this.items[this.activeIndex]&&this.items[this.activeIndex].classList.remove("meo-active"),this.activeIndex=i,i>=0&&this.items[i]&&(this.items[i].classList.add("meo-active"),this.ensureItemVisible(this.items[i])))}injectStyles(){if(document.getElementById(x))return;const t=document.createElement("style");t.id=x,t.textContent=et,document.head.appendChild(t)}buildSidebar(){const t=document.createElement("div");t.className="meo-sidebar",t.setAttribute("data-position",this.settings.position),t.style.setProperty("--meo-width",`${this.settings.width}px`),t.style.width=`${this.settings.width}px`;const i=document.createElement("div");i.className="meo-header";const o=document.createElement("span");o.className="meo-title",o.textContent="Outline",i.append(o);const n=document.createElement("div");n.className="meo-list",n.setAttribute("role","tree"),n.addEventListener("click",a=>this.onListClick(a));const r=document.createElement("div");r.className="meo-empty",r.textContent="No headings in this document.",r.style.display="none",t.append(i,n,r),document.body.appendChild(t),this.root=t,this.list=n,this.empty=r}renderList(){if(this.list.textContent="",this.items=[],this.activeIndex=-1,this.headings.length===0){this.empty.style.display="";return}this.empty.style.display="none";const t=document.createDocumentFragment();this.headings.forEach((i,o)=>{const n=document.createElement("button");n.className="meo-item",n.setAttribute("data-level",String(i.level)),n.setAttribute("data-index",String(o)),n.title=i.title,n.textContent=i.title,this.items.push(n),t.appendChild(n)}),this.list.appendChild(t)}onListClick(t){var n;const i=(n=t.target)==null?void 0:n.closest(".meo-item");if(i===null)return;const o=parseInt(i.getAttribute("data-index")??"",10);Number.isNaN(o)||Y(this.headings,o,this.settings.syncPreviewScroll)}ensureItemVisible(t){const i=this.list.scrollTop,o=i+this.list.clientHeight,n=t.offsetTop-this.list.offsetTop,r=n+t.offsetHeight;n<i?this.list.scrollTop=n-4:r>o&&(this.list.scrollTop=r-this.list.clientHeight+4)}pushEditor(t){if(!this.settings.pushEditor)return;const i=this.settings.width,o=this.settings.position==="right",n=document.body.style,r=document.documentElement.style;t?(n.width=`calc(100vw - ${i}px)`,n.marginLeft=o?"":`${i}px`,n.marginRight="",r.setProperty("--markedit-content-inset",o?`0 ${i}px 0 0`:`0 0 0 ${i}px`)):(n.width="",n.marginLeft="",n.marginRight="",r.removeProperty("--markedit-content-inset")),s.MarkEdit.editorView.requestMeasure()}applyTheme(){if(!this.mounted)return;const t=s.MarkEdit.editorView,i=getComputedStyle(t.dom),o=getComputedStyle(t.contentDOM??t.dom),n=E([i.backgroundColor,getComputedStyle(document.body).backgroundColor])??"#ffffff",r=E([o.color,i.color])??"#1a1a1a",a=nt(n),l=($,j)=>this.root.style.setProperty($,j);l("--meo-bg",a?h(n,8):"#fafafa"),l("--meo-fg",r),l("--meo-hover",a?h(n,22):"#f0f0f0"),l("--meo-active-bg",a?h(n,32):"#e8e8e8"),l("--meo-accent","AccentColor"),document.documentElement.style.setProperty("--meo-flash",a?"rgba(255, 214, 92, 0.60)":"rgba(255, 209, 71, 0.60)")}}function ot(){try{const e=localStorage.getItem(M);if(e==="1")return!0;if(e==="0")return!1}catch{}}function E(e){for(const t of e){const i=y(t);if(i!==void 0&&i.a>.05)return t}}function h(e,t){const i=y(e);if(i===void 0)return e;const o=n=>Math.max(0,Math.min(255,Math.round(n+t)));return`rgb(${o(i.r)}, ${o(i.g)}, ${o(i.b)})`}function nt(e){const t=y(e);return t===void 0?matchMedia("(prefers-color-scheme: dark)").matches:(.299*t.r+.587*t.g+.114*t.b)/255<.5}function y(e){const t=/rgba?\(([^)]+)\)/.exec(e);if(t===null)return;const i=t[1].split(",").map(o=>parseFloat(o.trim()));if(!(i.length<3||i.some(o=>Number.isNaN(o))))return{r:i[0],g:i[1],b:i[2],a:i.length>=4?i[3]:1}}const rt="settings.json",u="editor.customToolbarItems";function T(){return`${s.MarkEdit.getDirectoryPath("documents")}/${rt}`}function A(e){return{title:"Outline",icon:e.position==="left"?"sidebar.left":"sidebar.right",actionName:g}}function I(e){return typeof e=="object"&&e!==null&&e.actionName===g}async function O(){const e=await s.MarkEdit.getFileContent(T());if(e===void 0||e.trim().length===0)return{};try{const t=JSON.parse(e);return typeof t!="object"||t===null||Array.isArray(t)?void 0:t}catch{return}}async function L(e){return s.MarkEdit.createFile({path:T(),string:`${JSON.stringify(e,null,2)}
`,overwrites:!0})}async function N(e){await s.MarkEdit.showAlert({title:"Couldn't update settings.json automatically",message:`Your settings.json couldn't be parsed as JSON, so it was left untouched.

Add this object to the "${u}" array yourself:

${JSON.stringify(e)}`,buttons:["OK"]})}async function st(e){const t=A(e),i=await O();if(i===void 0){await N(t);return}const o=Array.isArray(i[u])?i[u]:[];if(o.some(I)){await s.MarkEdit.showAlert({title:"Toolbar button already configured",message:`A toolbar toggle for the Outline Sidebar is already in your settings.json.

If you don’t see it, restart MarkEdit and add it via View → Customize Toolbar….`,buttons:["OK"]});return}i[u]=[...o,t];const n=await L(i);await s.MarkEdit.showAlert({title:n?"Toolbar button added":"Failed to write settings.json",message:n?"Restart MarkEdit, then drag the “Outline” item into the toolbar via View → Customize Toolbar…. Clicking it toggles the sidebar.":`Could not write settings.json. Check permissions in the MarkEdit Documents folder, or add this item to "${u}" manually:

${JSON.stringify(t)}`,buttons:["OK"]})}async function at(e){const t=await O();if(t===void 0){await N(A(e));return}const i=Array.isArray(t[u])?t[u]:[],o=i.filter(r=>!I(r));if(o.length===i.length){await s.MarkEdit.showAlert({title:"Nothing to remove",message:"No Outline Sidebar toolbar item was found in settings.json.",buttons:["OK"]});return}o.length===0?delete t[u]:t[u]=o;const n=await L(t);await s.MarkEdit.showAlert({title:n?"Toolbar button removed":"Failed to write settings.json",message:n?"Restart MarkEdit to apply. You can also remove it from the toolbar via View → Customize Toolbar….":"Could not write settings.json.",buttons:["OK"]})}function lt(e,t){s.MarkEdit.addMainMenuItem({title:"Outline Sidebar",children:[{title:g,key:e.shortcut.key,modifiers:e.shortcut.modifiers,action:()=>t.toggle(),state:()=>({isSelected:t.isOpen()})},{separator:!0},{title:"Add Toolbar Button to settings.json…",action:()=>void st(e)},{title:"Remove Toolbar Button…",action:()=>void at(e)}]})}const V=R(),m=new it(V);lt(V,m);let f;s.MarkEdit.addExtension(S.EditorView.updateListener.of(e=>{e.docChanged?(f!==void 0&&clearTimeout(f),f=setTimeout(()=>m.refresh(),250)):e.selectionSet&&m.updateActive()}));let k=!1;function P(){k||(k=!0,m.mount(),m.shouldStartOpen()&&m.open())}s.MarkEdit.onEditorReady(()=>P());try{s.MarkEdit.editorView!==void 0&&P()}catch{}
