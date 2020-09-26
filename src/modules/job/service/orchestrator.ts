import { getCustomRepository } from 'typeorm';
import Job from '../model';
import JobRepository from '../repository';
import { CheckUrlExecutor } from './executors';
import IExecutor from './executors/iexecutor';

const AWAIT_JOBS_TIMEOUT = 1000;
const MAX_TIME_TO_FINISH_JOB_SECONDS = 60;

export default class Orchestrator {
  private jobRepository: JobRepository;

  private checkUrlExecutor: IExecutor;

  constructor() {
    this.jobRepository = getCustomRepository(JobRepository);
    this.checkUrlExecutor = new CheckUrlExecutor();
  }

  async getNextJob(): Promise<Job | null | undefined> {
    return this.jobRepository.getNextJob(MAX_TIME_TO_FINISH_JOB_SECONDS);
  }

  async start(): Promise<void> {
    await this.processQueuedJobs();
    setTimeout(this.start.bind(this), AWAIT_JOBS_TIMEOUT);
  }

  async processQueuedJobs(): Promise<void> {
    let job = await this.getNextJob();
    while (job) {
      const jobStatus = await this.checkUrlExecutor.execute(job); // eslint-disable-line
      job.status = jobStatus;
      job.finishedAt = new Date();
      await job.save(); // eslint-disable-line
      job = await this.getNextJob(); // eslint-disable-line
    }
  }
}
