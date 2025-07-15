import { NextResponse } from 'next/server';
import { promises as fs } from 'fs';
import path from 'path';

const submissionsFile = path.join(process.cwd(), 'contact-submissions.json');

export async function GET() {
  try {
    const file = await fs.readFile(submissionsFile, 'utf-8');
    const submissions = JSON.parse(file);
    return NextResponse.json(submissions);
  } catch (e) {
    // File does not exist or is invalid
    return NextResponse.json([]);
  }
}

export async function DELETE(req: Request) {
  try {
    const { index } = await req.json();
    const file = await fs.readFile(submissionsFile, 'utf-8');
    let submissions = JSON.parse(file);
    if (typeof index !== 'number' || index < 0 || index >= submissions.length) {
      return NextResponse.json({ success: false, error: 'Invalid index' }, { status: 400 });
    }
    submissions.splice(index, 1);
    await fs.writeFile(submissionsFile, JSON.stringify(submissions, null, 2));
    return NextResponse.json({ success: true });
  } catch (e) {
    return NextResponse.json({ success: false }, { status: 500 });
  }
} 