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
  phoneNumber: string;
  @Column()
  group: 'A' | 'B' | 'C' | 'D';

  getPassword(): string {
    return this.password;
  }

  getEmail(): string {
    return this.email;
  }

  #salt: string | undefined | number = 10;

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
    // 해시된 비밀번호 자체에 salt값이 포함되어 있음
    return bcrypt.compare(plainPassword, this.password);
  }

  @AfterLoad()
  protected setOldPassword(): void {
    /* 
      setOldPassword 메서드는 데이터베이스에서 사용자의 해시된 비밀번호를 불러올 때, 그 해시에서 salt를 추출하는 역할을 합니다.
      AfterLoad 데코레이터가 붙어 있어, 사용자 엔티티가 데이터베이스에서 로드될 때 자동으로 호출됩니다.
      bcrypt 해시의 첫 29자리는 salt를 포함하고 있으므로, 이 부분을 추출하여 나중에 비밀번호를 다시 해시할 때 동일한 salt를 사용할 수 있도록 합니다. 
    */
    this.#salt = this.password.slice(0, 29); // 기존 해시 비밀번호에서 salt 추출
  }
}
