const IR_ENUM = require('./enum');

class DeviceMock {
  constructor(ir, name, {
    Type = IR_ENUM.DEVICE_CUSTOM_TCP,
    Host,
    Port = 8080,
    MaxClients = 10,
    LogLevel = 7,
    SendMode = IR_ENUM.ALWAYS_mockConnected,
    ScriptMode = IR_ENUM.DIRECT_AND_SCRIPT
  } = {}) {
    this.Name = name;
    this.Type = Type;
    this.Host = Host;
    this.Port = Port;
    this.MaxClients = MaxClients;
    this.LogLevel = LogLevel;
    this.SendMode = SendMode;
    this.ScriptMode = ScriptMode;

    this.mockIr = ir;
    this.mockFeedbacks = [];
    this.mockConnected = false;
    this.mockSeparator = null;
  }

  mockAddFeedback(name, data = []) {
    const id = this.mockFeedbacks.length;
    this.mockFeedbacks.push({ name, id, data });
    return this;
  }

  mockDestroy() {
    this.mockFeedbacks = [];
    this.mockConnected = false;
    this.mockSeparator = null;
  }

  AddEndOfString(mockSeparator) {
    this.mockSeparator = mockSeparator;
  }

  Connect() {
    if (!this.mockConnected && this.mockIr.mockIsAppStarted) {
      this.mockConnected = true;
      this.mockIr.mockCallListener(this.mockIr.EVENT_ONLINE, this);
    }
  }

  Disconnect() {
    if (this.mockConnected) {
      this.mockConnected = false;
      this.mockIr.mockCallListener(this.mockIr.EVENT_OFFLINE, this);
    }
  }

  GetFeedback(feedback) {
    if (this.GetFeedbackAtName(feedback)) {
      return this.mockIr.GetVariable(`Drivers.${this.Name}.${feedback}`);
    }
    return undefined;
  }

  GetFeedbackAtPos(id) {
    return this.mockFeedbacks[id];
  }

  GetFeedbackAtName(name) {
    for (let i = 0; i < this.mockFeedbacks.length; i++) {
      if (this.mockFeedbacks[i].name === name) {
        return this.mockFeedbacks[i];
      }
    }
    return undefined;
  }

  GetFeedbacksCount() {
    return Object.keys(this.mockFeedbacks).length;
  }

  Send(data) {
    if (this.mockConnected) this.mockIr.emit('device-send', { name: this.Name, data });
  }

  Set(command, value) {
    this.mockIr.emit('device-set', { name: this.Name, command, value });
  }

  SetFeedback(feedback, value) {
    if (this.GetFeedbackAtName(feedback)) {
      this.mockIr.SetVariable(`Drivers.${this.Name}.${feedback}`, value);
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
