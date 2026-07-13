import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

// Simple API Key authentication for the prototype
const validateApiKey = (request: Request) => {
  const authHeader = request.headers.get('authorization');
  if (authHeader !== `Bearer ${process.env.ADMIN_API_KEY || 'demo-admin-key'}`) {
    return false;
  }
  return true;
};

export async function POST(request: Request) {
  if (!validateApiKey(request)) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const data = await request.json();
    
    // Example payload validation and ingestion for an AuditRecord and Representative update
    if (data.type === 'representative_update') {
      const { representativeId, bio, sourceId, fieldMetadataVersion } = data;
      
      // Update representative
      await prisma.representative.update({
        where: { id: representativeId },
        data: { bio }
      });

      // Create Audit Record
      await prisma.auditRecord.create({
        data: {
          entityType: 'representative',
          entityId: representativeId,
          entityLabel: `Representative Update: ${representativeId}`,
          stage: 'processed',
          source: sourceId,
          version: fieldMetadataVersion || 'v1',
          status: 'success'
        }
      });

      // Update FieldMetadata
      await prisma.fieldMetadata.create({
        data: {
          entityType: 'Representative',
          entityId: representativeId,
          field: 'bio',
          confidenceScore: 100, // Explicitly provided by admin ingestion
          version: fieldMetadataVersion || 'v1',
          sourceId: sourceId,
          representativeId: representativeId
        }
      });

      return NextResponse.json({ success: true, message: 'Data ingested successfully' });
    }

    return NextResponse.json({ error: 'Unsupported ingestion type' }, { status: 400 });

  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: 'Failed to ingest data' }, { status: 500 });
  }
}
