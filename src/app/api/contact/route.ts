import { NextRequest, NextResponse } from 'next/server';
import { promises as fs } from 'fs';
import path from 'path';

const submissionsFile = path.join(process.cwd(), 'contact-submissions.json');

export async function POST(req: NextRequest) {
  try {
    const data = await req.json();
    let submissions = [];
    try {
      const file = await fs.readFile(submissionsFile, 'utf-8');
      submissions = JSON.parse(file);
    } catch (e) {
      // File does not exist or is invalid, start fresh
      submissions = [];
    }
    submissions.push({ ...data, timestamp: new Date().toISOString() });
    await fs.writeFile(submissionsFile, JSON.stringify(submissions, null, 2));
    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json({ success: false }, { status: 500 });
  }
} 