"use strict";function _classCallCheck(e,t){if(!(e instanceof t))throw new TypeError("Cannot call a class as a function")}Object.defineProperty(exports,"__esModule",{value:!0}),exports.StepSystem=void 0;var _createClass=function(){function e(e,t){for(var n=0;n<t.length;n++){var s=t[n];s.enumerable=s.enumerable||!1,s.configurable=!0,"value"in s&&(s.writable=!0),Object.defineProperty(e,s.key,s)}}return function(t,n,s){return n&&e(t.prototype,n),s&&e(t,s),t}}(),_Step=require("Step"),StepSystem=exports.StepSystem=function(){function e(){_classCallCheck(this,e),this._steps=[]}return _createClass(e,[{key:"addStep",value:function(e){this._steps.push(new _Step.Step(this,e))}},{key:"steps",get:function(){return this._steps}}]),e}();