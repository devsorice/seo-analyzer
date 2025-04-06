import { PrismaClient, Prisma } from '@prisma/client';
import { config } from '../config/config';
import { LighthouseJSONReport, ReportScores } from '../model/types';

export class ReportRepository {
  private prisma = new PrismaClient({ datasources: { db: { url: config.dbUrl } } });

  async save(url: string, raw: LighthouseJSONReport, scores: ReportScores) {
    return this.prisma.lighthouseReport.create({
      data: {
        url,
        raw: raw as unknown as Prisma.InputJsonValue,
        performance: scores.performance,
        accessibility: scores.accessibility,
        bestPractices: scores.bestPractices,
        seo: scores.seo,
      },
    });
  }
}