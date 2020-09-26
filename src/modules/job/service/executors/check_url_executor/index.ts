import IExecutor from '../iexecutor';
import Job, { JOB_STATUS } from '../../../model';
import Request from './request';

export default class CheckUrlExecutor implements IExecutor {
  public async execute(job: Job): Promise<JOB_STATUS.DONE | JOB_STATUS.ERROR> {
    console.log(`Processing job ${job.id}`); // eslint-disable-line
    const request = new Request(job.url);
    try {
      const statusCode = await request.getStatusCode();
      job.httpCode = statusCode;
      return JOB_STATUS.DONE;
    } catch (error) {
      job.errorMessage = error.message;
      return JOB_STATUS.ERROR;
    }
  }
}
