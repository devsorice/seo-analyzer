import dotenv from 'dotenv';
import { LighthouseCategory } from '../model/types';

dotenv.config();

export interface AppConfig {
  dbUrl: string;
  lighthouseCategories: LighthouseCategory[];
  browserDebugPort: number;
}

export const config: AppConfig = {
  dbUrl: process.env.DATABASE_URL || 'file:./dev.db',
  lighthouseCategories: [
    LighthouseCategory.Performance,
    LighthouseCategory.Accessibility,
    LighthouseCategory.BestPractices,
    LighthouseCategory.SEO,
  ],
  browserDebugPort: Number(process.env.DEBUG_PORT || 9222),
};