import{j as e}from"./app-3gSJrcYZ.js";import{C as g,a as h}from"./card-CfsoJ79S.js";import{a as r}from"./proxy-DPZ7lxn4.js";import{w as p}from"./use-mobile-navigation-Bj26Qtq-.js";/**
 * @license lucide-react v0.475.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const y=[["path",{d:"M12 5v14",key:"s699le"}],["path",{d:"m19 12-7 7-7-7",key:"1idqje"}]],f=r("ArrowDown",y);/**
 * @license lucide-react v0.475.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const b=[["path",{d:"m5 12 7-7 7 7",key:"hav0vg"}],["path",{d:"M12 19V5",key:"x0mq9r"}]],w=r("ArrowUp",b);/**
 * @license lucide-react v0.475.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const u=[["circle",{cx:"12",cy:"12",r:"10",key:"1mglay"}],["line",{x1:"12",x2:"12",y1:"8",y2:"12",key:"1pkeuh"}],["line",{x1:"12",x2:"12.01",y1:"16",y2:"16",key:"4dfq90"}]],N=r("CircleAlert",u);/**
 * @license lucide-react v0.475.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const j=[["path",{d:"M5 12h14",key:"1ays0h"}]],k=r("Minus",j),A=({title:i="Metric",value:m=0,unit:a="",status:t="normal",trend:o="neutral",trendValue:c="",description:n=""})=>{const s={up:{icon:w,color:"text-green-500",bg:"bg-green-50"},down:{icon:f,color:"text-red-500",bg:"bg-red-50"},neutral:{icon:k,color:"text-gray-500",bg:"bg-gray-50"}},l={normal:{icon:p,color:"text-green-500"},warning:{icon:N,color:"text-amber-500"}},x=s[o].icon,d=l[t].icon;return e.jsx(g,{className:"group overflow-hidden border-0 bg-gradient-to-br from-white to-gray-50 shadow-lg transition-all duration-300 hover:shadow-xl",children:e.jsxs(h,{className:"relative p-6",children:[e.jsx("div",{className:`absolute top-0 left-0 h-1 w-full ${t==="normal"?"bg-green-500":"bg-amber-500"}`}),e.jsxs("div",{className:"flex h-full flex-col",children:[e.jsxs("div",{className:"mb-4 flex items-start justify-between",children:[e.jsx("h3",{className:"text-sm font-medium tracking-wider text-gray-500 uppercase",children:i}),e.jsx(d,{className:`h-5 w-5 ${l[t].color}`})]}),e.jsxs("div",{className:"mb-2 flex items-end gap-2",children:[e.jsx("span",{className:"text-3xl font-bold text-gray-900",children:m}),a&&e.jsx("span",{className:"mb-1 text-lg text-gray-500",children:a})]}),c&&e.jsxs("div",{className:`inline-flex items-center rounded-full px-2.5 py-1 ${s[o].bg} mt-2 w-fit`,children:[e.jsx(x,{className:`mr-1 h-4 w-4 ${s[o].color}`}),e.jsxs("span",{className:`text-xs font-medium ${s[o].color}`,children:[c," ",o==="up"?"Increase":o==="down"?"Decrease":"No change"]})]}),n&&e.jsx("p",{className:"mt-4 text-sm text-gray-500",children:n})]})]})})};export{A as K};
