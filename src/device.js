const IR_ENUM = require('./enum');

class DeviceMock {
  constructor(ir, name, {
    Type = IR_ENUM.DEVICE_CUSTOM_TCP, Host, Port, ...compatibility
  } = {}) {
    this.Name = name;
    this.Type = Type || compatibility.type;
    this.Host = Host || compatibility.host;
    this.Port = Port || compatibility.port;

    this.ir = ir;
    this.feedbacks = [];
    this.connected = false;
    this.separator = null;

    if (Host) setTimeout(() => this.Connect(), 10);
  }

  mockAddFeedback(name, data = []) {
    const id = this.feedbacks.length;
    this.feedbacks.push({ name, id, data });
    return this.feedbacks[id];
  }

  AddEndOfString(separator) {
    this.separator = separator;
  }

  Connect() {
    if (!this.connected) {
      this.connected = true;
      this.ir.mockCallListener(this.ir.EVENT_ONLINE, this);
    }
  }

  Disconnect() {
    if (this.connected) {
      this.connected = false;
      this.ir.mockCallListener(this.ir.EVENT_OFFLINE, this);
    }
  }

  GetFeedback(feedback) {
    if (this.GetFeedbackAtName(feedback)) {
      return this.ir.GetVariable(`Drivers.${this.Name}.${feedback}`);
    }
    return undefined;
  }

  GetFeedbackAtPos(id) {
    return this.feedbacks[id];
  }

  GetFeedbackAtName(name) {
    for (let i = 0; i < this.feedbacks.length; i++) {
      if (this.feedbacks[i].name === name) {
        return this.feedbacks[i];
      }
    }
    return undefined;
  }

  GetFeedbacksCount() {
    return Object.keys(this.feedbacks).length;
  }

  Send(data) {
    this.ir.emit('device-send', { name: this.Name, data });
  }

  Set(command, value) {
    this.ir.emit('device-set', { name: this.Name, command, value });
  }

  SetFeedback(feedback, value) {
    if (this.GetFeedbackAtName(feedback)) {
      this.ir.SetVariable(`Drivers.${this.Name}.${feedback}`, value);
    }
  }

  SetParameters({ Host, Port }) {
    if (typeof Host !== 'undefined') {
      this.Host = Host;
    }
    if (typeof Port !== 'undefined') {
      this.Port = Port;
    }
    return true;
  }
}

module.exports = DeviceMock;
