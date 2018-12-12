(window.webpackJsonp=window.webpackJsonp||[]).push([[0],{101:function(e,n,t){},103:function(e,n,t){},118:function(e,n){},120:function(e,n){},138:function(e,n,t){"use strict";t.r(n);var a=t(0),o=t.n(a),i=t(31),c=t.n(i),r=(t(76),t(5)),l=t(6),s=t(9),u=t(7),v=t(8),m=(t(78),t(1)),h=t(4),d=t(2),f=t(3),g=t(32),y=t(11),p=(t(82),t(84),function(e){function n(e){var t;Object(r.a)(this,n),t=Object(s.a)(this,Object(u.a)(n).call(this,e));var a=e.min,o=e.max,i=e.value;return t.state={hideOverflow:!0,inputTranslationFraction:(i-a)/(o-a)},t.inputOnChange=t.inputOnChange.bind(Object(m.a)(Object(m.a)(t))),t}return Object(v.a)(n,e),Object(l.a)(n,[{key:"componentDidMount",value:function(){this.inputRef.addEventListener("change",this.inputOnChange)}},{key:"componentWillUnmount",value:function(){this.inputRef.removeEventListener("change",this.inputOnChange)}},{key:"inputOnChange",value:function(e){var n=this.props,t=n.min,a=n.max,o=(n.value-t)/(a-t);this.setState({hideOverflow:!0,inputTranslationFraction:o})}},{key:"render",value:function(){var e=this,n=this.props,t=n.min,a=n.max,i=n.value,c=n.step,r=n.onChange,l=this.state.hideOverflow,s=this.state.inputTranslationFraction,u=270*((i-t)/(a-t))-45;return o.a.createElement("div",{className:"knob__container",style:{overflow:l?"hidden":"visible"}},o.a.createElement("div",{className:"knob__spinner",style:{transform:"rotate(".concat(u,"deg)")}},o.a.createElement("div",{className:"knob__marker"})),o.a.createElement("input",{type:"range",className:"knob__input",min:t,max:a,step:c,value:i,onChange:function(e){r(Number(e.target.value))},ref:function(n){e.inputRef=n},onMouseDown:function(){e.setState({hideOverflow:!1})},onMouseUp:this.inputOnChange,style:{transform:"translate(".concat(250*-s,"px, 0)")}}))}}]),n}(o.a.Component));p.defaultProps={min:0,max:1,step:"any"};var b=p;function E(e){var n=e.label,t=e.min,a=e.max,i=e.step,c=e.valueKey,r=e.config,l=e.onChange;return o.a.createElement("div",null,o.a.createElement("div",{className:"labeled-knob__label"},n),o.a.createElement(b,{min:t,max:a,step:i,value:r[c],onChange:function(e){return l(c,e)}}),o.a.createElement("div",{className:"labeled-knob__value"},Number(r[c]).toFixed(1)))}E.defaultProps={min:0,max:1,step:"any"};var C=E,O=t(61),k=t.n(O);t(93),t(95);var j=[{value:"sine",label:o.a.createElement("span",null,o.a.createElement(function(){return o.a.createElement("svg",{viewBox:"0 25 100 50",className:"waveform-icon"},o.a.createElement("path",{d:"M89.2 60.8c-4.5 0-6.6-5.3-8.6-10.4-1.8-4.5-3.6-9.1-6.8-9.1s-5 4.6-6.8 9.1c-2 5.1-4.1 10.4-8.6 10.4s-6.6-5.3-8.6-10.4c-1.8-4.5-3.6-9.1-6.8-9.1s-5 4.6-6.8 9.1c-2 5.1-4.1 10.4-8.6 10.4S21 55.5 19 50.4c-1.8-4.5-3.6-9.1-6.8-9.1-.6 0-1-.4-1-1s.4-1 1-1c4.5 0 6.6 5.3 8.6 10.4 1.8 4.5 3.6 9.1 6.8 9.1 3.2 0 5-4.6 6.8-9.1 2-5.1 4.1-10.4 8.6-10.4s6.6 5.3 8.6 10.4c1.8 4.5 3.6 9.1 6.8 9.1 3.2 0 5-4.6 6.8-9.1 2-5.1 4.1-10.4 8.6-10.4s6.6 5.3 8.6 10.4c1.8 4.5 3.6 9.1 6.8 9.1.6 0 1 .4 1 1s-.4 1-1 1z"}))},null),"Sine")},{value:"triangle",label:o.a.createElement("span",null,o.a.createElement(function(){return o.a.createElement("svg",{viewBox:"0 25 100 50",className:"waveform-icon"},o.a.createElement("path",{d:"M57.5 61.7l-15-20-15 20-15.8-21.1 1.6-1.2 14.2 18.9 15-20 15 20 15-20 15.8 21.1-1.6 1.2-14.2-18.9z"}))},null),"Triangle")},{value:"square",label:o.a.createElement("span",null,o.a.createElement(function(){return o.a.createElement("svg",{viewBox:"0 25 100 50",className:"waveform-icon"},o.a.createElement("path",{d:"M95 61H79V41H66v20H49V41H36v20H19V41H5v-2h16v20h13V39h17v20h13V39h17v20h14z"}))},null),"Square")},{value:"sawtooth",label:o.a.createElement("span",null,o.a.createElement(function(){return o.a.createElement("svg",{viewBox:"0 25 100 50",className:"waveform-icon"},o.a.createElement("g",{transform:"scale(-1,1) translate(-100, 0)"},o.a.createElement("path",{d:"M64 61.9v-20l-30 20v-20L5.6 60.8l-1.2-1.6L36 38.1v20l30-20v20l28.4-18.9 1.2 1.6z"})))},null),"Sawtooth")}];var w=function(e){var n=e.value,t=e.onChange;return o.a.createElement(k.a,{className:"waveform-selector",options:j,value:n,onChange:function(e){var n=e.value;return t(n)},clearable:!1,searchable:!1})},N=t(19),T=(t(97),{q:-9,2:-8,w:-7,3:-6,e:-5,r:-4,5:-3,t:-2,6:-1,y:0,7:1,u:2,i:3,9:4,o:5,0:6,p:7,"[":8,"=":9,"]":10}),F={"-9":"C -1","-8":"C# -1","-7":"D -1","-6":"D# -1","-5":"E -1","-4":"F -1","-3":"F# -1","-2":"G -1","-1":"G#",0:"A",1:"A#",2:"B",3:"C",4:"C#",5:"D",6:"D#",7:"E",8:"F",9:"F#",10:"G"},q={q:0,2:.5,w:1,3:1.5,e:2,r:3,5:3.5,t:4,6:4.5,y:5,7:5.5,u:6,i:7,9:7.5,o:8,0:8.5,p:9,"[":10,"=":10.5,"]":11};function S(e){return 440*Math.pow(1.059463094359,e)}var x=function(e){function n(e){var t;return Object(r.a)(this,n),(t=Object(s.a)(this,Object(u.a)(n).call(this,e))).state={keysHeld:[],sequencedNote:null},t.onKeyDown=t.onKeyDown.bind(Object(m.a)(Object(m.a)(t))),t.onKeyUp=t.onKeyUp.bind(Object(m.a)(Object(m.a)(t))),t}return Object(v.a)(n,e),Object(l.a)(n,[{key:"componentDidMount",value:function(){var e=this;document.body.addEventListener("keydown",this.onKeyDown),document.body.addEventListener("keyup",this.onKeyUp);!function n(){e.setState(function(n){var t=n.sequencedNote,a=e.props,o=a.getCurrentTime,i=a.tempo,c=a.pattern,r=60/(4*i),l=Math.floor(o()/r)%16,s=c.activeSettings[l]?c.degreeSettings[l]||0:null;return t===s?null:{sequencedNote:s}}),e.animationFrame=requestAnimationFrame(n)}()}},{key:"componentWillUnmount",value:function(){document.body.removeEventListener("keydown",this.onKeyDown),document.body.removeEventListener("keyup",this.onKeyUp),this.animationFrame&&cancelAnimationFrame(this.animationFrame)}},{key:"onKeyDown",value:function(e){this.setState(function(n){var t=n.keysHeld;if(!t.includes(e.key)&&e.key in q)return{keysHeld:Object(N.a)(t).concat([e.key])}})}},{key:"onKeyUp",value:function(e){this.setState(function(n){var t=n.keysHeld;return{keysHeld:Object(y.pull)(t,e.key)}})}},{key:"render",value:function(){var e=this.state,n=e.keysHeld,t=e.sequencedNote,a=Object.entries(q).filter(function(e){var n=Object(f.a)(e,2);n[0];return n[1]%1===0}).sort(function(e,n){return Object(f.a)(e,2)[1]-Object(f.a)(n,2)[1]}),i=Object.entries(q).filter(function(e){var n=Object(f.a)(e,2);n[0];return n[1]%1!==0}).sort(function(e,n){return Object(f.a)(e,2)[1]-Object(f.a)(n,2)[1]});return o.a.createElement("div",{style:{height:70,position:"relative",padding:10}},o.a.createElement("div",null,i.map(function(e){var a=Object(f.a)(e,2),i=a[0],c=a[1],r="key key--black";return n.includes(i)?r+=" key--pressed":t===T[i]&&(r+=" key--sequenced"),o.a.createElement("div",{key:i,className:r,style:{position:"absolute",left:45*c}},i)})),o.a.createElement("div",{style:{paddingTop:35}},a.map(function(e){var a=Object(f.a)(e,2),i=a[0],c=a[1],r="key key--white";return n.includes(i)?r+=" key--pressed":t===T[i]&&(r+=" key--sequenced"),o.a.createElement("div",{key:i,className:r,style:{position:"absolute",left:45*c}},i)})))}}]),n}(o.a.Component);t(99),t(101);function L(e){e.label;var n=e.min,t=e.max,a=e.step,i=e.valueKey,c=e.config,r=e.onChange;return o.a.createElement("div",null,o.a.createElement(b,{min:n,max:t,step:a,value:c[i],onChange:function(e){return r(i,e)}}),o.a.createElement("div",{className:"degree-knob__value"},F[c[i]]))}L.defaultProps={min:0,max:1,step:"any"};var M=L,H=Object.values(T),D=Math.min.apply(Math,Object(N.a)(H)),A=Math.max.apply(Math,Object(N.a)(H)),R=function(e){function n(e){var t;return Object(r.a)(this,n),(t=Object(s.a)(this,Object(u.a)(n).call(this,e))).state={beatIndex:0},t.onKnobChanged=t.onKnobChanged.bind(Object(m.a)(Object(m.a)(t))),t}return Object(v.a)(n,e),Object(l.a)(n,[{key:"componentDidMount",value:function(){var e=this,n=this.props,t=n.getCurrentTime,a=n.tempo;!function n(){e.setState(function(e){var n=e.beatIndex,o=60/(4*a),i=Math.floor(t()/o)%16;return i===n?null:{beatIndex:i}}),e.animationFrame=requestAnimationFrame(n)}()}},{key:"componentWillUnmount",value:function(){this.animationFrame&&cancelAnimationFrame(this.animationFrame)}},{key:"onKnobChanged",value:function(e,n){(0,this.props.onNoteDegreeChange)(e,n)}},{key:"onNoteSelected",value:function(e,n){(0,this.props.onNoteActiveChange)(e,n)}},{key:"render",value:function(){var e=this,n=this.props.pattern,t=n.degreeSettings,a=n.activeSettings,i=this.state.beatIndex,c=Object(d.a)({},Object(y.range)(16).reduce(function(e,n){return Object(d.a)({},e,Object(h.a)({},n,0))},{}),t);return o.a.createElement("div",{className:"sequencer__container"},Object(y.range)(16).map(function(n){var t="sequencer-note"+(i===n?" sequencer-note--current":"");return o.a.createElement("div",{key:n,className:t},o.a.createElement(M,{valueKey:n,min:D,max:A,step:1,onChange:e.onKnobChanged,config:c}),o.a.createElement("div",null,o.a.createElement("input",{id:"note-active-".concat(n),className:"sequencer-note__checkbox",type:"checkbox",checked:Boolean(a[n]),onChange:function(t){return e.onNoteSelected(n,t.target.checked)}}),o.a.createElement("label",{htmlFor:"note-active-".concat(n)})))}))}}]),n}(o.a.Component),K=function(e){function n(){return Object(r.a)(this,n),Object(s.a)(this,Object(u.a)(n).apply(this,arguments))}return Object(v.a)(n,e),Object(l.a)(n,[{key:"componentDidMount",value:function(){var e=this,n=this.props.analyser,t=n.fftSize,a=new Float32Array(t),o=this.canvasRef.getContext("2d");requestAnimationFrame(function i(){var c,r=e.props,l=r.vco1Octave,s=r.vco2Octave,u=r.freq,v=r.sampleRate,m=1/(Math.min(u*Math.pow(2,l),u*Math.pow(2,s))||440),h=Math.round(4*m*v);n.getFloatTimeDomainData(a);for(var d=0;d<a.length-1;d+=1)if(a[d]>0&&a[d+1]<=0){c=d;break}o.fillStyle="rgb(200, 200, 200)",o.fillRect(0,0,300,150),o.lineWidth=2,o.strokeStyle="rgb(0, 0, 0)",o.beginPath();for(var f=300/Math.min(h/2,t),g=0,y=c;y<Math.min(h,t);y++){var p=.5*a[y]*150/2+75;0===y?o.moveTo(g,p):o.lineTo(g,p),g+=f}o.lineTo(e.canvasRef.width,e.canvasRef.height/2),o.stroke(),requestAnimationFrame(i)})}},{key:"render",value:function(){var e=this;return o.a.createElement("canvas",{ref:function(n){e.canvasRef=n},style:{width:300,height:150}})}}]),n}(o.a.Component),V=function(e){function n(){return Object(r.a)(this,n),Object(s.a)(this,Object(u.a)(n).apply(this,arguments))}return Object(v.a)(n,e),Object(l.a)(n,[{key:"componentDidMount",value:function(){var e=this,n=this.props.analyser,t=n.fftSize,a=new Float32Array(t),o=this.canvasRef.getContext("2d");!function i(){n.getFloatFrequencyData(a),o.fillStyle="rgb(200, 200, 200)",o.fillRect(0,0,300,150),o.lineWidth=2,o.strokeStyle="rgb(0, 0, 0)",o.beginPath();for(var c=300/Math.log(t/2),r=0;r<t/2;r++){var l=150*(.4-a[r]/100)/2,s=Math.log(r+1)*c;0===r?o.moveTo(s,l):o.lineTo(s,l)}o.lineTo(e.canvasRef.width,e.canvasRef.height/2),o.stroke(),requestAnimationFrame(i)}()}},{key:"render",value:function(){var e=this;return o.a.createElement("canvas",{ref:function(n){e.canvasRef=n},style:{width:300,height:150}})}}]),n}(o.a.Component);t(103);function P(e){var n=e.sectionName,t=e.selected,a=e.onChange;return o.a.createElement("label",{className:"section-setting"},n,o.a.createElement("input",{id:"".concat(n,"-is-visible-checkbox"),type:"checkbox",checked:t,onChange:function(e){return a(n,e.target.checked)}}))}function I(e){var n=e.sectionsShown,t=e.onChange;return o.a.createElement("div",{className:"visibility-settings"},Object.entries(n).map(function(e){var a=Object(f.a)(e,2),i=a[0],c=a[1];return o.a.createElement(P,{key:i,sectionName:i,selected:c,onChange:function(e,a){return t(Object(d.a)({},n,Object(h.a)({},e,a)))}})}))}var z=t(62);var W={vco1Volume:1,vco1Waveform:"sine",vco1Detune:0,vco1Octave:0,vco2Volume:1,vco2Waveform:"sine",vco2Detune:0,vco2Octave:0,noiseVolume:0,fltHighPassFreq:0,fltHighPassRes:0,fltLowPassFreq:1e4,fltLowPassRes:0,globalVolume:.3,lfoFreq:2,vcoFreqEnvMod:0,vcoFreqLfoMod:0,fltHpEnvMod:0,fltHpLfoMod:0,fltLpEnvMod:0,fltLpLfoMod:0,envAttack:4e-4,envDecay:4e-4,envSustain:.5,envRelease:4e-4};function B(e,n){var t=n.createOscillator();t.type=e.vco1Waveform,t.frequency.value=440,t.detune.value=e.vco1Detune,t.start();var a=n.createConstantSource();a.offset.value=1200*e.vco1Octave,a.start();var o=n.createOscillator();o.type=e.vco2Waveform,o.frequency.value=440,t.detune.value=e.vco2Detune,o.start();var i=n.createConstantSource();i.offset.value=1200*e.vco2Octave,i.start();var c=function(e){for(var n=e.createBuffer(2,3*e.sampleRate,e.sampleRate),t=0;t<n.numberOfChannels;t++)for(var a=n.getChannelData(t),o=0;o<n.length;o++)a[o]=2*Math.random()-1;var i=e.createBufferSource();return i.buffer=n,i.loop=!0,i.start(),i}(n),r=n.createGain();r.gain.value=e.vco1Volume;var l=n.createGain();l.gain.value=e.vco2Volume;var s=n.createGain();s.gain.value=e.noiseVolume;var u=n.createGain();u.gain.value=0;var v=n.createBiquadFilter();v.type="highpass",v.Q.value=e.fltHighPassRes,v.frequency.value=e.fltHighPassFreq;var m=n.createBiquadFilter();m.type="lowpass",m.Q.value=e.fltLowPassRes,m.frequency.value=e.fltLowPassFreq;var h=n.createGain();h.gain.value=e.globalVolume;var g=n.createConstantSource();g.offset.value=1,g.start();var y=n.createGain();y.gain.setValueAtTime(0,0),g.connect(y);var p=new z(n,y.gain);p.mode="ADSR",p.attackTime=e.envAttack,p.decayTime=e.envDecay,p.sustainLevel=e.envSustain,p.releaseTime=e.envRelease;var b=n.createOscillator();b.type="triangle",b.frequency.value=e.lfoFreq,b.start();var E=n.createGain();E.gain.value=e.vcoFreqEnvMod;var C=n.createGain();C.gain.value=e.vcoFreqLfoMod;var O=n.createGain();O.gain.value=e.fltHpEnvMod;var k=n.createGain();k.gain.value=e.fltHpLfoMod;var j=n.createGain();j.gain.value=e.fltLpEnvMod;var w=n.createGain();w.gain.value=e.fltLpLfoMod;var N=n.createAnalyser();N.fftSize=4096,t.connect(r),o.connect(l),c.connect(s),r.connect(u),l.connect(u),s.connect(u),u.connect(v),v.connect(m),m.connect(h),m.connect(N),h.connect(n.destination),y.connect(u.gain),y.connect(E),y.connect(O),y.connect(j),O.connect(v.detune),k.connect(v.detune),j.connect(m.detune),w.connect(m.detune),b.connect(C),b.connect(k),b.connect(w),E.connect(t.detune),E.connect(o.detune),C.connect(t.detune),C.connect(o.detune),a.connect(t.detune),i.connect(o.detune);var T={vco1Volume:function(){var e=arguments.length>0&&void 0!==arguments[0]?arguments[0]:1;r.gain.value=e},vco1Waveform:function(){var e=arguments.length>0&&void 0!==arguments[0]?arguments[0]:"sine";t.type=e},vco1Detune:function(){var e=arguments.length>0&&void 0!==arguments[0]?arguments[0]:0;t.detune.value=e},vco1Octave:function(){var e=arguments.length>0&&void 0!==arguments[0]?arguments[0]:0;a.offset.value=1200*e},vco2Volume:function(){var e=arguments.length>0&&void 0!==arguments[0]?arguments[0]:1;l.gain.value=e},vco2Waveform:function(){var e=arguments.length>0&&void 0!==arguments[0]?arguments[0]:"sine";o.type=e},vco2Detune:function(){var e=arguments.length>0&&void 0!==arguments[0]?arguments[0]:0;o.detune.value=e},vco2Octave:function(){var e=arguments.length>0&&void 0!==arguments[0]?arguments[0]:0;i.offset.value=1200*e},noiseVolume:function(){var e=arguments.length>0&&void 0!==arguments[0]?arguments[0]:0;s.gain.value=e},fltHighPassFreq:function(){var e=arguments.length>0&&void 0!==arguments[0]?arguments[0]:0;v.frequency.value=e},fltHighPassRes:function(){var e=arguments.length>0&&void 0!==arguments[0]?arguments[0]:0;v.Q.value=e},fltLowPassFreq:function(){var e=arguments.length>0&&void 0!==arguments[0]?arguments[0]:0;m.frequency.value=e},fltLowPassRes:function(){var e=arguments.length>0&&void 0!==arguments[0]?arguments[0]:0;m.Q.value=e},globalVolume:function(){var e=arguments.length>0&&void 0!==arguments[0]?arguments[0]:.3;h.gain.value=e},lfoFreq:function(){var e=arguments.length>0&&void 0!==arguments[0]?arguments[0]:2;b.frequency.value=e},vcoFreqEnvMod:function(){var e=arguments.length>0&&void 0!==arguments[0]?arguments[0]:0;E.gain.value=e},vcoFreqLfoMod:function(){var e=arguments.length>0&&void 0!==arguments[0]?arguments[0]:0;C.gain.value=e},fltHpEnvMod:function(){var e=arguments.length>0&&void 0!==arguments[0]?arguments[0]:0;O.gain.value=e},fltHpLfoMod:function(){var e=arguments.length>0&&void 0!==arguments[0]?arguments[0]:0;k.gain.value=e},fltLpEnvMod:function(){var e=arguments.length>0&&void 0!==arguments[0]?arguments[0]:0;j.gain.value=e},fltLpLfoMod:function(){var e=arguments.length>0&&void 0!==arguments[0]?arguments[0]:0;w.gain.value=e},envAttack:function(n){p.attackTime=e.envAttack},envDecay:function(n){p.decayTime=e.envDecay},envSustain:function(n){p.sustainLevel=e.envSustain},envRelease:function(n){p.releaseTime=e.envRelease}};return{scheduleAttackAtTime:function(e){p.gateOn(e)},scheduleReleaseAtTime:function(e){p.gateOff(e)},setVcoFrequencyAtTime:function(e,n){t.frequency.setValueAtTime(e,n),o.frequency.setValueAtTime(e,n)},updateConfig:function(n){e=Object(d.a)({},e,n),Object.entries(n).forEach(function(e){var n=Object(f.a)(e,2),t=n[0],a=n[1],o=T[t];o&&o(a)})},analyser:N}}var _=t(63),U=t(64),G=t.n(U);function Q(e,n,t){var a=document.getElementById("systemTime"),o=document.getElementById("syncTime"),i=document.getElementById("offset"),c=document.getElementById("syncing"),r=_.create({peers:[],interval:e.length>0?5e3:null,delay:200,timeout:1e3,now:function(){return n.currentTime}});r.on("sync",function(e){console.log("sync "+e),"start"===e&&(r.options.peers=function(){if(!l.connections)return[];return Object.keys(l.connections).filter(function(e){return l.connections[e].some(function(e){return e.open})})}(),console.log("syncing with peers ["+r.options.peers.join(", ")+"]"),r.options.peers.length&&(c.innerHTML="syncing with "+r.options.peers.join(", ")+"...")),"end"===e&&(c.innerHTML="")}),r.on("change",function(e){console.log("changed offset: "+e),i.innerHTML="Offset: ".concat(e.toFixed(1),"s")}),r.send=function(e,n){var t=l.connections[e],a=t&&t.filter(function(e){return e.open})[0];a?a.send(n):console.log(new Error("Cannot send message: not connected to "+e).toString())},setTimeout(function e(){a.innerText="Local time: ".concat(n.currentTime.toFixed(2)),o.innerText="Synced time: ".concat(r.now().toFixed(2)),setTimeout(e,100)},100);var l=new G.a({host:"synth-beat-connection.herokuapp.com",port:"443",secure:!0,debug:1});function s(){t(l),e.filter(function(e){return!l.connections||void 0===l.connections[e]}).forEach(function(e){console.log("connecting with "+e+"..."),u(l.connect(e))})}function u(e){e.on("open",function(){console.log("connected with "+e.peer)}).on("data",function(n){r.receive(e.peer,n)}).on("close",function(){console.log("disconnected from "+e.peer)}).on("error",function(e){console.log("Error",e)})}return l.on("open",s),l.on("connection",u),setInterval(s,1e4),{peer:l,ts:r}}function J(e){return Object.entries(e).reduce(function(e,n){var t=Object(f.a)(n,2),a=t[0],o=t[1];return Object(d.a)({},e,Object(h.a)({},a,"true"===o))},{})}function $(e){return Object.entries(e).reduce(function(e,n){var t=Object(f.a)(n,2),a=t[0],o=t[1];return Object(d.a)({},e,Object(h.a)({},a,isNaN(o)?o:Number(o)))},{})}var X={keyboard:!0,sequencer:!1,filter:!0,modulation:!0};function Y(){var e=window.location.search.slice(1),n=g.parse(e,{arrayLimit:0});return{synthConfig:Object(d.a)({},W,$(Object(y.omit)(n,"na","nd","ss"))),pattern:{activeSettings:J(n.na||{}),degreeSettings:$(n.nd||{})},sectionsShown:Object(d.a)({},X,J(n.ss||{}))}}var Z=function(e){function n(e){var t;Object(r.a)(this,n),t=Object(s.a)(this,Object(u.a)(n).call(this,e));var a=Y(),o=a.synthConfig,i=new AudioContext({latencyHint:0});return t.synthesizer=B(o,i),t.keysHeld=[],t.keyIsHeld=!1,t.tempo=100,t.audioCtx=i,t.state=Object(d.a)({},a,{vco1Freq:440,vco2Freq:440,isLeader:!1,peerId:void 0,connectedPeerId:void 0}),t.onConfigChange=t.onConfigChange.bind(Object(m.a)(Object(m.a)(t))),t.onNoteDegreeChange=t.onNoteDegreeChange.bind(Object(m.a)(Object(m.a)(t))),t.onNoteActiveChange=t.onNoteActiveChange.bind(Object(m.a)(Object(m.a)(t))),t.onVisibilityChange=t.onVisibilityChange.bind(Object(m.a)(Object(m.a)(t))),t.connectToPeer=t.connectToPeer.bind(Object(m.a)(Object(m.a)(t))),t.becomeLeader=t.becomeLeader.bind(Object(m.a)(Object(m.a)(t))),t.getCurrentTime=t.getCurrentTime.bind(Object(m.a)(Object(m.a)(t))),t.pushHistoryUpdateDebounced=Object(y.debounce)(t.pushHistoryUpdate.bind(Object(m.a)(Object(m.a)(t))),1e3,{trailing:!0}),t}return Object(v.a)(n,e),Object(l.a)(n,[{key:"componentDidMount",value:function(){var e=this;document.body.addEventListener("keydown",function(n){!e.keysHeld.includes(n.key)&&n.key in T&&e.keysHeld.push(n.key),e.onKeysChanged()}),document.body.addEventListener("keyup",function(n){e.keysHeld.splice(e.keysHeld.indexOf(n.key),1),e.onKeysChanged()}),window.addEventListener("popstate",function(n){var t=Y();e.synthesizer.updateConfig(t.synthConfig),e.setState(t)});this.lastScheduledTime=-1;!function n(){for(var t=e.getCurrentTime(),a=t,o=a+.15,i=60/(4*e.tempo),c=Math.ceil(t/i),r=[],l=e.state.pattern,s=l.activeSettings,u=l.degreeSettings;c*i<o;)s[c%16]&&r.push([c,u[c%16]||0]),c+=1;r.forEach(function(n){var t=Object(f.a)(n,2),c=t[0],r=t[1];e.scheduleAttack({startTime:a,endTime:o,nextAttackTime:c*i,timeToRelease:.9*i,degree:r})}),e.lastScheduledTime=o,setTimeout(n,100)}();setTimeout(function n(){e.peer&&e.peer.socket.send({type:"ping"}),setTimeout(n,2e4)},2e4)}},{key:"connectToPeer",value:function(){var e=this,n=this.state.connectedPeerId,t=Q(n?[n]:[],this.audioCtx,function(n){e.setState({peerId:n.id})}),a=t.peer,o=t.ts;this.peer=a,this.timesync=o}},{key:"becomeLeader",value:function(){var e=this;this.setState({connectedPeerId:"",isLeader:!0},function(){return e.connectToPeer()})}},{key:"getCurrentTime",value:function(){return this.timesync?this.timesync.now():this.audioCtx.currentTime}},{key:"scheduleAttack",value:function(e){var n=e.startTime,t=e.endTime,a=e.nextAttackTime,o=e.timeToRelease,i=e.degree;if(a>n&&a<t&&a>this.lastScheduledTime){var c=this.timesync?this.timesync.offset:0;if(this.keysHeld.length<1){var r=S(i);this.synthesizer.setVcoFrequencyAtTime(r,a-c)}this.synthesizer.scheduleAttackAtTime(a-c),this.synthesizer.scheduleReleaseAtTime(a+o-c)}}},{key:"pushHistoryUpdate",value:function(){var e=this.state,n=e.synthConfig,t=e.pattern,a=t.activeSettings,o=t.degreeSettings,i=e.sectionsShown,c=Object.entries(n).reduce(function(e,n){var t=Object(f.a)(n,2),a=t[0],o=t[1];return W[a]!==o?Object(d.a)({},e,Object(h.a)({},a,o)):e},{}),r=Object.entries(a).reduce(function(e,n){var t=Object(f.a)(n,2),a=t[0],o=t[1];return o?Object(d.a)({},e,Object(h.a)({},a,o)):e},{}),l=Object.entries(o).reduce(function(e,n){var t=Object(f.a)(n,2),a=t[0],o=t[1];return 0!==o?Object(d.a)({},e,Object(h.a)({},a,o)):e},{}),s=Object.entries(i).reduce(function(e,n){var t=Object(f.a)(n,2),a=t[0],o=t[1];return X[a]!==o?Object(d.a)({},e,Object(h.a)({},a,o)):e},{}),u=Object(d.a)({},c,{na:r,nd:l,ss:s});window.history.pushState({},"","?".concat(g.stringify(u)))}},{key:"onKeysChanged",value:function(){0===this.keysHeld.length?this.keyIsHeld&&(this.onReleaseTrigger(),this.keyIsHeld=!1):(this.keyIsHeld||(this.onAttackTrigger(),this.keyIsHeld=!0),this.setVcoFreq())}},{key:"onAttackTrigger",value:function(){var e=this.audioCtx.currentTime;this.synthesizer.scheduleAttackAtTime(e)}},{key:"onReleaseTrigger",value:function(){var e=this.audioCtx.currentTime;this.synthesizer.scheduleReleaseAtTime(e)}},{key:"onNoteDegreeChange",value:function(e,n){var t=this;this.setState(function(t){var a=t.pattern;return{pattern:Object(d.a)({},a,{degreeSettings:Object(d.a)({},a.degreeSettings,Object(h.a)({},e,n))})}},function(){t.pushHistoryUpdateDebounced()})}},{key:"onNoteActiveChange",value:function(e,n){var t=this;this.setState(function(t){var a=t.pattern;return{pattern:Object(d.a)({},a,{activeSettings:Object(d.a)({},a.activeSettings,Object(h.a)({},e,n))})}},function(){t.pushHistoryUpdateDebounced()})}},{key:"setVcoFreq",value:function(){if(!(this.keysHeld.length<1)){var e,n=S((e=this.keysHeld[this.keysHeld.length-1],T[e]));this.synthesizer.setVcoFrequencyAtTime(n,0),this.setState({vco1Freq:n,vco2Freq:n})}}},{key:"onConfigChange",value:function(e,n){var t=this;this.synthesizer.updateConfig(Object(h.a)({},e,n)),this.setState(function(t){var a=t.synthConfig;return{synthConfig:Object(d.a)({},a,Object(h.a)({},e,n))}},function(){t.pushHistoryUpdateDebounced()})}},{key:"onVisibilityChange",value:function(e){var n=this;this.setState({sectionsShown:e},function(){return n.pushHistoryUpdateDebounced()})}},{key:"render",value:function(){var e=this,n=this.state,t=n.synthConfig,a=n.vco1Freq,i=n.peerId,c=n.connectedPeerId,r=n.pattern,l=n.isLeader,s=n.sectionsShown;return o.a.createElement("div",null,o.a.createElement(I,{sectionsShown:s,onChange:this.onVisibilityChange}),o.a.createElement("div",null,s.keyboard&&o.a.createElement(x,{pattern:r,getCurrentTime:this.getCurrentTime,tempo:this.tempo})),o.a.createElement("div",null,s.sequencer&&o.a.createElement(R,{pattern:r,onNoteActiveChange:this.onNoteActiveChange,onNoteDegreeChange:this.onNoteDegreeChange,getCurrentTime:this.getCurrentTime,tempo:this.tempo})),o.a.createElement("div",{className:"inline-container"},o.a.createElement("div",{className:"section-container"},o.a.createElement("h3",null,"Oscillator 1"),o.a.createElement("div",null,o.a.createElement(w,{value:t.vco1Waveform,onChange:function(n){e.onConfigChange("vco1Waveform",n)}})),o.a.createElement("div",{className:"inline-container"},o.a.createElement(C,{label:"Volume",valueKey:"vco1Volume",onChange:this.onConfigChange,config:t})),o.a.createElement("div",{className:"inline-container"},o.a.createElement(C,{label:"Detune",min:-1200,max:1200,valueKey:"vco1Detune",onChange:this.onConfigChange,config:t})),o.a.createElement("div",{className:"inline-container"},o.a.createElement(C,{label:"Octave",valueKey:"vco1Octave",min:-4,max:2,step:1,onChange:this.onConfigChange,config:t}))),o.a.createElement("div",{className:"section-container"},o.a.createElement("h3",null,"Oscillator 2"),o.a.createElement("div",null,o.a.createElement(w,{value:t.vco2Waveform,onChange:function(n){console.log(n),e.onConfigChange("vco2Waveform",n)}})),o.a.createElement("div",{className:"inline-container"},o.a.createElement(C,{label:"Volume",valueKey:"vco2Volume",onChange:this.onConfigChange,config:t})),o.a.createElement("div",{className:"inline-container"},o.a.createElement(C,{label:"Detune",min:-1200,max:1200,valueKey:"vco2Detune",onChange:this.onConfigChange,config:t})),o.a.createElement("div",{className:"inline-container"},o.a.createElement(C,{label:"Octave",valueKey:"vco2Octave",min:-4,max:2,step:1,onChange:this.onConfigChange,config:t}))),o.a.createElement("div",{className:"section-container"},o.a.createElement("h3",null,"Noise"),o.a.createElement("div",{className:"inline-container"},o.a.createElement(C,{label:"Volume",valueKey:"noiseVolume",onChange:this.onConfigChange,config:t}))),s.modulation&&o.a.createElement("div",{className:"section-container"},o.a.createElement("h3",null,"Frequency Modulation"),o.a.createElement("div",{className:"inline-container"},o.a.createElement(C,{label:"Envelope",max:1200,valueKey:"vcoFreqEnvMod",onChange:this.onConfigChange,config:t})),o.a.createElement("div",{className:"inline-container"},o.a.createElement(C,{label:"LFO",max:600,valueKey:"vcoFreqLfoMod",onChange:this.onConfigChange,config:t})))),s.filter&&o.a.createElement("div",{className:"inline-container"},o.a.createElement("div",{className:"section-container"},o.a.createElement("h3",null,"High Pass Filter"),o.a.createElement("div",null,o.a.createElement("div",{className:"inline-container"},o.a.createElement(C,{label:"Frequency",min:0,max:1e4,valueKey:"fltHighPassFreq",onChange:this.onConfigChange,config:t})),o.a.createElement("div",{className:"inline-container"},o.a.createElement(C,{label:"Resonance",min:0,max:40,valueKey:"fltHighPassRes",onChange:this.onConfigChange,config:t}))),s.modulation&&o.a.createElement("div",null,o.a.createElement("div",{className:"inline-container"},o.a.createElement(C,{label:"Envelope Mod",min:0,max:1e4,valueKey:"fltHpEnvMod",onChange:this.onConfigChange,config:t})),o.a.createElement("div",{className:"inline-container"},o.a.createElement(C,{label:"LFO Mod",min:0,max:1e4,valueKey:"fltHpLfoMod",onChange:this.onConfigChange,config:t})))),o.a.createElement("div",{className:"section-container"},o.a.createElement("h3",null,"Low Pass Filter"),o.a.createElement("div",null,o.a.createElement("div",{className:"inline-container"},o.a.createElement(C,{label:"Frequency",min:0,max:1e4,valueKey:"fltLowPassFreq",onChange:this.onConfigChange,config:t})),o.a.createElement("div",{className:"inline-container"},o.a.createElement(C,{label:"Resonance",min:0,max:40,valueKey:"fltLowPassRes",onChange:this.onConfigChange,config:t}))),s.modulation&&o.a.createElement("div",null,o.a.createElement("div",{className:"inline-container"},o.a.createElement(C,{label:"Envelope Mod",min:0,max:1e4,valueKey:"fltLpEnvMod",onChange:this.onConfigChange,config:t})),o.a.createElement("div",{className:"inline-container"},o.a.createElement(C,{label:"LFO Mod",min:0,max:1e4,valueKey:"fltLpLfoMod",onChange:this.onConfigChange,config:t}))))),o.a.createElement("div",{className:"inline-container"},s.modulation&&o.a.createElement("div",{className:"section-container"},o.a.createElement("h3",null,"LFO"),o.a.createElement("div",{className:"inline-container"},o.a.createElement(C,{label:"Frequency",min:0,max:20,valueKey:"lfoFreq",onChange:this.onConfigChange,config:t}))),s.modulation&&o.a.createElement("div",{className:"section-container"},o.a.createElement("h3",null,"Envelope"),o.a.createElement("div",{className:"inline-container"},o.a.createElement(C,{label:"Attack",min:.004,max:5,valueKey:"envAttack",onChange:this.onConfigChange,config:t})),o.a.createElement("div",{className:"inline-container"},o.a.createElement(C,{label:"Decay",min:.004,max:5,valueKey:"envDecay",onChange:this.onConfigChange,config:t})),o.a.createElement("div",{className:"inline-container"},o.a.createElement(C,{label:"Sustain",valueKey:"envSustain",onChange:this.onConfigChange,config:t})),o.a.createElement("div",{className:"inline-container"},o.a.createElement(C,{label:"Release",min:.004,max:5,valueKey:"envRelease",onChange:this.onConfigChange,config:t}))),o.a.createElement("div",{className:"section-container"},o.a.createElement("h3",null,"Oscilloscope"),o.a.createElement(K,{vco1Octave:t.vco1Octave,vco2Octave:t.vco2Octave,freq:a,sampleRate:this.audioCtx.sampleRate,analyser:this.synthesizer.analyser}),o.a.createElement("h3",null,"Spectrum Analyser"),o.a.createElement(V,{analyser:this.synthesizer.analyser}))),o.a.createElement("div",{className:"inline-container"},o.a.createElement("div",{className:"section-container"},o.a.createElement("h3",null,"Beat Connection"),!l&&o.a.createElement("label",null,"Leader ID:\xa0",o.a.createElement("input",{type:"text",value:c,onChange:function(n){return e.setState({connectedPeerId:n.target.value})}})),!l&&o.a.createElement("button",{onClick:this.connectToPeer},"Connect to leader"),!l&&!i&&o.a.createElement("div",{style:{marginTop:10}},o.a.createElement("button",{onClick:this.becomeLeader},"Become leader")),i&&o.a.createElement("div",null,"ID: ",i),o.a.createElement("div",{id:"systemTime"}),o.a.createElement("div",{id:"syncTime"}),o.a.createElement("div",{id:"offset"}),o.a.createElement("div",{id:"syncing"}))))}}]),n}(o.a.Component),ee=function(e){function n(){return Object(r.a)(this,n),Object(s.a)(this,Object(u.a)(n).apply(this,arguments))}return Object(v.a)(n,e),Object(l.a)(n,[{key:"render",value:function(){return o.a.createElement("div",{style:{padding:30}},o.a.createElement(Z,null))}}]),n}(a.Component),ne=Boolean("localhost"===window.location.hostname||"[::1]"===window.location.hostname||window.location.hostname.match(/^127(?:\.(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)){3}$/));function te(e){navigator.serviceWorker.register(e).then(function(e){e.onupdatefound=function(){var n=e.installing;n.onstatechange=function(){"installed"===n.state&&(navigator.serviceWorker.controller?console.log("New content is available; please refresh."):console.log("Content is cached for offline use."))}}}).catch(function(e){console.error("Error during service worker registration:",e)})}c.a.render(o.a.createElement(ee,null),document.getElementById("root")),function(){if("serviceWorker"in navigator){if(new URL("/synthesizer",window.location).origin!==window.location.origin)return;window.addEventListener("load",function(){var e="".concat("/synthesizer","/service-worker.js");ne?function(e){fetch(e).then(function(n){404===n.status||-1===n.headers.get("content-type").indexOf("javascript")?navigator.serviceWorker.ready.then(function(e){e.unregister().then(function(){window.location.reload()})}):te(e)}).catch(function(){console.log("No internet connection found. App is running in offline mode.")})}(e):te(e)})}}()},65:function(e,n,t){e.exports=t(138)},76:function(e,n,t){},78:function(e,n,t){},82:function(e,n,t){},84:function(e,n,t){},95:function(e,n,t){},97:function(e,n,t){},99:function(e,n,t){}},[[65,2,1]]]);
//# sourceMappingURL=main.a87fe756.chunk.js.map