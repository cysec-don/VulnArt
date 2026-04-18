import { NextResponse } from 'next/server';
import { getSessionUser } from '@/lib/auth';
import { db } from '@/lib/db';

export async function GET() {
  try {
    const user = await getSessionUser();

    if (!user) {
      return NextResponse.json(
        { error: 'Authentication required' },
        { status: 401 }
      );
    }

    const fullUser = await db.user.findUnique({
      where: { id: user.id },
      select: {
        id: true,
        username: true,
        email: true,
        name: true,
        bio: true,
        avatar: true,
        role: true,
        balance: true,
        createdAt: true,
      },
    });

    return NextResponse.json({ user: fullUser });
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to fetch profile' },
      { status: 500 }
    );
  }
}

export async function PUT(request: NextRequest) {
  try {
    const user = await getSessionUser();

    if (!user) {
      return NextResponse.json(
        { error: 'Authentication required' },
        { status: 401 }
      );
    }

    const body = await request.json();
    const { name, bio, avatar, role } = body;

    // CTF VULN: IDOR - allows role change via body
    // Should NOT allow role to be changed, but we do
    const updateData: any = {};
    if (name !== undefined) updateData.name = name;
    if (bio !== undefined) updateData.bio = bio;
    if (avatar !== undefined) updateData.avatar = avatar;
    if (role !== undefined) {
      // CTF: No check on what role can be set
      updateData.role = role;
      await db.hiddenLog.create({
        data: {
          eventType: 'flag',
          message: `User ${user.username} changed role to ${role} - FLAG{adm1n_c00k1e_h4ck}`,
          metadata: JSON.stringify({ userId: user.id, oldRole: user.role, newRole: role }),
        },
      });
    }

    const updatedUser = await db.user.update({
      where: { id: user.id },
      data: updateData,
      select: {
        id: true,
        username: true,
        email: true,
        name: true,
        bio: true,
        avatar: true,
        role: true,
        balance: true,
      },
    });

    return NextResponse.json({
      message: 'Profile updated',
      user: updatedUser,
      // CTF: Leak flag if role was changed to admin
      ...(role === 'admin' ? { hint: 'FLAG{adm1n_c00k1e_h4ck}' } : {}),
    });
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to update profile' },
      { status: 500 }
    );
  }
}
