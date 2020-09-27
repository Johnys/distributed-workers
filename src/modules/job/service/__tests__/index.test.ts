import { getCustomRepository } from 'typeorm';
import Service from '../index';
import JobRepository from '../../repository';
import ConnectionManager from '../../../../connection_manager';
import Job, { JOB_STATUS, JOB_TYPE } from '../../model';

const createScenario1 = async (repository: JobRepository) => {
  const STATUS_CASES = [JOB_STATUS.NEW, JOB_STATUS.NEW, JOB_STATUS.PROCESSING, JOB_STATUS.ERROR];
  for (let i = 0; i < STATUS_CASES.length; i += 1) {
    const job = new Job();
    job.url = 'http://www.test.com';
    job.status = STATUS_CASES[i];
    job.type = JOB_TYPE.CHECK_URL;
    if (job.status === JOB_STATUS.ERROR || job.status === JOB_STATUS.PROCESSING) {
      job.startedAt = new Date();
    }
    await repository.save(job); // eslint-disable-line
  }
};

describe('job service', () => {
  let jobRepository: JobRepository;
  let service: Service;

  beforeAll(async () => {
    await ConnectionManager.init();
    jobRepository = await getCustomRepository(JobRepository);
    service = new Service();
  });

  beforeEach(async () => {
    await jobRepository.clear();
  });

  afterAll(async () => {
    await ConnectionManager.close();
  });

  it('should return job counter by status', async () => {
    await createScenario1(jobRepository);
    const jobCount = await service.getJobCountByStatus(6);
    expect(jobCount).toStrictEqual([
      { status: JOB_STATUS.NEW, count: '2' },
      { status: JOB_STATUS.PROCESSING, count: '1' },
      { status: JOB_STATUS.ERROR, count: '1' },
      { status: JOB_STATUS.DONE, count: '0' },
    ]);
  });
});
