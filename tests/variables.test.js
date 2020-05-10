const { IridiumMock } = require('..');

describe('variable tests', () => {
  it('Should return undefined if variable was not set', () => {
    const IR = new IridiumMock();
    expect(IR.GetVariable('Global.SomeVar')).toBe(undefined);
  });

  it('Should set and get variables', () => {
    const varString = 'Some string';
    const varNumber = 42;
    const IR = new IridiumMock();
    IR.SetVariable('Global.String', varString);
    IR.SetVariable('Global.Number', varNumber);

    expect(IR.GetVariable('Global.String')).toBe(varString);
    expect(IR.GetVariable('Global.Number')).toBe(`${varNumber}`);
  });

  it('Should change variables', () => {
    const var1 = 'Some string';
    const var2 = 'Another';
    const IR = new IridiumMock();
    IR.SetVariable('Global.Var', var1);
    expect(IR.GetVariable('Global.Var')).toBe(var1);
    IR.SetVariable('Global.Var', var2);
    expect(IR.GetVariable('Global.Var')).toBe(var2);
  });
});
