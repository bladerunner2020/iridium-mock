/* eslint-disable no-console */
const { IridiumMock } = require('..');

const IR = new IridiumMock();

IR.on('ir-log', (msg) => console.log(msg));

const varString = 'Some string';
const varNumber = 42;

IR.SetVariable('GLobal.String', varString);
IR.SetVariable('GLobal.Number', varNumber);

IR.Log(IR.GetVariable('GLobal.String'));
