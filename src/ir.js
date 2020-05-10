/* eslint-disable class-methods-use-this */
const EventEmitter = require('events');
const IR_ENUM = require('./enum');
const DeviceMock = require('./device');

class IridiumMock extends EventEmitter {
  constructor() {
    super();

    this.mockIsAppStarted = false;
    this.mockDevices = {};
    this.mockListeners = {};
    this.mockVariables = {};
    this.mockTimers = [];
    this.mockIntervals = [];

    Object.assign(this, IR_ENUM);
  }

  mockAppStart() {
    this.mockIsAppStarted = true;
    this.mockCallListener(IR_ENUM.EVENT_START, 0);
    Object.keys(this.mockDevices).forEach((device) => this.mockDevices[device].Connect());
    return this;
  }

  mockAddDevice(name, options) {
    const device = new DeviceMock(this, name, options);
    this.mockDevices[name] = device;
    return device;
  }

  mockCallListener(/* type, item, values */) {
    // eslint-disable-next-line prefer-rest-params
    const args = Array.prototype.slice.call(arguments);
    const type = args.shift();
    const item = args.shift();

    if (typeof this.mockListeners[type] !== 'undefined') {
      this.mockListeners[type].forEach((listener) => {
        if (listener.item === item && listener.callback) {
          listener.callback.apply(listener.context, args);
        }
      });
    }
  }

  mockResetIr() {
    this.mockTimers.forEach((timer) => clearTimeout(timer));
    this.mockIntervals.forEach((timer) => clearInterval(timer));
    Object.keys(this.mockDevices).forEach((deviceName) => this.mockDevices[deviceName].mockDestroy());

    this.mockIsAppStarted = false;
    this.mockDevices = {};
    this.mockListeners = {};
    this.mockVariables = {};
    this.mockTimers = [];
    this.mockIntervals = [];
  }

  AddListener(type, item, callback, context) {
    if (typeof this.mockListeners[type] === 'undefined') {
      this.mockListeners[type] = [];
    }
    this.mockListeners[type].push({ item, callback, context });
  }

  RemoveListener(type, item, callback) {
    const listeners = this.mockListeners[type];
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
    const index = this.mockIntervals.indexOf(timer);
    this.mockIntervals.splice(index, 1);
    clearInterval(timer);
  }

  ClearTimeout(timer) {
    const index = this.mockTimers.indexOf(timer);
    this.mockTimers.splice(index, 1);
    clearTimeout(timer);
  }

  GetDevice(name) {
    return this.mockDevices[name];
  }

  CreateDevice(type, name, properties) {
    return this.mockAddDevice(name, { Type: type, ...properties });
  }

  GetDevices() {
    const res = [];
    const keys = Object.keys(this.mockDevices);
    for (let i = 0; i < keys.length; i++) {
      const key = keys[i];
      res.push(this.mockDevices[key]);
    }
    return res;
  }

  GetVariable(tag) {
    const res = this.mockVariables[tag];
    return res ? res.toString() : res;
  }

  Log(message) {
    this.emit('ir-log', { message });
  }

  SetVariable(tag, value) {
    this.mockVariables[tag] = value;
  }

  SetInterval(interval, callback) {
    const timer = setInterval(callback, interval);
    this.mockIntervals.push(timer);
    return timer;
  }

  SetTimeout(timeout, callback) {
    const timer = setTimeout(() => {
      const index = this.mockTimers.indexOf(timer);
      this.mockTimers.splice(index, 1);
      callback();
    }, timeout);
    this.mockTimers.push(timer);
    return timer;
  }
}

module.exports = IridiumMock;
