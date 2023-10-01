!function(){"use strict";function e(e){return new Promise((e=>setTimeout(e,1500)))}window.request=async function(e,t){let n=await fetch(e,t);if(n.ok)return n;throw n},window.htmlToElement=function(e){let t=document.createElement("template");return t.innerHTML=e.trim(),t.content.firstChild},window.AuxEvent=class{constructor(){this.event=document.createElement("e"),this.aux=new Event("e")}addListener(e,t){let n=this.event;n.addEventListener("e",(function a(){document.contains(e)?t():n.removeEventListener("e",a)}))}dispatch(){this.event.dispatchEvent(this.aux)}},window.Observable=class{constructor(e){this.variable=e,this.event=new AuxEvent}get value(){return this.variable}set value(e){this.variable=e,this.event.dispatch()}subscribe(e,t){this.event.addListener(e,t)}},window.dataPromise=async function(){let t;for(;!t;)t=await request("data.json").then((e=>e.json())).catch(e);return t}(),window.htmlData={title:document.querySelector("h1").innerText,header:document.querySelector("header").innerHTML,main:document.querySelector("main").innerHTML};let t=new Promise((e=>{document.head.querySelector("[data-id=vegaEmbed]").onload=()=>e()})),n=[];function a(){let e=location.pathname;return e.endsWith("/")?e:e+"/"}const l=dataPromise.then((e=>Object.keys(e.mediciones)));function i(e){let t=e.split(";")[0].split("/");return t[t.length-1]}function o(e){if(document.body.contains(e[0]))return!0;e[1]()}function s(){alert("Copia el enlace de esta página para guardar la selección")}async function r(){let e=htmlToElement(`<header class="main-header-container">\n\t\t<a class="home-link" href="#"><i class="fa-solid fa-house"></i></a>\n\t\t<header class="main-header">\n\t\t\t<label for="main-info-checkbox"><h1>${htmlData.title} <span><i class="fa-solid fa-circle-info"></i></span></h1></label>\n\t\t\t<input id="main-info-checkbox" type="checkbox">\n\t\t\t<p class="main-info">${(await dataPromise).infoResultados}</p>\n\t\t</header>\n\t\t<section class="downloads">\n\t\t\t<span><i class="fa-solid fa-download"></i></span>\n\t\t\t<a role="link">Enlace</a>\n\t\t</section>\n\t</header>`);return e.querySelector(".downloads > a").onclick=share,e}function c(e){let t={};for(let n of Object.values(e.estimadores))for(let[e,a]of Object.entries(n))t[e]=a;return t}function d(e){let t=new URLSearchParams(location.hash.substring(1)),n={};for(let[e,a]of t)n[e]=a.split(" ");return function(e,t){let n=c(t);return!!(e.var&&e.est&&e.seg&&e.m&&e.var.length&&e.est.length&&e.seg.length&&e.m.length&&e.var.every((e=>t.variables[e]))&&e.est.every((e=>n[e]))&&e.seg.every((e=>t.segmentaciones[e]))&&e.m.every((e=>t.mediciones[e])))}(n,e)&&n}function h(e,t,n){let a=e.split(";")[1].split(","),l=n.filter((e=>!t.includes(e)));return a.some((e=>!l.some((t=>e.includes(t)))))}async function u(){let e=location.hash,t=htmlToElement('<main class="results-page"></main>'),n=await dataPromise;if(e!=location.hash)return t;let a=d(n);if(!a)return location.hash="",t;let l=function(e,t){let n=Object.keys(t.mediciones),a=new Map;for(let l of e.var){let i=t.variables[l].archivos,o=new Map;for(let t of e.est){let a=i[t];if(!a)continue;let l=new Map;for(let t of e.seg){let i=a[t];i&&(i=i.filter((t=>h(t,e.m,n))),i.length&&l.set(t,i))}l.size&&o.set(t,l)}o.size&&a.set(l,o)}return a}(a,n);if(!l.size)return t.append(htmlToElement("<p>Ningún estimador seleccionado está disponible para las variables y mediciones seleccionadas.</p>")),t;let i,o=c(n),s=0;if(a.seg.length>1?s=3:a.est.length>1?s=2:a.var.length>1&&(s=1),s>=1){i=htmlToElement('<h2 class="var-title">Índice de contenidos seleccionados</h2>'),t.append(i);for(let[e,a]of l.entries()){let l=htmlToElement(`<a class="index-link" role="link"><span>${n.variables[e].nombre}</span></a>`);if(l.onclick=()=>t.querySelector(`#var-${e}`).scrollIntoView(),t.append(l),s>=2)for(let[l,i]of a.entries()){let a=htmlToElement(`<a class="index-link indent" role="link"><span>${o[l]}</span></a>`);if(a.onclick=()=>t.querySelector(`#var-${e}-est-${l}`).scrollIntoView(),t.append(a),s>=3)for(let a of i.keys()){let i=htmlToElement(`<a class="index-link indent-2" role="link"><span>${n.segmentaciones[a]}</span></a>`);i.onclick=()=>t.querySelector(`#var-${e}-est-${l}-seg-${a}`).scrollIntoView(),t.append(i)}}}}function r(e){i.scrollIntoView(),e.preventDefault()}function u(){let e=htmlToElement('<a class="index-back"><i class="fa-solid fa-arrow-turn-up"></i></a>');return e.onclick=r,e}for(let[e,i]of l.entries()){let l=htmlToElement(`<h2 id="var-${e}" class="var-title">Variable seleccionada: ${n.variables[e].nombre}</h2>`);s>=1&&l.append(u()),t.append(l);for(let[l,r]of i.entries()){let i=htmlToElement(`<label id="var-${e}-est-${l}" for="${e}-${l}" class="est-title"><h2>Estimador seleccionado: ${o[l]} <span><i class="fa-solid fa-circle-info"></i></span></h2></label>`);s>=2&&i.append(u()),t.append(i,htmlToElement(`<input id="${e}-${l}" type="checkbox">`),htmlToElement(`<p>${n.descripciones[l]}</p>`));for(let[i,o]of r.entries()){let r=htmlToElement(`<h2 id="var-${e}-est-${l}-seg-${i}" class="est-title">Segmentación seleccionada: ${n.segmentaciones[i]}</h2>`);s>=3&&r.append(u()),t.append(r);for(let e of o){let n=htmlToElement('<div class="chart-container"><div></div></div>');loadChart(n.querySelector("div"),e,a.m),t.append(n)}}}}return t}function p(e,t){return htmlToElement(`<label><input ${t?`name="${t}"`:""} type="checkbox"><span>${e}</span></label>`)}function m(e,t){let n=e.querySelector("input"),a=t.map((e=>e.querySelector("input")));function l(){a.every((e=>e.checked))?n.checked=!0:a.some((e=>!e.checked))&&(n.checked=!1)}n.addEventListener("change",(()=>{for(let e of a)e.checked=n.checked}));for(let e of a)e.addEventListener("change",l)}function f(e){return[...new FormData(e).keys()]}async function v(){let e=htmlToElement(`<main class="selection-page">${htmlData.main}</main>`),t=0,n=await dataPromise,a=e.querySelector("#var-selection");for(let[e,l]of Object.entries(n.bloques)){let i=htmlToElement(`<div>\n\t\t\t<input id="block${++t}-checkbox" type="checkbox">\n\t\t\t<label for="block${t}-checkbox"><span>${e}</span><span><i class="fa-solid fa-play"></i></span></label>\n\t\t</div>`),o=p("Todas"),s=l.map((e=>p(n.variables[e].nombre,e)));m(o,s),i.append(o,...s),a.append(i)}let l=e.querySelector("#est-selection"),i=p("Todas las tablas");l.append(i);let o=[];for(let[e,a]of Object.entries(n.estimadores)){let n=htmlToElement(`<div>\n\t\t\t<input id="block${++t}-checkbox" type="checkbox">\n\t\t\t<label for="block${t}-checkbox"><span>${e}</span><span><i class="fa-solid fa-play"></i></span></label>\n\t\t</div>`),i=Object.entries(a).map((e=>p(e[1],e[0])));o.push(...i),n.append(...i),l.append(n)}m(i,o);let s=e.querySelector("#seg-selection"),r=p("Todas"),c=Object.entries(n.segmentaciones).map((e=>p(e[1],e[0])));m(r,c),s.append(r,...c);let d,h=e.querySelector("#m-selection"),u=p("Todas"),v=Object.entries(n.mediciones).map((e=>p(e[1],e[0])));m(u,v),h.append(u,...v);let b=e.querySelector(".main-button");function w(){d={var:f(a),est:f(l),seg:f(s),m:f(h)},b.disabled=!Object.values(d).every((e=>e.length))}for(let t of e.querySelectorAll("input:not([id])"))t.addEventListener("change",w);return b.addEventListener("click",(function(){b.disabled=!0,function(e){let t=new URLSearchParams(Object.entries(e).map((e=>[e[0],e[1].join(" ")])));location.hash="?"+t.toString()}(d)})),function(e,t){let n=e.querySelectorAll(".distr-link > span:last-of-type"),a=[t.descripciones.evolution,t.descripciones.distribution];for(let e=0;e<n.length;e++)n[e].onclick=function(t){t.preventDefault(),alert(a[e])}}(e,n),e}function b(){let e=htmlToElement('<main class="results-page">\n\t\t<label for="evolution-checkbox" class="est-title"><h2>Descripción de las mediciones <span><i class="fa-solid fa-circle-info"></i></span></h2></label>\n\t\t<input id="evolution-checkbox" type="checkbox">\n\t\t<p>Cargando...</p>\n\t\t<div class="chart-container"><div></div></div>\n\t</main>');return loadChart(e.querySelector(".chart-container > div"),"evolution"),dataPromise.then((t=>e.querySelector("p").innerHTML=t.descripciones.evolution)),e}window.loadChart=async function(e,o,s){let r=await async function(e,t){let[n,i]=e.split(";");n=`${a()}data/${n}.json`,i=i?i.split(","):[];let o=t?(await l).filter((e=>!t.includes(e))):[];if(!i.some((e=>o.some((t=>e.includes(t))))))return n;let s=await request(n).then((e=>e.text())),r=o.map((e=>`indexof(datum.M, '${e}') == -1`)).join(" && ");return JSON.parse(s.replace("indexof(datum.M, 'M') != -1",r))}(o,s);await t;let c=(await vegaEmbed(e,r,{renderer:"canvas",downloadFileName:i(o)})).finalize;s&&function(e,t){let n=`${a()}data/${t.split(";")[0]}.xlsx`,l=htmlToElement(`<a href="${n}" target="_blank" rel="noopener" download>Download table</a>`);e.querySelector(".vega-actions").prepend(l)}(e,o),setTimeout((()=>n.push([e,c])),0)},setInterval((function(){n=n.filter(o)}),1e3),window.share=function(){navigator.share?navigator.share({url:location.href}):navigator.clipboard?navigator.clipboard.writeText(location.href).then((()=>alert("Enlace copiado al portapapeles"))).catch(s):s()};let w=0;async function y(){scrollTo(0,0);let e,t,n=++w,a=location.hash;a.length>1&&"?"==a[1]?[e,t]=[r(),u()]:[e,t]="#/evolution"==a?[htmlToElement(`<header class="main-header">\n\t\t<a href="#"><h1>${htmlData.title}</h1></a>\n\t</header>`),b()]:[htmlToElement(`<header class="main-header-container main-selection-header">\n\t\t${htmlData.header}\n\t</header>`),v()],[e,t]=await Promise.all([e,t]),n==w&&(document.querySelector("header").replaceWith(e),document.querySelector("main").replaceWith(t))}window.onpopstate=y,y()}();