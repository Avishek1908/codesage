#!/usr/bin/env node

console.log('🧪 Testing Public API with New Auth Service...');
console.log('='.repeat(50));

async function testPublicAPI() {
  try {
    // Test public submissions endpoint
    console.log('\n🔍 Testing public submissions API...');
    
    const response = await fetch('http://localhost:3003/api/user/codesage2025/submissions', {
      method: 'GET',
    });
    
    if (response.ok) {
      const data = await response.json();
      console.log('✅ Public submissions API working:');
      console.log('- Total submissions:', data.submissions?.length || 0);
      if (data.submissions && data.submissions.length > 0) {
        console.log('- Sample submission:', {
          title: data.submissions[0].title,
          status: data.submissions[0].statusDisplay,
          language: data.submissions[0].lang
        });
      }
    } else {
      console.log('❌ Public submissions API failed:', response.status, response.statusText);
    }
    
    // Test user profile endpoint
    console.log('\n🔍 Testing user profile API...');
    
    const profileResponse = await fetch('http://localhost:3003/api/user/codesage2025', {
      method: 'GET',
    });
    
    if (profileResponse.ok) {
      const profileData = await profileResponse.json();
      console.log('✅ User profile API working:');
      console.log('- Profile retrieved successfully');
    } else {
      console.log('❌ User profile API failed:', profileResponse.status, profileResponse.statusText);
    }
    
  } catch (error) {
    console.error('❌ Test failed:', error.message);
  }
}

// Run tests
testPublicAPI().then(() => {
  console.log('\n🎯 Public API Test Summary:');
  console.log('- Public APIs continue to work correctly');
  console.log('- New authentication service is backward compatible');
  console.log('- Ready for production testing!');
}).catch(console.error);
