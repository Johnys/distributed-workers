import CheckUrlExecutor from './check_url_executor';
import Job, { JOB_TYPE } from '../../model';
import IExecutor from './iexecutor';

export default class ExecutorFactory {
  static getExecutor(job: Job): IExecutor | null {
    switch (job.type) {
      case JOB_TYPE.CHECK_URL:
        return new CheckUrlExecutor();
      default:
        return null;
    }
  }
}
