import CliProgress from 'cli-progress';
import { JOB_STATUS, Service as JobService } from './modules/job';

const BAR_FORMAT = '[{bar}] | {STATUS} | {value}/{total}';

const REFRESH_INTERVAL = 1000;
const WINDOW_SIZE = 1;

export default class Monitor {
  private multibar: CliProgress.MultiBar;

  private jobService: JobService;

  private bars = new Map<string, CliProgress.SingleBar>();

  constructor() {
    this.initBars();
    this.jobService = new JobService();
  }

  initBars(): void {
    this.multibar = new CliProgress.MultiBar(
      {
        clearOnComplete: false,
        hideCursor: true,
        format: BAR_FORMAT,
      },
      CliProgress.Presets.shades_classic,
    );
    this.bars.set(JOB_STATUS.NEW, this.multibar.create(0, 0));
    this.bars.set(JOB_STATUS.PROCESSING, this.multibar.create(0, 0));
    this.bars.set(JOB_STATUS.DONE, this.multibar.create(0, 0));
    this.bars.set(JOB_STATUS.ERROR, this.multibar.create(0, 0));
  }

  async start(): Promise<void> {
    const jobCountByStatus = await this.getJobCountByStatus();
    const totalCount = jobCountByStatus.reduce((acc, jobCount) => acc + jobCount.count, 0);
    jobCountByStatus.forEach(jobCount => {
      const bar = this.bars.get(jobCount.status);
      bar?.setTotal(totalCount);
      bar?.update(jobCount.count, {
        STATUS: jobCount.status,
      });
    });
    setTimeout(this.start.bind(this), REFRESH_INTERVAL);
  }

  private async getJobCountByStatus(): Promise<{ status: string; count: number }[]> {
    const jobCountByStatus = await this.jobService.getJobCountByStatus(WINDOW_SIZE);
    const parsedJobCount = jobCountByStatus.map(item => ({
      status: item.status,
      count: parseInt(item.count, 10),
    }));
    parsedJobCount.sort((itemA, itemB) => itemA.count - itemB.count);
    return parsedJobCount;
  }
}
