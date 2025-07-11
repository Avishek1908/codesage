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
        </div>
      </main>

      {/* Background Elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-purple-500 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-orange-500 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob animation-delay-2000"></div>
        <div className="absolute top-40 left-40 w-80 h-80 bg-yellow-500 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob animation-delay-4000"></div>
      </div>
    </div>
  );
}
