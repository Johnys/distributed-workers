import { getCustomRepository } from 'typeorm';
import Job, { JOB_STATUS } from '../model';
import ConnectionManager from '../../../connection_manager';
import JobRepository from '../repository';

describe.only('JobRepository', () => {
  let jobRepository: JobRepository;
  beforeAll(async () => {
    await ConnectionManager.init();
    jobRepository = getCustomRepository(JobRepository);
  });

  beforeEach(async () => {
    await jobRepository.clear();
  });

  afterAll(async () => {
    await jobRepository.clear();
    await ConnectionManager.close();
  });

  it('should get next job', async () => {
    const job = new Job();
    job.url = 'http://www.test.com';
    job.status = JOB_STATUS.NEW;
    const savedJob = await jobRepository.save(job);

    const nextJob = await jobRepository.getNextJob(60);

    expect(savedJob.id).toBe(nextJob?.id);
  });

  it('should get next job when has two jobs on database', async () => {
    const job1 = new Job();
    job1.url = 'http://www.test.com';
    job1.status = JOB_STATUS.NEW;
    const savedJob1 = await jobRepository.save(job1);
    const job2 = new Job();
    job2.url = 'http://www.test.com';
    job2.status = JOB_STATUS.NEW;
    await jobRepository.save(job2);

    const nextJob = await jobRepository.getNextJob(60);

    expect(savedJob1.id).toBe(nextJob?.id);
  });

  it('should return null when there is no job new', async () => {
    const job1 = new Job();
    job1.url = 'http://www.test.com';
    job1.status = JOB_STATUS.DONE;
    await jobRepository.save(job1);

    const nextJob = await jobRepository.getNextJob(60);

    expect(nextJob).toBeNull();
  });

  it('should return job that was not processed by other', async () => {
    const job = new Job();
    job.url = 'http://www.test.com';
    job.status = JOB_STATUS.PROCESSING;
    job.startedAt = new Date(new Date().getTime() - 10 * 1000);
    const savedJob = await jobRepository.save(job);

    const nextJob = await jobRepository.getNextJob(2);

    expect(savedJob.id).toBe(nextJob?.id);
  });
});
