/* eslint-disable no-undef */
/* eslint-disable @typescript-eslint/no-var-requires */
const detox = require('detox');
const config = require('../package.json').detox;
const adapter = require('detox/runners/jest/adapter');
const specReporter = require('detox/runners/jest/specReporter');
const assignReporter = require('detox/runners/jest/assignReporter');

detoxCircus.getEnv().addEventsListener(adapter);
detoxCircus.getEnv().addEventsListener(assignReporter);
detoxCircus.getEnv().addEventsListener(specReporter);

// Set the default timeout
jest.setTimeout(90000);

beforeAll(async () => {
  await detox.init(config);
}, 300000);

beforeEach(async () => {
  await adapter.beforeEach();
});

afterAll(async () => {
  await adapter.afterAll();
  await detox.cleanup();
});
