'use client';

import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';

// Type definitions
interface Submission {
  id: string;
  title: string;
  titleSlug: string;
  timestamp: string;
  statusDisplay: string;
  lang: string;
  submittedAt: string;
  isAccepted: boolean;
  problemUrl: string;
  timeAgo: string;
}

interface Analytics {
  totalSubmissions: number;
  successfulSubmissions: number;
  failedSubmissions: number;
  languages: string[];
  firstAttempt: Submission;
  latestAttempt: Submission;
  successRate: number;
  timeSpent: string;
  attempts: number;
}

interface ProblemData {
  username: string;
  problemSlug: string;
  problemTitle: string;
  problemUrl: string;
  submissions: Submission[];
  analytics: Analytics;
  fetchedAt: string;
}

export default function ProblemDetail() {
  const params = useParams();
  const username = params.username as string;
  const slug = params.slug as string;
  const [data, setData] = useState<ProblemData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (username && slug) {
      fetchProblemData();
    }
  }, [username, slug]);

  const fetchProblemData = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await fetch(
        `/api/user/${encodeURIComponent(username)}/problem/${encodeURIComponent(slug)}`
      );
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to fetch problem data');
      }
      
      const problemData = await response.json();
      setData(problemData);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-orange-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-white text-xl">Loading problem submissions...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 flex items-center justify-center">
        <div className="text-center max-w-md">
          <div className="text-6xl mb-4">😞</div>
          <h1 className="text-2xl font-bold text-white mb-4">Problem Not Found</h1>
          <p className="text-gray-300 mb-6">{error}</p>
          <div className="space-y-4">
            <button
              onClick={fetchProblemData}
              className="px-6 py-3 bg-orange-500 hover:bg-orange-600 text-white rounded-lg transition-colors"
            >
              Try Again
            </button>
            <Link 
              href={`/dashboard/${encodeURIComponent(username)}`} 
              className="block px-6 py-3 bg-gray-600 hover:bg-gray-700 text-white rounded-lg transition-colors"
            >
              Back to Dashboard
            </Link>
          </div>
        </div>
      </div>
    );
  }

  if (!data) return null;

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case 'accepted': return 'bg-green-500/20 text-green-300 border-green-500/30';
      case 'wrong answer': return 'bg-red-500/20 text-red-300 border-red-500/30';
      case 'time limit exceeded': return 'bg-yellow-500/20 text-yellow-300 border-yellow-500/30';
      case 'memory limit exceeded': return 'bg-purple-500/20 text-purple-300 border-purple-500/30';
      case 'runtime error': return 'bg-orange-500/20 text-orange-300 border-orange-500/30';
      case 'compilation error': return 'bg-pink-500/20 text-pink-300 border-pink-500/30';
      default: return 'bg-gray-500/20 text-gray-300 border-gray-500/30';
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
      {/* Header */}
      <nav className="relative z-10 px-6 py-4 border-b border-white/10">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <Link href="/" className="text-2xl font-bold text-white hover:text-orange-400 transition-colors">
            CodeSage
          </Link>
          <div className="flex items-center space-x-4">
            <Link 
              href={`/dashboard/${encodeURIComponent(username)}`}
              className="px-4 py-2 bg-white/10 hover:bg-white/20 text-white rounded-lg transition-colors"
            >
              ← Back to Dashboard
            </Link>
            <button
              onClick={fetchProblemData}
              className="px-4 py-2 bg-orange-500 hover:bg-orange-600 text-white rounded-lg transition-colors"
            >
              🔄 Refresh
            </button>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <main className="relative z-10 px-6 py-8">
        <div className="max-w-6xl mx-auto">
          {/* Problem Header */}
          <div className="bg-white/5 backdrop-blur-sm rounded-3xl p-8 border border-white/10 mb-8">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h1 className="text-4xl font-bold text-white mb-2">{data.problemTitle}</h1>
                <p className="text-gray-300 text-lg">
                  @{data.username}'s submission history
                </p>
              </div>
              <a
                href={data.problemUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="px-6 py-3 bg-gradient-to-r from-orange-500 to-yellow-500 hover:from-orange-600 hover:to-yellow-600 text-white rounded-xl transition-all transform hover:scale-105 font-semibold"
              >
                View Problem on LeetCode →
              </a>
            </div>

            {/* Analytics Overview */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
              <div className="text-center">
                <div className="text-3xl font-bold text-white mb-1">
                  {data.analytics.totalSubmissions}
                </div>
                <div className="text-gray-300 text-sm">Total Attempts</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-green-400 mb-1">
                  {data.analytics.successRate}%
                </div>
                <div className="text-gray-300 text-sm">Success Rate</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-purple-400 mb-1">
                  {data.analytics.languages.length}
                </div>
                <div className="text-gray-300 text-sm">Languages Used</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-orange-400 mb-1">
                  {data.analytics.timeSpent}
                </div>
                <div className="text-gray-300 text-sm">Time Span</div>
              </div>
            </div>
          </div>

          {/* Progress Journey */}
          <div className="bg-white/5 backdrop-blur-sm rounded-3xl p-8 border border-white/10 mb-8">
            <h2 className="text-2xl font-bold text-white mb-6">Progress Journey</h2>
            <div className="grid md:grid-cols-2 gap-6">
              <div className="bg-white/5 rounded-2xl p-6 border border-white/10">
                <h3 className="text-lg font-semibold text-white mb-4">Languages Used</h3>
                <div className="flex flex-wrap gap-2">
                  {data.analytics.languages.map((lang, index) => (
                    <span
                      key={index}
                      className="px-3 py-1 bg-gradient-to-r from-blue-500/20 to-purple-500/20 text-blue-300 rounded-full border border-blue-500/30 text-sm"
                    >
                      {lang}
                    </span>
                  ))}
                </div>
              </div>
              <div className="bg-white/5 rounded-2xl p-6 border border-white/10">
                <h3 className="text-lg font-semibold text-white mb-4">Attempt Summary</h3>
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span className="text-gray-300">Successful:</span>
                    <span className="text-green-400 font-semibold">{data.analytics.successfulSubmissions}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-300">Failed:</span>
                    <span className="text-red-400 font-semibold">{data.analytics.failedSubmissions}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-300">Total:</span>
                    <span className="text-white font-semibold">{data.analytics.totalSubmissions}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Submission Timeline */}
          <div className="bg-white/5 backdrop-blur-sm rounded-3xl p-8 border border-white/10">
            <h2 className="text-2xl font-bold text-white mb-6">Submission Timeline</h2>
            {data.submissions.length === 0 ? (
              <div className="text-center py-12">
                <div className="text-6xl mb-4">📝</div>
                <p className="text-gray-300 text-xl">No recent submissions found for this problem</p>
                <p className="text-gray-400 mt-2">This user may not have attempted this problem recently</p>
              </div>
            ) : (
              <div className="space-y-4">
                {data.submissions.map((submission, index) => (
                  <div
                    key={submission.id}
                    className="bg-white/5 rounded-xl p-6 border border-white/10 hover:bg-white/10 transition-all duration-200"
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex-1">
                        <div className="flex items-center space-x-4 mb-3">
                          <Link 
                            href={`/dashboard/${encodeURIComponent(username)}/submission/${submission.timestamp}`}
                            className="text-orange-400 font-medium hover:text-orange-300 transition-colors cursor-pointer"
                          >
                            Attempt #{data.submissions.length - index}
                          </Link>
                          <span className={`px-3 py-1 rounded-lg text-sm border ${getStatusColor(submission.statusDisplay)}`}>
                            {submission.statusDisplay}
                          </span>
                          <span className="px-3 py-1 bg-blue-500/20 text-blue-300 rounded-lg text-sm border border-blue-500/30">
                            {submission.lang}
                          </span>
                        </div>
                        <div className="flex items-center space-x-6 text-sm text-gray-400">
                          <span>📅 {new Date(submission.submittedAt).toLocaleString()}</span>
                          <span>⏰ {submission.timeAgo}</span>
                          <span className="text-orange-400 text-xs">👆 Click attempt number to view code</span>
                        </div>
                      </div>
                      {submission.isAccepted && (
                        <div className="text-2xl">🎉</div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
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
