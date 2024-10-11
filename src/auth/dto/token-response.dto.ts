export interface TokenResponseDto {
  success: boolean;
  token: {
    accessToken: string;
    refreshToken: string;
  };
  email: string;
  group: 'A' | 'B' | 'C' | 'D';
  name: string;
}
