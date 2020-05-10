/* eslint-disable class-methods-use-this */
const EventEmitter = require('events');
const IR_ENUM = require('./enum');
const DeviceMock = require('./device');

class IridiumMock extends EventEmitter {
  constructor() {
    super();

    this.devices = {};
    this.irListeners = {};
    this.irVariables = {};
    this.irTimers = [];

    Object.assign(this, IR_ENUM);
  }

  mockAddDevice(name, options) {
    this.devices[name] = new DeviceMock(this, name, options);
    return this.devices[name];
  }

  mockCallListener(/* type, item, values */) {
    // eslint-disable-next-line prefer-rest-params
    const args = Array.prototype.slice.call(arguments);
    const type = args.shift();
    const item = args.shift();

    if (typeof this.irListeners[type] !== 'undefined') {
      this.irListeners[type].forEach((listener) => {
        if (listener.item === item && listener.callback) {
          listener.callback.apply(item.context, args);
        }
      });
    }
  }

  AddListener(type, item, callback, context) {
    if (typeof this.irListeners[type] === 'undefined') {
      this.irListeners[type] = [];
    }
    this.irListeners[type].push({ item, callback, context });
  }

  RemoveListener(type, item, callback) {
    const listeners = this.irListeners[type];
    if (typeof listeners === 'undefined') {
      return;
    }
    for (let i = listeners.length - 1; i >= 0; i--) {
      if (listeners[i].item === item && listeners[i].callback === callback) {
        listeners.splice(i, 1);
      }
    }
  }

  ClearInterval(timer) {
    const index = this.irTimers.indexOf(timer);
    this.irTimers.splice(index, 1);
    clearInterval(timer);
  }

  ClearTimeout(timer) {
    const index = this.irTimers.indexOf(timer);
    this.irTimers.splice(index, 1);
    clearTimeout(timer);
  }

  GetDevice(name) {
    return this.devices[name];
  }

  CreateDevice(type, name, properties) {
    return this.mockAddDevice(name, { Type: type, ...properties });
  }

  GetDevices() {
    const res = [];
    const keys = Object.keys(this.devices);
    for (let i = 0; i < keys.length; i++) {
      const key = keys[i];
      res.push(this.devices[key]);
    }
    return res;
  }

  GetVariable(tag) {
    const res = this.irVariables[tag];
    return res ? res.toString() : res;
  }

  Log(message) {
    this.emit('ir-log', { message });
  }

  SetVariable(tag, value) {
    this.irVariables[tag] = value;
  }

  SetInterval(interval, callback) {
    const timer = setInterval(callback, interval);
    this.irTimers.push(timer);
    return timer;
  }

  SetTimeout(timeout, callback) {
    const timer = setTimeout(() => {
      const index = this.irTimers.indexOf(timer);
      this.irTimers.splice(index, 1);
      callback();
    }, timeout);
    this.irTimers.push(timer);
    return timer;
  }
}

module.exports = IridiumMock;
