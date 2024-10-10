// app.config.ts
import { registerAs } from '@nestjs/config';

export default registerAs('app', () => ({
  jwt: {
    secretKey: process.env.JWT_SECRET_KEY || 'secret',
    accessSecret: process.env.JWT_ACCESS_SECRET,
    refreshSecret: process.env.JWT_REFRESH_SECRET,
    accessExpireTime: process.env.JWT_ACCESS_EXPIRE_TIME,
    refreshExpireTime: process.env.JWT_REFRESH_EXPIRE_TIME,
    ttl: process.env.RT_JWT_EXPIRATION_TIME,
  },
  common: {
    port: process.env.PORT || 8080,
  },
  throttle: {
    timeToLiveMilliSecond: process.env.TIME_TO_LIVE_MILLISECOND,
    limitRequestTimeToLive: parseInt(process.env.LIMIT_REQUEST_TIME_TO_LIVE),
  },
}));
