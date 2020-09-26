import CheckUrlExecutor from '../index';
import Job, { JOB_STATUS } from '../../../../model';
import Request from '../request';

jest.mock('../request');

describe('CheckUrlExecutor', () => {
  beforeEach(() => {
    // @ts-ignore
    Request.mockClear();
  });

  afterAll(() => {
    jest.restoreAllMocks();
  });

  it('should return status job done and set httpStatus 200', async () => {
    // @ts-ignore
    Request.mockImplementation(() => ({
      getStatusCode: () => Promise.resolve(200),
    }));
    const checkUrlExecutor = new CheckUrlExecutor();
    const job = new Job();
    job.id = 123;
    job.url = 'http://www.test.com';
    const jobStatus = await checkUrlExecutor.execute(job);
    expect(jobStatus).toBe(JOB_STATUS.DONE);
    expect(job.httpCode).toBe(200);
  });

  it('should return status job error and set errorMessage', async () => {
    // @ts-ignore
    Request.mockImplementation(() => ({
      getStatusCode: () => Promise.reject(new Error('error')),
    }));
    const checkUrlExecutor = new CheckUrlExecutor();
    const job = new Job();
    job.id = 123;
    job.url = 'http://www.test.com';
    const jobStatus = await checkUrlExecutor.execute(job);
    expect(jobStatus).toBe(JOB_STATUS.ERROR);
    expect(job.errorMessage).toBe('error');
  });
});
