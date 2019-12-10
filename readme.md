# General Information

**IridiumMock** allows to debug [Iridium Mobile](http://iridi.com) scripts outside Iridium IDE and create unit tests for them using popular test environments (like as *jest*, *mocha*, etc.).

## Installation
```bash
npm install git@github.com:bladerunner2020/iridium-mock.git
```
or

```bash
yarn add git@github.com:bladerunner2020/iridium-mock.git
```

## Usage

```js
const { IridiumMock } = require('iridium-mock');
IR = new IridiumMock();
const kramer = IR.mockAddDevice('Kramer', { host: '127.0.0.1' });
kramer.mockAddFeedback('output1');
kramer.mockAddFeedback('output2');
kramer.mockAddFeedback('output3');
kramer.mockAddFeedback('status');

IR.on('device-send', ({ name, data }) => console.log(`Device ${name} sent: ${data}`));

IR.mockCallListener(IR.EVENT_CHANNEL_SET, IR.GetDevice('Kramer'), 'setRoute', '1: 2');
IR.mockCallListener(IR.EVENT_CHANNEL_SET, IR.GetDevice('Kramer'), 'setVolume', 100);
```

# Note
In the current release just few IR properties are added. Let me know if you need more or PR even better :)
