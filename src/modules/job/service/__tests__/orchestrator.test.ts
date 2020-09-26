import http from 'http';
import { getCustomRepository } from 'typeorm';
import Orchestrator from '../orchestrator';
import Job, { JOB_STATUS } from '../../model';
import ConnectionManager from '../../../../connection_manager';
import JobRepository from '../../repository';

jest.useFakeTimers();

describe('Orchestrator', () => {
  let jobRepository: JobRepository;
  beforeAll(async () => {
    await ConnectionManager.init();
    jobRepository = getCustomRepository(JobRepository);
    await jobRepository.clear();
  });

  beforeEach(() => {
    jest.clearAllMocks();
  });

  afterAll(async () => {
    jest.restoreAllMocks();
    await jobRepository.clear();
    await ConnectionManager.close();
  });

  it('should process job', async () => {
    const job = new Job();
    job.url = 'http://www.test.com';
    job.status = JOB_STATUS.NEW;
    const savedJob = await jobRepository.save(job);

    const httpGetMock = jest.spyOn(http, 'get');
    httpGetMock.mockImplementation((url, callback) =>
      // @ts-ignore
      callback({ statusCode: 200 }),
    );

    const orchestrator = new Orchestrator();
    await orchestrator.start();

    const updatedJob = await jobRepository.findOne(savedJob.id);
    expect(updatedJob?.status).toBe(JOB_STATUS.DONE);
    expect(updatedJob?.httpCode).toBe(200);
  });

  it('should trow a error when there is some issue', async () => {
    const job = new Job();
    job.url = 'http://www.test.com';
    job.status = JOB_STATUS.NEW;
    const savedJob = await jobRepository.save(job);

    const httpGetMock = jest.spyOn(http, 'get');
    // @ts-ignore
    httpGetMock.mockImplementation(() => ({
      // @ts-ignore
      on: (event, callback) => {
        callback(new Error('error'));
      },
    }));

    const orchestrator = new Orchestrator();
    await orchestrator.start();

    const updatedJob = await jobRepository.findOne(savedJob.id);
    expect(updatedJob?.status).toBe(JOB_STATUS.ERROR);
    expect(updatedJob?.errorMessage).toBe('error');
  });
});
