import http from 'http';
import https from 'https';

export default class Request {
  private url: string;

  constructor(url: string) {
    this.url = url;
  }

  getStatusCode(): Promise<number> {
    return new Promise<number>((resolve, reject) => {
      this.getResolver()
        .get(this.url, response => {
          resolve(response.statusCode);
        })
        .on('error', reject);
    });
  }

  getResolver(): typeof http | typeof https {
    if (this.url.startsWith('https')) return https;
    return http;
  }
}
