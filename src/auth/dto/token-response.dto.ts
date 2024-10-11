export interface TokenResponseDto {
  success: boolean;
  token: {
    accessToken: string;
    refreshToken: string;
  };
  email: string;
}
