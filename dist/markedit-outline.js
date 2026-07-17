"use strict";var j=Object.defineProperty;var H=(e,t,i)=>t in e?j(e,t,{enumerable:!0,configurable:!0,writable:!0,value:i}):e[t]=i;var d=(e,t,i)=>H(e,typeof t!="symbol"?t+"":t,i);const s=require("markedit-api"),x=require("@codemirror/view"),f=require("@codemirror/language"),$=require("@codemirror/state"),c={position:"right",width:280,onLaunch:"remember",pushEditor:!0,syncPreviewScroll:!0,shortcut:{key:"l",modifiers:["Command","Shift"]}},D=["Shift","Control","Command","Option"];function P(){var i;let e={};try{const o=(i=s.MarkEdit.userSettings)==null?void 0:i["outline-sidebar"];o&&typeof o=="object"&&(e=o)}catch{}const t=(()=>{const o=e.shortcut;if(!o||typeof o!="object")return c.shortcut;const n=o,r=typeof n.key=="string"&&n.key.length>0?n.key:c.shortcut.key,l=Array.isArray(n.modifiers)?n.modifiers.filter(a=>D.includes(a)):c.shortcut.modifiers;return{key:r,modifiers:l.length>0?l:c.shortcut.modifiers}})();return{position:e.position==="left"?"left":c.position,width:F(e.width,160,600,c.width),onLaunch:e.onLaunch==="open"||e.onLaunch==="closed"?e.onLaunch:c.onLaunch,pushEditor:g(e.pushEditor,c.pushEditor),syncPreviewScroll:g(e.syncPreviewScroll,c.syncPreviewScroll),shortcut:t}}function g(e,t){return typeof e=="boolean"?e:t}function F(e,t,i,o){return typeof e!="number"||!Number.isFinite(e)?o:Math.min(i,Math.max(t,e))}const B=/^(?:ATX|Setext)Heading([1-6])$/;function R(e){const t=f.ensureSyntaxTree(e,e.doc.length,300)??f.syntaxTree(e),i=[];return t.iterate({from:0,to:e.doc.length,enter:o=>{const n=B.exec(o.name);if(n===null)return;const r=e.sliceDoc(o.from,o.to),l=o.name.startsWith("Setext");let a;l?a=r.split(e.lineBreak)[0].trim():a=r.replace(/^\s{0,3}#+\s+/,"").replace(/\s+#+\s*$/,"").trim(),i.push({title:a.length>0?a:"(untitled)",level:parseInt(n[1],10),from:o.from,to:o.to})}}),i}function _(e,t){let i=-1;for(let o=0;o<e.length&&t>=e[o].from;o++)i=o;return i}function z(e,t,i){const o=e[t];if(o===void 0)return;const n=s.MarkEdit.editorView,r=Math.max(0,Math.min(o.from,n.state.doc.length));n.dispatch({selection:$.EditorSelection.cursor(r),effects:x.EditorView.scrollIntoView(r,{y:"start",yMargin:8})}),q(n)&&n.focus(),i&&K(e,t)}function q(e){return e.scrollDOM.clientHeight>0&&e.scrollDOM.clientWidth>0}function K(e,t){try{const i=G();if(i.length===0)return;let o;if(i.length===e.length&&(o=i[t]),o===void 0){const n=b(e[t].title);o=i.find(r=>b(r.textContent??"")===n)}o==null||o.scrollIntoView({block:"start",behavior:"auto"})}catch{}}function G(){return Array.from(document.querySelectorAll(".markdown-body h1, .markdown-body h2, .markdown-body h3, .markdown-body h4, .markdown-body h5, .markdown-body h6")).filter(J)}function J(e){return e.offsetWidth>0||e.offsetHeight>0||e.getClientRects().length>0}function b(e){return e.replace(/\s+/g," ").trim().toLowerCase()}const y="markedit-outline-styles",Y=`
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
  justify-content: space-between;
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
.meo-close {
  appearance: none;
  border: none;
  background: transparent;
  color: inherit;
  opacity: 0.55;
  cursor: pointer;
  width: 22px;
  height: 22px;
  border-radius: 5px;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 0;
}
.meo-close:hover {
  opacity: 1;
  background: var(--meo-hover, rgba(127, 127, 127, 0.16));
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
`,p="Toggle Outline Sidebar",E="markedit-outline.visible";class X{constructor(t){d(this,"settings");d(this,"mounted",!1);d(this,"opened",!1);d(this,"root");d(this,"list");d(this,"empty");d(this,"headings",[]);d(this,"items",[]);d(this,"activeIndex",-1);this.settings=t}mount(){this.mounted||(this.mounted=!0,this.injectStyles(),this.buildSidebar(),this.applyTheme(),matchMedia("(prefers-color-scheme: dark)").addEventListener("change",()=>this.applyTheme()))}isOpen(){return this.opened}shouldStartOpen(){switch(this.settings.onLaunch){case"open":return!0;case"closed":return!1;case"remember":return W()??!1}}open(){!this.mounted||this.opened||(this.opened=!0,this.applyTheme(),this.refresh(),this.root.classList.add("meo-open"),this.pushEditor(!0),this.persistVisibility())}close(){!this.mounted||!this.opened||(this.opened=!1,this.root.classList.remove("meo-open"),this.pushEditor(!1),this.persistVisibility())}persistVisibility(){if(this.settings.onLaunch==="remember")try{localStorage.setItem(E,this.opened?"1":"0")}catch{}}toggle(){this.opened?this.close():this.open()}refresh(){this.mounted&&this.opened&&(this.headings=R(s.MarkEdit.editorView.state),this.renderList(),this.updateActive())}updateActive(){if(!this.mounted||!this.opened||this.items.length===0)return;const t=s.MarkEdit.editorView.state.selection.main.head,i=_(this.headings,t);i!==this.activeIndex&&(this.activeIndex>=0&&this.items[this.activeIndex]&&this.items[this.activeIndex].classList.remove("meo-active"),this.activeIndex=i,i>=0&&this.items[i]&&(this.items[i].classList.add("meo-active"),this.ensureItemVisible(this.items[i])))}injectStyles(){if(document.getElementById(y))return;const t=document.createElement("style");t.id=y,t.textContent=Y,document.head.appendChild(t)}buildSidebar(){const t=document.createElement("div");t.className="meo-sidebar",t.setAttribute("data-position",this.settings.position),t.style.setProperty("--meo-width",`${this.settings.width}px`),t.style.width=`${this.settings.width}px`;const i=document.createElement("div");i.className="meo-header";const o=document.createElement("span");o.className="meo-title",o.textContent="Outline";const n=document.createElement("button");n.className="meo-close",n.title="Hide Outline",n.setAttribute("aria-label","Hide Outline"),n.textContent="✕",n.addEventListener("click",()=>this.close()),i.append(o,n);const r=document.createElement("div");r.className="meo-list",r.setAttribute("role","tree"),r.addEventListener("click",a=>this.onListClick(a));const l=document.createElement("div");l.className="meo-empty",l.textContent="No headings in this document.",l.style.display="none",t.append(i,r,l),document.body.appendChild(t),this.root=t,this.list=r,this.empty=l}renderList(){if(this.list.textContent="",this.items=[],this.activeIndex=-1,this.headings.length===0){this.empty.style.display="";return}this.empty.style.display="none";const t=document.createDocumentFragment();this.headings.forEach((i,o)=>{const n=document.createElement("button");n.className="meo-item",n.setAttribute("data-level",String(i.level)),n.setAttribute("data-index",String(o)),n.title=i.title,n.textContent=i.title,this.items.push(n),t.appendChild(n)}),this.list.appendChild(t)}onListClick(t){var n;const i=(n=t.target)==null?void 0:n.closest(".meo-item");if(i===null)return;const o=parseInt(i.getAttribute("data-index")??"",10);Number.isNaN(o)||z(this.headings,o,this.settings.syncPreviewScroll)}ensureItemVisible(t){const i=this.list.scrollTop,o=i+this.list.clientHeight,n=t.offsetTop-this.list.offsetTop,r=n+t.offsetHeight;n<i?this.list.scrollTop=n-4:r>o&&(this.list.scrollTop=r-this.list.clientHeight+4)}pushEditor(t){if(!this.settings.pushEditor)return;const i=this.settings.width,o=this.settings.position==="right",n=document.body.style,r=document.documentElement.style;t?(n.width=`calc(100vw - ${i}px)`,n.marginLeft=o?"":`${i}px`,n.marginRight="",r.setProperty("--markedit-content-inset",o?`0 ${i}px 0 0`:`0 0 0 ${i}px`)):(n.width="",n.marginLeft="",n.marginRight="",r.removeProperty("--markedit-content-inset")),s.MarkEdit.editorView.requestMeasure()}applyTheme(){if(!this.mounted)return;const t=s.MarkEdit.editorView,i=getComputedStyle(t.dom),o=getComputedStyle(t.contentDOM??t.dom),n=v([i.backgroundColor,getComputedStyle(document.body).backgroundColor])??"#ffffff",r=v([o.color,i.color])??"#1a1a1a",l=U(n),a=(N,V)=>this.root.style.setProperty(N,V);a("--meo-bg",n),a("--meo-fg",r),a("--meo-border",l?"rgba(255, 255, 255, 0.14)":"rgba(0, 0, 0, 0.12)"),a("--meo-hover",l?"rgba(255, 255, 255, 0.10)":"rgba(0, 0, 0, 0.06)"),a("--meo-active-bg",l?"rgba(255, 255, 255, 0.13)":"rgba(0, 0, 0, 0.06)"),a("--meo-accent","AccentColor")}}function W(){try{const e=localStorage.getItem(E);if(e==="1")return!0;if(e==="0")return!1}catch{}}function v(e){for(const t of e){const i=k(t);if(i!==void 0&&i.a>.05)return t}}function U(e){const t=k(e);return t===void 0?matchMedia("(prefers-color-scheme: dark)").matches:(.299*t.r+.587*t.g+.114*t.b)/255<.5}function k(e){const t=/rgba?\(([^)]+)\)/.exec(e);if(t===null)return;const i=t[1].split(",").map(o=>parseFloat(o.trim()));if(!(i.length<3||i.some(o=>Number.isNaN(o))))return{r:i[0],g:i[1],b:i[2],a:i.length>=4?i[3]:1}}const Q="settings.json",u="editor.customToolbarItems";function S(){return`${s.MarkEdit.getDirectoryPath("documents")}/${Q}`}function T(e){return{title:"Outline",icon:e.position==="left"?"sidebar.left":"sidebar.right",actionName:p}}function O(e){return typeof e=="object"&&e!==null&&e.actionName===p}async function C(){const e=await s.MarkEdit.getFileContent(S());if(e===void 0||e.trim().length===0)return{};try{const t=JSON.parse(e);return typeof t!="object"||t===null||Array.isArray(t)?void 0:t}catch{return}}async function M(e){return s.MarkEdit.createFile({path:S(),string:`${JSON.stringify(e,null,2)}
`,overwrites:!0})}async function A(e){await s.MarkEdit.showAlert({title:"Couldn't update settings.json automatically",message:`Your settings.json couldn't be parsed as JSON, so it was left untouched.

Add this object to the "${u}" array yourself:

${JSON.stringify(e)}`,buttons:["OK"]})}async function Z(e){const t=T(e),i=await C();if(i===void 0){await A(t);return}const o=Array.isArray(i[u])?i[u]:[];if(o.some(O)){await s.MarkEdit.showAlert({title:"Toolbar button already configured",message:`A toolbar toggle for the Outline Sidebar is already in your settings.json.

If you don’t see it, restart MarkEdit and add it via View → Customize Toolbar….`,buttons:["OK"]});return}i[u]=[...o,t];const n=await M(i);await s.MarkEdit.showAlert({title:n?"Toolbar button added":"Failed to write settings.json",message:n?"Restart MarkEdit, then drag the “Outline” item into the toolbar via View → Customize Toolbar…. Clicking it toggles the sidebar.":`Could not write settings.json. Check permissions in the MarkEdit Documents folder, or add this item to "${u}" manually:

${JSON.stringify(t)}`,buttons:["OK"]})}async function tt(e){const t=await C();if(t===void 0){await A(T(e));return}const i=Array.isArray(t[u])?t[u]:[],o=i.filter(r=>!O(r));if(o.length===i.length){await s.MarkEdit.showAlert({title:"Nothing to remove",message:"No Outline Sidebar toolbar item was found in settings.json.",buttons:["OK"]});return}o.length===0?delete t[u]:t[u]=o;const n=await M(t);await s.MarkEdit.showAlert({title:n?"Toolbar button removed":"Failed to write settings.json",message:n?"Restart MarkEdit to apply. You can also remove it from the toolbar via View → Customize Toolbar….":"Could not write settings.json.",buttons:["OK"]})}function et(e,t){s.MarkEdit.addMainMenuItem({title:"Outline Sidebar",icon:e.position==="left"?"sidebar.left":"sidebar.right",children:[{title:p,key:e.shortcut.key,modifiers:e.shortcut.modifiers,action:()=>t.toggle(),state:()=>({isSelected:t.isOpen()})},{separator:!0},{title:"Show Outline",action:()=>t.open(),state:()=>({isEnabled:!t.isOpen()})},{title:"Hide Outline",action:()=>t.close(),state:()=>({isEnabled:t.isOpen()})},{separator:!0},{title:"Add Toolbar Button to settings.json…",action:()=>void Z(e)},{title:"Remove Toolbar Button…",action:()=>void tt(e)}]})}const I=P(),m=new X(I);et(I,m);let h;s.MarkEdit.addExtension(x.EditorView.updateListener.of(e=>{e.docChanged?(h!==void 0&&clearTimeout(h),h=setTimeout(()=>m.refresh(),250)):e.selectionSet&&m.updateActive()}));let w=!1;function L(){w||(w=!0,m.mount(),m.shouldStartOpen()&&m.open())}s.MarkEdit.onEditorReady(()=>L());try{s.MarkEdit.editorView!==void 0&&L()}catch{}
