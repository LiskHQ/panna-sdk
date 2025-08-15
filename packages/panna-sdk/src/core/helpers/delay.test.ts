import { delay } from './delay';

describe('delay', () => {
  it('should sleep for the specified delay', async () => {
    const delayMs = 15;
    const startTime = Date.now();
    await delay(delayMs);
    const endTime = Date.now();

    expect(endTime - startTime).toBeGreaterThanOrEqual(delayMs);
  });
});
