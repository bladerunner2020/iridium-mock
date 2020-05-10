const { IridiumMock } = require('..');

describe('devices tests', () => {
  it('Should create device', () => {
    const IR = new IridiumMock();
    const device = IR.CreateDevice(IR.DEVICE_CUSTOM_TCP, 'SomeDevice', { Host: '192.168.2.2', Port: 4242 });
    expect(device).toBeDefined();
    expect(device.Name).toBe('SomeDevice');
    expect(device.Type).toBe(IR.DEVICE_CUSTOM_TCP);
    expect(device.Host).toBe('192.168.2.2');
    expect(device.Port).toBe(4242);
    expect(IR.GetDevice('SomeDevice')).toBe(device);
  });

  it('Should return added device', () => {
    const IR = new IridiumMock();
    IR.mockAddDevice('SomeDevice', { Host: '192.168.2.2', Port: 4242 });
    const device = IR.GetDevice('SomeDevice');

    expect(device).toBeDefined();
    expect(device.Name).toBe('SomeDevice');
    expect(device.Type).toBe(IR.DEVICE_CUSTOM_TCP);
    expect(device.Host).toBe('192.168.2.2');
    expect(device.Port).toBe(4242);
  });
});
