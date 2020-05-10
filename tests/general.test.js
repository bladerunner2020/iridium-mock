
const { IridiumMock } = require('..');

describe('general test', () => {
  it('Should call EVENT_START', () => {
    const mock = jest.fn();
    const IR = new IridiumMock();
    expect(IR.mockIsAppStarted).toBe(false);
    IR.AddListener(IR.EVENT_START, 0, mock);
    IR.mockAppStart();
    expect(IR.mockIsAppStarted).toBe(true);
    expect(mock).toBeCalled();
  });
});
