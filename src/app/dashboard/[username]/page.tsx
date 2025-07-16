'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import TopicsAnalytics from '../../../components/TopicsAnalytics';

// Type definitions
interface User {
  username: string;
  realName: string | null;
  avatar: string | null;
  ranking: number | null;
  reputation: number | null;
  aboutMe: string | null;
  location: string | null;
  company: string | null;
  school: string | null;
  skillTags: string[];
}

interface ProblemStats {
  totalSolved: number;
  easySolved: number;
  mediumSolved: number;
  hardSolved: number;
}

interface SubmissionAnalytics {
  totalSubmissions: number;
  acceptanceRate: number;
}

interface Submission {
  title: string;
  titleSlug: string;
  statusDisplay: string;
  lang: string;
  submittedAt: string;
  isAccepted: boolean;
  problemUrl: string;
}

interface RecentActivity {
  recentSubmissions: Submission[];
  languages: string[];
  recentAcceptanceRate: number;
  problemsSolvedRecently: number;
}

interface Contest {
  rating: number | null;
  ranking: number | null;
  attended: number;
  topPercentage: number | null;
}

interface DashboardData {
  user: User;
  problemStats: ProblemStats;
  submissionAnalytics: SubmissionAnalytics;
  recentActivity: RecentActivity;
  contest: Contest | null;
  badges: any[];
  contributions: any;
  fetchedAt: string;
}

