(this["webpackJsonpnear-giveaway"]=this["webpackJsonpnear-giveaway"]||[]).push([[0],{10:function(e,t,n){"use strict";(function(e){n.d(t,"d",(function(){return j})),n.d(t,"e",(function(){return b})),n.d(t,"a",(function(){return x})),n.d(t,"b",(function(){return g})),n.d(t,"c",(function(){return v}));var a=n(77),r=n(12),c=n.n(r),i=n(25),s=n.n(i),o=n(145),l=n.n(o),d=n(17),u=n(79),m=n.n(u),j=function(e){return e?e.format("DD MMM yyyy HH:mm"):""},b=function(e){var t=Math.floor(e/1e6).toFixed();return s()(t,"x")},x=l()(3).times(Math.pow(10,13)).toFixed(),f=188,p=13,h=32,g=function(){var t=Object(a.a)(c.a.mark((function t(n){var a,r;return c.a.wrap((function(t){for(;;)switch(t.prev=t.next){case 0:if(a=O(),44!==n.length){t.next=4;break}return r=new d.utils.PublicKey({keyType:d.utils.key_pair.KeyType.ED25519,data:e.from(n,"hex")}),t.abrupt("return",!!r.toString());case 4:return t.prev=4,t.next=7,new d.Account(a,n).state();case 7:return t.abrupt("return",!0);case 10:return t.prev=10,t.t0=t.catch(4),t.abrupt("return",!1);case 13:case"end":return t.stop()}}),t,null,[[4,10]])})));return function(e){return t.apply(this,arguments)}}();function O(){if(!window.connection){var e=m()("testnet");console.log(e);var t=new d.providers.JsonRpcProvider(e.nodeUrl);window.connection=new d.Connection(e.nodeUrl,t,{})}return window.connection}var v=[f,p,h]}).call(this,n(26).Buffer)},186:function(e,t){},192:function(e,t){},321:function(e,t,n){},324:function(e,t,n){"use strict";n.r(t);var a=n(60),r=n(77),c=n(12),i=n.n(c),s=n(0),o=n(44),l=n.n(o),d=n(6),u=(n(99),n(329)),m=n(331),j=n(29),b=n(2),x=function(e){e.contract;var t=e.currentUser,n=e.nearConfig,a=e.wallet,r=e.isLoading,c=Object(s.useState)(!0),i=Object(d.a)(c,2),o=i[0],l=i[1],x=Object(u.a)((function(){return l(!0)}),500),f=Object(d.a)(x,3)[2];return Object(s.useEffect)((function(){f()}),[f]),Object(b.jsx)(b.Fragment,{children:Object(b.jsx)(m.a,{as:s.Fragment,show:o,enter:"transform transition duration-[500ms]",enterFrom:"opacity-0 rotate-[-120deg] scale-50",enterTo:"opacity-100 rotate-0 scale-100",leave:"transform duration-200 transition ease-in-out",leaveFrom:"opacity-100 rotate-0 scale-100 ",leaveTo:"opacity-0 scale-95 ",children:Object(b.jsxs)("div",{className:"flex justify-between bg-gradient-to-r from-indigo-400 via-purple-400 to-pink-400 mt-6 p-2 mx-auto rounded-xl shadow-md items-center",children:[Object(b.jsx)(j.b,{to:"/",children:Object(b.jsx)("img",{className:"h-14 w-20",src:"https://docs.near.org/img/near_logo.svg",alt:"NEAR Logo"})}),Object(b.jsxs)("div",{className:"text-xl font-medium text-black uppercase flex ml-4 items-center",children:["NEAR Giveaway",r&&Object(b.jsx)("svg",{xmlns:"http://www.w3.org/2000/svg",className:"animate-spin ml-4 h-6 w-6",fill:"none",viewBox:"0 0 24 24",stroke:"currentColor",children:Object(b.jsx)("path",{strokeLinecap:"round",strokeLinejoin:"round",strokeWidth:2,d:"M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"})})]}),Object(b.jsx)("div",{className:"flex justify-between",children:t?Object(b.jsx)("button",{className:"bg-gradient-to-r from-indigo-400 to-indigo-500 hover:from-indigo-700 hover:to-indigo-900 text-black hover:text-white py-2 px-4 rounded float-right",onClick:function(){a.signOut(),window.location.replace(window.location.origin+window.location.pathname)},children:"Logout"}):Object(b.jsx)("button",{className:"bg-gradient-to-r from-indigo-400 to-indigo-500 hover:from-indigo-700 hover:to-indigo-900 text-black hover:text-white py-2 px-4 rounded float-right",onClick:function(){a.requestSignIn(n.contractName,"NEAR Giveway")},children:"Login"})})]})})})},f=n(330);function p(e){var t=e.error,n=e.callback;function a(){n()}return Object(b.jsx)(b.Fragment,{children:Object(b.jsx)(m.a,{appear:!0,show:""!==t,as:s.Fragment,children:Object(b.jsx)(f.a,{as:"div",className:"fixed inset-0 z-10 overflow-y-auto",onClose:a,children:Object(b.jsxs)("div",{className:"min-h-screen px-4 text-center",children:[Object(b.jsx)(m.a.Child,{as:s.Fragment,enter:"ease-out duration-300",enterFrom:"opacity-0",enterTo:"opacity-100",leave:"ease-in duration-200",leaveFrom:"opacity-100",leaveTo:"opacity-0",children:Object(b.jsx)(f.a.Overlay,{className:"fixed inset-0"})}),Object(b.jsx)("span",{className:"inline-block h-screen align-middle","aria-hidden":"true",children:"\u200b"}),Object(b.jsx)(m.a.Child,{as:s.Fragment,enter:"ease-out duration-300",enterFrom:"opacity-0 scale-95",enterTo:"opacity-100 scale-100",leave:"ease-in duration-200",leaveFrom:"opacity-100 scale-100",leaveTo:"opacity-0 scale-95",children:Object(b.jsxs)("div",{className:"inline-block w-full max-w-md p-6 my-4 overflow-hidden text-left align-middle transition-all transform bg-white shadow-xl rounded-2xl",children:[Object(b.jsx)(f.a.Title,{as:"h3",className:"text-lg font-medium leading-6 text-gray-900",children:"Opps, something went wrong"}),Object(b.jsx)("div",{className:"mt-2",children:Object(b.jsx)("p",{className:"text-sm text-gray-500",children:t})}),Object(b.jsx)("div",{className:"mt-4",children:Object(b.jsx)("button",{type:"button",className:"inline-flex justify-center px-4 py-2 text-sm font-medium text-blue-900 bg-blue-100 border border-transparent rounded-md hover:bg-blue-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-blue-500",onClick:a,children:"Close"})})]})})]})})})})}var h=function(e){var t=e.onAddEvent,n=Object(s.useState)(!1),a=Object(d.a)(n,2),r=a[0],c=a[1],i=Object(s.useState)(!1),o=Object(d.a)(i,2),l=o[0],j=o[1],x=Object(u.a)((function(){return c(!0)}),100),f=Object(d.a)(x,3)[2];return Object(s.useEffect)((function(){f()}),[f]),Object(b.jsx)(m.a,{as:s.Fragment,show:r,enter:"transform transition duration-[200ms]",enterFrom:"opacity-0 rotate-[-120deg] scale-50",enterTo:"opacity-100 rotate-0 scale-100",leave:"transform duration-200 transition ease-in-out",leaveFrom:"opacity-100 rotate-0 scale-100 ",leaveTo:"opacity-0 scale-95 ",children:Object(b.jsx)("button",{onClick:t,className:"w-full bg-gradient-to-r ".concat(l?"from-green-300 to-blue-500":"from-green-100 to-blue-300"," p-6 mx-auto max-w-sm rounded-xl shadow-md cursor-pointer"),onMouseEnter:function(){return j(!0)},onMouseLeave:function(){return j(!1)},children:Object(b.jsx)("svg",{xmlns:"http://www.w3.org/2000/svg",className:"h-6 w-6 mx-auto",fill:"none",viewBox:"0 0 24 24",stroke:"currentColor",children:Object(b.jsx)("path",{strokeLinecap:"round",strokeLinejoin:"round",strokeWidth:2,d:"M12 4v16m8-8H4"})})})})},g=n(59),O=n(333),v=n(144),w=n.n(v),y=function(e){var t=e.label,n=e.value,a=e.lines,r=e.onValueChange,c=e.isDate,i=e.placeholder;return Object(b.jsxs)("div",{className:"mt-2 flex justify-between rounded-md",children:[Object(b.jsx)("label",{htmlFor:t,className:"block text-sm font-medium text-gray-700 w-1/3 mr-2",children:t}),c?Object(b.jsx)(w.a,{className:"border-2 p-1 focus:ring-indigo-500 focus:border-indigo-500 block w-2/3 sm:text-sm border-gray-200 rounded-md",value:n,onChange:function(e){return r(e)}}):a?Object(b.jsx)("textarea",{className:"border-2 p-1 focus:ring-indigo-500 focus:border-indigo-500 block w-2/3 sm:text-sm border-gray-200 rounded-md",name:t,id:t,rows:a,placeholder:i||"",onChange:r}):Object(b.jsx)("input",{type:"text",name:t,id:t,placeholder:i||"",className:"border-2 p-1 focus:ring-indigo-500 focus:border-indigo-500 block w-2/3 sm:text-sm border-gray-200 rounded-md",value:n,onChange:r})]})},N=n(25),k=n.n(N),_=n(58),C=n(10),S=function(e){var t=e.isOpen,n=e.onClose,a=e.onRegister,r=Object(s.useState)(""),c=Object(d.a)(r,2),i=c[0],o=c[1],l=Object(s.useState)(""),u=Object(d.a)(l,2),j=u[0],x=u[1],p=Object(s.useState)([{id:"1",text:"1"}]),h=Object(d.a)(p,2),v=h[0],w=h[1],N=Object(s.useState)([{id:"lkskrnk.testnet",text:"lkskrnk.testnet"}]),S=Object(d.a)(N,2),E=S[0],F=S[1],L=Object(s.useState)(!1),T=Object(d.a)(L,2),M=T[0],A=T[1],D=Object(s.useState)(new Date),U=Object(d.a)(D,2),I=U[0],z=U[1],W=Object(s.useState)(new Date),R=Object(d.a)(W,2),V=R[0],B=R[1],H=Object(s.useState)(new Date),P=Object(d.a)(H,2),K=P[0],q=P[1],G=function(){return i&&i.length>0&&j&&j.length>0&&v.length>0&&I&&V};return Object(s.useEffect)((function(){t&&(z(k()().add(8,"days").startOf("day").toDate()),B(k()().add(1,"day").startOf("day").toDate()),q(k()().add(7,"days").endOf("day").toDate()))}),[t]),Object(b.jsx)(b.Fragment,{children:Object(b.jsx)(m.a,{appear:!0,show:t,as:s.Fragment,children:Object(b.jsx)(f.a,{as:"div",className:"fixed inset-0 z-10 overflow-y-auto",onClose:n,children:Object(b.jsxs)("div",{className:"min-h-screen px-4 text-center",children:[Object(b.jsx)(m.a.Child,{as:s.Fragment,enter:"ease-out duration-100",enterFrom:"opacity-0",enterTo:"opacity-100",leave:"ease-in duration-200",leaveFrom:"opacity-100",leaveTo:"opacity-0",children:Object(b.jsx)(f.a.Overlay,{className:"fixed inset-0"})}),Object(b.jsx)("span",{className:"inline-block h-screen align-middle","aria-hidden":"true",children:"\u200b"}),Object(b.jsx)(m.a.Child,{as:s.Fragment,enter:"ease-out duration-300",enterFrom:"opacity-0 scale-95",enterTo:"opacity-100 scale-100",leave:"ease-in duration-200",leaveFrom:"opacity-100 scale-100",leaveTo:"opacity-0 scale-95",children:Object(b.jsxs)("div",{className:"inline-block w-full max-w-md p-6 my-4 overflow-hidden text-left align-middle transition-all transform bg-white shadow-xl rounded-2xl",children:[Object(b.jsx)(f.a.Title,{as:"h3",className:"text-lg font-medium leading-6 text-gray-900",children:"New event"}),Object(b.jsx)("div",{className:"mt-2 mb-2",children:Object(b.jsx)("p",{className:"text-sm text-gray-500",children:"Fill in the event details and press register."})}),Object(b.jsx)("hr",{}),Object(b.jsx)(y,{label:"Title",placeholder:"Enter title",value:i,onValueChange:function(e){return o(e.target.value)}}),Object(b.jsx)(y,{label:"Description",value:j,placeholder:"Enter description",onValueChange:function(e){return x(e.target.value)}}),Object(b.jsx)(y,{label:"Accept participants from",value:V,isDate:!0,onValueChange:function(e){return B(e)}}),Object(b.jsx)(y,{label:"Accept participants until",value:K,isDate:!0,onValueChange:function(e){return q(e)}}),Object(b.jsx)(y,{label:"Draw date",value:I,isDate:!0,onValueChange:function(e){return z(e)}}),Object(b.jsx)("div",{className:"mt-4",children:Object(b.jsx)(O.a.Group,{children:Object(b.jsxs)("div",{className:"flex justify-between",children:[Object(b.jsx)(O.a.Label,{children:"Allow duplicates"}),Object(b.jsx)(O.a,{checked:M,onChange:A,className:"".concat(M?"bg-blue-600":"bg-gray-200"," relative inline-flex items-center h-6 rounded-full w-11"),children:Object(b.jsx)("span",{className:"".concat(M?"translate-x-6":"translate-x-1"," inline-block w-4 h-4 transform bg-white rounded-full")})})]})})}),Object(b.jsxs)("div",{className:"mt-4",children:[Object(b.jsx)("label",{className:"mb-2",htmlFor:"rewards",children:"Rewards (NEAR):"}),Object(b.jsx)(_.WithContext,{tags:v,delimiters:C.c,handleDelete:function(e){w(v.filter((function(t,n){return n!==e})))},handleAddition:function(e){parseFloat(e.id)>0?w([].concat(Object(g.a)(v),[e])):alert("Illegal reward "+e.id)},inputFieldPosition:"top",allowUnique:!1,placeholder:"Insert rewards",allowDragDrop:!1})]}),Object(b.jsxs)("div",{className:"mt-4",children:[Object(b.jsx)("label",{className:"mb-2",htmlFor:"participants",children:"Participants:"}),Object(b.jsx)(_.WithContext,{tags:E,delimiters:C.c,handleDelete:function(e){F(E.filter((function(t,n){return n!==e})))},handleAddition:function(e){Object(C.b)(e.id).then((function(t){t?F([].concat(Object(g.a)(E),[e])):alert("Illegal account "+e.id)}))},handleDrag:function(e,t,n){var a=E.slice();a.splice(t,1),a.splice(n,0,e),F(a)},inputFieldPosition:"top",allowUnique:!M,placeholder:"Insert participants",allowDragDrop:!0})]}),Object(b.jsxs)("div",{className:"mt-4 flex justify-between",children:[Object(b.jsx)("button",{type:"button",className:"inline-flex justify-center px-4 py-2 text-sm font-medium text-blue-900 bg-red-100 border border-transparent rounded-md hover:bg-red-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-red-500",onClick:n,children:"Cancel"}),Object(b.jsx)("button",{type:"button",className:"inline-flex justify-center px-4 py-2 text-sm font-medium text-blue-900 bg-blue-100 border border-transparent rounded-md hover:bg-blue-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-blue-500 disabled:opacity-30",onClick:function(){G&&a(i,j,I,K,V,M,v,E)},disabled:!G(),children:"Register"})]})]})})]})})})})},E=n(17),F=function(e){var t=e.currentEvent,n=e.index,a=e.delay,r=e.contract,c=e.onLoading,i=Object(s.useState)(!1),o=Object(d.a)(i,2),l=o[0],x=o[1],f=Object(s.useState)(!1),p=Object(d.a)(f,2),h=p[0],g=p[1],O=Object(s.useState)(t),v=Object(d.a)(O,2),w=v[0],y=v[1],N=Object(C.e)(w.event_timestamp),k=w.finalized_timestamp&&"0"!==w.finalized_timestamp?Object(C.e)(w.finalized_timestamp):void 0,_=Object(C.e)(w.add_participants_start_timestamp),S=Object(C.e)(w.add_participants_end_timestamp);Object(s.useEffect)((function(){c&&(c(!0),r.get_event({event_id:w.event_id}).then((function(e){c(!1),y(e)}),(function(e){c(!1)})))}),[r,w.event_id,c]);var F=Object(u.a)((function(){return x(!0)}),200*n),L=Object(d.a)(F,3)[2];return Object(s.useEffect)((function(){L()}),[L]),Object(b.jsx)(m.a,{as:s.Fragment,show:l,enter:"transform transition duration-[".concat(a,"ms]"),enterFrom:"opacity-0 rotate-[-120deg] scale-50",enterTo:"opacity-100 rotate-0 scale-100",leave:"transform duration-200 transition ease-in-out",leaveFrom:"opacity-100 rotate-0 scale-100 ",leaveTo:"opacity-0 scale-95 ",children:Object(b.jsxs)(j.b,{to:"events/".concat(w.event_id),onMouseEnter:function(){return g(!0)},onMouseLeave:function(){return g(!1)},className:"w-full bg-gradient-to-r ".concat(h?"from-yellow-500 to-red-600":"from-yellow-400 to-red-500","  p-6 max-w-sm mx-auto rounded-xl flex-col shadow-md flex space-y-2 cursor-pointer"),children:[Object(b.jsx)("div",{className:"text-xl font-medium text-black text-center",children:w.title}),Object(b.jsxs)("div",{className:"text-xl font-medium text-black break-all flex flex-row justify-start",children:[Object(b.jsx)("svg",{xmlns:"http://www.w3.org/2000/svg",className:"h-6 w-6 mr-1 flex-none",fill:"none",viewBox:"0 0 24 24",stroke:"currentColor",children:Object(b.jsx)("path",{strokeLinecap:"round",strokeLinejoin:"round",strokeWidth:2,d:"M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"})}),w.description]}),Object(b.jsxs)("div",{className:"text-md font-medium text-black text flex flex-row justify-start",children:[Object(b.jsx)("svg",{xmlns:"http://www.w3.org/2000/svg",className:"h-6 w-6 mr-1 flex-none",fill:"none",viewBox:"0 0 24 24",stroke:"currentColor",children:Object(b.jsx)("path",{strokeLinecap:"round",strokeLinejoin:"round",strokeWidth:2,d:"M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"})}),Object(b.jsxs)("div",{className:"mr-2",children:["Created: ",Object(b.jsx)("br",{})," ",Object(C.d)(N)]}),k&&Object(b.jsxs)("div",{children:["Finalized: ",Object(b.jsx)("br",{})," ",Object(C.d)(k)]})]}),Object(b.jsxs)("div",{className:"text-md font-medium text-black text flex flex-row justify-start",children:[Object(b.jsx)("svg",{xmlns:"http://www.w3.org/2000/svg",className:"h-6 w-6 mr-1 flex-none",fill:"none",viewBox:"0 0 24 24",stroke:"currentColor",children:Object(b.jsx)("path",{strokeLinecap:"round",strokeLinejoin:"round",strokeWidth:2,d:"M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"})}),Object(b.jsxs)("p",{className:"flex-wrap",children:["Accept participants: ",Object(b.jsx)("br",{})," ",Object(C.d)(_)," -"," ",Object(C.d)(S)]})]}),Object(b.jsxs)("div",{className:"text-md font-medium text-black text flex flex-row justify-start",children:[Object(b.jsx)("svg",{xmlns:"http://www.w3.org/2000/svg",className:"h-6 w-6 mr-1 flex-none",fill:"none",viewBox:"0 0 24 24",stroke:"currentColor",children:Object(b.jsx)("path",{strokeLinecap:"round",strokeLinejoin:"round",strokeWidth:2,d:"M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z"})}),Object(b.jsx)("p",{children:"Rewards:"}),w.rewards&&w.rewards.map((function(e,t){return Object(b.jsx)("div",{className:"pr-2 pl-2 ml-2 bg-gradient-to-r from-green-300 to-green-500 rounded-lg",children:"".concat(E.utils.format.formatNearAmount(e,2))},t)}))]}),Object(b.jsxs)("div",{className:"text-md font-medium text-black text flex flex-row justify-start",children:[Object(b.jsx)("svg",{xmlns:"http://www.w3.org/2000/svg",className:"h-6 w-6 mr-1 flex-none",fill:"none",viewBox:"0 0 24 24",stroke:"currentColor",children:Object(b.jsx)("path",{strokeLinecap:"round",strokeLinejoin:"round",strokeWidth:2,d:"M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z"})}),!w.participants||w.participants&&0===w.participants.length&&"No participants yet, only owner can add new participants.",w.participants&&w.participants.length>0&&"".concat(w.participants.length," total participants.")]})]})})},L=n(332),T=n(98),M=function(e){var t=e.limit,n=e.limits,a=e.onLimitChange;return Object(b.jsx)("div",{className:"w-45 rounded-lg pt-1 pb-2 px-2 bg-gradient-to-r from-indigo-400 to-purple-400",children:Object(b.jsx)(L.a,{value:t,onChange:a,children:Object(b.jsxs)("div",{className:"relative mt-1 flex items-center",children:[Object(b.jsx)(L.a.Label,{className:"mr-4",children:"Limit"}),Object(b.jsxs)(L.a.Button,{className:"relative w-full py-2 pl-3 pr-10 text-left bg-white rounded-lg shadow-md cursor-default focus:outline-none focus-visible:ring-2 focus-visible:ring-opacity-75 focus-visible:ring-white focus-visible:ring-offset-orange-300 focus-visible:ring-offset-2 focus-visible:border-indigo-500 sm:text-sm",children:[Object(b.jsx)("span",{className:"block truncate",children:t}),Object(b.jsx)("span",{className:"absolute inset-y-0 right-0 flex items-center pr-2 pointer-events-none",children:Object(b.jsx)(T.b,{className:"w-5 h-5 text-gray-400","aria-hidden":"true"})})]}),Object(b.jsx)(m.a,{as:s.Fragment,leave:"transition ease-in duration-100",leaveFrom:"opacity-100",leaveTo:"opacity-0",children:Object(b.jsx)(L.a.Options,{className:"absolute w-full py-1 mt-1 overflow-auto text-base bg-white rounded-md shadow-lg max-h-60 ring-1 ring-black ring-opacity-5 focus:outline-none sm:text-sm",children:n.map((function(e){return Object(b.jsx)(L.a.Option,{className:function(e){var t=e.active;return"".concat(t?"text-amber-900 bg-amber-100":"text-gray-900","\n                          cursor-default select-none relative py-2 pl-10 pr-4")},value:e,children:function(t){var n=t.selected;t.active;return Object(b.jsxs)(b.Fragment,{children:[Object(b.jsx)("span",{className:"".concat(n?"font-medium":"font-normal"," block truncate"),children:e}),n?Object(b.jsx)("span",{className:"".concat("text-amber-600","\n                                absolute inset-y-0 left-0 flex items-center pl-3"),children:Object(b.jsx)(T.a,{className:"w-5 h-5","aria-hidden":"true"})}):null]})}},e)}))})})]})})})},A=function(e){var t=e.contract,n=(e.currentUser,e.nearConfig,e.wallet,e.onLoading),a=e.onError,r=Object(s.useState)(),c=Object(d.a)(r,2),i=c[0],o=c[1],l=Object(s.useState)(30),u=Object(d.a)(l,2),m=u[0],j=u[1],x=Object(s.useState)(!0),f=Object(d.a)(x,2),p=f[0],g=f[1],v=Object(s.useState)(!0),w=Object(d.a)(v,2),y=w[0],N=w[1],_=Object(s.useState)(!1),L=Object(d.a)(_,2),T=L[0],A=L[1],D=function(e){return"".concat(k()(e).format("x"),"000000")};return Object(s.useEffect)((function(){if(n&&y){n(!0);p?t.get_events_to_finalize({from_index:0,limit:m}).then((function(e){o(e.sort((function(e,t){return parseInt(t.event_timestamp)-parseInt(e.event_timestamp)})))}),(function(e){a("".concat(e))})):t.get_events({from_index:0,limit:m}).then((function(e){o(e.sort((function(e,t){return parseInt(t.event_timestamp)-parseInt(e.event_timestamp)})))}),(function(e){a("".concat(e))})),N(!1),n(!1)}}),[t,n,a,y,p,m]),Object(b.jsx)(b.Fragment,{children:Object(b.jsxs)("div",{className:"container mx-auto flex-row mt-4",children:[Object(b.jsxs)("div",{className:"flex justify-between items-center mb-4",children:[Object(b.jsx)(M,{limit:m,limits:[1,5,10,20,30,50,100],onLimitChange:function(e){j(e),N(!0)}}),Object(b.jsx)(O.a.Group,{className:"flex justify-end items-center mr-2 ml-4 rounded-lg p-4 bg-gradient-to-r from-purple-400 to-pink-400",children:Object(b.jsxs)("div",{className:"flex items-center",children:[Object(b.jsx)(O.a.Label,{className:"mr-4",children:p?"Active events":"All Events"}),Object(b.jsx)(O.a,{checked:p,onChange:function(e){N(!0),g(e)},className:"".concat(p?"bg-blue-600":"bg-gray-200"," relative inline-flex items-center h-6 rounded-full w-11 transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"),children:Object(b.jsx)("span",{className:"".concat(p?"translate-x-6":"translate-x-1"," inline-block w-4 h-4 transform bg-white rounded-full transition-transform")})})]})})]}),Object(b.jsxs)("div",{className:"grid lg:grid-cols-4 md:grid-cols-2 xs:grid-cols-1 gap-4",children:[Object(b.jsx)(h,{onAddEvent:function(){return A(!0)}}),i&&i.map((function(e,a){return Object(b.jsx)(F,{currentEvent:e,delay:20,index:a,contract:t,onLoading:n},a)}))]}),T&&Object(b.jsx)(S,{isOpen:T,onClose:function(){return A(!1)},onRegister:function(e,r,c,i,s,o,l,d){n(!0);var u=l.map((function(e){return e.id})).reduce((function(e,t){return parseFloat(e)+parseFloat(t)})),m=Math.min(10,.01*u);t.add_event({event_input:{title:e,description:r,rewards:l.map((function(e){return E.utils.format.parseNearAmount(e.id.toString())})),participants:d.map((function(e){return e.id})),allow_duplicate_participants:o,event_timestamp:D(c),add_participants_start_timestamp:D(s),add_participants_end_timestamp:D(i)}},C.a,E.utils.format.parseNearAmount((m+u).toString())).then((function(){n(!1),A(!1)}),(function(e){n(!1),a("".concat(e&&e.kind?e.kind.ExecutionError:e))}))}})]})})},D=n(7),U=function(e){var t=e.participant;return Object(b.jsx)("div",{className:"flex text-md",children:t})},I=function(e){var t=e.contract,n=e.currentUser,a=e.onClose,r=e.onLoading,c=e.onError,i=Object(s.useState)(!1),o=Object(d.a)(i,2),l=o[0],x=o[1],f=Object(s.useState)("#000"),p=Object(d.a)(f,2),h=p[0],O=p[1],v=Object(s.useState)(),w=Object(d.a)(v,2),y=w[0],N=w[1],S=Object(s.useState)(),F=Object(d.a)(S,2),L=F[0],T=F[1],M=Object(s.useState)(),A=Object(d.a)(M,2),I=A[0],z=A[1],W=Object(s.useState)(),R=Object(d.a)(W,2),V=R[0],B=R[1],H=Object(s.useState)(),P=Object(d.a)(H,2),K=P[0],q=P[1],G=Object(s.useState)(),J=Object(d.a)(G,2),Q=J[0],X=J[1],Y=Object(s.useState)(!0),Z=Object(d.a)(Y,2),$=Z[0],ee=Z[1],te=Object(s.useState)([]),ne=Object(d.a)(te,2),ae=ne[0],re=ne[1],ce=Object(s.useState)(!1),ie=Object(d.a)(ce,2),se=ie[0],oe=ie[1],le=Object(D.g)(),de=Object(u.a)((function(){return x(!0)}),100),ue=Object(d.a)(de,3)[2];Object(s.useEffect)((function(){ue(),y&&y.event_timestamp&&oe(Object(C.e)(y.event_timestamp).isAfter(k()()))}),[ue,oe,y]);return Object(s.useEffect)((function(){var e=parseInt(le.eventId);e&&$&&r&&c&&(r(!0),t.get_event({event_id:e}).then((function(e){N(e),T(e.owner_account_id&&n&&e.owner_account_id===n.accountId),z(Object(C.e)(e.event_timestamp)),B(e.finalized_timestamp&&"0"!==e.finalized_timestamp?Object(C.e)(e.finalized_timestamp):void 0),q(Object(C.e)(e.add_participants_start_timestamp)),X(Object(C.e)(e.add_participants_end_timestamp)),ee(!1),r(!1)}),(function(e){ee(!1),r(!1),c("".concat(e&&e.kind?e.kind.ExecutionError:e))})))}),[t,le.eventId,n,$,r,c]),y?Object(b.jsx)(m.a,{as:s.Fragment,show:l,enter:"transform transition duration-[20ms]",enterFrom:"opacity-0 rotate-[-120deg] scale-50",enterTo:"opacity-100 rotate-0 scale-100",leave:"transform duration-200 transition ease-in-out",leaveFrom:"opacity-100 rotate-0 scale-100 ",leaveTo:"opacity-0 scale-95 ",children:Object(b.jsxs)("div",{className:"mw-800 mt-4 bg-gradient-to-r from-indigo-300 to-indigo-500 p-6 rounded-xl flex-col shadow-md flex",children:[Object(b.jsxs)("div",{className:"text-2xl flex justify-between font-medium items-center mb-4",children:[Object(b.jsx)("div",{className:"mt-2 text-2xl text-center font-medium text-black",children:y.title}),Object(b.jsx)(j.b,{to:"/",className:"font-medium ",onClick:a,onMouseEnter:function(){return O("#ddd")},onMouseLeave:function(){return O("#000")},children:Object(b.jsx)("svg",{xmlns:"http://www.w3.org/2000/svg",className:"h-6 w-6",fill:"none",viewBox:"0 0 24 24",stroke:h,children:Object(b.jsx)("path",{strokeLinecap:"round",strokeLinejoin:"round",strokeWidth:2,d:"M6 18L18 6M6 6l12 12"})})})]}),Object(b.jsxs)("div",{className:"text-xl font-medium text-black flex flex-row items-center justify-between",children:[Object(b.jsx)("svg",{xmlns:"http://www.w3.org/2000/svg",className:"h-6 w-6 mr-1 flex-none",fill:"none",viewBox:"0 0 24 24",stroke:"currentColor",children:Object(b.jsx)("path",{strokeLinecap:"round",strokeLinejoin:"round",strokeWidth:2,d:"M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"})}),Object(b.jsx)("p",{className:"flex-grow",children:y.description}),!V&&"0"!==V&&Object(b.jsx)("button",{className:"disabled:opacity-50 bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded flex-none",disabled:se,onClick:function(){!V&&I.isBefore(k()())&&(r(!0),t.finalize_event({event_id:y.id},C.a).then((function(){ee(!0),r(!1)}),(function(e){r(!1),c("".concat(e&&e.kind?e.kind.ExecutionError:e))})))},children:"Finalize Event"})]}),Object(b.jsxs)("div",{className:"text-md font-medium text-black text flex flex-row items-center",children:[Object(b.jsx)("svg",{xmlns:"http://www.w3.org/2000/svg",className:"h-6 w-6 mr-1",fill:"none",viewBox:"0 0 24 24",stroke:"currentColor",children:Object(b.jsx)("path",{strokeLinecap:"round",strokeLinejoin:"round",strokeWidth:2,d:"M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"})}),I&&Object(b.jsxs)("p",{className:"flex-grow",children:["Draw date: ",Object(C.d)(I)]}),V&&Object(b.jsxs)("p",{children:["Finalized date: ",Object(C.d)(V)]})]}),Object(b.jsxs)("div",{className:"text-md font-medium text-black text flex flex-row items-center mt-2",children:[Object(b.jsx)("svg",{xmlns:"http://www.w3.org/2000/svg",className:"h-6 w-6 mr-1",fill:"none",viewBox:"0 0 24 24",stroke:"currentColor",children:Object(b.jsx)("path",{strokeLinecap:"round",strokeLinejoin:"round",strokeWidth:2,d:"M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"})}),"Accepting participants: ",Object(C.d)(K)," -"," ",Object(C.d)(Q)]}),Object(b.jsxs)("div",{className:"text-md font-medium text-black text flex flex-row items-center mt-2",children:[Object(b.jsx)("svg",{xmlns:"http://www.w3.org/2000/svg",className:"h-6 w-6 mr-1",fill:"none",viewBox:"0 0 24 24",stroke:"currentColor",children:Object(b.jsx)("path",{strokeLinecap:"round",strokeLinejoin:"round",strokeWidth:2,d:"M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z"})}),"Rewards (NEAR):",y.rewards&&y.rewards.map((function(e,t){return Object(b.jsx)("div",{className:"pr-2 pl-2 ml-2 bg-gradient-to-r from-green-300 to-green-500 rounded-lg",children:E.utils.format.formatNearAmount(e,2)},t)}))]}),Object(b.jsx)("div",{className:"text-xl font-medium text-black text-center",children:y.participants.length>0?"Participants:":"No participants yet, add participants before the end date."}),Object(b.jsx)("div",{className:"text-md font-medium text-black text flex flex-row items-center",children:y&&y.participants&&y.participants.length>0&&Object(b.jsx)("div",{children:y.participants.map((function(e,t){return Object(b.jsx)(U,{participant:e},t)}))})}),L&&Object(b.jsxs)(b.Fragment,{children:[Object(b.jsx)("div",{className:"text-xl font-medium text-black text-center",children:"Add participants:"}),Object(b.jsxs)("div",{className:"mt-4 flex mr-4",children:[Object(b.jsx)("div",{className:"flex-auto",children:Object(b.jsx)(_.WithContext,{tags:ae,delimiters:C.c,handleDelete:function(e){re(ae.filter((function(t,n){return n!==e})))},handleAddition:function(e){Object(C.b)(e.text).then((function(t){t?re([].concat(Object(g.a)(ae),[e])):alert("Illegal account "+e.text)}))},handleDrag:function(e,t,n){var a=ae.slice();a.splice(t,1),a.splice(n,0,e),re(a)},inputFieldPosition:"top",allowUnique:!y.allowDuplicates,placeholder:"Insert participants",allowDragDrop:!0,inline:!0})}),Object(b.jsx)("button",{className:"disabled:opacity-50 bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded flex-none h-12",disabled:0===ae.length,onClick:function(){ae.length>0&&(r(!0),t.insert_participants({event_id:y.event_id,participants:ae.map((function(e){return e.id}))},C.a).then((function(){ee(!0),r(!1)}),(function(e){r(!1),c("".concat(e&&e.kind?e.kind.ExecutionError:e))})))},children:"Save"})]})]})]})}):Object(b.jsx)(b.Fragment,{})},z=function(e){var t=e.contract,n=e.currentUser,a=e.nearConfig,r=e.wallet,c=Object(s.useState)(!1),i=Object(d.a)(c,2),o=i[0],l=i[1],u=Object(s.useState)(""),m=Object(d.a)(u,2),j=m[0],f=m[1];return Object(b.jsxs)("div",{className:"container mx-auto",children:[Object(b.jsx)(x,{contract:t,currentUser:n,nearConfig:a,wallet:r,isLoading:o}),Object(b.jsx)(p,{error:j,callback:function(){return f("")}}),n&&n.accountId&&Object(b.jsxs)(D.c,{children:[Object(b.jsx)(D.a,{path:"/",element:Object(b.jsx)(A,{contract:t,currentUser:n,nearConfig:a,wallet:r,onLoading:l,onError:f})}),Object(b.jsx)(D.a,{path:"events/:eventId",element:Object(b.jsx)(I,{contract:t,currentUser:n,nearConfig:a,wallet:r,onLoading:l,onError:f})})]})]})},W=(n(321),n(79)),R=n.n(W);function V(){return(V=Object(r.a)(i.a.mark((function e(){var t,n,r,c,s;return i.a.wrap((function(e){for(;;)switch(e.prev=e.next){case 0:return t=R()("testnet"),e.next=3,E.connect(Object(a.a)({deps:{keyStore:new E.keyStores.BrowserLocalStorageKeyStore}},t));case 3:if(n=e.sent,!(r=new E.WalletConnection(n)).getAccountId()){e.next=11;break}return e.t0=r.getAccountId(),e.next=9,r.account().state();case 9:e.t1=e.sent.amount,c={accountId:e.t0,balance:e.t1};case 11:return e.next=13,new E.Contract(r.account(),t.contractName,{viewMethods:["get_event","get_events","get_events_to_finalize","get_payouts"],changeMethods:["add_event","insert_participants","finalize_event"],sender:r.getAccountId()});case 13:return s=e.sent,e.abrupt("return",{contract:s,currentUser:c,nearConfig:t,walletConnection:r});case 15:case"end":return e.stop()}}),e)})))).apply(this,arguments)}window.nearInitPromise=function(){return V.apply(this,arguments)}().then((function(e){var t=e.contract,n=e.currentUser,a=e.nearConfig,r=e.walletConnection;l.a.render(Object(b.jsx)(j.a,{children:Object(b.jsx)(z,{contract:t,currentUser:n,nearConfig:a,wallet:r})}),document.getElementById("root"))}))},79:function(e,t){var n=Object({NODE_ENV:"production",PUBLIC_URL:"/near-giveaway",WDS_SOCKET_HOST:void 0,WDS_SOCKET_PATH:void 0,WDS_SOCKET_PORT:void 0,FAST_REFRESH:!0}).CONTRACT_NAME||"dev-1641421731569-38860898594754";e.exports=function(e){switch(e){case"production":case"mainnet":return{networkId:"mainnet",nodeUrl:"https://rpc.mainnet.near.org",contractName:n,walletUrl:"https://wallet.near.org",helperUrl:"https://helper.mainnet.near.org",explorerUrl:"https://explorer.mainnet.near.org"};case"development":case"testnet":return{networkId:"testnet",nodeUrl:"https://rpc.testnet.near.org",contractName:n,walletUrl:"https://wallet.testnet.near.org",helperUrl:"https://helper.testnet.near.org",explorerUrl:"https://explorer.testnet.near.org"};case"betanet":return{networkId:"betanet",nodeUrl:"https://rpc.betanet.near.org",contractName:n,walletUrl:"https://wallet.betanet.near.org",helperUrl:"https://helper.betanet.near.org",explorerUrl:"https://explorer.betanet.near.org"};case"local":return{networkId:"local",nodeUrl:"http://localhost:3030",keyPath:"".concat(Object({NODE_ENV:"production",PUBLIC_URL:"/near-giveaway",WDS_SOCKET_HOST:void 0,WDS_SOCKET_PATH:void 0,WDS_SOCKET_PORT:void 0,FAST_REFRESH:!0}).HOME,"/.near/validator_key.json"),walletUrl:"http://localhost:4000/wallet",contractName:n};case"test":case"ci":return{networkId:"shared-test",nodeUrl:"https://rpc.ci-testnet.near.org",contractName:n,masterAccount:"test.near"};case"ci-betanet":return{networkId:"shared-test-staging",nodeUrl:"https://rpc.ci-betanet.near.org",contractName:n,masterAccount:"test.near"};default:throw Error("Unconfigured environment '".concat(e,"'. Can be configured in src/config.js."))}}}},[[324,1,2]]]);
//# sourceMappingURL=main.54b9b9d2.chunk.js.map