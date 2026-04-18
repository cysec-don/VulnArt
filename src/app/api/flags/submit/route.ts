import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { getSessionUser } from '@/lib/auth';

const VALID_FLAGS: Record<string, { tier: string; points: number }> = {
  'FLAG{w3lcome_to_vuln_art}': { tier: 'easy', points: 100 },
  'FLAG{r0b0ts_txt_g0ldm1ne}': { tier: 'easy', points: 150 },
  'FLAG{d33p_n3st3d_f1l3s_w1n}': { tier: 'medium', points: 300 },
  'FLAG{adm1n_c00k1e_h4ck}': { tier: 'medium', points: 250 },
  'FLAG{sql_qu3ry_m4st3r}': { tier: 'hard', points: 400 },
  'FLAG{b1d_m4n1pul4t10n}': { tier: 'medium', points: 250 },
  'FLAG{r3nt_t1m3_tr4v3l3r}': { tier: 'medium', points: 250 },
  'FLAG{h1dd3n_4dm1n_p4n3l}': { tier: 'easy', points: 150 },
  'FLAG{d3bug_m0d3_l34k}': { tier: 'medium', points: 200 },
  'FLAG{1nt3rn4l_3xp0s3d}': { tier: 'medium', points: 200 },
  'FLAG{cr3d3nt14l_dump}': { tier: 'hard', points: 350 },
  'FLAG{b4ckup_sql_dump}': { tier: 'medium', points: 200 },
  'FLAG{4dm1n_fl4gs_v1ew}': { tier: 'hard', points: 500 },
  'FLAG{m4st3r_0f_vuln}': { tier: 'expert', points: 1000 },
  'FLAG{exp0rt_d4t4_br34ch}': { tier: 'medium', points: 200 },
};

export async function POST(request: NextRequest) {
  try {
    const user = await getSessionUser();

    if (!user) {
      return NextResponse.json(
        { error: 'Authentication required' },
        { status: 401 }
      );
    }

    const body = await request.json();
    const { flag } = body;

    if (!flag) {
      return NextResponse.json(
        { error: 'Flag is required' },
        { status: 400 }
      );
    }

    const flagData = VALID_FLAGS[flag];

    if (!flagData) {
      return NextResponse.json(
        { error: 'Invalid flag', valid: false },
        { status: 400 }
      );
    }

    // Check if already submitted
    const existing = await db.flagSubmission.findFirst({
      where: {
        userId: user.id,
        flag,
      },
    });

    if (existing) {
      return NextResponse.json({
        message: 'Flag already submitted',
        valid: true,
        tier: flagData.tier,
        points: flagData.points,
        alreadySubmitted: true,
      });
    }

    // Record the submission
    const submission = await db.flagSubmission.create({
      data: {
        userId: user.id,
        flag,
        tier: flagData.tier,
        points: flagData.points,
      },
    });

    return NextResponse.json({
      message: 'Flag accepted! 🎉',
      valid: true,
      tier: flagData.tier,
      points: flagData.points,
      submission: {
        id: submission.id,
        createdAt: submission.createdAt,
      },
    });
  } catch (error) {
    return NextResponse.json(
      { error: 'Flag submission failed' },
      { status: 500 }
    );
  }
}
