import { NextRequest, NextResponse } from 'next/server';
import { LeetCodeAuthService } from '@/lib/leetcode-auth';

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ username: string }> }
): Promise<NextResponse> {
  try {
    const { username } = await params;
    const { sessionCookie } = await request.json();

    if (!sessionCookie) {
      return NextResponse.json(
        { success: false, error: 'Session cookie is required' },
        { status: 400 }
      );
    }

    console.log(`🔐 Authenticating user ${username} for submissions...`);

    // Create auth service instance
    const authService = new LeetCodeAuthService();
    
    // Authenticate with session cookie
    const authResult = await authService.authenticate(sessionCookie);
    
    if (!authResult.success || !authResult.authenticated) {
      return NextResponse.json(
        { 
          success: false, 
          error: authResult.error || 'Authentication failed',
          details: 'Session cookie authentication failed'
        },
        { status: 401 }
      );
    }

    // Verify the authenticated user matches the requested username
    if (!authService.verifyUsername(username)) {
      return NextResponse.json(
        { 
          success: false, 
          error: `Session cookie is for user '${authResult.username}', but requesting data for '${username}'` 
        },
        { status: 403 }
      );
    }

    console.log(`✅ Authentication successful for ${authResult.username}`);

    // Fetch all submissions with code
    console.log(`📊 Fetching all submissions for ${username}...`);
    const submissions = await authService.getAllSubmissions(1000, true);
    
    console.log(`✅ Successfully fetched ${submissions.length} submissions`);

    return NextResponse.json({
      success: true,
      submissions,
      total: submissions.length,
      authenticatedUser: authResult.username,
      message: `Successfully fetched ${submissions.length} submissions with code`
    });

  } catch (error) {
    console.error('❌ Error in submissions-auth:', error);
    return NextResponse.json(
      { 
        success: false, 
        error: error instanceof Error ? error.message : 'Failed to fetch authenticated submissions',
        details: 'Server error occurred while fetching submissions'
      },
      { status: 500 }
    );
  }
}