export default function Dashboard() {
  const params = useParams();
  const router = useRouter();
  const username = params.username as string;
  const [data, setData] = useState<DashboardData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchUsername, setSearchUsername] = useState('');
  const [isSearching, setIsSearching] = useState(false);

  // CodeSage functionality state
  const [showCodeSageModal, setShowCodeSageModal] = useState(false);
  const [codeSageResults, setCodeSageResults] = useState<any>(null);
  const [codeSageLoading, setCodeSageLoading] = useState(false);
  const [codeSageError, setCodeSageError] = useState<string | null>(null);
  const [codeSageView, setCodeSageView] = useState<'submissions' | 'detail' | 'test'>('submissions');
  const [testApiResponse, setTestApiResponse] = useState<any>(null);
  const [testApiLoading, setTestApiLoading] = useState(false);

  useEffect(() => {
    if (username) {
      fetchDashboardData();
      setSearchUsername(decodeURIComponent(username));
    }
  }, [username]);

  // Handle keyboard shortcuts
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Focus search bar when pressing "/"
      if (e.key === '/' && !e.ctrlKey && !e.metaKey) {
        e.preventDefault();
        const searchInput = document.querySelector('input[placeholder*="Search"]') as HTMLInputElement;
        if (searchInput) {
          searchInput.focus();
        }
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, []);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await fetch(`/api/user/${encodeURIComponent(username)}/dashboard`);
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to fetch data');
      }
      
      const dashboardData = await response.json();
      setData(dashboardData);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleCodeSageClick = async () => {
    console.log('🚀 CodeSage button clicked!');
    
    // Your actual session cookie
    const sessionCookie = "eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJfYXV0aF91c2VyX2lkIjoiMTQzMTEwOTgiLCJfYXV0aF91c2VyX2JhY2tlbmQiOiJkamFuZ28uY29udHJpYi5hdXRoLmJhY2tlbmRzLk1vZGVsQmFja2VuZCIsIl9hdXRoX3VzZXJfaGFzaCI6ImNjNDhkNTMyMzYwZjQ0MjhkMDBkZGE1OThkZjRjNThjNTJhZGUyYTg2NDYzYWZhODg5ZWRiYWQ4YzNmNTAwZDgiLCJzZXNzaW9uX3V1aWQiOiI1YjFiMDhkNSIsImlkIjoxNDMxMTA5OCwiZW1haWwiOiJhdmlzaGVrY2hhb3MxOUBnbWFpbC5jb20iLCJ1c2VybmFtZSI6ImF2aXNoZWttMTkiLCJ1c2VyX3NsdWciOiJhdmlzaGVrbTE5IiwiYXZhdGFyIjoiaHR0cHM6Ly9hc3NldHMubGVldGNvZGUuY29tL3VzZXJzL2RlZmF1bHRfYXZhdGFyLmpwZyIsInJlZnJlc2hlZF9hdCI6MTc1MjI2NzcyNywiaXAiOiIyNjAxOjE5NzoyODA6NWM5MDoxY2JiOmYzODE6YTM2Mjo1NjJmIiwiaWRlbnRpdHkiOiJjZTY5Yjg1MWM0ZWRjN2VlYmZiMzk5OGFhOTRhNzE1NyIsImRldmljZV93aXRoX2lwIjpbImM3NDkwMzIwYmQzNDM4NjE2ZmRmNmM1MTA3MWU4NWJlIiwiMjYwMToxOTc6MjgwOjVjOTA6MWNiYjpmMzgxOmEzNjI6NTYyZiJdLCJfc2Vzc2lvbl9leHBpcnkiOjEyMDk2MDB9.1hVaj5GqGYpYDiYJfngJpy9YtnU1yIb-Dtql-IKGoFc";
    
    try {
      setCodeSageLoading(true);
      setCodeSageError(null);
      setShowCodeSageModal(true);
      
      console.log('🔮 Running CodeSage magic via API...');
      
      // Call our API route that uses leetcode-query on the server
      const response = await fetch('/api/codesage', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ sessionCookie }),
      });
      
      const result = await response.json();
      
      if (!response.ok) {
        throw new Error(result.error || 'CodeSage API failed');
      }
      
      console.log('✨ CodeSage API results:', result);
      setCodeSageResults(result.data);
      setCodeSageView('submissions'); // Reset to submissions view
      
    } catch (err) {
      console.error('CodeSage error:', err);
      setCodeSageError(err instanceof Error ? err.message : 'CodeSage failed');
    } finally {
      setCodeSageLoading(false);
    }
  };

  const handleTestApiClick = async () => {
    console.log('🧪 Test API button clicked!');
    
    try {
      setTestApiLoading(true);
      setCodeSageView('test');
      
      // Simulate an API call - you can replace this with your actual API endpoint
      console.log('🔍 Testing API call...');
      
      // Example API call (replace with your actual endpoint)
      const response = await fetch('https://jsonplaceholder.typicode.com/posts/1');
      const result = await response.json();
      
      // Add some additional mock data to make it more interesting
      const enhancedResult = {
        ...result,
        timestamp: new Date().toISOString(),
        status: 'success',
        metadata: {
          endpoint: 'https://jsonplaceholder.typicode.com/posts/1',
          method: 'GET',
          responseTime: '142ms',
          contentType: 'application/json'
        }
      };
      
      console.log('✨ Test API results:', enhancedResult);
      setTestApiResponse(enhancedResult);
      
    } catch (err) {
      console.error('Test API error:', err);
      setTestApiResponse({
        error: err instanceof Error ? err.message : 'Test API failed',
        timestamp: new Date().toISOString(),
        status: 'error'
      });
    } finally {
      setTestApiLoading(false);
    }
  };

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (searchUsername.trim() && searchUsername.trim() !== decodeURIComponent(username)) {
      setIsSearching(true);
      // Navigate to new username dashboard
      router.push(`/dashboard/${encodeURIComponent(searchUsername.trim())}`);
    }
  };

  const handleQuickSearch = (quickUsername: string) => {
    setSearchUsername(quickUsername);
    if (quickUsername !== decodeURIComponent(username)) {
      setIsSearching(true);
      router.push(`/dashboard/${encodeURIComponent(quickUsername)}`);
    }
  };

  if (loading || isSearching) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-orange-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-white text-xl">
            {isSearching ? `Searching for ${searchUsername}...` : `Loading ${decodeURIComponent(username)}'s dashboard...`}
          </p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 flex items-center justify-center">
        <div className="text-center max-w-md">
          <div className="text-6xl mb-4">😞</div>
          <h1 className="text-2xl font-bold text-white mb-4">Oops! Something went wrong</h1>
          <p className="text-gray-300 mb-6">{error}</p>
          <div className="space-y-4">
            <button
              onClick={fetchDashboardData}
              className="px-6 py-3 bg-orange-500 hover:bg-orange-600 text-white rounded-lg transition-colors"
            >
              Try Again
            </button>
            <Link href="/" className="block px-6 py-3 bg-gray-600 hover:bg-gray-700 text-white rounded-lg transition-colors">
              Go Back Home
            </Link>
          </div>
        </div>
      </div>
    );
  }

  if (!data) return null;

  const difficultyColors = {
    easy: 'text-green-400',
    medium: 'text-yellow-400',
    hard: 'text-red-400'
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
      {/* Header */}
      <nav className="relative z-10 px-6 py-4 border-b border-white/10">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <Link href="/" className="text-2xl font-bold text-white hover:text-orange-400 transition-colors">
            CodeSage
          </Link>
          
          {/* Search Bar */}
          <div className="flex-1 max-w-md mx-8">
            <form onSubmit={handleSearch} className="relative">
              <input
                type="text"
                value={searchUsername}
                onChange={(e) => setSearchUsername(e.target.value)}
                placeholder="Search LeetCode username..."
                className="w-full px-4 py-2 pl-10 bg-white/10 backdrop-blur-sm border border-white/20 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all"
              />
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <svg className="h-5 w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </div>
              <button
                type="submit"
                disabled={isSearching || !searchUsername.trim()}
                className="absolute inset-y-0 right-0 pr-3 flex items-center"
              >
                <div className={`px-3 py-1 text-xs font-medium rounded-lg transition-all ${
                  isSearching || !searchUsername.trim() 
                    ? 'bg-gray-600 text-gray-400 cursor-not-allowed' 
                    : 'bg-orange-500 hover:bg-orange-600 text-white cursor-pointer'
                }`}>
                  {isSearching ? '...' : '⏎'}
                </div>
              </button>
            </form>
          </div>

          <div className="flex items-center space-x-3">
            <button
              onClick={fetchDashboardData}
              disabled={loading}
              className="px-4 py-2 bg-white/10 hover:bg-white/20 text-white rounded-lg transition-colors disabled:opacity-50"
            >
              {loading ? '🔄' : '🔄 Refresh'}
            </button>
          </div>
        </div>
        
        {/* Quick Search Suggestions */}
        <div className="max-w-7xl mx-auto mt-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <span className="text-sm text-gray-400">Try:</span>
              {['jacoblincool', 'neal_wu', 'votrubac', 'uwi'].map((quickUser) => (
                <button
                  key={quickUser}
                  onClick={() => handleQuickSearch(quickUser)}
                  className="px-3 py-1 text-sm bg-white/5 hover:bg-white/10 text-gray-300 hover:text-white rounded-lg transition-colors border border-white/10"
                >
                  {quickUser}
                </button>
              ))}
            </div>
            <div className="hidden md:block text-xs text-gray-500">
              Press <kbd className="px-2 py-1 bg-white/10 rounded text-xs">/</kbd> to focus search
            </div>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <main className="relative z-10 px-6 py-8">
        <div className="max-w-7xl mx-auto">
          {/* User Header */}
          <div className="bg-white/5 backdrop-blur-sm rounded-3xl p-8 border border-white/10 mb-8">
            <div className="flex items-center space-x-6">
              {data.user.avatar && (
                <img
                  src={data.user.avatar}
                  alt={data.user.username}
                  className="w-20 h-20 rounded-full border-4 border-orange-500"
                />
              )}
              <div>
                <h1 className="text-4xl font-bold text-white mb-2">
                  {data.user.realName || data.user.username}
                </h1>
                <p className="text-gray-300 text-lg">@{data.user.username}</p>
                {data.user.ranking && (
                  <p className="text-orange-400 font-semibold">
                    Global Ranking: #{data.user.ranking.toLocaleString()}
                  </p>
                )}
                <div className="flex flex-wrap gap-2 mt-2">
                  {data.user.location && (
                    <span className="px-3 py-1 bg-blue-500/20 text-blue-300 rounded-full text-sm">
                      📍 {data.user.location}
                    </span>
                  )}
                  {data.user.school && (
                    <span className="px-3 py-1 bg-purple-500/20 text-purple-300 rounded-full text-sm">
                      🎓 {data.user.school}
                    </span>
                  )}
                  {data.user.company && (
                    <span className="px-3 py-1 bg-green-500/20 text-green-300 rounded-full text-sm">
                      🏢 {data.user.company}
                    </span>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Stats Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            {/* Total Solved */}
            <div className="bg-white/5 backdrop-blur-sm rounded-2xl p-6 border border-white/10">
              <div className="text-center">
                <div className="text-3xl font-bold text-white mb-2">
                  {data.problemStats.totalSolved}
                </div>
                <div className="text-gray-300">Problems Solved</div>
              </div>
            </div>

            {/* Acceptance Rate */}
            <div className="bg-white/5 backdrop-blur-sm rounded-2xl p-6 border border-white/10">
              <div className="text-center">
                <div className="text-3xl font-bold text-green-400 mb-2">
                  {data.submissionAnalytics.acceptanceRate}%
                </div>
                <div className="text-gray-300">Acceptance Rate</div>
              </div>
            </div>

            {/* Contest Rating */}
            <div className="bg-white/5 backdrop-blur-sm rounded-2xl p-6 border border-white/10">
              <div className="text-center">
                <div className="text-3xl font-bold text-purple-400 mb-2">
                  {data.contest?.rating ? Math.round(data.contest.rating) : 'N/A'}
                </div>
                <div className="text-gray-300">Contest Rating</div>
              </div>
            </div>

            {/* Recent Activity */}
            <div className="bg-white/5 backdrop-blur-sm rounded-2xl p-6 border border-white/10">
              <div className="text-center">
                <div className="text-3xl font-bold text-orange-400 mb-2">
                  {data.recentActivity.recentAcceptanceRate}%
                </div>
                <div className="text-gray-300">Recent Success Rate</div>
              </div>
            </div>
          </div>

          {/* Problem Difficulty Breakdown */}
          <div className="bg-white/5 backdrop-blur-sm rounded-3xl p-8 border border-white/10 mb-8">
            <h2 className="text-2xl font-bold text-white mb-6">Problem Difficulty Breakdown</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="text-center">
                <div className="text-4xl font-bold text-green-400 mb-2">
                  {data.problemStats.easySolved}
                </div>
                <div className="text-gray-300">Easy Problems</div>
                <div className="w-full bg-gray-700 rounded-full h-2 mt-2">
                  <div
                    className="bg-green-400 h-2 rounded-full"
                    style={{
                      width: `${Math.min((data.problemStats.easySolved / data.problemStats.totalSolved) * 100, 100)}%`
                    }}
                  ></div>
                </div>
              </div>
              <div className="text-center">
                <div className="text-4xl font-bold text-yellow-400 mb-2">
                  {data.problemStats.mediumSolved}
                </div>
                <div className="text-gray-300">Medium Problems</div>
                <div className="w-full bg-gray-700 rounded-full h-2 mt-2">
                  <div
                    className="bg-yellow-400 h-2 rounded-full"
                    style={{
                      width: `${Math.min((data.problemStats.mediumSolved / data.problemStats.totalSolved) * 100, 100)}%`
                    }}
                  ></div>
                </div>
              </div>
              <div className="text-center">
                <div className="text-4xl font-bold text-red-400 mb-2">
                  {data.problemStats.hardSolved}
                </div>
                <div className="text-gray-300">Hard Problems</div>
                <div className="w-full bg-gray-700 rounded-full h-2 mt-2">
                  <div
                    className="bg-red-400 h-2 rounded-full"
                    style={{
                      width: `${Math.min((data.problemStats.hardSolved / data.problemStats.totalSolved) * 100, 100)}%`
                    }}
                  ></div>
                </div>
              </div>
            </div>
          </div>

          {/* Recent Submissions */}
          <div className="bg-white/5 backdrop-blur-sm rounded-3xl p-8 border border-white/10 mb-8">
            <h2 className="text-2xl font-bold text-white mb-6">Recent Submissions</h2>
            <div className="space-y-4">
              {data.recentActivity.recentSubmissions.map((submission, index) => (
                <div
                  key={index}
                  className="bg-white/5 rounded-xl p-4 border border-white/10 hover:bg-white/10 transition-colors"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex-1">
                      <h3 className="text-white font-semibold mb-1">{submission.title}</h3>
                      <div className="flex items-center space-x-4 text-sm text-gray-300">
                        <span className={`px-2 py-1 rounded text-xs ${
                          submission.isAccepted ? 'bg-green-500/20 text-green-300' : 'bg-red-500/20 text-red-300'
                        }`}>
                          {submission.statusDisplay}
                        </span>
                        <span className="px-2 py-1 bg-blue-500/20 text-blue-300 rounded text-xs">
                          {submission.lang}
                        </span>
                        <span>{new Date(submission.submittedAt).toLocaleDateString()}</span>
                      </div>
                    </div>
                    <div className="flex space-x-2">
                      <Link
                        href={`/dashboard/${encodeURIComponent(username)}/problem/${submission.titleSlug}`}
                        className="px-4 py-2 bg-orange-500 hover:bg-orange-600 text-white rounded-lg transition-colors text-sm"
                      >
                        View Progress
                      </Link>
                      <a
                        href={submission.problemUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="px-4 py-2 bg-white/10 hover:bg-white/20 text-white rounded-lg transition-colors text-sm border border-white/20"
                      >
                        LeetCode ↗
                      </a>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Languages and Skills */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
            {/* Languages Used */}
            <div className="bg-white/5 backdrop-blur-sm rounded-3xl p-8 border border-white/10">
              <h2 className="text-2xl font-bold text-white mb-6">Recent Languages</h2>
              <div className="flex flex-wrap gap-3">
                {data.recentActivity.languages.map((lang, index) => (
                  <span
                    key={index}
                    className="px-4 py-2 bg-gradient-to-r from-orange-500/20 to-yellow-500/20 text-orange-300 rounded-full border border-orange-500/30"
                  >
                    {lang}
                  </span>
                ))}
              </div>
            </div>

            {/* Skill Tags */}
            <div className="bg-white/5 backdrop-blur-sm rounded-3xl p-8 border border-white/10">
              <h2 className="text-2xl font-bold text-white mb-6">Skill Tags</h2>
              <div className="flex flex-wrap gap-3">
                {data.user.skillTags.map((skill, index) => (
                  <span
                    key={index}
                    className="px-4 py-2 bg-gradient-to-r from-purple-500/20 to-blue-500/20 text-purple-300 rounded-full border border-purple-500/30"
                  >
                    {skill}
                  </span>
                ))}
              </div>
            </div>
          </div>

          {/* Topics Analytics Section */}
          <TopicsAnalytics username={data.user.username} />

          {/* CodeSage Feature Button */}
          <div className="relative mt-12">
            {/* Dramatic backdrop with multiple gradients */}
            <div className="absolute inset-0 bg-gradient-to-r from-purple-600/20 via-orange-500/20 to-purple-600/20 rounded-3xl blur-xl transform scale-105"></div>
            <div className="absolute inset-0 bg-gradient-to-t from-slate-900/50 via-transparent to-slate-900/50 rounded-3xl"></div>
            
            {/* Main container */}
            <div className="relative bg-gradient-to-br from-slate-800/80 via-slate-900/90 to-slate-800/80 backdrop-blur-sm rounded-3xl p-12 border border-gradient-to-r border-orange-500/30 shadow-2xl">
              {/* Animated border glow */}
              <div className="absolute inset-0 rounded-3xl bg-gradient-to-r from-purple-500/0 via-orange-500/30 to-purple-500/0 blur-sm opacity-75 animate-pulse"></div>
              
              {/* Content */}
              <div className="relative text-center">
                {/* Title with dramatic styling */}
                <div className="mb-6">
                  <h2 className="text-5xl font-black text-transparent bg-clip-text bg-gradient-to-r from-orange-400 via-purple-400 to-orange-400 mb-3 animate-pulse">
                    CodeSage
                  </h2>
                  <div className="w-32 h-1 bg-gradient-to-r from-orange-500 to-purple-500 mx-auto rounded-full shadow-lg shadow-orange-500/50"></div>
                </div>

                {/* Description */}
                <p className="text-xl text-gray-300 mb-8 max-w-2xl mx-auto leading-relaxed">
                  Unlock the full power of CodeSage and discover advanced insights into your coding journey
                </p>

                {/* The dramatic button */}
                <button
                  onClick={handleCodeSageClick}
                  disabled={codeSageLoading}
                  className="group relative overflow-hidden px-12 py-6 bg-gradient-to-r from-orange-500 via-purple-500 to-orange-500 text-white font-bold text-xl rounded-2xl shadow-2xl shadow-orange-500/25 transform transition-all duration-300 hover:scale-105 hover:shadow-3xl hover:shadow-orange-500/40 active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {/* Button background animation */}
                  <div className="absolute inset-0 bg-gradient-to-r from-purple-600 via-orange-600 to-purple-600 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                  
                  {/* Shimmer effect */}
                  <div className="absolute inset-0 -top-2 -left-2 bg-gradient-to-r from-transparent via-white/20 to-transparent transform -skew-x-12 group-hover:translate-x-full transition-transform duration-700"></div>
                  
                  {/* Button text with icon */}
                  <span className="relative flex items-center justify-center gap-3">
                    {codeSageLoading ? (
                      <>
                        <div className="w-6 h-6 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                        Running CodeSage...
                      </>
                    ) : (
                      <>
                        <svg className="w-6 h-6 group-hover:rotate-12 transition-transform duration-300" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M11.3 1.046A1 1 0 0112 2v5h4a1 1 0 01.82 1.573l-7 10A1 1 0 018 18v-5H4a1 1 0 01-.82-1.573l7-10a1 1 0 011.12-.38z" clipRule="evenodd" />
                        </svg>
                        Activate CodeSage
                        <svg className="w-6 h-6 group-hover:-rotate-12 transition-transform duration-300" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M11.3 1.046A1 1 0 0112 2v5h4a1 1 0 01.82 1.573l-7 10A1 1 0 018 18v-5H4a1 1 0 01-.82-1.573l7-10a1 1 0 011.12-.38z" clipRule="evenodd" />
                        </svg>
                      </>
                    )}
                  </span>
                  
                  {/* Ripple effect */}
                  <div className="absolute inset-0 rounded-2xl bg-white/10 scale-0 group-active:scale-100 transition-transform duration-150"></div>
                </button>

                {/* Decorative elements */}
                <div className="mt-8 flex justify-center space-x-4">
                  <div className="w-3 h-3 bg-orange-500 rounded-full animate-bounce"></div>
                  <div className="w-3 h-3 bg-purple-500 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                  <div className="w-3 h-3 bg-orange-500 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                </div>
              </div>

              {/* Corner decorations */}
              <div className="absolute top-4 left-4 w-8 h-8 border-l-2 border-t-2 border-orange-500/50 rounded-tl-lg"></div>
              <div className="absolute top-4 right-4 w-8 h-8 border-r-2 border-t-2 border-purple-500/50 rounded-tr-lg"></div>
              <div className="absolute bottom-4 left-4 w-8 h-8 border-l-2 border-b-2 border-purple-500/50 rounded-bl-lg"></div>
              <div className="absolute bottom-4 right-4 w-8 h-8 border-r-2 border-b-2 border-orange-500/50 rounded-br-lg"></div>
            </div>
          </div>
        </div>
      </main>

      {/* Background Elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-purple-500 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-orange-500 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob animation-delay-2000"></div>
        <div className="absolute top-40 left-40 w-80 h-80 bg-yellow-500 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob animation-delay-4000"></div>
      </div>

      {/* CodeSage Results Modal */}
      {showCodeSageModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm">
          <div className="relative w-full max-w-4xl max-h-[80vh] bg-gradient-to-br from-slate-800 to-slate-900 rounded-2xl shadow-2xl border border-orange-500/30 overflow-hidden">
            {/* Modal header */}
            <div className="flex items-center justify-between p-6 border-b border-slate-700">
              <div>
                <h2 className="text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-orange-400 to-purple-400">
                  🚀 CodeSage Results
                </h2>
                <p className="text-gray-400 text-sm mt-1">
                  {codeSageView === 'submissions' ? 'Raw submissions list from LeetCode' : 'Detailed submission data'}
                </p>
              </div>
              <div className="flex items-center gap-3">
                {/* Navigation buttons */}
                {codeSageResults && !codeSageLoading && !codeSageError && (
                  <div className="flex bg-slate-700 rounded-lg p-1">
                    <button
                      onClick={() => setCodeSageView('submissions')}
                      className={`px-3 py-1 text-sm rounded transition-colors ${
                        codeSageView === 'submissions'
                          ? 'bg-orange-500 text-white'
                          : 'text-gray-300 hover:text-white'
                      }`}
                    >
                      Submissions
                    </button>
                    <button
                      onClick={() => setCodeSageView('detail')}
                      disabled={!codeSageResults?.submissionDetail}
                      className={`px-3 py-1 text-sm rounded transition-colors ${
                        codeSageView === 'detail'
                          ? 'bg-orange-500 text-white'
                          : codeSageResults?.submissionDetail
                          ? 'text-gray-300 hover:text-white'
                          : 'text-gray-500 cursor-not-allowed'
                      }`}
                    >
                      Detail
                    </button>
                    <button
                      onClick={handleTestApiClick}
                      disabled={testApiLoading}
                      className={`px-3 py-1 text-sm rounded transition-colors ${
                        codeSageView === 'test'
                          ? 'bg-orange-500 text-white'
                          : 'text-gray-300 hover:text-white'
                      } disabled:opacity-50`}
                    >
                      {testApiLoading ? '...' : 'Test'}
                    </button>
                  </div>
                )}
                <button
                  onClick={() => setShowCodeSageModal(false)}
                  className="text-gray-400 hover:text-white transition-colors p-2 hover:bg-slate-700 rounded-lg"
                >
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
            </div>

            {/* Modal content */}
            <div className="p-6 overflow-auto max-h-96">
              {codeSageLoading && (
                <div className="flex items-center justify-center py-12">
                  <div className="text-center">
                    <div className="w-12 h-12 border-4 border-orange-500/30 border-t-orange-500 rounded-full animate-spin mx-auto mb-4"></div>
                    <p className="text-white text-lg">Running CodeSage magic...</p>
                    <p className="text-gray-400 text-sm">Fetching your submission data</p>
                  </div>
                </div>
              )}

              {codeSageError && (
                <div className="bg-red-900/30 border border-red-500/30 rounded-lg p-4">
                  <div className="flex items-start gap-3">
                    <svg className="w-5 h-5 text-red-400 mt-0.5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                    </svg>
                    <div>
                      <p className="text-red-300 font-medium">CodeSage Error</p>
                      <p className="text-red-200 text-sm mt-1">{codeSageError}</p>
                    </div>
                  </div>
                </div>
              )}

              {((codeSageResults && !codeSageLoading && !codeSageError) || (codeSageView === 'test' && testApiResponse)) && (
                <div className="space-y-4">
                  <div className="bg-green-900/30 border border-green-500/30 rounded-lg p-4">
                    <p className="text-green-300 font-medium">✨ {codeSageView === 'test' ? 'Test API completed!' : 'CodeSage completed successfully!'}</p>
                    <p className="text-green-200 text-sm mt-1">
                      {codeSageView === 'submissions' 
                        ? 'Here\'s the raw submissions list from your LeetCode account:'
                        : codeSageView === 'detail'
                        ? 'Here\'s the source code from the submission:'
                        : 'Here\'s the API response:'}
                    </p>
                  </div>
                  
                  <div className="bg-slate-800 rounded-lg border border-slate-600 overflow-hidden">
                    {codeSageView === 'submissions' ? (
                      <pre className="text-sm text-gray-300 overflow-auto p-4">
                        {JSON.stringify(codeSageResults.submissions, null, 2)}
                      </pre>
                    ) : codeSageView === 'test' ? (
                      <div className="bg-slate-900">
                        {/* API Response editor header */}
                        <div className="flex items-center justify-between px-4 py-2 bg-slate-800 border-b border-slate-700">
                          <div className="flex items-center space-x-2">
                            <div className="flex space-x-1">
                              <div className="w-3 h-3 bg-red-500 rounded-full"></div>
                              <div className="w-3 h-3 bg-yellow-500 rounded-full"></div>
                              <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                            </div>
                            <span className="text-gray-400 text-sm ml-3">api-response.json</span>
                          </div>
                          <div className="text-xs text-gray-500">Test API Response</div>
                        </div>
                        
                        {/* API Response content with line numbers */}
                        <div className="flex">
                          <div className="bg-slate-800 px-3 py-4 text-right text-gray-500 text-sm font-mono select-none border-r border-slate-700">
                            {testApiResponse ? 
                              JSON.stringify(testApiResponse, null, 2).split('\n').map((_: string, index: number) => (
                                <div key={index} className="leading-6">
                                  {index + 1}
                                </div>
                              )) : 
                              <div>1</div>
                            }
                          </div>
                          <pre className="flex-1 p-4 text-sm text-gray-100 font-mono overflow-auto leading-6 bg-slate-900">
                            <code className="language-json">
                              {testApiResponse ? JSON.stringify(testApiResponse, null, 2) : 'No API response available'}
                            </code>
                          </pre>
                        </div>
                      </div>
                    ) : (
                      <div className="bg-slate-900">
                        {/* Code editor header */}
                        <div className="flex items-center justify-between px-4 py-2 bg-slate-800 border-b border-slate-700">
                          <div className="flex items-center space-x-2">
                            <div className="flex space-x-1">
                              <div className="w-3 h-3 bg-red-500 rounded-full"></div>
                              <div className="w-3 h-3 bg-yellow-500 rounded-full"></div>
                              <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                            </div>
                            <span className="text-gray-400 text-sm ml-3">
                              {codeSageResults.submissionDetail?.lang?.name || 'code'}.{
                                codeSageResults.submissionDetail?.lang?.name === 'python' ? 'py' :
                                codeSageResults.submissionDetail?.lang?.name === 'javascript' ? 'js' :
                                codeSageResults.submissionDetail?.lang?.name === 'mysql' ? 'sql' :
                                codeSageResults.submissionDetail?.lang?.name === 'java' ? 'java' :
                                codeSageResults.submissionDetail?.lang?.name === 'cpp' ? 'cpp' :
                                'txt'
                              }
                            </span>
                          </div>
                          <div className="text-xs text-gray-500">
                            {codeSageResults.submissionDetail?.lang?.verboseName || 'Code'}
                          </div>
                        </div>
                        
                        {/* Code content with line numbers */}
                        <div className="flex">
                          <div className="bg-slate-800 px-3 py-4 text-right text-gray-500 text-sm font-mono select-none border-r border-slate-700">
                            {codeSageResults.submissionDetail?.code ? 
                              codeSageResults.submissionDetail.code.split('\n').map((_: string, index: number) => (
                                <div key={index} className="leading-6">
                                  {index + 1}
                                </div>
                              )) : 
                              <div>1</div>
                            }
                          </div>
                          <pre className="flex-1 p-4 text-sm text-gray-100 font-mono overflow-auto leading-6 bg-slate-900">
                            <code className="language-auto">
                              {codeSageResults.submissionDetail?.code || 'No code available'}
                            </code>
                          </pre>
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Show info about the other view */}
                  {codeSageView === 'submissions' && codeSageResults.submissionDetail && (
                    <div className="bg-blue-900/30 border border-blue-500/30 rounded-lg p-3">
                      <p className="text-blue-300 text-sm">
                        💡 Click "Detail" tab above to see the source code from the first submission
                      </p>
                    </div>
                  )}
                  
                  {codeSageView === 'detail' && !codeSageResults.submissionDetail && (
                    <div className="bg-yellow-900/30 border border-yellow-500/30 rounded-lg p-3">
                      <p className="text-yellow-300 text-sm">
                        ⚠️ No detailed submission data available
                      </p>
                    </div>
                  )}
                </div>
              )}
            </div>

            {/* Modal footer */}
            <div className="flex justify-between gap-3 p-6 border-t border-slate-700">
              <div>
                {codeSageView === 'detail' && codeSageResults?.submissionDetail?.code && (
                  <button
                    onClick={() => {
                      // Open the help page with the code
                      const code = encodeURIComponent(codeSageResults.submissionDetail.code);
                      const language = codeSageResults.submissionDetail?.lang?.name || 'code';
                      const verboseName = codeSageResults.submissionDetail?.lang?.verboseName || 'Code';
                      window.open(`/help-me-improve?code=${code}&lang=${language}&verboseName=${encodeURIComponent(verboseName)}`, '_blank');
                    }}
                    className="px-4 py-2 bg-gradient-to-r from-purple-500 to-blue-500 hover:from-purple-600 hover:to-blue-600 text-white rounded-lg transition-colors font-medium"
                  >
                    🤖 Help me get better
                  </button>
                )}
              </div>
              <div className="flex gap-3">
                <button
                  onClick={() => setShowCodeSageModal(false)}
                  className="px-4 py-2 bg-gray-600 hover:bg-gray-700 text-white rounded-lg transition-colors"
                >
                  Close
                </button>
                {(codeSageResults || testApiResponse) && (
                  <button
                    onClick={() => {
                      const dataToCopy = codeSageView === 'submissions' 
                        ? JSON.stringify(codeSageResults.submissions, null, 2)
                        : codeSageView === 'test'
                        ? JSON.stringify(testApiResponse, null, 2)
                        : codeSageResults.submissionDetail?.code || 'No code available';
                      navigator.clipboard.writeText(dataToCopy);
                      // You could add a toast notification here
                    }}
                    className="px-4 py-2 bg-orange-500 hover:bg-orange-600 text-white rounded-lg transition-colors"
                  >
                    Copy {codeSageView === 'submissions' ? 'Submissions' : codeSageView === 'test' ? 'API Response' : 'Code'}
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
