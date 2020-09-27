import { getCustomRepository } from 'typeorm';
import { JOB_STATUS } from '..';
import Job from '../model';
import JobRepository from '../repository';
import { ExecutorFactory } from './executors';

const AWAIT_JOBS_TIMEOUT = 1000;
const MAX_TIME_TO_FINISH_JOB_SECONDS = 60;

export default class Orchestrator {
  private jobRepository: JobRepository;

  constructor() {
    this.jobRepository = getCustomRepository(JobRepository);
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
      await this.process(job); // eslint-disable-line
      job = await this.getNextJob(); // eslint-disable-line
    }
  }

  async process(job: Job): Promise<void> {
    const executor = ExecutorFactory.getExecutor(job);
    if (!executor) {
      job.status = JOB_STATUS.DONE;
      job.errorMessage = 'There is no executor for this job type';
    } else {
      const jobStatus = await executor.execute(job);
      job.status = jobStatus;
    }
    job.finishedAt = new Date();
    await this.jobRepository.save(job);
  }
}
