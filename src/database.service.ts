import { Injectable } from '@nestjs/common';
import { Client } from 'pg';

@Injectable()
export class DatabaseService {
  constructor() {}

  async ensureDatabaseExists(): Promise<void> {
    const client = new Client({
      user: process.env.DB_USER,
      host: process.env.DB_HOST,
      password: process.env.DB_PASSWORD,
      port: parseInt(process.env.DB_PORT, 10),
    });

    console.log('Ensuring database existence...');
    try {
      await client.connect();

      // 데이터베이스가 있는지 확인
      const result = await client.query(
        `SELECT 1 FROM pg_database WHERE datname = '${process.env.DB_NAME}';`,
      );

      // 데이터베이스가 없으면 생성
      if (result.rowCount === 0) {
        await client.query(`CREATE DATABASE "${process.env.DB_NAME}";`);
        console.log(`Database "${process.env.DB_NAME}" created successfully.`);
      } else {
        console.log(`Database "${process.env.DB_NAME}" already exists.`);
      }
    } catch (err) {
      console.error('Error ensuring database existence:', err);
    } finally {
      await client.end();
    }
  }
}
