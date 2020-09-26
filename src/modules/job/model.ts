import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  BaseEntity,
  UpdateDateColumn,
  Index,
} from 'typeorm';

export enum JOB_STATUS {
  NEW = 'NEW',
  PROCESSING = 'PROCESSING',
  DONE = 'DONE',
  ERROR = 'ERROR',
}

@Entity({
  schema: 'workers',
  name: 'job',
})
export default class Job extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({
    nullable: false,
    type: 'varchar',
    length: 200,
  })
  url: string;

  @Column({
    type: 'enum',
    enum: JOB_STATUS,
    default: JOB_STATUS.NEW,
    nullable: false,
  })
  @Index('job_status_idx')
  status: JOB_STATUS;

  @Column({
    name: 'http_code',
    type: 'int',
    nullable: true,
  })
  httpCode: number;

  @Column({
    type: 'timestamp',
    name: 'started_at',
    nullable: true,
  })
  startedAt: Date;

  @UpdateDateColumn({
    type: 'timestamp',
    name: 'updated_at',
    nullable: false,
  })
  updatedAt: Date;

  @Column({
    type: 'timestamp',
    name: 'finished_at',
    nullable: true,
  })
  finishedAt: Date;

  @Column({
    name: 'error_message',
    nullable: true,
    type: 'varchar',
    length: 200,
  })
  errorMessage: string;
}
