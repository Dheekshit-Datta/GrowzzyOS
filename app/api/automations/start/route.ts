import { NextRequest, NextResponse } from 'next/server';
import { automationEngine } from '@/lib/automation-engine';

export async function POST(request: NextRequest) {
  try {
    await automationEngine.start();
    
    return NextResponse.json({
      success: true,
      message: 'Automation engine started successfully'
    });
  } catch (error: any) {
    console.error('Failed to start automation engine:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to start automation engine' },
      { status: 500 }
    );
  }
}

export async function DELETE(request: NextRequest) {
  try {
    await automationEngine.stop();
    
    return NextResponse.json({
      success: true,
      message: 'Automation engine stopped successfully'
    });
  } catch (error: any) {
    console.error('Failed to stop automation engine:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to stop automation engine' },
      { status: 500 }
    );
  }
}
