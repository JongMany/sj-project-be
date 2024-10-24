import {
  IsEmail,
  IsIn,
  IsMobilePhone,
  IsString,
  Matches,
  MinLength,
} from 'class-validator';

export class RegisterUserRequestDto {
  @IsEmail({}, { message: '올바른 이메일 형식이 아닙니다.' })
  email: string;

  @IsString()
  @MinLength(8, { message: '비밀번호는 8자리 이상이어야 합니다.' })
  password: string;

  @IsString()
  @MinLength(8, { message: '비밀번호 확인은 8자리 이상이어야 합니다.' })
  confirmPassword: string;

  @IsString()
  @MinLength(2, { message: '이름은 2자리 이상이어야 합니다.' })
  name: string;

  @IsMobilePhone('ko-KR', {}, { message: '올바른 전화번호 형식이어야 합니다.' })
  @Matches(/^010\d{8}$/, {
    message: '전화번호는 010으로 시작하는 11자리여야 합니다.',
  })
  phoneNumber: string;

  @IsIn(['A', 'B', 'C', 'D'], {
    message: '그룹은 A, B, C 또는 D 중 하나여야 합니다.',
  })
  group: 'A' | 'B' | 'C' | 'D';
}
