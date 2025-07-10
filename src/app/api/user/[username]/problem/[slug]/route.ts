import { NextRequest, NextResponse } from 'next/server';
import { LeetCode } from 'leetcode-query';

export async function GET(
  request: NextRequest,
  { params }: { params: { username: string; slug: string } }
) {
  try {
    const { username, slug } = params;
    
    if (!username || !slug) {
      return NextResponse.json(
        { error: 'Username and problem slug are required' },
        { status: 400 }
      );
    }

    const leetcode = new LeetCode();
    
    // Fetch all recent submissions for the user
    const allSubmissions = await leetcode.recent_submissions(username, 20);
    
    // Filter submissions for this specific problem
    const problemSubmissions = allSubmissions.filter(
      (submission: any) => submission.titleSlug === slug
    );

    if (problemSubmissions.length === 0) {
      // If no recent submissions found, still try to get problem info
      try {
        const problemInfo = await leetcode.problem(slug);
        return NextResponse.json({
          username,
          problemSlug: slug,
          problemTitle: problemInfo.title || 'Unknown Problem',
          problemUrl: `https://leetcode.com/problems/${slug}/`,
          submissions: [],
          message: 'No recent submissions found for this problem',
          totalSubmissions: 0,
          successfulSubmissions: 0,
          languages: [],
          fetchedAt: new Date().toISOString()
        });
      } catch {
        return NextResponse.json(
          { error: 'Problem not found or no submissions available' },
          { status: 404 }
        );
      }
    }

    // Process and enhance submission data
    const processedSubmissions = problemSubmissions.map((submission: any) => ({
      id: `${submission.timestamp}-${submission.lang}`,
      title: submission.title,
      titleSlug: submission.titleSlug,
      timestamp: submission.timestamp,
      statusDisplay: submission.statusDisplay,
      lang: submission.lang,
      submittedAt: new Date(parseInt(submission.timestamp) * 1000).toISOString(),
      isAccepted: submission.statusDisplay === 'Accepted',
      problemUrl: `https://leetcode.com/problems/${submission.titleSlug}/`,
      // Add relative time for better UX
      timeAgo: getTimeAgo(new Date(parseInt(submission.timestamp) * 1000))
    }));

    // Sort by timestamp (most recent first)
    processedSubmissions.sort((a, b) => parseInt(b.timestamp) - parseInt(a.timestamp));

    // Calculate analytics for this specific problem
    const analytics = {
      totalSubmissions: processedSubmissions.length,
      successfulSubmissions: processedSubmissions.filter(s => s.isAccepted).length,
      failedSubmissions: processedSubmissions.filter(s => !s.isAccepted).length,
      languages: [...new Set(processedSubmissions.map(s => s.lang))],
      firstAttempt: processedSubmissions[processedSubmissions.length - 1],
      latestAttempt: processedSubmissions[0],
      successRate: Math.round((processedSubmissions.filter(s => s.isAccepted).length / processedSubmissions.length) * 100),
      timeSpent: calculateTimeSpent(processedSubmissions),
      attempts: processedSubmissions.length
    };

    return NextResponse.json({
      username,
      problemSlug: slug,
      problemTitle: processedSubmissions[0]?.title || 'Unknown Problem',
      problemUrl: `https://leetcode.com/problems/${slug}/`,
      submissions: processedSubmissions,
      analytics,
      fetchedAt: new Date().toISOString()
    });
    
  } catch (error: any) {
    console.error('Error fetching problem submissions:', error);
    
    if (error.message?.includes('User not found') || error.status === 404) {
      return NextResponse.json(
        { error: 'User or problem not found. Please check the username and problem slug.' },
        { status: 404 }
      );
    }
    
    return NextResponse.json(
      { error: 'Failed to fetch problem submissions. Please try again later.' },
      { status: 500 }
    );
  }
}

// Helper function to calculate time ago
function getTimeAgo(date: Date): string {
  const now = new Date();
  const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000);
  
  if (diffInSeconds < 60) return `${diffInSeconds}s ago`;
  if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)}m ago`;
  if (diffInSeconds < 86400) return `${Math.floor(diffInSeconds / 3600)}h ago`;
  if (diffInSeconds < 604800) return `${Math.floor(diffInSeconds / 86400)}d ago`;
  if (diffInSeconds < 2419200) return `${Math.floor(diffInSeconds / 604800)}w ago`;
  return `${Math.floor(diffInSeconds / 2419200)}mo ago`;
}

// Helper function to calculate time spent on problem
function calculateTimeSpent(submissions: any[]): string {
  if (submissions.length < 2) return 'N/A';
  
  const earliest = submissions[submissions.length - 1];
  const latest = submissions[0];
  const diffInHours = (parseInt(latest.timestamp) - parseInt(earliest.timestamp)) / 3600;
  
  if (diffInHours < 1) return `${Math.round(diffInHours * 60)}m`;
  if (diffInHours < 24) return `${Math.round(diffInHours)}h`;
  return `${Math.round(diffInHours / 24)}d`;
}
