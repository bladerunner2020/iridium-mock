const { useFakeTimers } = require('sinon');
const { IridiumMock } = require('..');

describe('timers test', () => {
  let clock = null;
  afterEach(() => {
    if (clock) clock.reset();
    clock = null;
  });

  it('IR.SetTimeout', () => {
    clock = useFakeTimers();
    const mock1 = jest.fn();
    const mock2 = jest.fn();
    const IR = new IridiumMock();

    const timer1 = IR.SetTimeout(1000, mock1);
    const timer2 = IR.SetTimeout(2000, mock2);
    expect(IR.mockTimers.indexOf(timer1)).not.toBe(-1);
    expect(IR.mockTimers.indexOf(timer2)).not.toBe(-1);
    clock.tick(1000);
    expect(mock1).toBeCalled();
    expect(mock2).not.toBeCalled();
    expect(IR.mockTimers.indexOf(timer1)).toBe(-1);
    expect(IR.mockTimers.indexOf(timer2)).not.toBe(-1);
    clock.tick(1000);
    expect(mock1).toBeCalled();
    expect(mock2).toBeCalled();
    expect(IR.mockTimers.indexOf(timer1)).toBe(-1);
    expect(IR.mockTimers.indexOf(timer2)).toBe(-1);
  });

  it('IR.SetInterval', () => {
    clock = useFakeTimers();
    const mock = jest.fn();
    const IR = new IridiumMock();

    const timer = IR.SetInterval(1000, mock);
    expect(IR.mockTimers.indexOf(timer)).not.toBe(-1);
    clock.tick(10000);
    expect(mock).toBeCalledTimes(10);
    expect(IR.mockTimers.indexOf(timer)).not.toBe(-1);
  });

  it('IR.ClearTimeout', () => {
    clock = useFakeTimers();
    const mock = jest.fn();
    const IR = new IridiumMock();

    const timer = IR.SetTimeout(1000, mock);
    expect(IR.mockTimers.indexOf(timer)).not.toBe(-1);
    clock.tick(500);
    expect(mock).not.toBeCalled();
    expect(IR.mockTimers.indexOf(timer)).not.toBe(-1);
    IR.ClearTimeout(timer);
    clock.tick(1000);
    expect(mock).not.toBeCalled();
    expect(IR.mockTimers.indexOf(timer)).toBe(-1);
  });

  it('IR.ClearInterval', () => {
    clock = useFakeTimers();
    const mock = jest.fn();
    const IR = new IridiumMock();

    const timer = IR.SetInterval(1000, mock);
    expect(IR.mockTimers.indexOf(timer)).not.toBe(-1);
    clock.tick(500);
    expect(mock).not.toBeCalled();
    expect(IR.mockTimers.indexOf(timer)).not.toBe(-1);
    IR.ClearInterval(timer);
    clock.tick(1000);
    expect(mock).not.toBeCalled();
    expect(IR.mockTimers.indexOf(timer)).toBe(-1);
  });
});
