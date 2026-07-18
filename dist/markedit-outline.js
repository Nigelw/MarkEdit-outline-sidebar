"use strict";var G=Object.defineProperty;var q=(e,t,i)=>t in e?G(e,t,{enumerable:!0,configurable:!0,writable:!0,value:i}):e[t]=i;var l=(e,t,i)=>q(e,typeof t!="symbol"?t+"":t,i);const s=require("markedit-api"),N=require("@codemirror/view"),S=require("@codemirror/language"),J=require("@codemirror/state"),y="Toggle Outline Sidebar",m="extension.markeditOutlineSidebar",_="markedit-outline.visible",$="markedit-outline.width",R="Nigelw/MarkEdit-outline-sidebar",X=`https://api.github.com/repos/${R}/releases/latest`,Q=`https://raw.githubusercontent.com/${R}/`,Z="markedit-outline.js",x="markedit-outline.updater.last-check",z="markedit-outline.updater.skipped",tt=["automatic","notify","never"],u={position:"right",onLaunch:"remember",shortcut:{key:"l",modifiers:["Command","Shift"]},update:"notify"},et=["Shift","Control","Command","Option"];function it(){var i;let e={};try{const o=(i=s.MarkEdit.userSettings)==null?void 0:i[m];o&&typeof o=="object"&&(e=o)}catch{}const t=(()=>{const o=e.shortcut;if(!o||typeof o!="object")return u.shortcut;const n=o,r=typeof n.key=="string"&&n.key.length>0?n.key:u.shortcut.key,a=Array.isArray(n.modifiers)?n.modifiers.filter(d=>et.includes(d)):u.shortcut.modifiers;return{key:r,modifiers:a.length>0?a:u.shortcut.modifiers}})();return{position:e.position==="left"?"left":u.position,onLaunch:e.onLaunch==="open"||e.onLaunch==="closed"?e.onLaunch:u.onLaunch,shortcut:t,update:tt.includes(e.update)?e.update:u.update}}const ot=/^(?:ATX|Setext)Heading([1-6])$/;function nt(e){const t=S.ensureSyntaxTree(e,e.doc.length,300)??S.syntaxTree(e),i=[];return t.iterate({from:0,to:e.doc.length,enter:o=>{const n=ot.exec(o.name);if(n===null)return;const r=e.sliceDoc(o.from,o.to),a=o.name.startsWith("Setext");let d;a?d=r.split(e.lineBreak)[0].trim():d=r.replace(/^\s{0,3}#+\s+/,"").replace(/\s+#+\s*$/,"").trim(),i.push({title:d.length>0?d:"(untitled)",level:parseInt(n[1],10),from:o.from,to:o.to})}}),i}function rt(e,t){let i=-1;for(let o=0;o<e.length&&t>=e[o].from;o++)i=o;return i}function st(e,t,i){const o=e[t];if(o===void 0)return;const n=s.MarkEdit.editorView,r=Math.max(0,Math.min(o.from,n.state.doc.length));n.dispatch({selection:J.EditorSelection.cursor(r),effects:N.EditorView.scrollIntoView(r,{y:"start",yMargin:8})}),at()||n.focus();{const a=ut(e,t);a!==void 0&&(dt()||(document.querySelectorAll(".markdown-body span.meo-flash").forEach(b),lt(a)),mt(a))}}function at(){const e=document.querySelector(".markdown-body.overlay");return e!==null&&D(e)}function dt(){var e;try{const t=(e=s.MarkEdit.userSettings)==null?void 0:e["extension.markeditPreview"];if(t!==null&&typeof t=="object"){const i=t.syncScroll;if(typeof i=="boolean")return i}}catch{}return!0}function lt(e){const t=ct(e);if(t===void 0){e.scrollIntoView({block:"start",behavior:"auto"});return}const i=8,o=t.scrollTop,n=e.getBoundingClientRect().top-t.getBoundingClientRect().top,r=t.scrollHeight-t.clientHeight,a=Math.max(0,Math.min(r,Math.round(o+n-i)));Math.abs(a-o)>1&&(t.scrollTop=a)}function ct(e){let t=e.parentElement;for(;t!==null&&t!==document.body;){const i=getComputedStyle(t).overflowY;if((i==="auto"||i==="scroll")&&t.scrollHeight>t.clientHeight)return t;t=t.parentElement}}function ut(e,t){const i=ft();if(i.length===0)return;if(i.length===e.length)return i[t];const o=A(e[t].title);return i.find(n=>A(n.textContent??"")===o)}function mt(e){ht(e);const t=document.createElement("span");for(t.className="meo-flash";e.firstChild!==null;)t.appendChild(e.firstChild);e.appendChild(t);const i=()=>{t.removeEventListener("animationend",i),b(t)};t.addEventListener("animationend",i)}function ht(e){e.querySelectorAll(":scope > span.meo-flash").forEach(b)}function b(e){const t=e.parentElement;if(t!==null){for(;e.firstChild!==null;)t.insertBefore(e.firstChild,e);e.remove()}}function ft(){return Array.from(document.querySelectorAll(".markdown-body h1, .markdown-body h2, .markdown-body h3, .markdown-body h4, .markdown-body h5, .markdown-body h6")).filter(D)}function D(e){return e.offsetWidth>0||e.offsetHeight>0||e.getClientRects().length>0}function A(e){return e.replace(/\s+/g," ").trim().toLowerCase()}const T="markedit-outline-styles",pt=`
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

/*
 * MarkEdit draws its active-line indicator (a CodeMirror layer, .cm-md-activeLine)
 * with viewport-based coordinates that assume the editor starts at the window's
 * left edge. A LEFT-docked sidebar shifts the editor right (body margin-left), so
 * the layer over-offsets by exactly the sidebar width — the indicator ends up
 * drawn only on the right, sized by the shift. Translate the layer back by that
 * width to restore a full-width indicator. (Right-docked doesn't move the body's
 * left edge, so it's unaffected and this rule never applies.)
 */
html.meo-push-left .cm-md-activeLine {
  transform: translateX(calc(-1 * var(--meo-width, 0px)));
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

/* Drag handle straddling the sidebar's inner edge, for resizing. */
.meo-resizer {
  position: absolute;
  top: 0;
  bottom: 0;
  width: 9px;
  z-index: 2;
  cursor: col-resize;
}
.meo-sidebar:not(.meo-open) .meo-resizer {
  display: none;
}
.meo-sidebar[data-position="right"] .meo-resizer { left: -4px; }
.meo-sidebar[data-position="left"] .meo-resizer { right: -4px; }
.meo-resizer::after {
  content: "";
  position: absolute;
  top: 0;
  bottom: 0;
  width: 2px;
  background: transparent;
  transition: background 120ms ease;
}
.meo-sidebar[data-position="right"] .meo-resizer::after { left: 3px; }
.meo-sidebar[data-position="left"] .meo-resizer::after { right: 3px; }
.meo-resizer:hover::after,
.meo-resizer.meo-dragging::after {
  background: var(--meo-accent, AccentColor);
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
`,gt=280,M=160;class yt{constructor(t){l(this,"settings");l(this,"mounted",!1);l(this,"opened",!1);l(this,"width");l(this,"root");l(this,"list");l(this,"empty");l(this,"resizer");l(this,"headings",[]);l(this,"items",[]);l(this,"activeIndex",-1);this.settings=t,this.width=gt}mount(){if(this.mounted)return;this.mounted=!0,this.injectStyles(),this.buildSidebar();const t=bt();t!==void 0&&this.setWidth(t,!1),this.applyTheme(),matchMedia("(prefers-color-scheme: dark)").addEventListener("change",()=>this.applyTheme())}isOpen(){return this.opened}shouldStartOpen(){switch(this.settings.onLaunch){case"open":return!0;case"closed":return!1;case"remember":return wt()??!1}}open(){!this.mounted||this.opened||(this.opened=!0,this.applyTheme(),this.refresh(),this.root.classList.add("meo-open"),this.pushEditor(!0),this.persistVisibility())}close(){!this.mounted||!this.opened||(this.opened=!1,this.root.classList.remove("meo-open"),this.pushEditor(!1),this.persistVisibility())}persistVisibility(){if(this.settings.onLaunch==="remember")try{localStorage.setItem(_,this.opened?"1":"0")}catch{}}toggle(){this.opened?this.close():this.open()}refresh(){this.mounted&&this.opened&&(this.headings=nt(s.MarkEdit.editorView.state),this.renderList(),this.updateActive())}updateActive(){if(!this.mounted||!this.opened||this.items.length===0)return;const t=s.MarkEdit.editorView.state.selection.main.head,i=rt(this.headings,t);i!==this.activeIndex&&(this.activeIndex>=0&&this.items[this.activeIndex]&&this.items[this.activeIndex].classList.remove("meo-active"),this.activeIndex=i,i>=0&&this.items[i]&&(this.items[i].classList.add("meo-active"),this.ensureItemVisible(this.items[i])))}injectStyles(){if(document.getElementById(T))return;const t=document.createElement("style");t.id=T,t.textContent=pt,document.head.appendChild(t)}buildSidebar(){const t=document.createElement("div");t.className="meo-sidebar",t.setAttribute("data-position",this.settings.position),t.style.setProperty("--meo-width",`${this.width}px`),t.style.width=`${this.width}px`;const i=document.createElement("div");i.className="meo-header";const o=document.createElement("span");o.className="meo-title",o.textContent="Outline",i.append(o);const n=document.createElement("div");n.className="meo-list",n.setAttribute("role","tree"),n.addEventListener("click",d=>this.onListClick(d));const r=document.createElement("div");r.className="meo-empty",r.textContent="No headings in this document.",r.style.display="none";const a=document.createElement("div");a.className="meo-resizer",a.title="Drag to resize",a.addEventListener("mousedown",d=>this.startResize(d)),t.append(i,n,r,a),document.body.appendChild(t),this.root=t,this.list=n,this.empty=r,this.resizer=a}maxWidth(){return Math.max(M,Math.min(600,window.innerWidth-120))}setWidth(t,i){const o=Math.max(M,Math.min(this.maxWidth(),Math.round(t)));if(this.width=o,this.root.style.width=`${o}px`,this.root.style.setProperty("--meo-width",`${o}px`),this.opened&&this.pushEditor(!0),i)try{localStorage.setItem($,String(o))}catch{}}startResize(t){t.preventDefault();const i=this.settings.position==="right";this.resizer.classList.add("meo-dragging"),document.body.style.cursor="col-resize",document.documentElement.style.userSelect="none";const o=r=>{const a=i?window.innerWidth-r.clientX:r.clientX;this.setWidth(a,!1)},n=()=>{document.removeEventListener("mousemove",o),document.removeEventListener("mouseup",n),this.resizer.classList.remove("meo-dragging"),document.body.style.cursor="",document.documentElement.style.userSelect="",this.setWidth(this.width,!0)};document.addEventListener("mousemove",o),document.addEventListener("mouseup",n)}renderList(){if(this.list.textContent="",this.items=[],this.activeIndex=-1,this.headings.length===0){this.empty.style.display="";return}this.empty.style.display="none";const t=document.createDocumentFragment();this.headings.forEach((i,o)=>{const n=document.createElement("button");n.className="meo-item",n.setAttribute("data-level",String(i.level)),n.setAttribute("data-index",String(o)),n.title=i.title,n.textContent=i.title,this.items.push(n),t.appendChild(n)}),this.list.appendChild(t)}onListClick(t){var n;const i=(n=t.target)==null?void 0:n.closest(".meo-item");if(i===null)return;const o=parseInt(i.getAttribute("data-index")??"",10);Number.isNaN(o)||st(this.headings,o)}ensureItemVisible(t){const i=this.list.scrollTop,o=i+this.list.clientHeight,n=t.offsetTop-this.list.offsetTop,r=n+t.offsetHeight;n<i?this.list.scrollTop=n-4:r>o&&(this.list.scrollTop=r-this.list.clientHeight+4)}pushEditor(t){const i=this.width,o=this.settings.position==="right",n=document.body.style,r=document.documentElement.style;t?(n.width=`calc(100vw - ${i}px)`,n.marginLeft=o?"":`${i}px`,n.marginRight="",r.setProperty("--markedit-content-inset",o?`0 ${i}px 0 0`:`0 0 0 ${i}px`),r.setProperty("--meo-width",`${i}px`),document.documentElement.classList.toggle("meo-push-left",!o)):(n.width="",n.marginLeft="",n.marginRight="",r.removeProperty("--markedit-content-inset"),document.documentElement.classList.remove("meo-push-left")),s.MarkEdit.editorView.requestMeasure()}applyTheme(){if(!this.mounted)return;const t=s.MarkEdit.editorView,i=getComputedStyle(t.dom),o=getComputedStyle(t.contentDOM??t.dom),n=C([i.backgroundColor,getComputedStyle(document.body).backgroundColor])??"#ffffff",r=C([o.color,i.color])??"#1a1a1a",a=vt(n),d=(W,Y)=>this.root.style.setProperty(W,Y);d("--meo-bg",a?f(n,8):"#fafafa"),d("--meo-fg",r),d("--meo-hover",a?f(n,22):"#f0f0f0"),d("--meo-active-bg",a?f(n,32):"#e8e8e8"),d("--meo-accent","AccentColor"),document.documentElement.style.setProperty("--meo-flash",a?"rgba(255, 214, 92, 0.60)":"rgba(255, 209, 71, 0.60)")}}function bt(){try{const e=localStorage.getItem($);if(e!==null){const t=parseInt(e,10);if(Number.isFinite(t)&&t>0)return t}}catch{}}function wt(){try{const e=localStorage.getItem(_);if(e==="1")return!0;if(e==="0")return!1}catch{}}function C(e){for(const t of e){const i=w(t);if(i!==void 0&&i.a>.05)return t}}function f(e,t){const i=w(e);if(i===void 0)return e;const o=n=>Math.max(0,Math.min(255,Math.round(n+t)));return`rgb(${o(i.r)}, ${o(i.g)}, ${o(i.b)})`}function vt(e){const t=w(e);return t===void 0?matchMedia("(prefers-color-scheme: dark)").matches:(.299*t.r+.587*t.g+.114*t.b)/255<.5}function w(e){const t=/rgba?\(([^)]+)\)/.exec(e);if(t===null)return;const i=t[1].split(",").map(o=>parseFloat(o.trim()));if(!(i.length<3||i.some(o=>Number.isNaN(o))))return{r:i[0],g:i[1],b:i[2],a:i.length>=4?i[3]:1}}const Et="settings.json";function V(){return`${s.MarkEdit.getDirectoryPath("documents")}/${Et}`}async function v(){const e=await s.MarkEdit.getFileContent(V());if(e===void 0||e.trim().length===0)return{};try{const t=JSON.parse(e);return typeof t!="object"||t===null||Array.isArray(t)?void 0:t}catch{return}}async function E(e){return s.MarkEdit.createFile({path:V(),string:`${JSON.stringify(e,null,2)}
`,overwrites:!0})}const c="editor.customToolbarItems";function j(){return{title:"Outline",icon:"list.bullet.rectangle.portrait",actionName:y}}function H(e){return typeof e=="object"&&e!==null&&e.actionName===y}async function P(e){await s.MarkEdit.showAlert({title:"Couldn't update settings.json automatically",message:`Your settings.json couldn't be parsed as JSON, so it was left untouched.

Add this object to the "${c}" array yourself:

${JSON.stringify(e)}`,buttons:["OK"]})}async function kt(){const e=j(),t=await v();if(t===void 0){await P(e);return}const i=Array.isArray(t[c])?t[c]:[];if(i.some(H)){await s.MarkEdit.showAlert({title:"Toolbar button already configured",message:`A toolbar toggle for the Outline Sidebar is already in your settings.json.

If you don’t see it, restart MarkEdit and add it via View → Customize Toolbar….`,buttons:["OK"]});return}t[c]=[...i,e];const o=await E(t);await s.MarkEdit.showAlert({title:o?"Toolbar button added":"Failed to write settings.json",message:o?"Restart MarkEdit, then drag the “Outline” item into the toolbar via View → Customize Toolbar…. Clicking it toggles the sidebar.":`Could not write settings.json. Check permissions in the MarkEdit Documents folder, or add this item to "${c}" manually:

${JSON.stringify(e)}`,buttons:["OK"]})}async function St(){const e=await v();if(e===void 0){await P(j());return}const t=Array.isArray(e[c])?e[c]:[],i=t.filter(n=>!H(n));if(i.length===t.length){await s.MarkEdit.showAlert({title:"Nothing to remove",message:"No Outline Sidebar toolbar item was found in settings.json.",buttons:["OK"]});return}i.length===0?delete e[c]:e[c]=i;const o=await E(e);await s.MarkEdit.showAlert({title:o?"Toolbar button removed":"Failed to write settings.json",message:o?"Restart MarkEdit to apply. You can also remove it from the toolbar via View → Customize Toolbar….":"Could not write settings.json.",buttons:["OK"]})}async function O(e,t){const i=e==="left"?"left":"right",o=await v();if(o===void 0){await s.MarkEdit.showAlert({title:"Couldn't update settings.json",message:`Your settings.json couldn't be parsed as JSON, so it was left untouched.

Set "position": "${e}" under "${m}" yourself.`,buttons:["OK"]});return}const n=typeof o[m]=="object"&&o[m]!==null?o[m]:{};if(o[m]={...n,position:e},!await E(o)){await s.MarkEdit.showAlert({title:"Failed to write settings.json",message:`Could not write settings.json. Check permissions in the MarkEdit Documents folder, or set "position": "${e}" under "${m}" manually.`,buttons:["OK"]});return}await s.MarkEdit.showAlert(e===t?{title:`Docked on the ${i}`,message:`The Outline Sidebar is already on the ${i}.`,buttons:["OK"]}:{title:"Restart to apply",message:`Restart MarkEdit to move the Outline Sidebar to the ${i}.`,buttons:["OK"]})}const g="1.0.0",xt=24*60*60*1e3;function I(e){const t=e.trim().match(/^v?(\d+(?:\.\d+)*)/);if(t!==null)return t[1].split(".").map(i=>parseInt(i,10))}function At(e,t){const i=I(e),o=I(t);if(i===void 0||o===void 0)return e!==t;const n=Math.max(i.length,o.length);for(let r=0;r<n;r++){const a=(i[r]??0)-(o[r]??0);if(a!==0)return a>0}return!1}function F(){try{const e=localStorage.getItem(z),t=JSON.parse(e??"[]");return new Set(Array.isArray(t)?t.map(String):[])}catch{return new Set}}function Tt(e){const t=F();t.add(e),localStorage.setItem(z,JSON.stringify([...t]))}async function Mt(){const e=await fetch(X);if(!e.ok)return;const t=await e.json();return typeof t.tag_name=="string"?t:void 0}async function Ct(e){const t=__FILE_PATH__;if(typeof t!="string")return console.error("Outline Sidebar updater: unknown script path, cannot install."),!1;const i=`${Q}refs/tags/${encodeURIComponent(e)}/dist/${Z}`;try{const o=await fetch(i);if(!o.ok)return console.error(`Outline Sidebar updater: failed to download ${i} (${o.status}).`),!1;const n=await o.text();return s.MarkEdit.createFile({path:t,string:n,overwrites:!0})}catch(o){return console.error("Outline Sidebar updater: download failed:",o),!1}}async function K(e){const t=await Ct(e.tag_name);await s.MarkEdit.showAlert(t?{title:`Updated to ${e.tag_name}`,message:"Restart MarkEdit to start using the new version of the Outline Sidebar.",buttons:["OK"]}:{title:"Update failed",message:"The Outline Sidebar couldn't download the latest build. Check your connection and try again from Extensions → Outline Sidebar → Check for Updates….",buttons:["OK"]})}async function Ot(e){const t=await s.MarkEdit.showAlert({title:`Outline Sidebar ${e.tag_name} is available`,message:`You have ${g}. Update now?`,buttons:["Update Now","Skip This Version","Later"]});t===0?await K(e):t===1&&Tt(e.tag_name)}async function U(e,t=!1){if(e==="never"&&!t)return;if(!t){const n=Number(localStorage.getItem(x)??"0");if(Date.now()-n<xt)return;localStorage.setItem(x,String(Date.now()))}let i;try{i=await Mt()}catch(n){console.error("Outline Sidebar updater: failed to check for updates:",n),t&&await s.MarkEdit.showAlert({title:"Update check failed",message:"Couldn't reach GitHub to check for updates. Please try again later.",buttons:["OK"]});return}if(i===void 0||!At(i.tag_name,g)){t&&await s.MarkEdit.showAlert({title:"You're up to date",message:`Outline Sidebar ${g} is the latest version.`,buttons:["OK"]});return}!t&&F().has(i.tag_name)||(e==="automatic"&&!t?await K(i):await Ot(i))}function It(e,t){s.MarkEdit.addMainMenuItem({title:"Outline Sidebar",children:[{title:y,key:e.shortcut.key,modifiers:e.shortcut.modifiers,action:()=>t.toggle(),state:()=>({isSelected:t.isOpen()})},{separator:!0},{title:"Dock Left",action:()=>void O("left",e.position),state:()=>({isSelected:e.position==="left"})},{title:"Dock Right",action:()=>void O("right",e.position),state:()=>({isSelected:e.position==="right"})},{separator:!0},{title:"Add Toolbar Button to settings.json",action:()=>void kt()},{title:"Remove Toolbar Button",action:()=>void St()},{separator:!0},{title:"Check for Updates…",action:()=>void U(e.update,!0)}]})}const k=it(),h=new yt(k);It(k,h);s.MarkEdit.onAppReady(()=>{setTimeout(()=>void U(k.update),2e3)});let p;s.MarkEdit.addExtension(N.EditorView.updateListener.of(e=>{e.docChanged?(p!==void 0&&clearTimeout(p),p=setTimeout(()=>h.refresh(),250)):e.selectionSet&&h.updateActive()}));let L=!1;function B(){L||(L=!0,h.mount(),h.shouldStartOpen()&&h.open())}s.MarkEdit.onEditorReady(()=>B());try{s.MarkEdit.editorView!==void 0&&B()}catch{}
