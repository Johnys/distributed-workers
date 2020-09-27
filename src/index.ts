import ConnectionManager from './connection_manager';
import { Orchestrator } from './modules/job';
import Monitor from './monitor';

const START_MONITOR = !!process.argv.find(arg => arg === '--monit');

async function init(): Promise<void> {
  await ConnectionManager.init();
  const orchestrator = new Orchestrator();
  orchestrator.start();
  console.log('worker started'); // eslint-disable-line
  if (START_MONITOR) {
    const monitor = new Monitor();
    await monitor.start();
  }
}

init();
