"use strict";function _classCallCheck(t,e){if(!(t instanceof e))throw new TypeError("Cannot call a class as a function")}Object.defineProperty(exports,"__esModule",{value:!0});var _createClass=function(){function t(t,e){for(var r=0;r<e.length;r++){var n=e[r];n.enumerable=n.enumerable||!1,n.configurable=!0,"value"in n&&(n.writable=!0),Object.defineProperty(t,n.key,n)}}return function(e,r,n){return r&&t(e.prototype,r),n&&t(e,n),e}}(),StepSystem=exports.StepSystem=function(){function t(e){_classCallCheck(this,t),this._steps={},this._current_step=null,this._container=e,this.commonHandlers=function(){}}return _createClass(t,[{key:"addStep",value:function(t){return t.parent=this,this._steps.push(t),this}},{key:"setHandlers",value:function(t){return this.commonHandlers=t,this}},{key:"step",value:function(t){return this._steps[t]}},{key:"render",value:function(t){var e=t.interceptors.beforeRender();if(!e.status)return e.onError&&e.onError(),this;this.container.html(t.template)}},{key:"goNext",value:function(){var t=step.interceptors.beforeNext();if(!t.status)return t.onError&&t.onError(),this;var e=this.current_step||{},r=e.next||null;r&&this.goToStep(this.step(r))}},{key:"goBack",value:function(){var t=step.interceptors.beforeBack();if(!t.status)return t.onError&&t.onError(),this;var e=this.current_step||{},r=e.from||null;r&&this.goToStep(this.step(r))}},{key:"goToStep",value:function(t){var e=this.current_step||{};t.from=e.name||null,this.render(t)}},{key:"init",value:function(){this.commonHandlers()}},{key:"current_step",get:function(){return this.steps[this._current_step]||null}},{key:"container",get:function(){return this._container}},{key:"steps",get:function(){return this._steps}}]),t}();