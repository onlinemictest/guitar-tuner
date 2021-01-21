"use strict";const e=(e,...t)=>{e.classList.remove(...t),e.offsetWidth,e.classList.add(...t)},t=["C","C#","D","D#","E","F","F#","G","G#","A","A#","B"];function n(e){const n=function(e){const t=Math.log(e/440)/Math.log(2)*12;return Math.round(t)+69}(e);return{value:n%12,index:n,name:t[n%12],cents:o(e,n),octave:Math.floor(n/12)-1,frequency:e}}function o(e,t){return Math.floor(1200*Math.log(e/function(e){return 440*Math.pow(2,(e-69)/12)}(t))/Math.log(2))}function*s(e,t=((e,t)=>e===t)){const n=e[Symbol.iterator](),{done:o,value:s}=n.next();if(o)return;let i=[];i.push(s);let a=s;for(const e of function(e){return{[Symbol.iterator]:()=>e}}(n))t(e,a)?(i.push(e),a=e):(yield[...i],i=[e],a=e);i.length&&(yield i)}
/**
 * Copyright (C) 2021 Online Mic Test
 *
 * This program is free software: you can redistribute it and/or modify
 * it under the terms of the GNU Affero General Public License as published
 * by the Free Software Foundation, either version 3 of the License, or
 * (at your option) any later version.
 *
 * This program is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU Affero General Public License for more details.
 *
 * You should have received a copy of the GNU Affero General Public License
 * along with this program.  If not, see <https://www.gnu.org/licenses/>.
 * @license
 */console.log("Licensed under AGPL-3.0: https://github.com/onlinemictest/guitar-tuner");const i=Math.pow(2,13),a=Math.ceil(1.5),r={E_4:329.63,B_3:246.94,G_3:196,D_3:146.83,A_2:110,E_2:82.41},l=Object.keys(r),c=new Map(Object.entries(r).map((([e,t])=>[t,e]))),d=Object.values(r).sort(),u=(e,t,n)=>e&&(e[t]=n),m=(e,t)=>(null==e||e.pop(),null==e||e.unshift(t),e),h=e=>{var t,n;return null!==(t=c.get((n=e,d.reduce(((e,t)=>Math.abs(t-n)<Math.abs(e-n)?t:e)))))&&void 0!==t?t:(e=>{throw Error(e)})()};Aubio().then((({Pitch:t})=>{if(function(){if(window.AudioContext=window.AudioContext||window.webkitAudioContext,!window.AudioContext)return alert("AudioContext not supported");void 0===navigator.mediaDevices&&(navigator.mediaDevices={}),void 0===navigator.mediaDevices.getUserMedia&&(navigator.mediaDevices.getUserMedia=function(e){const t=navigator.webkitGetUserMedia||navigator.mozGetUserMedia;return t||alert("getUserMedia is not implemented in this browser"),new Promise((function(n,o){t.call(navigator,e,n,o)}))})}(),!("WebAssembly"in window&&"AudioContext"in window&&"createAnalyser"in AudioContext.prototype&&"createScriptProcessor"in AudioContext.prototype&&"trunc"in Math))return alert("Browser not supported");const o=document.getElementById("audio-start"),c=document.getElementById("audio-pause"),d=document.getElementById("tune-up-text"),y=document.getElementById("tune-down-text"),v=document.getElementById("match-circle-r"),f=document.getElementById("match-circle-l"),p=document.getElementById("inner-circle"),w=document.getElementById("tuned-jingle");w.volume=.5;const g=new Map(Object.entries(r).map((([e])=>[e,document.getElementById(e)]))),M=new Map(Object.entries(r).map((([e])=>[e,document.getElementById(e+"-fill")])));let b,x,A,L;const E=v.innerText;c.addEventListener("click",(()=>{A.disconnect(b.destination),x.disconnect(A),b.close(),o.style.display="block",c.style.display="none",f.style.transform="translateX(125%)",v.innerText=E,v.classList.add("with-text"),v.style.color="",d.classList.remove("show"),y.classList.remove("show"),e(o,"blob-animation")})),o.addEventListener("click",(()=>{b=new AudioContext,x=b.createAnalyser(),A=b.createScriptProcessor(i,1,1),L=new t("default",i,1,b.sampleRate),navigator.mediaDevices.getUserMedia({audio:!0}).then((t=>{b.createMediaStreamSource(t).connect(x),x.connect(A),A.connect(b.destination),o.style.display="none",c.style.display="block",v.innerText="Pluck a String",v.classList.add("with-text"),e(c,"shrink-animation"),f.style.visibility="visible";let i=!1,E=!1,B=!1;const C=new Array(a).fill(void 0),k=new Array(18).fill(void 0);let I=new Map(l.map((e=>[e,[]])));A.addEventListener("audioprocess",(e=>{var t,o,a,c;const b=e.inputBuffer.getChannelData(0),x=L.do(b),A=n(x);if(m(k,A.name),[...s(k.filter((e=>!!e)))].every((e=>e.length<=3)))i&&(i=!1,v.innerText="Pluck a String",v.classList.add("with-text"),v.style.color="",f.style.transform="translateX(125%)",d.classList.remove("show"),y.classList.remove("show"));else if(A.name&&!Number.isNaN(A.cents)){if(w.paused){i=!0,E=!0;const e=`${A.name}_${A.octave}`,n=h(x),s=x<r[n];e===n&&A.cents<25?(d.classList.remove("show"),y.classList.remove("show")):(d.classList[s?"add":"remove"]("show"),y.classList[s?"remove":"add"]("show"));const l=e===n?A.cents:s?-85:85,m=2*Math.abs(l),b=((e,t=1)=>Math.round(e/t)*t)(l,Math.min(10,Math.round(100/m)));v.innerText=n.split("_")[0],v.classList.remove("with-text");const L=null!==(t=I.get(e))&&void 0!==t?t:[];e===n&&0===b&&L.push(0);const C=(D=L.length/6,Math.max(0,Math.min(1,D)));p.style.transition="transform 350ms ease",p.style.transform=`scale(${1-C})`,v.style.transition="color 350ms ease",v.style.color=1===C?"#fff":"#fff8",f.style.transition="transform 350ms ease",f.style.transform=`translateX(${b*(1-C)}%)`,1!==C||B||(w.play(),u(null===(a=null===(o=g.get(n))||void 0===o?void 0:o.querySelector("path"))||void 0===a?void 0:a.style,"fill","rgb(67,111,142)"),u(null===(c=M.get(n))||void 0===c?void 0:c.style,"display","block"),B=!0)}m(C,A.name)}else E&&(p.style.transition="transform 100ms",p.style.transform="scale(1)",E=!1,B=!1,I=new Map(l.map((e=>[e,[]]))));var D}))}))}))}));
//# sourceMappingURL=index.js.map