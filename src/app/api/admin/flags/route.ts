import { NextRequest, NextResponse } from 'next/server';
import { getSessionUser } from '@/lib/auth';

// CTF: Weak auth check - only checks if role contains 'admin' string
// But doesn't verify session integrity properly
export async function GET(request: NextRequest) {
  try {
    const user = await getSessionUser();

    // Weak auth check - could be bypassed
    if (!user) {
      return NextResponse.json(
        { error: 'Authentication required' },
        { status: 401 }
      );
    }

    if (user.role !== 'admin') {
      // But we still leak some info
      return NextResponse.json({
        error: 'Admin access required',
        hint: 'Try accessing with an admin role. The profile update endpoint might help...',
      });
    }

    const flags = [
      { flag: 'FLAG{w3lcome_to_vuln_art}', tier: 'easy', points: 100, description: 'Found in HTML source code' },
      { flag: 'FLAG{r0b0ts_txt_g0ldm1ne}', tier: 'easy', points: 150, description: 'Found in exposed .env file via robots.txt' },
      { flag: 'FLAG{d33p_n3st3d_f1l3s_w1n}', tier: 'medium', points: 300, description: 'Found deep in nested directory structure' },
      { flag: 'FLAG{adm1n_c00k1e_h4ck}', tier: 'medium', points: 250, description: 'Escalated privileges via role manipulation' },
      { flag: 'FLAG{sql_qu3ry_m4st3r}', tier: 'hard', points: 400, description: 'Exploited search query vulnerability' },
      { flag: 'FLAG{b1d_m4n1pul4t10n}', tier: 'medium', points: 250, description: 'Placed a bid below minimum' },
      { flag: 'FLAG{r3nt_t1m3_tr4v3l3r}', tier: 'medium', points: 250, description: 'Rented for an impossibly long duration' },
      { flag: 'FLAG{h1dd3n_4dm1n_p4n3l}', tier: 'easy', points: 150, description: 'Found the hidden admin panel' },
      { flag: 'FLAG{d3bug_m0d3_l34k}', tier: 'medium', points: 200, description: 'Accessed debug environment variables' },
      { flag: 'FLAG{1nt3rn4l_3xp0s3d}', tier: 'medium', points: 200, description: 'Accessed internal statistics endpoint' },
      { flag: 'FLAG{cr3d3nt14l_dump}', tier: 'hard', points: 350, description: 'Found credentials in exposed files' },
      { flag: 'FLAG{b4ckup_sql_dump}', tier: 'medium', points: 200, description: 'Found clues in database backup' },
      { flag: 'FLAG{4dm1n_fl4gs_v1ew}', tier: 'hard', points: 500, description: 'Viewed admin flags endpoint' },
      { flag: 'FLAG{m4st3r_0f_vuln}', tier: 'expert', points: 1000, description: 'Found the master flag in the admin panel' },
      { flag: 'FLAG{exp0rt_d4t4_br34ch}', tier: 'medium', points: 200, description: 'Exported sensitive data via v1 API' },
    ];

    return NextResponse.json({ flags, totalPoints: flags.reduce((sum, f) => sum + f.points, 0) });
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to fetch flags' },
      { status: 500 }
    );
  }
}
