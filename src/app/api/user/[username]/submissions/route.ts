import { NextRequest, NextResponse } from 'next/server';
import { LeetCode } from 'leetcode-query';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ username: string }> }
) {
  try {
    const resolvedParams = await params;
    const { username } = resolvedParams;
    const { searchParams } = new URL(request.url);
    const limit = parseInt(searchParams.get('limit') || '20');
    
    if (!username) {
      return NextResponse.json(
        { error: 'Username is required' },
        { status: 400 }
      );
    }

    const leetcode = new LeetCode();
    
    // Fetch recent submissions
    const submissions = await leetcode.recent_submissions(username, Math.min(limit, 20));
    
    // Process and enhance submission data
    const processedSubmissions = submissions.map((submission: any) => ({
      title: submission.title,
      titleSlug: submission.titleSlug,
      timestamp: submission.timestamp,
      statusDisplay: submission.statusDisplay,
      lang: submission.lang,
      // Convert timestamp to readable date
      submittedAt: new Date(parseInt(submission.timestamp) * 1000).toISOString(),
      // Determine if submission was successful
      isAccepted: submission.statusDisplay === 'Accepted',
      // Extract problem URL
      problemUrl: `https://leetcode.com/problems/${submission.titleSlug}/`
    }));

    // Calculate some basic analytics
    const analytics = {
      totalSubmissions: processedSubmissions.length,
      acceptedSubmissions: processedSubmissions.filter(s => s.isAccepted).length,
      languages: [...new Set(processedSubmissions.map(s => s.lang))],
      recentAcceptanceRate: processedSubmissions.length > 0 ? 
        Math.round((processedSubmissions.filter(s => s.isAccepted).length / processedSubmissions.length) * 100) : 0,
      problemsSolved: [...new Set(processedSubmissions.filter(s => s.isAccepted).map(s => s.titleSlug))].length
    };

    return NextResponse.json({
      username,
      submissions: processedSubmissions,
      analytics,
      fetchedAt: new Date().toISOString()
    });
    
  } catch (error: any) {
    console.error('Error fetching submissions:', error);
    
    if (error.message?.includes('User not found') || error.status === 404) {
      return NextResponse.json(
        { error: 'User not found. Please check the username and try again.' },
        { status: 404 }
      );
    }
    
    return NextResponse.json(
      { error: 'Failed to fetch submissions. Please try again later.' },
      { status: 500 }
    );
  }
}
