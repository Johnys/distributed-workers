import Job, { JOB_STATUS } from '../../model';

export default interface IExecutor {
  execute(job: Job): Promise<JOB_STATUS.DONE | JOB_STATUS.ERROR>;
}
