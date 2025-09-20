import{j as e,L as g}from"./app-DUKVp81f.js";import{C as p,a as u}from"./card-DUNJXoyd.js";import{a as l}from"./proxy-ksJoh3Hq.js";import{w as b}from"./use-mobile-navigation-Dcb7j0Tm.js";import{A as f}from"./app-layout-D___LaH8.js";import"./index-Vyl4BKBj.js";import"./index-1EUa3U-_.js";import"./react-icons.esm-bOrlgzrP.js";import"./chart-column-D6iad66K.js";import"./baby-DuzLFHwf.js";/**
 * @license lucide-react v0.475.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const j=[["path",{d:"M12 5v14",key:"s699le"}],["path",{d:"m19 12-7 7-7-7",key:"1idqje"}]],y=l("ArrowDown",j);/**
 * @license lucide-react v0.475.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const N=[["path",{d:"m5 12 7-7 7 7",key:"hav0vg"}],["path",{d:"M12 19V5",key:"x0mq9r"}]],w=l("ArrowUp",N);/**
 * @license lucide-react v0.475.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const v=[["circle",{cx:"12",cy:"12",r:"10",key:"1mglay"}],["line",{x1:"12",x2:"12",y1:"8",y2:"12",key:"1pkeuh"}],["line",{x1:"12",x2:"12.01",y1:"16",y2:"16",key:"4dfq90"}]],k=l("CircleAlert",v);/**
 * @license lucide-react v0.475.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const C=[["path",{d:"M5 12h14",key:"1ays0h"}]],D=l("Minus",C),i=({title:n="Metric",value:c=0,unit:t="",status:s="normal",trend:a="neutral",trendValue:r="",description:d=""})=>{const o={up:{icon:w,color:"text-green-500",bg:"bg-green-50"},down:{icon:y,color:"text-red-500",bg:"bg-red-50"},neutral:{icon:D,color:"text-gray-500",bg:"bg-gray-50"}},m={normal:{icon:b,color:"text-green-500"},warning:{icon:k,color:"text-amber-500"}},x=o[a].icon,h=m[s].icon;return e.jsx(p,{className:"group overflow-hidden border-0 bg-gradient-to-br from-white to-gray-50 shadow-lg transition-all duration-300 hover:shadow-xl",children:e.jsxs(u,{className:"relative p-6",children:[e.jsx("div",{className:`absolute top-0 left-0 h-1 w-full ${s==="normal"?"bg-green-500":"bg-amber-500"}`}),e.jsxs("div",{className:"flex h-full flex-col",children:[e.jsxs("div",{className:"mb-4 flex items-start justify-between",children:[e.jsx("h3",{className:"text-sm font-medium tracking-wider text-gray-500 uppercase",children:n}),e.jsx(h,{className:`h-5 w-5 ${m[s].color}`})]}),e.jsxs("div",{className:"mb-2 flex items-end gap-2",children:[e.jsx("span",{className:"text-3xl font-bold text-gray-900",children:c}),t&&e.jsx("span",{className:"mb-1 text-lg text-gray-500",children:t})]}),r&&e.jsxs("div",{className:`inline-flex items-center rounded-full px-2.5 py-1 ${o[a].bg} mt-2 w-fit`,children:[e.jsx(x,{className:`mr-1 h-4 w-4 ${o[a].color}`}),e.jsxs("span",{className:`text-xs font-medium ${o[a].color}`,children:[r," ",a==="up"?"Increase":a==="down"?"Decrease":"No change"]})]}),d&&e.jsx("p",{className:"mt-4 text-sm text-gray-500",children:d})]})]})})},$=[{title:"GuestDashboard",href:"/dashboard"}];function U({distributionLabel:n,label:c,training:t,kriteria:s}){return e.jsxs(f,{breadcrumbs:$,children:[e.jsx(g,{title:"Dashboard"}),e.jsxs("div",{className:"mx-auto max-w-7xl",children:[e.jsx("header",{className:"mb-8",children:e.jsx("p",{className:"mt-1 text-muted-foreground",children:"Dashboard Rekomendasi Jenis Sayuran "})}),e.jsx("section",{className:"mb-8 flex gap-3",children:e.jsx("div",{children:e.jsxs("div",{className:"grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-4",children:[c.map((a,r)=>e.jsx(i,{title:`Total Dataset ${a.nama}`,value:n[a.nama].length,unit:"data",status:"normal",trend:"up"},r)),e.jsx(i,{title:"Total Dataset",value:t,unit:"data",status:"normal",trend:"up"}),e.jsx(i,{title:"Total Kriteria",value:s,unit:"data",status:"normal",trend:"up"})]})})})]})]})}export{U as default};
