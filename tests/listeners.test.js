const { IridiumMock, DeviceMock } = require('..');

describe('listers test', () => {
  it('AddListener should add listeners', () => {
    const mock = jest.fn();
    const IR = new IridiumMock();
    const device = new DeviceMock({ ir: IR, name: 'test' });

    IR.AddListener(IR.EVENT_CHANNEL_SET, device, mock);

    expect(IR.mockListeners[IR.EVENT_CHANNEL_SET]).toBeDefined();
    IR.mockCallListener(IR.EVENT_CHANNEL_SET, device, 'channel1', 'value1');
    expect(mock).toBeCalledWith('channel1', 'value1');
  });

  it('RemoveListener should remove listeners', () => {
    const mock = jest.fn();
    const IR = new IridiumMock();
    const device = new DeviceMock({ ir: IR, name: 'test' });

    IR.AddListener(IR.EVENT_CHANNEL_SET, device, mock);

    expect(IR.mockListeners[IR.EVENT_CHANNEL_SET]).toBeDefined();
    IR.RemoveListener(IR.EVENT_CHANNEL_SET, device, mock);

    IR.mockCallListener(IR.EVENT_CHANNEL_SET, device, 'channel1', 'value1');
    expect(mock).not.toBeCalled();
  });
});
