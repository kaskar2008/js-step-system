/**
 * StepSystem v1.0.1
 * Last update: 25.05.2017
 *
 * Dependencies: jQuery
 *
 * @author kaskar2008
 */

export class StepSystem {
  /**
   * @param  {jQuery element} container
   */
  constructor (params) {
    this._steps = {}
    this._current_step = null
    this._container = params.container || $('.step-system')
    this._step_container = params.step_class || '.step'
    this._next_timeout = null
    this.steps_past = []
    this.progress = 0
    this.commonHandlers = function () {}
    this.onFinish = function () {}
    this.onProgress = function () {}
    this.onStepRender = function () {}

    this._global_interceptors = {
      isSkipGlobal: function (step) {
        return step.interceptors.isSkip(step)
      },
      beforeNext: function (step) {
        return new Promise((resolve) => {
          resolve()
        })
      },
      beforeBack: function (step) {
        return new Promise((resolve) => {
          resolve()
        })
      }
    }
  }

  /**
   * Add new step
   * @param {Step} step
   */
  addStep (step) {
    step.parent = this
    this._steps[step.name] = step
    return this
  }

  setGlobalInterceptors (interceptors) {
    this._global_interceptors = Object.assign(this._global_interceptors, interceptors)
    return this
  }

  setHandlers (cb) {
    this.commonHandlers = cb
    return this
  }

  get global_interceptors () {
    return this._global_interceptors
  }

  get current_step () {
    return this.step(this._current_step) || null
  }

  step (name) {
    return this._steps[name]
  }

  get container () {
    return this._container
  }

  get steps () {
    return this._steps
  }

  get all_data () {
    return this.collectData()
  }

  render (step) {
    let _br = step.call('beforeRender', step)
    if (!_br.status) {
      if (_br.onError) _br.onError.apply(step)
      return this
    }
    this.container.find(this._step_container).html(step.template || this._container.find(`#${step.name}`).html())
    this.container.find(this._step_container).attr('data-name', step.name)
    this.onStepRender(step)
    step.call('onRender', step)
  }

  updateProgress () {
    let future_steps = 0
    let iteration_step = this.current_step
    let iteration_next_step = iteration_step.next
    while (iteration_next_step) {
      if (!iteration_step.ignore_progress) {
        future_steps++
      }
      iteration_step = this.step(iteration_next_step)
      iteration_next_step = iteration_step.next
    }
    this.progress = (this.steps_past.length * 100) / (this.steps_past.length + future_steps)
    this.onProgress(this.progress)
  }

  goNextTimeout (timeout = 300) {
    const $this = this
    clearTimeout(this._next_timeout)
    this._next_timeout = setTimeout(function () {
      $this.goNext()
    }, timeout)
  }

  goNext () {
    let curr_step = this.current_step || {}
    this.global_interceptors.beforeNext(curr_step)
      .then(() => {
        let _bn = curr_step.call('beforeNext', curr_step)
        if (!_bn.status) {
          if (_bn.onError) {
            _bn.onError.apply(curr_step)
          }
          return
        }
        let next_step = curr_step.next || null
        if (next_step) {
          this.goToStep(this.step(next_step), { from: curr_step.name })
        } else {
          if (this.onFinish) {
            this.onFinish()
          }
        }
      })
      .catch(() => { })
    return this
  }

  goBack () {
    let curr_step = this.current_step || {}
    this.global_interceptors.beforeBack(curr_step)
      .then(() => {
        let prev_step = curr_step.from || null
        let _bb = curr_step.call('beforeBack', curr_step) || { status: false }
        if (!_bb.status) {
          if (_bb.onError) _bb.onError.apply(curr_step)
          return
        }
        if (prev_step) {
          if (_bb.status) {
            this.steps_past.pop()
          }
          this.goToStep(this.step(prev_step), { is_back: true })
        }
      })
      .catch(() => {})
    return this
  }

  goToStep (step, params = {}) {
    let is_skip = this.global_interceptors.isSkipGlobal(step) || step.call('isSkip', step)
    if (is_skip) {
      step = this.step(step.next)
    }
    let from = params.from || null
    let is_back = params.is_back || false
    if (from) {
      step.from = from
    }
    this.render(step)
    this._current_step = step.name
    if (this.steps_past.indexOf(step.name) < 0) {
      this.steps_past.push(step.name)
    }
    this.updateProgress()
    return this
  }

  collectData () {
    let data = {}
    for (var step in this.steps) {
      if (this.step(step).data) {
        data[step] = this.step(step).data
      }
    }
    return data
  }

  init (first_step) {
    this.first_step = first_step
    this.commonHandlers()
    this._current_step = this.first_step
    this.goToStep(this.step(this._current_step))
  }
}
