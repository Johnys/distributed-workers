import ConnectionManager from './connection_manager';
import { Orchestrator } from './modules/job';

async function init(): Promise<void> {
  await ConnectionManager.init();
  const orchestrator = new Orchestrator();
  orchestrator.start();
  console.log('worker started'); // eslint-disable-line
}

init();
