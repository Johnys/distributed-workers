import http from 'http';
import https from 'https';
import Request from '../request';

describe('request', () => {
  beforeEach(() => {
    jest.restoreAllMocks();
  });

  afterAll(() => {
    jest.restoreAllMocks();
  });

  it('should call http get method and return 200', async () => {
    const httpGetMock = jest.spyOn(http, 'get');
    httpGetMock.mockImplementation((url, callback) =>
      // @ts-ignore
      callback({ statusCode: 200 }),
    );
    const url = 'http://www.test.com';
    const request = new Request(url);
    const httpCode = await request.getStatusCode();
    expect(httpCode).toBe(200);
  });

  it('should call https get method and return 200', async () => {
    const httpsGetMock = jest.spyOn(https, 'get');
    httpsGetMock.mockImplementation((url, callback) =>
      // @ts-ignore
      callback({ statusCode: 200 }),
    );
    const url = 'https://www.test.com';
    const request = new Request(url);
    const httpCode = await request.getStatusCode();
    expect(httpCode).toBe(200);
  });

  it('should trow a error when there is some issue', done => {
    expect.assertions(1);
    const httpGetMock = jest.spyOn(http, 'get');
    let onCallback;
    // @ts-ignore
    httpGetMock.mockImplementation(() => ({
      // @ts-ignore
      on: (event, callback) => {
        onCallback = callback;
      },
    }));
    const url = 'http://www.test.com';
    const request = new Request(url);
    const promise = request.getStatusCode();
    promise.catch(error => {
      expect(error).toBe('error');
      done();
    });
    // @ts-ignore
    onCallback('error');
  });
});
