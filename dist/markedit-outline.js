"use strict";var nt=Object.defineProperty;var rt=(e,t,i)=>t in e?nt(e,t,{enumerable:!0,configurable:!0,writable:!0,value:i}):e[t]=i;var c=(e,t,i)=>rt(e,typeof t!="symbol"?t+"":t,i);const a=require("markedit-api"),k=require("@codemirror/view"),L=require("@codemirror/language"),st=require("@codemirror/state"),M="Toggle Outline Sidebar",d="extension.markeditOutlineSidebar",W="markedit-outline.visible",q="markedit-outline.width",at="Nigelw/MarkEdit-outline-sidebar",K=`https://github.com/${at}`,lt=`${K}/blob/main/CHANGELOG.md`,m={position:"right",onLaunch:"remember",highlightMode:"scroll",shortcut:{key:"l",modifiers:["Command","Shift"]}},ct=["Shift","Control","Command","Option"];function G(){var i;let e={};try{const o=(i=a.MarkEdit.userSettings)==null?void 0:i[d];o&&typeof o=="object"&&(e=o)}catch{}const t=(()=>{const o=e.shortcut;if(!o||typeof o!="object")return m.shortcut;const n=o,r=typeof n.key=="string"&&n.key.length>0?n.key:m.shortcut.key,s=Array.isArray(n.modifiers)?n.modifiers.filter(l=>ct.includes(l)):m.shortcut.modifiers;return{key:r,modifiers:s.length>0?s:m.shortcut.modifiers}})();return{position:e.position==="left"?"left":m.position,onLaunch:e.onLaunch==="open"||e.onLaunch==="closed"?e.onLaunch:m.onLaunch,highlightMode:e.highlightMode==="insertionPoint"?"insertionPoint":m.highlightMode,shortcut:t}}const dt=/^(?:ATX|Setext)Heading([1-6])$/,ht=1e3;function ut(e){const t=L.ensureSyntaxTree(e,e.doc.length,300),i=t!==null;return mt(e,i?t:L.syntaxTree(e),i)}function mt(e,t,i){const o=[];let n=!i;return t.iterate({from:0,to:e.doc.length,enter:r=>{if(o.length>=ht)return n=!0,!1;const s=ft(e,r);s!==void 0&&o.push(s)}}),{headings:o,truncated:n}}function ft(e,t){const i=dt.exec(t.name);if(i===null)return;const o=e.sliceDoc(t.from,t.to),n=t.name.startsWith("Setext");let r;return n?r=o.split(e.lineBreak)[0].trim():r=o.replace(/^\s{0,3}#+\s+/,"").replace(/\s+#+\s*$/,"").trim(),{title:r.length>0?r:"(untitled)",level:parseInt(i[1],10),from:t.from,to:t.to}}function U(e,t){let i=-1;for(let o=0;o<e.length&&t>=e[o].from;o++)i=o;return i}function gt(e,t,i){var u,p,A;const o=e[t];if(o===void 0)return;const n=a.MarkEdit.editorView,r=Math.max(0,Math.min(o.from,n.state.doc.length)),s=((u=window.config)==null?void 0:u.typewriterMode)===!0,l=s?k.EditorView.scrollIntoView(r,{y:"center"}):k.EditorView.scrollIntoView(r,{y:"start",yMargin:8});!N()&&P()&&((A=(p=window.__markeditBidirectionalPreviewSync__)==null?void 0:p.beginEditorScroll)==null||A.call(p,{animated:!0})),n.dispatch({selection:st.EditorSelection.cursor(r),effects:l}),vt(r,s),v()||n.focus();{const S=yt(e,t);S!==void 0&&(!N()&&!P()&&(document.querySelectorAll(".markdown-body span.meo-flash").forEach(T),bt(S)),wt(S))}}function O(e){var l;if(e.length===0)return-1;const t=a.MarkEdit.editorView,i=t.scrollDOM.getBoundingClientRect(),o=((l=window.config)==null?void 0:l.typewriterMode)===!0,n=i.top+(o?i.height/2:Y(i.height)),r=Math.max(0,n-t.documentTop),s=t.lineBlockAtHeight(r).from;return U(e,s)}function Y(e){return Math.min(Math.max(e*.1,48),140)}function H(e){const t=J();if(t.length===0)return;const i=X(t[0]),o=i==null?void 0:i.getBoundingClientRect(),r=((o==null?void 0:o.top)??0)+Y((o==null?void 0:o.height)??window.innerHeight);let s=-1;for(let l=0;l<t.length&&t[l].getBoundingClientRect().top<=r+1;l++)s=l;return s<0?-1:pt(e,t,s)}function pt(e,t,i){if(t.length===e.length)return i;const o=b(t[i].textContent??"");return e.findIndex(r=>b(r.title)===o)}function v(){const e=document.querySelector(".markdown-body.overlay");return e!==null&&C(e)}function E(){if(v())return"overlay";const e=document.querySelector(".markdown-body");return e!==null&&C(e)?"split":"edit"}function N(){var e;try{const t=(e=a.MarkEdit.userSettings)==null?void 0:e["extension.markeditPreview"];if(t!==null&&typeof t=="object"){const i=t.syncScroll;if(typeof i=="boolean")return i}}catch{}return!0}function P(){var e;return((e=window.__markeditBidirectionalPreviewSync__)==null?void 0:e.isActive)===!0}function vt(e,t){const i=a.MarkEdit.editorView;i.requestMeasure({read:()=>{const o=i.scrollDOM,n=o.getBoundingClientRect(),r=i.lineBlockAt(e),l=i.documentTop+r.top-n.top,u=t?(n.height-r.height)/2:8,p=o.scrollHeight-o.clientHeight;return Math.max(0,Math.min(p,Math.round(o.scrollTop+l-u)))},write:o=>{const n=i.scrollDOM;Math.abs(o-n.scrollTop)>1&&n.scrollTo({top:o})}})}function bt(e){const t=X(e);if(t===void 0){e.scrollIntoView({block:"start",behavior:"smooth"});return}const i=8,o=t.scrollTop,n=e.getBoundingClientRect().top-t.getBoundingClientRect().top,r=t.scrollHeight-t.clientHeight,s=Math.max(0,Math.min(r,Math.round(o+n-i)));Math.abs(s-o)>1&&t.scrollTo({top:s,behavior:"smooth"})}function X(e){let t=e.parentElement;for(;t!==null&&t!==document.body;){const i=getComputedStyle(t).overflowY;if((i==="auto"||i==="scroll")&&t.scrollHeight>t.clientHeight)return t;t=t.parentElement}}function yt(e,t){const i=J();if(i.length===0)return;if(i.length===e.length)return i[t];const o=b(e[t].title);return i.find(n=>b(n.textContent??"")===o)}function wt(e){St(e);const t=document.createElement("span");for(t.className="meo-flash";e.firstChild!==null;)t.appendChild(e.firstChild);e.appendChild(t);const i=()=>{t.removeEventListener("animationend",i),T(t)};t.addEventListener("animationend",i)}function St(e){e.querySelectorAll(":scope > span.meo-flash").forEach(T)}function T(e){const t=e.parentElement;if(t!==null){for(;e.firstChild!==null;)t.insertBefore(e.firstChild,e);e.remove()}}function J(){return Array.from(document.querySelectorAll(".markdown-body h1, .markdown-body h2, .markdown-body h3, .markdown-body h4, .markdown-body h5, .markdown-body h6")).filter(C)}function C(e){return e.offsetWidth>0||e.offsetHeight>0||e.getClientRects().length>0}function b(e){return e.replace(/\s+/g," ").trim().toLowerCase()}const z="markedit-outline-styles",Et=`
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
}
.meo-item-label {
  display: block;
  width: 100%;
  overflow: hidden;
  white-space: nowrap;
}
.meo-item:hover {
  background: var(--meo-hover, #f0f0f0);
}
.meo-item.meo-active {
  background: var(--meo-active-bg, #e8e8e8);
  background: color-mix(in srgb, var(--meo-accent, AccentColor) var(--meo-active-accent-mix, 18%), var(--meo-bg, #fafafa));
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
.meo-notice {
  flex: 0 0 auto;
  margin: 0 10px 10px;
  padding: 8px 10px;
  border-radius: 6px;
  background: var(--meo-hover, #f0f0f0);
  color: inherit;
  font-size: 12px;
  opacity: 0.72;
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
`,xt=280,D=160,kt=1400;class Mt{constructor(t){c(this,"settings");c(this,"mounted",!1);c(this,"opened",!1);c(this,"width");c(this,"root");c(this,"list");c(this,"empty");c(this,"notice");c(this,"resizer");c(this,"headings",[]);c(this,"truncated",!1);c(this,"items",[]);c(this,"activeIndex",-1);c(this,"navigationHoldIndex");c(this,"scrollHandler",t=>this.onDocumentScroll(t));c(this,"userScrollIntentHandler",t=>this.onUserScrollIntent(t));c(this,"spyScheduled",!1);c(this,"scrollSource");c(this,"scrollSourceTimer");c(this,"modeObserver");c(this,"modeSignature","edit");c(this,"modeCheckScheduled",!1);c(this,"titleResizeObserver");this.settings=t,this.width=xt}mount(){if(this.mounted)return;this.mounted=!0,this.injectStyles(),this.buildSidebar();const t=It();t!==void 0&&this.setWidth(t,!1),this.applyTheme(),matchMedia("(prefers-color-scheme: dark)").addEventListener("change",()=>this.repollTheme())}isOpen(){return this.opened}applySettings(t,i=this.settings.position){this.settings=t,this.mounted&&i!==t.position&&(this.opened&&this.pushEditor(!1),this.root.setAttribute("data-position",t.position),this.opened&&this.pushEditor(!0)),this.updateActive()}shouldStartOpen(){switch(this.settings.onLaunch){case"open":return!0;case"closed":return!1;case"remember":return At()??!1}}open(){!this.mounted||this.opened||(this.opened=!0,this.applyTheme(),this.refresh(),this.root.classList.add("meo-open"),this.pushEditor(!0),document.addEventListener("scroll",this.scrollHandler,{capture:!0,passive:!0}),document.addEventListener("wheel",this.userScrollIntentHandler,{capture:!0,passive:!0}),document.addEventListener("touchstart",this.userScrollIntentHandler,{capture:!0,passive:!0}),document.addEventListener("keydown",this.userScrollIntentHandler,{capture:!0}),this.modeSignature=E(),this.modeObserver=new MutationObserver(()=>this.scheduleModeCheck()),this.modeObserver.observe(document.body,{childList:!0,subtree:!0,attributes:!0,attributeFilter:["class","style"]}),this.persistVisibility())}close(){var t;!this.mounted||!this.opened||(this.opened=!1,this.root.classList.remove("meo-open"),this.pushEditor(!1),document.removeEventListener("scroll",this.scrollHandler,{capture:!0}),document.removeEventListener("wheel",this.userScrollIntentHandler,{capture:!0}),document.removeEventListener("touchstart",this.userScrollIntentHandler,{capture:!0}),document.removeEventListener("keydown",this.userScrollIntentHandler,{capture:!0}),(t=this.modeObserver)==null||t.disconnect(),this.modeObserver=void 0,this.navigationHoldIndex=void 0,this.clearScrollSource(),this.persistVisibility())}persistVisibility(){if(this.settings.onLaunch==="remember")try{localStorage.setItem(W,this.opened?"1":"0")}catch{}}toggle(){this.opened?this.close():this.open()}refresh(){if(!this.mounted||!this.opened)return;const t=ut(a.MarkEdit.editorView.state);this.headings=t.headings,this.truncated=t.truncated,this.navigationHoldIndex=void 0,this.renderList(),this.updateActive()}updateActive(){!this.mounted||!this.opened||this.items.length===0||this.setActive(this.activeInView())}activeInView(){return this.settings.highlightMode==="insertionPoint"?this.activeInEditor():v()?H(this.headings)??this.activeInEditor():this.activeInEditor()}activeInEditor(){return this.settings.highlightMode==="insertionPoint"?U(this.headings,a.MarkEdit.editorView.state.selection.main.head):O(this.headings)}setHighlightMode(t){this.settings.highlightMode!==t&&(this.settings.highlightMode=t,this.updateActive())}onSelectionChange(){this.settings.highlightMode==="insertionPoint"&&this.updateActive()}setActive(t){t!==this.activeIndex&&(this.activeIndex>=0&&this.items[this.activeIndex]&&(this.items[this.activeIndex].classList.remove("meo-active"),this.updateItemTooltip(this.items[this.activeIndex])),this.activeIndex=t,t>=0&&this.items[t]&&(this.items[t].classList.add("meo-active"),this.ensureItemVisible(this.items[t]),this.updateItemTooltip(this.items[t])))}onDocumentScroll(t){if(!this.opened||this.items.length===0)return;const i=t.target;if(!(i instanceof HTMLElement&&i.closest(".meo-sidebar"))){if(E()==="split"){const o=this.scrollSourceForTarget(i);if(o!==void 0){if(this.scrollSource!==void 0&&this.scrollSource!==o){this.extendScrollSourceHold();return}this.scrollSource=o,this.extendScrollSourceHold()}}this.spyScheduled||(this.spyScheduled=!0,requestAnimationFrame(()=>{if(this.spyScheduled=!1,!!this.opened){if(this.navigationHoldIndex!==void 0&&this.items[this.navigationHoldIndex]!==void 0){this.setActive(this.navigationHoldIndex);return}this.setActive(this.activeForScroll(i))}}))}}onUserScrollIntent(t){const i=t.target;if(!(i instanceof HTMLElement&&i.closest(".meo-sidebar"))&&!(t instanceof KeyboardEvent&&!Ht(t))){if(!(t instanceof KeyboardEvent)){const o=this.scrollSourceForTarget(i);o!==void 0&&this.setScrollSource(o)}this.navigationHoldIndex!==void 0&&(this.navigationHoldIndex=void 0)}}activeForScroll(t){return this.settings.highlightMode==="insertionPoint"?this.activeIndex:(a.MarkEdit.editorView.scrollDOM,this.scrollSourceForTarget(t)==="editor"?v()?this.activeIndex:O(this.headings):H(this.headings)??this.activeIndex)}scrollSourceForTarget(t){if(!(t instanceof Node))return;const i=a.MarkEdit.editorView.scrollDOM;if(t===i||i.contains(t))return"editor";const o=Lt();if(o!==void 0&&(t===o||o.contains(t)||t.contains(o)))return"preview"}setScrollSource(t){this.scrollSource=t,this.extendScrollSourceHold()}extendScrollSourceHold(){this.scrollSourceTimer!==void 0&&clearTimeout(this.scrollSourceTimer),this.scrollSourceTimer=setTimeout(()=>this.clearScrollSource(),kt)}clearScrollSource(){this.scrollSourceTimer!==void 0&&(clearTimeout(this.scrollSourceTimer),this.scrollSourceTimer=void 0),this.scrollSource=void 0}scheduleModeCheck(){this.modeCheckScheduled||(this.modeCheckScheduled=!0,requestAnimationFrame(()=>{if(this.modeCheckScheduled=!1,!this.opened)return;const t=E();t!==this.modeSignature&&(this.modeSignature=t,this.updateActive())}))}injectStyles(){if(document.getElementById(z))return;const t=document.createElement("style");t.id=z,t.textContent=Et,document.head.appendChild(t)}buildSidebar(){const t=document.createElement("div");t.className="meo-sidebar",t.setAttribute("data-position",this.settings.position),t.style.setProperty("--meo-width",`${this.width}px`),t.style.width=`${this.width}px`;const i=document.createElement("div");i.className="meo-header";const o=document.createElement("span");o.className="meo-title",o.textContent="Outline",i.append(o);const n=document.createElement("div");n.className="meo-list",n.setAttribute("role","tree"),n.addEventListener("click",u=>this.onListClick(u));const r=document.createElement("div");r.className="meo-empty",r.textContent="No headings in this document.",r.style.display="none";const s=document.createElement("div");s.className="meo-notice",s.style.display="none";const l=document.createElement("div");l.className="meo-resizer",l.title="Drag to resize",l.addEventListener("mousedown",u=>this.startResize(u)),t.append(i,n,r,s,l),document.body.appendChild(t),this.root=t,this.list=n,this.empty=r,this.notice=s,this.resizer=l,this.titleResizeObserver=new ResizeObserver(()=>{this.opened&&this.updateItemTooltips()}),this.titleResizeObserver.observe(n)}maxWidth(){return Math.max(D,Math.min(600,window.innerWidth-120))}setWidth(t,i){const o=Math.max(D,Math.min(this.maxWidth(),Math.round(t)));if(this.width=o,this.root.style.width=`${o}px`,this.root.style.setProperty("--meo-width",`${o}px`),this.updateItemTooltips(),this.opened&&this.pushEditor(!0),i)try{localStorage.setItem(q,String(o))}catch{}}startResize(t){t.preventDefault();const i=this.settings.position==="right";this.resizer.classList.add("meo-dragging"),document.body.style.cursor="col-resize",document.documentElement.style.userSelect="none";const o=r=>{const s=i?window.innerWidth-r.clientX:r.clientX;this.setWidth(s,!1)},n=()=>{document.removeEventListener("mousemove",o),document.removeEventListener("mouseup",n),this.resizer.classList.remove("meo-dragging"),document.body.style.cursor="",document.documentElement.style.userSelect="",this.setWidth(this.width,!0)};document.addEventListener("mousemove",o),document.addEventListener("mouseup",n)}renderList(){if(this.list.textContent="",this.items=[],this.activeIndex=-1,this.headings.length===0){this.empty.style.display="",this.notice.style.display=this.truncated?"":"none",this.notice.textContent=this.truncated?"Outline unavailable until CodeMirror finishes parsing this large document.":"";return}this.empty.style.display="none",this.notice.style.display=this.truncated?"":"none",this.notice.textContent=this.truncated?`Showing first ${this.headings.length.toLocaleString()} headings. Outline truncated for performance.`:"";const t=document.createDocumentFragment();this.headings.forEach((i,o)=>{const n=document.createElement("button");n.className="meo-item",n.setAttribute("data-level",String(i.level)),n.setAttribute("data-index",String(o)),n.setAttribute("aria-label",i.title),n.setAttribute("data-full-title",i.title);const r=document.createElement("span");r.className="meo-item-label",r.textContent=i.title,n.appendChild(r),this.items.push(n),t.appendChild(n)}),this.list.appendChild(t),this.updateItemTooltips()}updateItemTooltips(){for(const t of this.items)this.updateItemTooltip(t)}updateItemTooltip(t){const i=t.querySelector(".meo-item-label"),o=t.getAttribute("data-full-title");if(i===null||o===null)return;i.textContent=o,i.scrollWidth>i.clientWidth?(Tt(i,o),t.title=o):t.removeAttribute("title")}onListClick(t){var n;const i=(n=t.target)==null?void 0:n.closest(".meo-item");if(i===null)return;const o=parseInt(i.getAttribute("data-index")??"",10);Number.isNaN(o)||(this.setActive(o),this.settings.highlightMode==="scroll"&&(this.navigationHoldIndex=o),gt(this.headings,o))}ensureItemVisible(t){const i=this.list.scrollTop,o=i+this.list.clientHeight,n=t.offsetTop-this.list.offsetTop,r=n+t.offsetHeight;n<i?this.list.scrollTop=n-4:r>o&&(this.list.scrollTop=r-this.list.clientHeight+4)}pushEditor(t){const i=this.width,o=this.settings.position==="right",n=document.body.style,r=document.documentElement.style;t?(n.width=`calc(100vw - ${i}px)`,n.marginLeft=o?"":`${i}px`,n.marginRight="",r.setProperty("--markedit-content-inset",o?`0 ${i}px 0 0`:`0 0 0 ${i}px`),r.setProperty("--meo-width",`${i}px`),document.documentElement.classList.toggle("meo-push-left",!o)):(n.width="",n.marginLeft="",n.marginRight="",r.removeProperty("--markedit-content-inset"),document.documentElement.classList.remove("meo-push-left")),a.MarkEdit.editorView.requestMeasure()}readEditorColors(){const t=a.MarkEdit.editorView,i=getComputedStyle(t.dom),o=getComputedStyle(t.contentDOM??t.dom),n=$([i.backgroundColor,getComputedStyle(document.body).backgroundColor])??"#ffffff",r=$([o.color,i.color])??"#1a1a1a";return{bg:n,fg:r}}repollTheme(){const t=matchMedia("(prefers-color-scheme: dark)").matches,i=performance.now()+500,o=()=>{if(R(this.readEditorColors().bg)===t||performance.now()>=i){this.applyTheme();return}requestAnimationFrame(o)};requestAnimationFrame(o)}applyTheme(){if(!this.mounted)return;const{bg:t,fg:i}=this.readEditorColors(),o=R(t),n=o?x(t,8):"#fafafa",r=(s,l)=>this.root.style.setProperty(s,l);r("--meo-bg",n),r("--meo-fg",i),r("--meo-hover",o?x(t,22):"#f0f0f0"),r("--meo-active-bg",o?x(t,32):"#e8e8e8"),r("--meo-active-accent-mix",o?"30%":"18%"),r("--meo-accent","AccentColor"),document.documentElement.style.setProperty("--meo-flash",o?"rgba(255, 214, 92, 0.60)":"rgba(255, 209, 71, 0.60)")}}function Tt(e,t){const i=Array.from(t);let o=0,n=Math.max(0,i.length-1),r="…";for(;o<=n;){const s=Math.floor((o+n)/2),l=Ct(i,s);e.textContent=l,e.scrollWidth<=e.clientWidth?(r=l,o=s+1):n=s-1}e.textContent=r}function Ct(e,t){const i=Math.ceil(t/2),o=t-i;return`${e.slice(0,i).join("")}…${o>0?e.slice(-o).join(""):""}`}function It(){try{const e=localStorage.getItem(q);if(e!==null){const t=parseInt(e,10);if(Number.isFinite(t)&&t>0)return t}}catch{}}function At(){try{const e=localStorage.getItem(W);if(e==="1")return!0;if(e==="0")return!1}catch{}}function Lt(){return Array.from(document.querySelectorAll(".markdown-body")).find(Ot)}function Ot(e){const t=e.getBoundingClientRect();return t.width>0&&t.height>0&&getComputedStyle(e).display!=="none"}function Ht(e){return["ArrowDown","ArrowLeft","ArrowRight","ArrowUp","End","Home","PageDown","PageUp"," "].includes(e.key)}function $(e){for(const t of e){const i=I(t);if(i!==void 0&&i.a>.05)return t}}function x(e,t){const i=I(e);if(i===void 0)return e;const o=n=>Math.max(0,Math.min(255,Math.round(n+t)));return`rgb(${o(i.r)}, ${o(i.g)}, ${o(i.b)})`}function R(e){const t=I(e);return t===void 0?matchMedia("(prefers-color-scheme: dark)").matches:(.299*t.r+.587*t.g+.114*t.b)/255<.5}function I(e){const t=/rgba?\(([^)]+)\)/.exec(e);if(t===null)return;const i=t[1].split(",").map(o=>parseFloat(o.trim()));if(!(i.length<3||i.some(o=>Number.isNaN(o))))return{r:i[0],g:i[1],b:i[2],a:i.length>=4?i[3]:1}}const Nt="settings.json";function Q(){return`${a.MarkEdit.getDirectoryPath("documents")}/${Nt}`}async function y(){const e=await a.MarkEdit.getFileContent(Q());if(e===void 0||e.trim().length===0)return{};try{const t=JSON.parse(e);return typeof t!="object"||t===null||Array.isArray(t)?void 0:t}catch{return}}async function w(e){return a.MarkEdit.createFile({path:Q(),string:`${JSON.stringify(e,null,2)}
`,overwrites:!0})}const h="editor.customToolbarItems";function Z(){return{title:"Outline",icon:"list.bullet.rectangle.portrait",actionName:M}}function tt(e){return typeof e=="object"&&e!==null&&e.actionName===M}async function et(e){await a.MarkEdit.showAlert({title:"Couldn't update settings.json automatically",message:`Your settings.json couldn't be parsed as JSON, so it was left untouched.

Add this object to the "${h}" array yourself:

${JSON.stringify(e)}`,buttons:["OK"]})}async function Pt(){const e=Z(),t=await y();if(t===void 0){await et(e);return}const i=Array.isArray(t[h])?t[h]:[];if(i.some(tt)){await a.MarkEdit.showAlert({title:"Toolbar button already configured",message:`A toolbar toggle for the Outline Sidebar is already in your settings.json.

If you don’t see it, restart MarkEdit and add it via View → Customize Toolbar….`,buttons:["OK"]});return}t[h]=[...i,e];const o=await w(t);await a.MarkEdit.showAlert({title:o?"Toolbar button added":"Failed to write settings.json",message:o?"Restart MarkEdit, then drag the “Outline” item into the toolbar via View → Customize Toolbar…. Clicking it toggles the sidebar.":`Could not write settings.json. Check permissions in the MarkEdit Documents folder, or add this item to "${h}" manually:

${JSON.stringify(e)}`,buttons:["OK"]})}async function zt(){const e=await y();if(e===void 0){await et(Z());return}const t=Array.isArray(e[h])?e[h]:[],i=t.filter(n=>!tt(n));if(i.length===t.length){await a.MarkEdit.showAlert({title:"Nothing to remove",message:"No Outline Sidebar toolbar item was found in settings.json.",buttons:["OK"]});return}i.length===0?delete e[h]:e[h]=i;const o=await w(e);await a.MarkEdit.showAlert({title:o?"Toolbar button removed":"Failed to write settings.json",message:o?"Restart MarkEdit to apply. You can also remove it from the toolbar via View → Customize Toolbar….":"Could not write settings.json.",buttons:["OK"]})}async function V(e,t,i){const o=t.position,n=await y();if(n===void 0){await a.MarkEdit.showAlert({title:"Couldn't update settings.json",message:`Your settings.json couldn't be parsed as JSON, so it was left untouched.

Set "position": "${e}" under "${d}" yourself.`,buttons:["OK"]});return}const r=typeof n[d]=="object"&&n[d]!==null?n[d]:{};if(n[d]={...r,position:e},!await w(n)){await a.MarkEdit.showAlert({title:"Failed to write settings.json",message:`Could not write settings.json. Check permissions in the MarkEdit Documents folder, or set "position": "${e}" under "${d}" manually.`,buttons:["OK"]});return}await Dt(n);const l=G();Object.assign(t,l),i.applySettings(t,o)}async function Dt(e){var i;const t=a.MarkEdit;await((i=t.loadSettings)==null?void 0:i.call(t)),a.MarkEdit.userSettings[d]=e[d]}async function F(e,t){t.setHighlightMode(e);const i=await y();if(i===void 0){await a.MarkEdit.showAlert({title:"Couldn't save the setting",message:`The change is active now, but your settings.json couldn't be parsed as JSON, so it wasn't saved and won't survive a relaunch.

Set "highlightMode": "${e}" under "${d}" yourself to keep it.`,buttons:["OK"]});return}const o=typeof i[d]=="object"&&i[d]!==null?i[d]:{};i[d]={...o,highlightMode:e},await w(i)||await a.MarkEdit.showAlert({title:"Failed to write settings.json",message:`The change is active now, but it couldn't be saved. Check permissions in the MarkEdit Documents folder, or set "highlightMode": "${e}" under "${d}" manually.`,buttons:["OK"]})}function $t(e,t){a.MarkEdit.addMainMenuItem({title:"Outline Sidebar",children:[{title:M,key:e.shortcut.key,modifiers:e.shortcut.modifiers,action:()=>t.toggle(),state:()=>({isSelected:t.isOpen()})},{separator:!0},{title:"Dock Left",action:()=>void V("left",e,t),state:()=>({isSelected:e.position==="left"})},{title:"Dock Right",action:()=>void V("right",e,t),state:()=>({isSelected:e.position==="right"})},{separator:!0},{title:"Highlight Follows Scroll",action:()=>void F("scroll",t),state:()=>({isSelected:e.highlightMode==="scroll"})},{title:"Highlight Follows Insertion Point",action:()=>void F("insertionPoint",t),state:()=>({isSelected:e.highlightMode==="insertionPoint"})},{separator:!0},{title:"Add Toolbar Button to settings.json",action:()=>void Pt()},{title:"Remove Toolbar Button",action:()=>void zt()},{separator:!0},{title:"Visit GitHub Project",action:()=>_(K)},{title:"View Release Notes",action:()=>_(lt)}]})}function _(e){const t=document.createElement("a");t.href=e,t.target="_blank",t.rel="noopener noreferrer",document.body.appendChild(t),t.click(),t.remove()}const it=G(),f=new Mt(it);$t(it,f);let g;a.MarkEdit.addExtension(k.EditorView.updateListener.of(e=>{e.docChanged?(g!==void 0&&clearTimeout(g),g=setTimeout(()=>{g=void 0,f.refresh()},250)):e.selectionSet&&f.onSelectionChange()}));let j=!1,B;function ot(e){if(B!==e){if(B=e,g!==void 0&&(clearTimeout(g),g=void 0),j){f.refresh();return}j=!0,f.mount(),f.shouldStartOpen()&&f.open()}}a.MarkEdit.onEditorReady(e=>ot(e));try{a.MarkEdit.editorView!==void 0&&ot(a.MarkEdit.editorView)}catch{}
