import { NextResponse } from 'next/server';
import { getReloopsWorkspaces } from '@/lib/reloops';

export async function GET() {
  const workspaces = await getReloopsWorkspaces();
  return NextResponse.json({ workspaces });
}