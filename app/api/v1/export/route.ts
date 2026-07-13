import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export const dynamic = 'force-dynamic';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const format = searchParams.get('format') || 'json';

  try {
    const representatives = await prisma.representative.findMany({
      include: {
        sources: true,
        issuePositions: true,
        metadata: true,
      }
    });

    if (format === 'csv') {
      // Very basic CSV generation for Data Warehousing requirements
      const headers = ['id', 'name', 'office', 'level', 'party', 'jurisdiction', 'confidence', 'lastUpdated'];
      const rows = representatives.map(rep => [
        rep.id,
        `"${rep.name}"`,
        `"${rep.office}"`,
        rep.level,
        rep.party,
        `"${rep.jurisdiction}"`,
        rep.confidence,
        new Date().toISOString()
      ].join(','));
      
      const csvContent = [headers.join(','), ...rows].join('\n');
      return new NextResponse(csvContent, {
        headers: {
          'Content-Type': 'text/csv',
          'Content-Disposition': 'attachment; filename="representatives.csv"'
        }
      });
    }

    // Default JSON export
    return NextResponse.json({ representatives });

  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: 'Failed to export data' }, { status: 500 });
  }
}
