const { IridiumMock } = require('..');

const IR = new IridiumMock();

describe('devices tests', () => {
  afterEach(() => {
    IR.mockResetIr();
  });

  it('Should add device to tree and call EVENT_ONLINE', () => {
    const mock = jest.fn();
    IR.mockAddHost('192.168.2.2');
    IR.mockAddDevice('SomeDevice', { Host: '192.168.2.2', Port: 4242 });
    const device = IR.GetDevice('SomeDevice');
    IR.AddListener(IR.EVENT_ONLINE, device, mock);

    IR.mockAppStart();

    expect(device).toBeDefined();
    expect(device.Name).toBe('SomeDevice');
    expect(device.Type).toBe(IR.DEVICE_CUSTOM_TCP);
    expect(device.Host).toBe('192.168.2.2');
    expect(device.Port).toBe(4242);
    expect(device.mockConnected).toBe(true);
    expect(mock).toBeCalled();
  });

  it('Should create device', () => {
    IR.mockAddHost('192.168.2.2');
    const device = IR.CreateDevice(IR.DEVICE_CUSTOM_TCP, 'SomeDevice', { Host: '192.168.2.2', Port: 4242 });
    expect(device).toBeDefined();
    expect(device.Name).toBe('SomeDevice');
    expect(device.Type).toBe(IR.DEVICE_CUSTOM_TCP);
    expect(device.Host).toBe('192.168.2.2');
    expect(device.Port).toBe(4242);
    expect(IR.GetDevice('SomeDevice')).toBe(device);
  });

  it('Should connect manually if device is created after EVENT_START', () => {
    IR.mockAddHost('192.168.2.2');
    IR.mockAppStart();
    const device = IR.CreateDevice(IR.DEVICE_CUSTOM_TCP, 'SomeDevice', { Host: '192.168.2.2', Port: 4242 });
    IR.AddListener(IR.EVENT_START, 0, () => {
      expect(device.mockConnected).toBe(false);
      device.Connect();
      expect(device.mockConnected).toBe(true);
    });
  });

  it('Should be connected if device is created before EVENT_START', () => {
    IR.mockAddHost('192.168.2.2');
    const device = IR.CreateDevice(IR.DEVICE_CUSTOM_TCP, 'SomeDevice', { Host: '192.168.2.2', Port: 4242 });
    IR.mockAppStart();
    expect(device.mockConnected).toBe(true);
  });

  it('Should not connected before EVENT_START', () => {
    IR.mockAddHost('192.168.2.2');
    const device = IR.CreateDevice(IR.DEVICE_CUSTOM_TCP, 'SomeDevice', { Host: '192.168.2.2', Port: 4242 });
    device.Connect();
    expect(device.mockConnected).toBe(false);
    IR.mockAppStart();
    expect(device.mockConnected).toBe(true);
  });

  it('Should not connected if host is not added to valid hosts', () => {
    const device = IR.CreateDevice(IR.DEVICE_CUSTOM_TCP, 'SomeDevice', { Host: '192.168.2.2', Port: 4242 });
    IR.mockAppStart();
    expect(device.mockConnected).toBe(false);
    device.Connect();
    expect(device.mockConnected).toBe(false);
  });
});
