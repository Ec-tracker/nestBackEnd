import {
  Column,
  CreateDateColumn,
  Entity,
  ObjectID,
  ObjectIdColumn,
  UpdateDateColumn,
  VersionColumn,
} from 'typeorm';

@Entity()
export abstract class Common {
  @ObjectIdColumn()
  _id: ObjectID;

  @CreateDateColumn()
  createAt: Date;

  @UpdateDateColumn()
  updateAt: Date;

  @Column({
    default: false,
    select: false,
  })
  isDeleted: boolean;

  @VersionColumn({
    select: false,
  })
  version: number;
}
