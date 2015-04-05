var dialogPolyfill=function(){var e=window.document.addEventListener?function(e,t,o){e.addEventListener(t,o)}:function(e,t,o){e.attachEvent("on"+t,o)},t=(window.document.removeEventListener?function(e,t,o){e.removeEventListener(t,o)}:function(e,t,o){e.detachEvent("on"+t,o)},{});t.reposition=function(e){var t=document.body.scrollTop||document.documentElement.scrollTop,o="undefined"==typeof window.innerHeight&&document.body&&document.body.clientHeight?document.body.clientHeight:window.innerHeight,n=t+(o-e.offsetHeight)/2;0>n&&(n=0),e.style.top=n+"px",e.dialogPolyfillInfo.isTopOverridden=!0},t.inNodeList=function(e,t){for(var o=0;o<e.length;++o)if(e[o]==t)return!0;return!1},t.isInlinePositionSetByStylesheet=function(e){for(var o=0;o<document.styleSheets.length;++o){var n=document.styleSheets[o],i=null;try{i=n.cssRules}catch(l){}if(i)for(var a=0;a<i.length;++a){var s=i[a],c=null;try{c=document.querySelectorAll(s.selectorText)}catch(l){}if(c&&t.inNodeList(c,e)){var r=s.style.getPropertyValue("top"),d=s.style.getPropertyValue("bottom");if(r&&"auto"!=r||d&&"auto"!=d)return!0}}}return!1},t.needsCentering=function(e){if("undefined"==typeof getComputedStyle){if(e.currentStyle&&"absolute"!=e.currentStyle.position)return!1}else{var o=getComputedStyle(e);if("absolute"!=o.position)return!1}return"auto"!=e.style.top&&""!=e.style.top||"auto"!=e.style.bottom&&""!=e.style.bottom?!1:!t.isInlinePositionSetByStylesheet(e)},t.showDialog=function(e){if(this.open)throw"InvalidStateError: showDialog called on open dialog";if(this.open=!0,this.setAttribute("open","open"),e){var o=null,n=null,i=function(e){if(e.children)for(var t=0;t<e.children.length;t++){var l=e.children[t];if(null!==o||l.disabled||"BUTTON"!=l.nodeName&&"INPUT"!=l.nodeName&&"KEYGEN"!=l.nodeName&&"SELECT"!=l.nodeName&&"TEXTAREA"!=l.nodeName||(o=l),l.autofocus)return void(n=l);if(i(l),null!==n)return}};i(this),null!==n?n.focus():null!==o&&o.focus()}t.needsCentering(this)&&t.reposition(this),e&&(this.dialogPolyfillInfo.modal=!0,t.dm.pushDialog(this));try{null!==n?n.focus():null!==o&&o.focus()}catch(l){}this.style.zoom=1},t.close=function(e){this.removeAttribute("open"),"undefined"!=typeof e&&(this.returnValue=e),this.dialogPolyfillInfo.isTopOverridden&&(this.style.top="auto"),this.dialogPolyfillInfo.modal&&t.dm.removeDialog(this);var o;return this.dispatchEvent&&(document.createEvent?(o=document.createEvent("HTMLEvents"),o.initEvent("close",!0,!0)):o=new Event("close"),this.dispatchEvent(o)),this.returnValue},t.registerDialog=function(o){o.show&&console.warn("This browser already supports <dialog>, the polyfill may not work correctly."),e(o,"dialog_submit",function(e){o.close(e.detail.target.value),e.preventDefault(),e.stopPropagation()}),o.show=function(){t.showDialog.call(o,!1)},o.showModal=function(){t.showDialog.call(o,!0)},o.close=function(e){t.close.call(o,e)},o.dialogPolyfillInfo={}};var o=1e5,n=1e5;return t.DialogManager=function(){this.pendingDialogStack=[],this.overlay=document.createElement("div"),this.overlay.style.width="100%",this.overlay.style.height="100%",this.overlay.style.position="fixed",this.overlay.style.left="0px",this.overlay.style.top="0px";try{this.overlay.style.backgroundColor="rgba(0,0,0,0.0)"}catch(t){this.overlay.style.backgroundColor="#000",this.overlay.style.filter="alpha(opacity=0)"}this.focusPageLast=this.createFocusable(),this.overlay.appendChild(this.focusPageLast),e(this.overlay,"click",function(e){var t=document.createEvent("MouseEvents");t.initMouseEvent(e.type,e.bubbles,e.cancelable,window,e.detail,e.screenX,e.screenY,e.clientX,e.clientY,e.ctrlKey,e.altKey,e.shiftKey,e.metaKey,e.button,e.relatedTarget),document.body.dispatchEvent(t)}),e(window,"load",function(){for(var t=document.getElementsByTagName("form"),o=t.length;o--;)!function(t){"dialog"==t.getAttribute("method")&&e(t,"click",function(e){if("submit"==e.target.type){var t;"function"==typeof CustomEvent?t=new CustomEvent("dialog_submit",{bubbles:!0,detail:{target:e.target}}):(t=document.createEvent("HTMLEvents"),t.initEvent("dialog_submit",!0,!0),t.detail={target:e.target}),this.dispatchEvent(t),e.preventDefault()}})}(t[o])})},t.DialogManager.prototype.createFocusable=function(e){var t=document.createElement("span");return t.tabIndex=e||0,t.style.opacity=0,t.style.position="static",t},t.DialogManager.prototype.blockDocument=function(){document.body.contains(this.overlay)||(document.body.appendChild(this.overlay),void 0===this.needsDocumentElementFocus&&(document.documentElement.focus(),this.needsDocumentElementFocus=document.activeElement!=document.documentElement),this.needsDocumentElementFocus&&(document.documentElement.tabIndex=1))},t.DialogManager.prototype.unblockDocument=function(){document.body.removeChild(this.overlay),this.needsDocumentElementFocus&&(document.documentElement.tabIndex="")},t.DialogManager.prototype.updateStacking=function(){if(0==this.pendingDialogStack.length)return void this.unblockDocument();this.blockDocument();for(var e=o,t=0;t<this.pendingDialogStack.length;t++){t==this.pendingDialogStack.length-1&&(this.overlay.style.zIndex=e++);var n=this.pendingDialogStack[t];n.dialogPolyfillInfo.backdrop.style.zIndex=e++,n.style.zIndex=e++}},t.DialogManager.prototype.handleKey=function(e){if(0!=this.pendingDialogStack.length){var t=this.pendingDialogStack.slice(-1)[0];if(9==e.keyCode){var o=document.activeElement,n=!e.shiftKey;n?o==document.documentElement||o==document.body||o==t.dialogPolyfillInfo.backdrop?t.dialogPolyfillInfo.focusFirst.focus():o==t.dialogPolyfillInfo.focusLast&&t.dialogPolyfillInfo.focusFirst.focus():o==pfi.focusFirst?t.dialogPolyfillInfo.focusLast.focus():o==this.focusPageLast&&t.dialogPolyfillInfo.focusLast.focus()}if(27===e.keyCode){e.preventDefault(),e.stopPropagation();var i;t&&("function"==typeof CustomEvent?i=new CustomEvent("cancel",{bubbles:!1,cancelable:!0}):(i=document.createEvent("HTMLEvents"),i.initEvent("cancel",!1,!0)),t.dispatchEvent(i)&&t.close())}}},t.DialogManager.prototype.pushDialog=function(t){if(this.pendingDialogStack.length>=n)throw"Too many modal dialogs";var o=document.createElement("div");o.className="backdrop",e(o,"click",function(e){var o=document.createEvent("MouseEvents");o.initMouseEvent(e.type,e.bubbles,e.cancelable,window,e.detail,e.screenX,e.screenY,e.clientX,e.clientY,e.ctrlKey,e.altKey,e.shiftKey,e.metaKey,e.button,e.relatedTarget),t.dispatchEvent(o)}),t.parentNode.insertBefore(o,t.nextSibling),t.dialogPolyfillInfo.backdrop=o,this.pendingDialogStack.push(t),this.updateStacking(),t.dialogPolyfillInfo.focusFirst=this.createFocusable(),t.dialogPolyfillInfo.focusLast=this.createFocusable(),t.appendChild(t.dialogPolyfillInfo.focusLast),t.insertBefore(t.dialogPolyfillInfo.focusFirst,t.firstChild)},t.DialogManager.prototype.removeDialog=function(e){if("undefined"==typeof Array.prototype.indexOf)var t=function(e,t){for(var o=0;o<e.length;o++)if(e[o]===t)return o;return-1}(this.pendingDialogStack,e);else var t=this.pendingDialogStack.indexOf(e);if(-1!=t){this.pendingDialogStack.splice(t,1);var o=e.dialogPolyfillInfo.backdrop;o.parentNode.removeChild(o),e.dialogPolyfillInfo.backdrop=null,this.updateStacking(),e.removeChild(e.dialogPolyfillInfo.focusFirst),e.removeChild(e.dialogPolyfillInfo.focusLast),e.dialogPolyfillInfo.focusFirst=null,e.dialogPolyfillInfo.focusLast=null}},t.dm=new t.DialogManager,e(document,"keydown",function(e){t.dm.handleKey.call(t.dm,e)}),t}();