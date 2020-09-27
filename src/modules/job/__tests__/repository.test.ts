import { getCustomRepository } from 'typeorm';
import Job, { JOB_STATUS, JOB_TYPE } from '../model';
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
    job.type = JOB_TYPE.CHECK_URL;
    const savedJob = await jobRepository.save(job);

    const nextJob = await jobRepository.getNextJob(60);

    expect(savedJob.id).toBe(nextJob?.id);
  });

  it('should get next job when has two jobs on database', async () => {
    const job1 = new Job();
    job1.url = 'http://www.test.com';
    job1.status = JOB_STATUS.NEW;
    job1.type = JOB_TYPE.CHECK_URL;
    const savedJob1 = await jobRepository.save(job1);
    const job2 = new Job();
    job2.url = 'http://www.test.com';
    job2.status = JOB_STATUS.NEW;
    job2.type = JOB_TYPE.CHECK_URL;
    await jobRepository.save(job2);

    const nextJob = await jobRepository.getNextJob(60);

    expect(savedJob1.id).toBe(nextJob?.id);
  });

  it('should return null when there is no job new', async () => {
    const job = new Job();
    job.url = 'http://www.test.com';
    job.status = JOB_STATUS.DONE;
    job.type = JOB_TYPE.CHECK_URL;
    await jobRepository.save(job);

    const nextJob = await jobRepository.getNextJob(60);

    expect(nextJob).toBeNull();
  });

  it('should not return job when it is been processed by other', async () => {
    const job = new Job();
    job.url = 'http://www.test.com';
    job.status = JOB_STATUS.NEW;
    job.type = JOB_TYPE.CHECK_URL;
    const savedJob = await jobRepository.save(job);
    const nextJob = await jobRepository.getNextJob(60);
    const nextJob2 = await jobRepository.getNextJob(60);
    expect(savedJob.id).toBe(nextJob?.id);
    expect(nextJob2).toBeNull();
  });

  it('should return job that was not processed by other', async () => {
    const job = new Job();
    job.url = 'http://www.test.com';
    job.status = JOB_STATUS.PROCESSING;
    job.startedAt = new Date(new Date().getTime() - 10 * 1000);
    job.type = JOB_TYPE.CHECK_URL;
    const savedJob = await jobRepository.save(job);

    const nextJob = await jobRepository.getNextJob(2);

    expect(savedJob.id).toBe(nextJob?.id);
  });
});
