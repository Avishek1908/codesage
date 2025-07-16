import { NextRequest, NextResponse } from 'next/server';
import { LeetCode } from 'leetcode-query';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ username: string }> }
) {
  try {
    const { username } = await params;
    
    if (!username) {
      return NextResponse.json(
        { error: 'Username is required' },
        { status: 400 }
      );
    }

    const leetcode = new LeetCode();

    // Fetch all user data in parallel for better performance
    const [userProfile, contestInfo, recentSubmissions] = await Promise.all([
      leetcode.user(username),
      leetcode.user_contest_info(username).catch(() => null), // Contest info might not be available
      leetcode.recent_submissions(username, 20)
    ]);

    if (!userProfile.matchedUser) {
      return NextResponse.json(
        { error: 'User not found' },
        { status: 404 }
      );
    }

    // Extract comprehensive dashboard data
    const user = userProfile.matchedUser;
    
    // Problem solving statistics
    const problemStats = {
      totalSolved: user.submitStats?.acSubmissionNum?.find(
        (stat: any) => stat.difficulty === 'All'
      )?.count || 0,
      easySolved: user.submitStats?.acSubmissionNum?.find(
        (stat: any) => stat.difficulty === 'Easy'
      )?.count || 0,
      mediumSolved: user.submitStats?.acSubmissionNum?.find(
        (stat: any) => stat.difficulty === 'Medium'
      )?.count || 0,
      hardSolved: user.submitStats?.acSubmissionNum?.find(
        (stat: any) => stat.difficulty === 'Hard'
      )?.count || 0,
    };

    // Submission analytics
    const submissionAnalytics = {
      totalSubmissions: user.submitStats?.totalSubmissionNum?.find(
        (stat: any) => stat.difficulty === 'All'
      )?.count || 0,
      acceptanceRate: (() => {
        const totalAc = problemStats.totalSolved;
        const totalSubmissions = user.submitStats?.totalSubmissionNum?.find(
          (stat: any) => stat.difficulty === 'All'
        )?.count || 0;
        return totalSubmissions > 0 ? Math.round((totalAc / totalSubmissions) * 100) : 0;
      })(),
    };

    // Process recent submissions
    const processedSubmissions = recentSubmissions.map((submission: any) => ({
      title: submission.title,
      titleSlug: submission.titleSlug,
      timestamp: submission.timestamp,
      statusDisplay: submission.statusDisplay,
      lang: submission.lang,
      submittedAt: new Date(parseInt(submission.timestamp) * 1000).toISOString(),
      isAccepted: submission.statusDisplay === 'Accepted',
      problemUrl: `https://leetcode.com/problems/${submission.titleSlug}/`
    }));

    // Recent activity analytics
    const recentActivity = {
      recentSubmissions: processedSubmissions.slice(0, 10),
      languages: [...new Set(processedSubmissions.map(s => s.lang))],
      recentAcceptanceRate: processedSubmissions.length > 0 ? 
        Math.round((processedSubmissions.filter(s => s.isAccepted).length / processedSubmissions.length) * 100) : 0,
      problemsSolvedRecently: [...new Set(processedSubmissions.filter(s => s.isAccepted).map(s => s.titleSlug))].length
    };

    // Combine all data
    const dashboardData = {
      user: {
        username: user.username,
        realName: user.profile?.realName || null,
        avatar: user.profile?.userAvatar || null,
        ranking: user.profile?.ranking || null,
        reputation: user.profile?.reputation || null,
        aboutMe: user.profile?.aboutMe || null,
        location: user.profile?.countryName || null,
        company: user.profile?.company || null,
        school: user.profile?.school || null,
        skillTags: user.profile?.skillTags || []
      },
      problemStats,
      submissionAnalytics,
      recentActivity,
      contest: contestInfo ? {
        rating: contestInfo.userContestRanking?.rating || null,
        ranking: contestInfo.userContestRanking?.globalRanking || null,
        attended: contestInfo.userContestRanking?.attendedContestsCount || 0,
        topPercentage: contestInfo.userContestRanking?.topPercentage || null
      } : null,
      badges: user.badges || [],
      contributions: user.contributions || null,
      fetchedAt: new Date().toISOString()
    };

    return NextResponse.json(dashboardData);
    
  } catch (error: any) {
    console.error('Error fetching dashboard data:', error);
    
    if (error.message?.includes('User not found') || error.status === 404) {
      return NextResponse.json(
        { error: 'User not found. Please check the username and try again.' },
        { status: 404 }
      );
    }
    
    return NextResponse.json(
      { error: 'Failed to fetch dashboard data. Please try again later.' },
      { status: 500 }
    );
  }
}
