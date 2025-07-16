import { NextRequest, NextResponse } from 'next/server';
import { LeetCode } from 'leetcode-query';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ username: string }> }
) {
  try {
    const resolvedParams = await params;
    const { username } = resolvedParams;
    
    if (!username) {
      return NextResponse.json(
        { error: 'Username is required' },
        { status: 400 }
      );
    }

    // Initialize LeetCode API client
    const leetcode = new LeetCode();

    // Fetch user profile data
    const [userProfile, contestInfo, recentSubmissions] = await Promise.all([
      leetcode.user(username),
      leetcode.user_contest_info(username),
      leetcode.recent_submissions(username, 20)
    ]);

    // Combine all data into a comprehensive response
    const userData = {
      profile: userProfile,
      contest: contestInfo,
      recentSubmissions: recentSubmissions,
      fetchedAt: new Date().toISOString()
    };

    return NextResponse.json(userData);
    
  } catch (error: any) {
    console.error('Error fetching user data:', error);
    
    // Handle specific error cases
    if (error.message?.includes('User not found') || error.status === 404) {
      return NextResponse.json(
        { error: 'User not found. Please check the username and try again.' },
        { status: 404 }
      );
    }
    
    return NextResponse.json(
      { error: 'Failed to fetch user data. Please try again later.' },
      { status: 500 }
    );
  }
}
