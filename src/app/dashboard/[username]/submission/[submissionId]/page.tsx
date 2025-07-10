'use client';

import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';

interface SubmissionData {
  username: string;
  submissionId: string;
  submissionDetail?: any;
  error?: string;
  message?: string;
  limitation?: string;
  suggestion?: string;
  mockData?: {
    code: string;
    language: string;
    runtime: string;
    memory: string;
    status: string;
  };
  fetchedAt: string;
}

export default function SubmissionDetail() {
  const params = useParams();
  const username = params.username as string;
  const submissionId = params.submissionId as string;
  const [data, setData] = useState<SubmissionData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (username && submissionId) {
      fetchSubmissionData();
    }
  }, [username, submissionId]);

  const fetchSubmissionData = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await fetch(
        `/api/user/${encodeURIComponent(username)}/submission/${encodeURIComponent(submissionId)}`
      );
      
      const submissionData = await response.json();
      setData(submissionData);
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
          <p className="text-white text-xl">Loading submission details...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 flex items-center justify-center">
        <div className="text-center max-w-md">
          <div className="text-6xl mb-4">😞</div>
          <h1 className="text-2xl font-bold text-white mb-4">Submission Not Found</h1>
          <p className="text-gray-300 mb-6">{error}</p>
          <Link 
            href={`/dashboard/${encodeURIComponent(username)}`}
            className="px-6 py-3 bg-orange-500 hover:bg-orange-600 text-white rounded-lg transition-colors"
          >
            Back to Dashboard
          </Link>
        </div>
      </div>
    );
  }

  if (!data) return null;

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
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <main className="relative z-10 px-6 py-8">
        <div className="max-w-6xl mx-auto">
          {/* Submission Header */}
          <div className="bg-white/5 backdrop-blur-sm rounded-3xl p-8 border border-white/10 mb-8">
            <h1 className="text-4xl font-bold text-white mb-2">
              Submission #{data.submissionId}
            </h1>
            <p className="text-gray-300 text-lg">
              @{data.username}'s submission details
            </p>
          </div>

          {/* Check if we have actual submission data or just mock data */}
          {data.error === 'Authentication required' ? (
            <>
              {/* Limitation Notice */}
              <div className="bg-yellow-500/10 backdrop-blur-sm rounded-3xl p-8 border border-yellow-500/20 mb-8">
                <div className="flex items-start space-x-4">
                  <div className="text-4xl">🔒</div>
                  <div>
                    <h2 className="text-2xl font-bold text-yellow-300 mb-4">Authentication Required</h2>
                    <p className="text-gray-300 mb-4">{data.message}</p>
                    <p className="text-gray-400 text-sm mb-6">{data.limitation}</p>
                    <div className="bg-blue-500/10 border border-blue-500/20 rounded-xl p-4">
                      <p className="text-blue-300 text-sm">
                        💡 <strong>Future Enhancement:</strong> {data.suggestion}
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Mock Code Example */}
              <div className="bg-white/5 backdrop-blur-sm rounded-3xl p-8 border border-white/10">
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-2xl font-bold text-white">Sample Code Structure</h2>
                  <div className="flex items-center space-x-4">
                    <span className="px-3 py-1 bg-green-500/20 text-green-300 rounded-lg text-sm border border-green-500/30">
                      {data.mockData?.status}
                    </span>
                    <span className="px-3 py-1 bg-blue-500/20 text-blue-300 rounded-lg text-sm border border-blue-500/30">
                      {data.mockData?.language}
                    </span>
                  </div>
                </div>

                {/* Performance Metrics */}
                <div className="grid grid-cols-2 gap-4 mb-6">
                  <div className="bg-white/5 rounded-xl p-4 border border-white/10">
                    <div className="text-sm text-gray-400">Runtime</div>
                    <div className="text-lg font-semibold text-white">{data.mockData?.runtime}</div>
                  </div>
                  <div className="bg-white/5 rounded-xl p-4 border border-white/10">
                    <div className="text-sm text-gray-400">Memory</div>
                    <div className="text-lg font-semibold text-white">{data.mockData?.memory}</div>
                  </div>
                </div>

                {/* Code Display */}
                <div className="bg-slate-800 rounded-xl p-6 border border-white/10">
                  <div className="flex items-center justify-between mb-4">
                    <span className="text-gray-400 text-sm">Example submission structure:</span>
                    <button className="px-3 py-1 bg-white/10 hover:bg-white/20 text-white rounded text-sm transition-colors">
                      Copy
                    </button>
                  </div>
                  <pre className="text-gray-300 text-sm overflow-x-auto">
                    <code>{data.mockData?.code}</code>
                  </pre>
                </div>
              </div>
            </>
          ) : (
            /* This would be the actual submission detail display */
            <div className="bg-white/5 backdrop-blur-sm rounded-3xl p-8 border border-white/10">
              <h2 className="text-2xl font-bold text-white mb-6">Submission Code</h2>
              {/* Actual submission code would go here */}
              <div className="bg-slate-800 rounded-xl p-6 border border-white/10">
                <pre className="text-gray-300 text-sm">
                  <code>{JSON.stringify(data.submissionDetail, null, 2)}</code>
                </pre>
              </div>
            </div>
          )}

          {/* Feature Enhancement Info */}
          <div className="bg-white/5 backdrop-blur-sm rounded-3xl p-8 border border-white/10 mt-8">
            <h2 className="text-2xl font-bold text-white mb-6">🚀 Future Enhancement</h2>
            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <h3 className="text-lg font-semibold text-orange-400 mb-3">What This Feature Would Show:</h3>
                <ul className="space-y-2 text-gray-300">
                  <li>• Complete source code for each attempt</li>
                  <li>• Runtime and memory performance</li>
                  <li>• Syntax highlighting by language</li>
                  <li>• Error details for failed submissions</li>
                  <li>• Code comparison between attempts</li>
                </ul>
              </div>
              <div>
                <h3 className="text-lg font-semibold text-purple-400 mb-3">Implementation Options:</h3>
                <ul className="space-y-2 text-gray-300">
                  <li>• User authentication with LeetCode</li>
                  <li>• OAuth integration</li>
                  <li>• Session-based access</li>
                  <li>• API key configuration</li>
                  <li>• Chrome extension approach</li>
                </ul>
              </div>
            </div>
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
