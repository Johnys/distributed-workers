import { getCustomRepository } from 'typeorm';
import Orchestrator from './orchestrator';
import JobRepository from '../repository';
import { JOB_STATUS } from '..';

export { Orchestrator };

const ALL_STATUS = [JOB_STATUS.NEW, JOB_STATUS.PROCESSING, JOB_STATUS.DONE, JOB_STATUS.ERROR];

export default class Service {
  private jobRepository: JobRepository;

  constructor() {
    this.jobRepository = getCustomRepository(JobRepository);
  }

  async getJobCountByStatus(windowSizeHour: number): Promise<{ status: string; count: string }[]> {
    const jobsByCount = await this.jobRepository.getJobCountByStatus(windowSizeHour);
    ALL_STATUS.forEach(status => {
      const existStatusCount = jobsByCount.find(jobCount => jobCount.status === status);
      if (!existStatusCount) jobsByCount.push({ status, count: '0' });
    });
    return jobsByCount;
  }
}
