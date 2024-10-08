import {
  AfterLoad,
  BeforeInsert,
  BeforeUpdate,
  Column,
  DeepPartial,
  Entity,
  PrimaryGeneratedColumn,
} from 'typeorm';
import * as bcrypt from 'bcryptjs';
// import * as bcrypt from 'bcrypt';

const bcryptRegex = /^\$(?:2a|2x|2y|2b)\$\d+\$/u;

@Entity('users')
export class UserEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;
  @Column('citext', { unique: true }) // citext 대소문자를 구분하지 않음
  email: string;
  @Column()
  password: string;
  @Column()
  name: string;
  @Column()
  gender: string;
  @Column()
  birth: Date;

  getId(): string {
    return this.id;
  }

  getPassword(): string {
    return this.password;
  }

  getEmail(): string {
    return this.email;
  }

  setPassword(password: string): void {
    this.password = password;
  }

  #salt: string | undefined;

  static fromPartial(data: DeepPartial<UserEntity>): UserEntity {
    return Object.assign(new UserEntity(), data);
  }

  @BeforeInsert()
  @BeforeUpdate()
  async hashPassword(): Promise<void> {
    if (!this.password.match(bcryptRegex)) {
      this.password = await bcrypt.hash(this.password, this.#salt ?? 10);
    }
  }

  checkPassword(plainPassword: string): Promise<boolean> {
    return bcrypt.compare(plainPassword, this.password);
  }

  @AfterLoad()
  protected setOldPassword(): void {
    this.#salt = this.password.slice(0, 29);
  }
}
