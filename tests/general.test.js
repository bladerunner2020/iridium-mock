
const { IridiumMock } = require('..');

describe('general test', () => {
  it('should call EVENT_START', () => {
    const mock = jest.fn();
    const IR = new IridiumMock();
    expect(IR.mockIsAppStarted).toBe(false);
    IR.AddListener(IR.EVENT_START, 0, mock);
    IR.mockAppStart();
    expect(IR.mockIsAppStarted).toBe(true);
    expect(mock).toBeCalled();
  });

  it('should reset IR', () => {
    const IR = new IridiumMock();
    IR.mockAppStart();
    expect(IR.mockIsAppStarted).toBe(true);
    IR.SetVariable('Global.Var', 'some text');
    IR.mockAddDevice('some device');

    IR.mockResetIr();
    expect(IR.mockIsAppStarted).toBe(false);
    expect(Object.keys(IR.mockVariables)).toHaveLength(0);
    expect(Object.keys(IR.mockDevices)).toHaveLength(0);
  });
});
