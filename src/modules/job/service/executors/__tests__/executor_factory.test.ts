import ExecutorFactory from '../executor_factory';
import Job, { JOB_TYPE } from '../../../model';
import CheckUrlExecutor from '../check_url_executor';

describe('ExecutorFactory', () => {
  it('should return CheckUrlExecutor when job type is CHECK_URL', () => {
    const job = new Job();
    job.type = JOB_TYPE.CHECK_URL;
    const executor = ExecutorFactory.getExecutor(job);
    expect(executor).toBeInstanceOf(CheckUrlExecutor);
  });
});
