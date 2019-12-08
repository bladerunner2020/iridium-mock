const EventEmitter = require('events');

const IR_ENUM = {
    EVENT_START: 1,
    EVENT_EXIT: 3,
    EVENT_ITEM_SHOW: 141,
    EVENT_ONLINE: 161,
    EVENT_OFFLINE: 162,
    EVENT_RECEIVE_DATA: 165,
    EVENT_RECEIVE_TEXT: 166,
    EVENT_TAG_CHANGE: 171,
    EVENT_CHANNEL_SET: 178,

    DEVICE_CUSTOM_TCP: 97
};

class IridiumMock extends EventEmitter{
    constructor() {
        super();

        this._devices = {};
        this._listeners = {};
        this._variables = {};

        Object.assign(this, IR_ENUM);
    }

    mockAddDevice(name, options) {
        this._devices[name] = new DeviceMock(this, name, options);
        return this._devices[name];
    }

    mockCallListener(/* type, item, values */) {
        const args = Array.prototype.slice.call(arguments);
        const type = args.shift();
        const item = args.shift();

        if (typeof this._listeners[type] !== 'undefined') {
            this._listeners[type].forEach(listener => {
                if (listener.item === item && listener.callback) {
                    listener.callback.apply(item.context, args);
                }
            });
        }
    }

    AddListener(type, item, callback, context) {
        if (typeof this._listeners[type] === 'undefined') {
            this._listeners[type] = [];    
        }
        this._listeners[type].push({ item, callback, context });

    }

    ClearInterval(timer) {
        clearTimeout(timer);
    }

    ClearTimeout(timer) {
        clearTimeout(timer);
    }

    GetDevice(name) {
        return this._devices[name];
    }

    GetDevices() {
        const res = [];
        for (let key in this._devices) {
            res.push(this._devices[key]);
        }
        return res;
    }

    GetVariable(tag) {
        return this._variables[tag];
    }

    Log(message) {
        this.emit('ir-log', { message });
    }

    SetVariable(tag, value) {
        this._variables[tag] = value;
    }

    SetInterval(interval, callback) {
        return setInterval(callback, interval);
    }

    SetTimeout(timeout, callback) {
        return setTimeout(callback, timeout);
    }
}


class DeviceMock {
    constructor(ir, name, { type = IR_ENUM.DEVICE_CUSTOM_TCP, host } = {}) {
        this.Name = name;
        this.Type = type;
        this.Host = host;

        this._IR = ir;
        this._feedbacks = [];
        this._connected = false;

        if (host) {
            setTimeout(() => this.Connect(), 10);
        }
    }

    mockAddFeedback(name, data = []) {
        const id = this._feedbacks.length;
        this._feedbacks.push({ name, id, data });
        return this._feedbacks[id];
    }

    AddEndOfString(separator) {
        this._separator = separator;
    }

    Connect() {
        if (!this._connected) {
            this._connected = true;
            this._IR.mockCallListener(this._IR.EVENT_ONLINE, this);
        } 
    }

    Disconnect() {
        if (this._connected) {
            this._connected = false;
            this._IR.mockCallListener(this._IR.EVENT_OFFLINE, this);
        } 
    }

    GetFeedback(feedback) {
        if (this.GetFeedbackAtName(feedback)) {
            return this._IR.GetVariable(`Drivers.${this.Name}.${feedback}`);
        } 
    }

    GetFeedbackAtPos(id) {
        return this._feedbacks[id];
    }

    GetFeedbackAtName(name) {
        for (var i = 0; i < this._feedbacks.length; i++) {
            if (this._feedbacks[i].name === name) {
                return this._feedbacks[i];
            }
        }
    }

    GetFeedbacksCount() {
        return Object.keys(this._feedbacks).length;
    }

    Send(data) {
        this._IR.emit('device-send', { name: this.Name, data });
    }

    Set(command, value) {
        this._IR.emit('device-set', { name: this.Name, command, value });   
    }

    SetFeedback(feedback, value) {
        if (this.GetFeedbackAtName(feedback)) {
            this._IR.SetVariable(`Drivers.${this.Name}.${feedback}`, value);
        } 
    }

    SetParameters({ Host, Port }) {
        if (typeof Host !== 'undefined' ) {
            this.Host = Host;
        }
        if (typeof Port !== 'undefined' ) {
            this.Port = Port;
        }
        return true;
    }
}

class ItemMock {
    constructor(ir, { name, x, y, width, height } = {}) {
        this._IR = ir;
        this.Name = name;
        this.Text = name;
        this.X = x;
        this.Y = y;
        this.Width = width;
        this.Height = height;
    }
}

module.exports = {
    IridiumMock, DeviceMock, ItemMock
};
