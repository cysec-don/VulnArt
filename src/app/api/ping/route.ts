import { NextRequest, NextResponse } from 'next/server';
import { exec } from 'child_process';
import { promisify } from 'util';

const execAsync = promisify(exec);

export async function POST(request: NextRequest) {
  try {
    const { host } = await request.json();

    if (!host) {
      return NextResponse.json(
        { error: 'Host parameter is required' },
        { status: 400 }
      );
    }

    // VULNERABLE: Direct command injection - no sanitization!
    const command = `ping -c 3 ${host}`;
    console.log('Executing command:', command);

    const { stdout, stderr } = await execAsync(command, { timeout: 10000 });

    return NextResponse.json({
      success: true,
      command,
      output: stdout || stderr,
    });
  } catch (error: any) {
    return NextResponse.json({
      success: false,
      command: `ping -c 3 ${error.message?.match(/ping -c 3 (.+)/)?.[1] || 'unknown'}`,
      output: error.stdout || error.stderr || error.message,
    });
  }
}
