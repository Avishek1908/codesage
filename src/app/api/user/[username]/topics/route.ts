import { NextRequest, NextResponse } from 'next/server';
import { LeetCode } from 'leetcode-query';

interface TopicAnalytics {
  topicName: string;
  slug: string;
  totalAttempts: number;
  successfulAttempts: number;
  failedAttempts: number;
  successRate: number;
  problems: string[];
  recentActivity: string;
  difficulty: {
    easy: { attempted: number; solved: number };
    medium: { attempted: number; solved: number };
    hard: { attempted: number; solved: number };
  };
}

async function getAllSubmissions(leetcode: any, username: string) {
  // Enhanced submission gathering strategy
  console.log('Attempting to gather comprehensive submission data...');
  
  let allSubmissions: any[] = [];
  
  // Method 1: Try recent_submissions with maximum reasonable limit
  try {
    console.log('Fetching recent submissions...');
    const recentSubmissions = await leetcode.recent_submissions(username, 100);
    allSubmissions = [...recentSubmissions];
    console.log(`✅ Got ${recentSubmissions.length} submissions from recent_submissions`);
  } catch (error) {
    console.error('❌ Error fetching recent submissions:', error);
    throw error; // If this fails, we can't proceed
  }
  
  // Method 2: Try to get user's total submission count for context
  try {
    const userProfile = await leetcode.user(username);
    if (userProfile?.matchedUser?.submitStats) {
      const totalSubmissions = userProfile.matchedUser.submitStats.totalSubmissionNum?.find(
        (stat: any) => stat.difficulty === 'All'
      )?.count || 0;
      
      console.log(`📊 User has ${totalSubmissions} total submissions in their profile`);
      console.log(`📈 Currently analyzing ${allSubmissions.length} recent submissions (${Math.round((allSubmissions.length / totalSubmissions) * 100)}% of total)`);
    }
  } catch {
    console.log('ℹ️ Could not fetch total submission count for context');
  }
  
  // Sort by timestamp (newest first)
  allSubmissions.sort((a, b) => parseInt(b.timestamp) - parseInt(a.timestamp));
  
  return allSubmissions;
}

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ username: string }> }
) {
  try {
    const { username } = await params;
    const { searchParams } = new URL(request.url);
    const enhanced = searchParams.get('enhanced') === 'true'; // Flag for enhanced data fetching
    
    if (!username) {
      return NextResponse.json(
        { error: 'Username is required' },
        { status: 400 }
      );
    }

    const leetcode = new LeetCode();
    
    // Fetch submissions with enhanced method if requested
    let submissions;
    if (enhanced) {
      submissions = await getAllSubmissions(leetcode, username);
    } else {
      submissions = await leetcode.recent_submissions(username, 50);
    }
    
    if (submissions.length === 0) {
      return NextResponse.json({
        username,
        message: 'No submissions found for topic analysis',
        topicAnalytics: [],
        fetchedAt: new Date().toISOString()
      });
    }

    console.log(`Analyzing ${submissions.length} submissions for topic analytics...`);

    // Get unique problem slugs from submissions
    const uniqueProblems = [...new Set(submissions.map((s: any) => s.titleSlug))];
    
    // Fetch problem details to get tags (with rate limiting)
    const problemDetails: any[] = [];
    for (let i = 0; i < Math.min(uniqueProblems.length, 30); i++) {
      try {
        console.log(`Fetching problem details for: ${uniqueProblems[i]} (${i + 1}/${Math.min(uniqueProblems.length, 30)})`);
        const problemDetail = await leetcode.problem(uniqueProblems[i]);
        problemDetails.push({
          slug: uniqueProblems[i],
          title: problemDetail.title,
          difficulty: problemDetail.difficulty,
          topicTags: problemDetail.topicTags || []
        });
        
        // Add delay to avoid rate limiting
        if (i < Math.min(uniqueProblems.length, 30) - 1) {
          await new Promise(resolve => setTimeout(resolve, 200));
        }
      } catch (error) {
        console.error(`Error fetching problem ${uniqueProblems[i]}:`, error);
        // Continue with other problems even if one fails
      }
    }

    console.log(`Successfully fetched details for ${problemDetails.length} problems`);

    // Create a map of problem slug to its details
    const problemMap = new Map();
    problemDetails.forEach(problem => {
      problemMap.set(problem.slug, problem);
    });

    // Group submissions by topic tags
    const topicMap = new Map<string, {
      submissions: any[];
      problems: Set<string>;
      difficulties: Set<string>;
    }>();

    submissions.forEach((submission: any) => {
      const problemDetail = problemMap.get(submission.titleSlug);
      if (problemDetail && problemDetail.topicTags) {
        problemDetail.topicTags.forEach((tag: any) => {
          const topicSlug = tag.slug;
          const topicName = tag.name;
          
          if (!topicMap.has(topicSlug)) {
            topicMap.set(topicSlug, {
              submissions: [],
              problems: new Set(),
              difficulties: new Set()
            });
          }
          
          const topicData = topicMap.get(topicSlug)!;
          topicData.submissions.push({
            ...submission,
            problemTitle: problemDetail.title,
            difficulty: problemDetail.difficulty,
            topicName
          });
          topicData.problems.add(submission.titleSlug);
          topicData.difficulties.add(problemDetail.difficulty);
        });
      }
    });

    // Calculate analytics for each topic
    const topicAnalytics: TopicAnalytics[] = [];
    
    topicMap.forEach((data, topicSlug) => {
      const submissions = data.submissions;
      const successfulSubmissions = submissions.filter(s => s.statusDisplay === 'Accepted');
      const failedSubmissions = submissions.filter(s => s.statusDisplay !== 'Accepted');
      
      // Calculate difficulty breakdown
      const difficultyStats = {
        easy: { attempted: 0, solved: 0 },
        medium: { attempted: 0, solved: 0 },
        hard: { attempted: 0, solved: 0 }
      };

      submissions.forEach(sub => {
        const diff = sub.difficulty?.toLowerCase();
        if (diff && difficultyStats[diff as keyof typeof difficultyStats]) {
          difficultyStats[diff as keyof typeof difficultyStats].attempted++;
          if (sub.statusDisplay === 'Accepted') {
            difficultyStats[diff as keyof typeof difficultyStats].solved++;
          }
        }
      });

      // Get most recent activity
      const sortedSubmissions = submissions.sort((a, b) => parseInt(b.timestamp) - parseInt(a.timestamp));
      const recentActivity = sortedSubmissions.length > 0 
        ? new Date(parseInt(sortedSubmissions[0].timestamp) * 1000).toLocaleDateString()
        : 'No recent activity';

      const analytics: TopicAnalytics = {
        topicName: submissions[0]?.topicName || topicSlug,
        slug: topicSlug,
        totalAttempts: submissions.length,
        successfulAttempts: successfulSubmissions.length,
        failedAttempts: failedSubmissions.length,
        successRate: Math.round((successfulSubmissions.length / submissions.length) * 100),
        problems: Array.from(data.problems),
        recentActivity,
        difficulty: difficultyStats
      };
      
      topicAnalytics.push(analytics);
    });

    // Sort by success rate and total attempts for better insights
    topicAnalytics.sort((a, b) => {
      if (a.totalAttempts !== b.totalAttempts) {
        return b.totalAttempts - a.totalAttempts; // More attempts first
      }
      return b.successRate - a.successRate; // Higher success rate first
    });

    // Calculate overall topic statistics
    const overallStats = {
      totalTopicsAnalyzed: topicAnalytics.length,
      totalProblemsAnalyzed: problemDetails.length,
      totalSubmissionsAnalyzed: submissions.length,
      averageSuccessRate: topicAnalytics.length > 0 
        ? Math.round(topicAnalytics.reduce((sum, topic) => sum + topic.successRate, 0) / topicAnalytics.length)
        : 0,
      strongestTopic: topicAnalytics.length > 0 
        ? topicAnalytics.find(topic => topic.totalAttempts >= 3) || topicAnalytics[0]
        : null,
      improvementAreas: topicAnalytics
        .filter(topic => topic.totalAttempts >= 2 && topic.successRate < 60)
        .slice(0, 5)
    };

    return NextResponse.json({
      username,
      topicAnalytics: topicAnalytics.slice(0, 20), // Return top 20 topics
      overallStats,
      metadata: {
        enhanced: enhanced,
        totalSubmissionsAnalyzed: submissions.length,
        analysisLimitReached: uniqueProblems.length > 30,
        totalUniqueProblems: uniqueProblems.length,
        problemsAnalyzed: problemDetails.length,
        note: enhanced 
          ? `Enhanced analysis: Processed ${submissions.length} submissions with comprehensive data gathering${uniqueProblems.length > 30 ? ', limited to 30 unique problems to avoid rate limiting' : ''}. Note: LeetCode API limits access to recent submissions only.`
          : `Standard analysis: Processed ${submissions.length} recent submissions${uniqueProblems.length > 30 ? ', limited to 30 unique problems to avoid rate limiting' : ''}. Use 🚀 Enhanced Mode for better data gathering and context.`
      },
      fetchedAt: new Date().toISOString()
    });
    
  } catch (error: any) {
    console.error('Error fetching topic analytics:', error);
    
    if (error.message?.includes('User not found') || error.status === 404) {
      return NextResponse.json(
        { error: 'User not found. Please check the username and try again.' },
        { status: 404 }
      );
    }
    
    return NextResponse.json(
      { error: 'Failed to fetch topic analytics. Please try again later.' },
      { status: 500 }
    );
  }
}
