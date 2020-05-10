/* eslint-disable no-console */
const { IridiumMock } = require('..');

const IR = new IridiumMock();
IR.on('ir-log', (msg) => console.log(msg));

IR.mockAddDevice('SomeDevice', {});
const device = IR.GetDevice('SomeDevice');
IR.AddListener(IR.EVENT_ONLINE, device, () => {
  IR.Log('Device is online');
});
