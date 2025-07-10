import { NextRequest, NextResponse } from 'next/server';
import { LeetCode } from 'leetcode-query';

export async function GET(
  request: NextRequest,
  { params }: { params: { username: string; submissionId: string } }
) {
  try {
    const { username, submissionId } = params;
    
    if (!username || !submissionId) {
      return NextResponse.json(
        { error: 'Username and submission ID are required' },
        { status: 400 }
      );
    }

    // Note: This requires authentication to access submission details
    // For now, we'll return a message about the limitation
    const leetcode = new LeetCode();
    
    try {
      // This would work only with authenticated sessions
      const submissionDetail = await leetcode.submission(parseInt(submissionId));
      
      return NextResponse.json({
        username,
        submissionId,
        submissionDetail,
        fetchedAt: new Date().toISOString()
      });
      
    } catch (authError) {
      // If authentication fails, provide helpful information
      return NextResponse.json({
        username,
        submissionId,
        error: 'Authentication required',
        message: 'To view submission code, you need to be logged in with your LeetCode account',
        limitation: 'LeetCode restricts access to submission details for privacy reasons',
        suggestion: 'This feature would work if the user provides their own LeetCode session',
        mockData: {
          code: `// This is where the actual submission code would appear
// For example, a Two Sum solution might look like:

class Solution {
public:
    vector<int> twoSum(vector<int>& nums, int target) {
        unordered_map<int, int> map;
        for (int i = 0; i < nums.size(); i++) {
            int complement = target - nums[i];
            if (map.find(complement) != map.end()) {
                return {map[complement], i};
            }
            map[nums[i]] = i;
        }
        return {};
    }
};`,
          language: 'cpp',
          runtime: '8 ms',
          memory: '10.2 MB',
          status: 'Accepted'
        },
        fetchedAt: new Date().toISOString()
      });
    }
    
  } catch (error: any) {
    console.error('Error fetching submission code:', error);
    
    return NextResponse.json(
      { error: 'Failed to fetch submission code. This feature requires LeetCode authentication.' },
      { status: 500 }
    );
  }
}
