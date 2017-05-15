(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var Step = exports.Step = function () {
  function Step(params) {
    _classCallCheck(this, Step);

    this.parent = params.parent || null;
    this.name = params.name;
    this.next = params.next;
    this.methods = params.methods || {};
    this.template = params.template || '';
    this.from = null;
    this._data = {};
    params.interceptors = params.interceptors || {};
    this.interceptors = {
      beforeRender: params.interceptors.beforeRender || this.methods.beforeRender || function () {
        return { status: true };
      },
      beforeNext: params.interceptors.beforeNext || this.methods.beforeNext || function () {
        return { status: true };
      },
      beforeBack: params.interceptors.beforeBack || this.methods.beforeBack || function () {
        return { status: true };
      }
    };
  }

  /* LINKS */


  _createClass(Step, [{
    key: 'goNext',
    get: function get() {
      return this.parent.goNext;
    }
  }, {
    key: 'goBack',
    get: function get() {
      return this.parent.goBack;
    }
  }, {
    key: 'goToStep',
    get: function get() {
      return this.parent.goToStep;
    }
  }, {
    key: 'data',
    get: function get() {
      return this._data;
    }
  }]);

  return Step;
}();

},{}],2:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

/**
 * StepSystem v1.0.0
 * Last update: 15.05.2017
 *
 * Dependencies: jQuery
 *
 * @author kaskar2008
 */

var StepSystem = exports.StepSystem = function () {
  /**
   * @param  {jQuery element} container
   */
  function StepSystem(container) {
    _classCallCheck(this, StepSystem);

    this._steps = {};
    this._current_step = null;
    this._container = container;
    this.commonHandlers = function () {};
  }

  /**
   * Add new step
   * @param {Step} step
   */


  _createClass(StepSystem, [{
    key: 'addStep',
    value: function addStep(step) {
      step.parent = this;
      this._steps[step.name] = step;
      return this;
    }
  }, {
    key: 'setHandlers',
    value: function setHandlers(cb) {
      this.commonHandlers = cb;
      return this;
    }
  }, {
    key: 'step',
    value: function step(name) {
      return this._steps[name];
    }
  }, {
    key: 'render',
    value: function render(step) {
      var _br = step.interceptors.beforeRender();
      if (!_br.status) {
        if (_br.onError) _br.onError();
        return this;
      }
      this.container.find('.step').html(step.template || this._container.find('#' + step.name).html());
    }
  }, {
    key: 'goNext',
    value: function goNext() {
      var curr_step = this.current_step || {};
      var next_step = curr_step.next || null;
      var _bn = curr_step.interceptors.beforeNext();
      if (!_bn.status) {
        if (_bn.onError) _bn.onError();
        return this;
      }
      if (next_step) {
        this.goToStep(this.step(next_step));
      }
    }
  }, {
    key: 'goBack',
    value: function goBack() {
      var curr_step = this.current_step || {};
      var prev_step = curr_step.from || null;
      var _bb = curr_step.interceptors.beforeBack();
      if (!_bb.status) {
        if (_bb.onError) _bb.onError();
        return this;
      }
      if (prev_step) {
        this.goToStep(this.step(prev_step));
      }
    }
  }, {
    key: 'goToStep',
    value: function goToStep(step) {
      var from = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : null;

      var curr_step = this.current_step || {};
      step.from = curr_step.name || null;
      this._current_step = step.name;
      this.render(step);
    }
  }, {
    key: 'init',
    value: function init(from_step) {
      this.commonHandlers();
      this._current_step = from_step;
      this.render(this.step(this._current_step));
    }
  }, {
    key: 'current_step',
    get: function get() {
      return this.step(this._current_step) || null;
    }
  }, {
    key: 'container',
    get: function get() {
      return this._container;
    }
  }, {
    key: 'steps',
    get: function get() {
      return this._steps;
    }
  }]);

  return StepSystem;
}();

},{}],3:[function(require,module,exports){
'use strict';

var _Step = require('../classes/Step');

var _StepSystem = require('../classes/StepSystem');

window.app = new _StepSystem.StepSystem($('.container'));

(function (app) {

  var first_step = 'first-step';

  app
  /**
   * FIRST STEP
   */
  .addStep(new _Step.Step({
    name: 'first-step',
    next: 'second-step',
    methods: {
      beforeRender: function beforeRender() {
        console.log('first-step beforeRender');
        return { status: true };
      },
      beforeNext: function beforeNext() {
        console.log('first-step beforeNext');
        return { status: true };
      }
    }
  }))

  /**
   * SECOND STEP
   */
  .addStep(new _Step.Step({
    name: 'second-step',
    methods: {
      beforeRender: function beforeRender() {
        console.log('second-step beforeRender');
        return { status: true };
      },
      beforeNext: function beforeNext() {
        console.log('second-step beforeNext');
        return { status: true };
      }
    }
  }));

  app.init(first_step);
})(window.app);

},{"../classes/Step":1,"../classes/StepSystem":2}]},{},[3])

//# sourceMappingURL=app.js.map