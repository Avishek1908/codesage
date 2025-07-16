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

    const leetcode = new LeetCode();
    
    // Fetch user profile to get problem solving statistics
    const userProfile = await leetcode.user(username);
    
    if (!userProfile.matchedUser) {
      return NextResponse.json(
        { error: 'User not found' },
        { status: 404 }
      );
    }

    // Extract and format statistics
    const stats = {
      username: userProfile.matchedUser.username,
      ranking: userProfile.matchedUser.profile?.ranking || null,
      totalSolved: userProfile.matchedUser.submitStats?.acSubmissionNum?.find(
        (stat: any) => stat.difficulty === 'All'
      )?.count || 0,
      easySolved: userProfile.matchedUser.submitStats?.acSubmissionNum?.find(
        (stat: any) => stat.difficulty === 'Easy'
      )?.count || 0,
      mediumSolved: userProfile.matchedUser.submitStats?.acSubmissionNum?.find(
        (stat: any) => stat.difficulty === 'Medium'
      )?.count || 0,
      hardSolved: userProfile.matchedUser.submitStats?.acSubmissionNum?.find(
        (stat: any) => stat.difficulty === 'Hard'
      )?.count || 0,
      totalSubmissions: userProfile.matchedUser.submitStats?.totalSubmissionNum?.find(
        (stat: any) => stat.difficulty === 'All'
      )?.count || 0,
      acceptanceRate: (() => {
        const totalAc = userProfile.matchedUser.submitStats?.acSubmissionNum?.find(
          (stat: any) => stat.difficulty === 'All'
        )?.count || 0;
        const totalSubmissions = userProfile.matchedUser.submitStats?.totalSubmissionNum?.find(
          (stat: any) => stat.difficulty === 'All'
        )?.count || 0;
        return totalSubmissions > 0 ? Math.round((totalAc / totalSubmissions) * 100) : 0;
      })(),
      badges: userProfile.matchedUser.badges || [],
      contributions: userProfile.matchedUser.contributions || null,
      fetchedAt: new Date().toISOString()
    };

    return NextResponse.json(stats);
    
  } catch (error: any) {
    console.error('Error fetching user stats:', error);
    
    if (error.message?.includes('User not found') || error.status === 404) {
      return NextResponse.json(
        { error: 'User not found. Please check the username and try again.' },
        { status: 404 }
      );
    }
    
    return NextResponse.json(
      { error: 'Failed to fetch user statistics. Please try again later.' },
      { status: 500 }
    );
  }
}
