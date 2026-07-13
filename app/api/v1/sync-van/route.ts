import { NextResponse } from 'next/server';
import { prisma as db } from '@/lib/prisma';
import { randomUUID } from 'crypto';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { actionType, details, voterVanId } = body;

    if (!actionType) {
      return NextResponse.json({ error: 'Missing actionType parameter' }, { status: 400 });
    }

    // Step 1: Log to local database as pending
    const interactionId = randomUUID();
    let interaction = await db.voterInteraction.create({
      data: {
        id: interactionId,
        actionType,
        details: details ? JSON.stringify(details) : null,
        voterVanId: voterVanId || null,
        syncStatus: 'pending'
      }
    });

    const apiKey = process.env.NGP_VAN_API_KEY;

    // Step 2: Sync with External CRM
    if (apiKey && apiKey.length > 5) {
      try {
        // Example NGP VAN / EveryAction endpoint for recording an activist code or contact
        const vanUrl = 'https://api.securevan.com/v4/echoes'; 
        
        // Split AppName|APIKey which is standard for NGP VAN
        const authHeader = 'Basic ' + Buffer.from(apiKey).toString('base64');
        
        const response = await fetch(vanUrl, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': authHeader
          },
          body: JSON.stringify({
            action: actionType,
            details: details
          })
        });

        if (!response.ok) {
          throw new Error(`NGP VAN returned status ${response.status}`);
        }

        const vanData = await response.json();
        
        interaction = await db.voterInteraction.update({
          where: { id: interactionId },
          data: { 
            syncStatus: 'synced',
            voterVanId: vanData.vanId || interaction.voterVanId
          }
        });

      } catch (error) {
        console.error("NGP VAN Sync Error:", error);
        
        interaction = await db.voterInteraction.update({
          where: { id: interactionId },
          data: { syncStatus: 'failed' }
        });

        return NextResponse.json({ 
          error: 'Failed to sync to NGP VAN', 
          interactionId: interaction.id 
        }, { status: 502 });
      }
    } else {
      // Mock Fallback Logic
      console.log(`[Mock VAN Sync] Simulating CRM Sync for action: ${actionType}`);
      
      interaction = await db.voterInteraction.update({
        where: { id: interactionId },
        data: { syncStatus: 'synced_mock' }
      });
    }

    // Return success
    return NextResponse.json({
      success: true,
      message: `Action ${actionType} recorded.`,
      interaction: interaction
    });

  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Unknown error";
    console.error("NGP VAN Sync Error:", error);
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
