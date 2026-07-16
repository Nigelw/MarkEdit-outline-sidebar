"use strict";var T=Object.defineProperty;var C=(i,t,e)=>t in i?T(i,t,{enumerable:!0,configurable:!0,writable:!0,value:e}):i[t]=e;var a=(i,t,e)=>C(i,typeof t!="symbol"?t+"":t,e);const d=require("markedit-api"),v=require("@codemirror/view"),g=require("@codemirror/language"),B=require("@codemirror/state"),c={position:"right",width:280,openByDefault:!1,showToggleButton:!0,pushEditor:!0,syncPreviewScroll:!0,shortcut:{key:"l",modifiers:["Command","Shift"]}},M=["Shift","Control","Command","Option"];function I(){var e;let i={};try{const o=(e=d.MarkEdit.userSettings)==null?void 0:e["outline-sidebar"];o&&typeof o=="object"&&(i=o)}catch{}const t=(()=>{const o=i.shortcut;if(!o||typeof o!="object")return c.shortcut;const n=o,s=typeof n.key=="string"&&n.key.length>0?n.key:c.shortcut.key,r=Array.isArray(n.modifiers)?n.modifiers.filter(l=>M.includes(l)):c.shortcut.modifiers;return{key:s,modifiers:r.length>0?r:c.shortcut.modifiers}})();return{position:i.position==="left"?"left":c.position,width:O(i.width,160,600,c.width),openByDefault:m(i.openByDefault,c.openByDefault),showToggleButton:m(i.showToggleButton,c.showToggleButton),pushEditor:m(i.pushEditor,c.pushEditor),syncPreviewScroll:m(i.syncPreviewScroll,c.syncPreviewScroll),shortcut:t}}function m(i,t){return typeof i=="boolean"?i:t}function O(i,t,e,o){return typeof i!="number"||!Number.isFinite(i)?o:Math.min(e,Math.max(t,i))}const L=/^(?:ATX|Setext)Heading([1-6])$/;function N(i){const t=g.ensureSyntaxTree(i,i.doc.length,300)??g.syntaxTree(i),e=[];return t.iterate({from:0,to:i.doc.length,enter:o=>{const n=L.exec(o.name);if(n===null)return;const s=i.sliceDoc(o.from,o.to),r=o.name.startsWith("Setext");let l;r?l=s.split(i.lineBreak)[0].trim():l=s.replace(/^\s{0,3}#+\s+/,"").replace(/\s+#+\s*$/,"").trim(),e.push({title:l.length>0?l:"(untitled)",level:parseInt(n[1],10),from:o.from,to:o.to})}}),e}function A(i,t){let e=-1;for(let o=0;o<i.length&&t>=i[o].from;o++)e=o;return e}function D(i,t,e){const o=i[t];if(o===void 0)return;const n=d.MarkEdit.editorView,s=Math.max(0,Math.min(o.from,n.state.doc.length));n.dispatch({selection:B.EditorSelection.cursor(s),effects:v.EditorView.scrollIntoView(s,{y:"start",yMargin:8})}),H(n)&&n.focus(),e&&P(i,t)}function H(i){return i.scrollDOM.clientHeight>0&&i.scrollDOM.clientWidth>0}function P(i,t){try{const e=V();if(e.length===0)return;let o;if(e.length===i.length&&(o=e[t]),o===void 0){const n=f(i[t].title);o=e.find(s=>f(s.textContent??"")===n)}o==null||o.scrollIntoView({block:"start",behavior:"auto"})}catch{}}function V(){return Array.from(document.querySelectorAll(".markdown-body h1, .markdown-body h2, .markdown-body h3, .markdown-body h4, .markdown-body h5, .markdown-body h6")).filter($)}function $(i){return i.offsetWidth>0||i.offsetHeight>0||i.getClientRects().length>0}function f(i){return i.replace(/\s+/g," ").trim().toLowerCase()}const y="markedit-outline-styles",j=`
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

.meo-toggle {
  position: fixed;
  top: 8px;
  z-index: 2147483001;
  width: 30px;
  height: 30px;
  border-radius: 7px;
  border: 1px solid var(--meo-border, rgba(127, 127, 127, 0.25));
  background: var(--meo-bg, #ffffff);
  color: var(--meo-fg, #1a1a1a);
  opacity: 0.8;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 0;
  box-shadow: 0 1px 4px rgba(0, 0, 0, 0.12);
  transition: opacity 120ms ease, right 180ms ease, left 180ms ease;
}
.meo-toggle:hover {
  opacity: 1;
}
.meo-toggle svg {
  width: 16px;
  height: 16px;
  display: block;
}
`,q=`
<svg viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
  <circle cx="2.5" cy="4" r="1.1" fill="currentColor"/>
  <circle cx="2.5" cy="8" r="1.1" fill="currentColor"/>
  <circle cx="2.5" cy="12" r="1.1" fill="currentColor"/>
  <rect x="5.5" y="3.3" width="8.5" height="1.4" rx="0.7" fill="currentColor"/>
  <rect x="5.5" y="7.3" width="8.5" height="1.4" rx="0.7" fill="currentColor"/>
  <rect x="5.5" y="11.3" width="8.5" height="1.4" rx="0.7" fill="currentColor"/>
</svg>`;class z{constructor(t){a(this,"settings");a(this,"mounted",!1);a(this,"opened",!1);a(this,"root");a(this,"list");a(this,"empty");a(this,"toggleButton");a(this,"headings",[]);a(this,"items",[]);a(this,"activeIndex",-1);this.settings=t}mount(){this.mounted||(this.mounted=!0,this.injectStyles(),this.buildSidebar(),this.settings.showToggleButton&&this.buildToggleButton(),this.applyTheme(),matchMedia("(prefers-color-scheme: dark)").addEventListener("change",()=>this.applyTheme()))}isOpen(){return this.opened}open(){!this.mounted||this.opened||(this.opened=!0,this.applyTheme(),this.refresh(),this.root.classList.add("meo-open"),this.pushEditor(!0),this.positionToggleButton())}close(){!this.mounted||!this.opened||(this.opened=!1,this.root.classList.remove("meo-open"),this.pushEditor(!1),this.positionToggleButton())}toggle(){this.opened?this.close():this.open()}refresh(){this.mounted&&this.opened&&(this.headings=N(d.MarkEdit.editorView.state),this.renderList(),this.updateActive())}updateActive(){if(!this.mounted||!this.opened||this.items.length===0)return;const t=d.MarkEdit.editorView.state.selection.main.head,e=A(this.headings,t);e!==this.activeIndex&&(this.activeIndex>=0&&this.items[this.activeIndex]&&this.items[this.activeIndex].classList.remove("meo-active"),this.activeIndex=e,e>=0&&this.items[e]&&(this.items[e].classList.add("meo-active"),this.ensureItemVisible(this.items[e])))}injectStyles(){if(document.getElementById(y))return;const t=document.createElement("style");t.id=y,t.textContent=j,document.head.appendChild(t)}buildSidebar(){const t=document.createElement("div");t.className="meo-sidebar",t.setAttribute("data-position",this.settings.position),t.style.setProperty("--meo-width",`${this.settings.width}px`),t.style.width=`${this.settings.width}px`;const e=document.createElement("div");e.className="meo-header";const o=document.createElement("span");o.className="meo-title",o.textContent="Outline";const n=document.createElement("button");n.className="meo-close",n.title="Hide Outline",n.setAttribute("aria-label","Hide Outline"),n.textContent="✕",n.addEventListener("click",()=>this.close()),e.append(o,n);const s=document.createElement("div");s.className="meo-list",s.setAttribute("role","tree"),s.addEventListener("click",l=>this.onListClick(l));const r=document.createElement("div");r.className="meo-empty",r.textContent="No headings in this document.",r.style.display="none",t.append(e,s,r),document.body.appendChild(t),this.root=t,this.list=s,this.empty=r}buildToggleButton(){const t=document.createElement("button");t.className="meo-toggle",t.title="Toggle Outline Sidebar",t.setAttribute("aria-label","Toggle Outline Sidebar"),t.innerHTML=q,t.addEventListener("click",()=>this.toggle()),document.body.appendChild(t),this.toggleButton=t,this.positionToggleButton()}renderList(){if(this.list.textContent="",this.items=[],this.activeIndex=-1,this.headings.length===0){this.empty.style.display="";return}this.empty.style.display="none";const t=document.createDocumentFragment();this.headings.forEach((e,o)=>{const n=document.createElement("button");n.className="meo-item",n.setAttribute("data-level",String(e.level)),n.setAttribute("data-index",String(o)),n.title=e.title,n.textContent=e.title,this.items.push(n),t.appendChild(n)}),this.list.appendChild(t)}onListClick(t){var n;const e=(n=t.target)==null?void 0:n.closest(".meo-item");if(e===null)return;const o=parseInt(e.getAttribute("data-index")??"",10);Number.isNaN(o)||D(this.headings,o,this.settings.syncPreviewScroll)}ensureItemVisible(t){const e=this.list.scrollTop,o=e+this.list.clientHeight,n=t.offsetTop-this.list.offsetTop,s=n+t.offsetHeight;n<e?this.list.scrollTop=n-4:s>o&&(this.list.scrollTop=s-this.list.clientHeight+4)}pushEditor(t){if(!this.settings.pushEditor)return;const e=this.settings.width,o=this.settings.position==="right",n=document.body.style,s=document.documentElement.style;t?(n.width=`calc(100vw - ${e}px)`,n.marginLeft=o?"":`${e}px`,n.marginRight="",s.setProperty("--markedit-content-inset",o?`0 ${e}px 0 0`:`0 0 0 ${e}px`)):(n.width="",n.marginLeft="",n.marginRight="",s.removeProperty("--markedit-content-inset")),d.MarkEdit.editorView.requestMeasure()}positionToggleButton(){if(this.toggleButton===void 0)return;const t=this.opened?this.settings.width+8:8;this.settings.position==="right"?(this.toggleButton.style.right=`${t}px`,this.toggleButton.style.left=""):(this.toggleButton.style.left=`${t}px`,this.toggleButton.style.right="")}applyTheme(){if(!this.mounted)return;const t=d.MarkEdit.editorView,e=getComputedStyle(t.dom),o=getComputedStyle(t.contentDOM??t.dom),n=b([e.backgroundColor,getComputedStyle(document.body).backgroundColor])??"#ffffff",s=b([o.color,e.color])??"#1a1a1a",r=F(n),l=(E,S)=>this.root.style.setProperty(E,S);l("--meo-bg",n),l("--meo-fg",s),l("--meo-border",r?"rgba(255, 255, 255, 0.14)":"rgba(0, 0, 0, 0.12)"),l("--meo-hover",r?"rgba(255, 255, 255, 0.10)":"rgba(0, 0, 0, 0.06)"),l("--meo-active-bg",r?"rgba(255, 255, 255, 0.13)":"rgba(0, 0, 0, 0.06)"),l("--meo-accent","AccentColor"),this.toggleButton!==void 0&&(this.toggleButton.style.setProperty("--meo-bg",n),this.toggleButton.style.setProperty("--meo-fg",s),this.toggleButton.style.setProperty("--meo-border",r?"rgba(255, 255, 255, 0.14)":"rgba(0, 0, 0, 0.12)"))}}function b(i){for(const t of i){const e=w(t);if(e!==void 0&&e.a>.05)return t}}function F(i){const t=w(i);return t===void 0?matchMedia("(prefers-color-scheme: dark)").matches:(.299*t.r+.587*t.g+.114*t.b)/255<.5}function w(i){const t=/rgba?\(([^)]+)\)/.exec(i);if(t===null)return;const e=t[1].split(",").map(o=>parseFloat(o.trim()));if(!(e.length<3||e.some(o=>Number.isNaN(o))))return{r:e[0],g:e[1],b:e[2],a:e.length>=4?e[3]:1}}function R(i,t){d.MarkEdit.addMainMenuItem({title:"Outline Sidebar",icon:i.position==="left"?"sidebar.left":"sidebar.right",children:[{title:"Toggle Outline Sidebar",key:i.shortcut.key,modifiers:i.shortcut.modifiers,action:()=>t.toggle(),state:()=>({isSelected:t.isOpen()})},{separator:!0},{title:"Show Outline",action:()=>t.open(),state:()=>({isEnabled:!t.isOpen()})},{title:"Hide Outline",action:()=>t.close(),state:()=>({isEnabled:t.isOpen()})}]})}const p=I(),h=new z(p);R(p,h);let u;d.MarkEdit.addExtension(v.EditorView.updateListener.of(i=>{i.docChanged?(u!==void 0&&clearTimeout(u),u=setTimeout(()=>h.refresh(),250)):i.selectionSet&&h.updateActive()}));let x=!1;function k(){x||(x=!0,h.mount(),p.openByDefault&&h.open())}d.MarkEdit.onEditorReady(()=>k());try{d.MarkEdit.editorView!==void 0&&k()}catch{}
