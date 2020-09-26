import { EntityRepository, Repository } from 'typeorm';
import Job, { JOB_STATUS } from './model';

@EntityRepository(Job)
export default class JobRepository extends Repository<Job> {
  async getNextJob(
    maxTimeToFinishSeconds: number,
  ): Promise<Job | undefined | null> {
    const [jobs, amount] = await this.getNextJobQuery(maxTimeToFinishSeconds);
    if (amount) {
      return this.findOne(jobs[0].id);
    }
    return null;
  }

  private getNextJobQuery(
    maxTimeToFinishSeconds: number,
  ): Promise<[[{ id: number }], number]> {
    const query = `
    UPDATE workers.job
    SET status = $1,
    started_at = now(),
    updated_at = now()
    WHERE id = (
      SELECT id
      FROM workers.job as job
      WHERE job.status = $2
      OR (
        job.status = $3 AND
        job.started_at < now() - interval '${maxTimeToFinishSeconds} second'
      )
      ORDER BY job.id
      FOR UPDATE SKIP LOCKED
      LIMIT 1
    )
    RETURNING id;`;
    return this.query(query, [
      JOB_STATUS.PROCESSING,
      JOB_STATUS.NEW,
      JOB_STATUS.PROCESSING,
    ]);
  }
}
