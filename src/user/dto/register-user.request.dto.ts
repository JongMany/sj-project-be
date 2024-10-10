export type RegisterUserRequestDto = {
  email: string;
  password: string;
  confirmPassword: string;
  name: string;
  phoneNumber: string;
  group: 'A' | 'B' | 'C' | 'D';
};
