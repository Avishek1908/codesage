import { NextRequest, NextResponse } from 'next/server';
import { LeetCode, Credential } from 'leetcode-query';

export async function POST(request: NextRequest) {
  try {
    const { sessionCookie } = await request.json();

    if (!sessionCookie) {
      return NextResponse.json(
        { error: 'Session cookie is required' },
        { status: 400 }
      );
    }

    console.log('🔮 Running CodeSage magic with leetcode-query...');
    
    // Initialize credential with session cookie
    const credential = new Credential();
    await credential.init(sessionCookie);
    
    // Create LeetCode instance and fetch all submissions
    const leetcode = new LeetCode(credential);
    
    console.log('📥 Fetching all submissions...');
    let allSubmissions = [];
    let currentPage = 0;
    let hasMoreSubmissions = true;
    
    while (hasMoreSubmissions) {
      console.log(`🔄 Fetching page ${currentPage + 1}...`);
      const submissions = await leetcode.submissions({ limit: 10, offset: currentPage * 10 });
      
      if (submissions && submissions.length > 0) {
        allSubmissions.push(...submissions);
        currentPage++;
        console.log(`✅ Page ${currentPage} fetched: ${submissions.length} submissions (Total: ${allSubmissions.length})`);
      } else {
        hasMoreSubmissions = false;
        console.log('🏁 No more submissions found. Fetching complete!');
      }
    }
    
    console.log(`✨ CodeSage total submissions fetched: ${allSubmissions.length}`);
    
    // Get detailed submission data for the first submission (if available)
    let submissionDetail = null;
    if (allSubmissions && allSubmissions.length > 0 && allSubmissions[0].id) {
      try {
        console.log('🔍 Fetching detailed submission for ID:', allSubmissions[0].id);
        submissionDetail = await leetcode.submission(allSubmissions[0].id);
        console.log('✨ CodeSage submission detail:', submissionDetail);
      } catch (detailError) {
        console.warn('⚠️ Could not fetch submission detail:', detailError);
      }
    }
    
    console.log('🔗 API Path for Postman: POST http://localhost:3001/api/codesage');
    
    return NextResponse.json({
      success: true,
      data: {
        submissions: allSubmissions,
        submissionDetail: submissionDetail
      },
      timestamp: new Date().toISOString()
    });

  } catch (error) {
    console.error('CodeSage API error:', error);
    
    return NextResponse.json(
      { 
        error: error instanceof Error ? error.message : 'CodeSage failed to execute',
        success: false 
      },
      { status: 500 }
    );
  }
}
