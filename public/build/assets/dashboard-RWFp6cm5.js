import{j as e,L as g}from"./app-DzrSKPVz.js";import{C as p,a as u}from"./card-Bn-ASFZc.js";import{a as o}from"./proxy-BSbp0aLI.js";import{w as b}from"./use-mobile-navigation-Dd3NJPFA.js";import{A as f}from"./app-layout-Dkh08aB5.js";import"./index-D8BHyDSJ.js";import"./index-Bq8tRjyt.js";import"./react-icons.esm-CFdoLmJo.js";import"./chart-column-a3CW39Jl.js";import"./baby-mEsfqkRn.js";/**
 * @license lucide-react v0.475.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const j=[["path",{d:"M12 5v14",key:"s699le"}],["path",{d:"m19 12-7 7-7-7",key:"1idqje"}]],y=o("ArrowDown",j);/**
 * @license lucide-react v0.475.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const N=[["path",{d:"m5 12 7-7 7 7",key:"hav0vg"}],["path",{d:"M12 19V5",key:"x0mq9r"}]],w=o("ArrowUp",N);/**
 * @license lucide-react v0.475.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const v=[["circle",{cx:"12",cy:"12",r:"10",key:"1mglay"}],["line",{x1:"12",x2:"12",y1:"8",y2:"12",key:"1pkeuh"}],["line",{x1:"12",x2:"12.01",y1:"16",y2:"16",key:"4dfq90"}]],k=o("CircleAlert",v);/**
 * @license lucide-react v0.475.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const C=[["path",{d:"M5 12h14",key:"1ays0h"}]],A=o("Minus",C),m=({title:l="Metric",value:n=0,unit:r="",status:a="normal",trend:s="neutral",trendValue:c="",description:i=""})=>{const t={up:{icon:w,color:"text-green-500",bg:"bg-green-50"},down:{icon:y,color:"text-red-500",bg:"bg-red-50"},neutral:{icon:A,color:"text-gray-500",bg:"bg-gray-50"}},d={normal:{icon:b,color:"text-green-500"},warning:{icon:k,color:"text-amber-500"}},x=t[s].icon,h=d[a].icon;return e.jsx(p,{className:"group overflow-hidden border-0 bg-gradient-to-br from-white to-gray-50 shadow-lg transition-all duration-300 hover:shadow-xl",children:e.jsxs(u,{className:"relative p-6",children:[e.jsx("div",{className:`absolute top-0 left-0 h-1 w-full ${a==="normal"?"bg-green-500":"bg-amber-500"}`}),e.jsxs("div",{className:"flex h-full flex-col",children:[e.jsxs("div",{className:"mb-4 flex items-start justify-between",children:[e.jsx("h3",{className:"text-sm font-medium tracking-wider text-gray-500 uppercase",children:l}),e.jsx(h,{className:`h-5 w-5 ${d[a].color}`})]}),e.jsxs("div",{className:"mb-2 flex items-end gap-2",children:[e.jsx("span",{className:"text-3xl font-bold text-gray-900",children:n}),r&&e.jsx("span",{className:"mb-1 text-lg text-gray-500",children:r})]}),c&&e.jsxs("div",{className:`inline-flex items-center rounded-full px-2.5 py-1 ${t[s].bg} mt-2 w-fit`,children:[e.jsx(x,{className:`mr-1 h-4 w-4 ${t[s].color}`}),e.jsxs("span",{className:`text-xs font-medium ${t[s].color}`,children:[c," ",s==="up"?"Increase":s==="down"?"Decrease":"No change"]})]}),i&&e.jsx("p",{className:"mt-4 text-sm text-gray-500",children:i})]})]})})},D=[{title:"GuestDashboard",href:"/dashboard"}];function U({distributionLabel:l,label:n,training:r,kriteria:a}){return e.jsxs(f,{breadcrumbs:D,children:[e.jsx(g,{title:"Dashboard"}),e.jsxs("div",{className:"mx-auto max-w-7xl",children:[e.jsx("header",{className:"mb-8",children:e.jsx("p",{className:"mt-1 text-muted-foreground",children:"Dashboard Rekomendasi Jenis Sayuran "})}),e.jsx("section",{className:"mb-8 flex gap-3",children:e.jsx("div",{children:e.jsxs("div",{className:"grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-4",children:[e.jsx(m,{title:"Total Dataset",value:r,unit:"data",status:"normal",trend:"up"}),e.jsx(m,{title:"Total Kriteria",value:a,unit:"data",status:"normal",trend:"up"})]})})})]})]})}export{U as default};
