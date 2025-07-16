'use client';

import { useState } from 'react';

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

interface TopicsData {
  username: string;
  topicAnalytics: TopicAnalytics[];
  overallStats: {
    totalTopicsAnalyzed: number;
    totalProblemsAnalyzed: number;
    totalSubmissionsAnalyzed: number;
    averageSuccessRate: number;
    strongestTopic: TopicAnalytics | null;
    improvementAreas: TopicAnalytics[];
  };
  metadata: {
    enhanced: boolean;
    totalSubmissionsAnalyzed: number;
    analysisLimitReached: boolean;
    totalUniqueProblems: number;
    problemsAnalyzed: number;
    note: string | null;
  };
  fetchedAt: string;
}

interface TopicsAnalyticsProps {
  username: string;
}

export default function TopicsAnalytics({ username }: TopicsAnalyticsProps) {
  const [data, setData] = useState<TopicsData | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showAll, setShowAll] = useState(false);
  const [enhancedMode, setEnhancedMode] = useState(false);

  const fetchTopicsData = async (enhanced = false) => {
    try {
      setLoading(true);
      setError(null);
      const url = `/api/user/${encodeURIComponent(username)}/topics${enhanced ? '?enhanced=true' : ''}`;
      const response = await fetch(url);
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to fetch topics data');
      }
      
      const topicsData = await response.json();
      setData(topicsData);
      setEnhancedMode(enhanced);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const getSuccessRateColor = (rate: number) => {
    if (rate >= 80) return 'text-green-400 bg-green-500/20 border-green-500/30';
    if (rate >= 60) return 'text-yellow-400 bg-yellow-500/20 border-yellow-500/30';
    if (rate >= 40) return 'text-orange-400 bg-orange-500/20 border-orange-500/30';
    return 'text-red-400 bg-red-500/20 border-red-500/30';
  };

  const getTopicIcon = (topicName: string) => {
    const iconMap: { [key: string]: string } = {
      'Array': '📊',
      'String': '📝',
      'Hash Table': '🔑',
      'Dynamic Programming': '🧠',
      'Math': '🔢',
      'Sorting': '📈',
      'Greedy': '💰',
      'Depth-First Search': '🌊',
      'Breadth-First Search': '🎯',
      'Tree': '🌳',
      'Binary Search': '🔍',
      'Graph': '🕸️',
      'Sliding Window': '🪟',
      'Two Pointers': '👆',
      'Linked List': '🔗',
      'Stack': '📚',
      'Queue': '🚶',
      'Heap': '⛰️',
      'Backtracking': '🔄',
      'Binary Tree': '🌲',
      'Recursion': '♾️'
    };
    return iconMap[topicName] || '💡';
  };

  if (loading) {
    return (
      <div className="bg-white/5 backdrop-blur-sm rounded-3xl p-8 border border-white/10">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold text-white">🏷️ Topic Analytics</h2>
          <div className="text-orange-400 animate-pulse">Analyzing submissions...</div>
        </div>
        <div className="space-y-4">
          {[1, 2, 3, 4, 5].map((i) => (
            <div key={i} className="bg-white/5 rounded-xl p-4 border border-white/10 animate-pulse">
              <div className="h-4 bg-white/10 rounded w-1/3 mb-2"></div>
              <div className="h-3 bg-white/10 rounded w-1/2"></div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-white/5 backdrop-blur-sm rounded-3xl p-8 border border-white/10">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold text-white">🏷️ Topic Analytics</h2>
          <button
            onClick={() => fetchTopicsData(enhancedMode)}
            className="px-4 py-2 bg-orange-500 hover:bg-orange-600 text-white rounded-lg transition-colors text-sm"
          >
            Try Again
          </button>
        </div>
        <div className="text-center py-8">
          <div className="text-4xl mb-4">😞</div>
          <p className="text-gray-300 mb-4">{error}</p>
          <p className="text-gray-400 text-sm">
            This feature analyzes your recent submissions to provide topic-based insights.
          </p>
        </div>
      </div>
    );
  }

  if (!data) {
    return (
      <div className="bg-white/5 backdrop-blur-sm rounded-3xl p-8 border border-white/10">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold text-white">🏷️ Topic Analytics</h2>
          <button
            onClick={() => fetchTopicsData(false)}
            className="px-4 py-2 bg-gradient-to-r from-orange-500 to-yellow-500 hover:from-orange-600 hover:to-yellow-600 text-white rounded-lg transition-colors text-sm font-semibold"
          >
            Analyze Topics
          </button>
        </div>
        <div className="text-center py-8">
          <div className="text-6xl mb-4">🏷️</div>
          <h3 className="text-xl font-semibold text-white mb-3">Discover Your Coding Strengths</h3>
          <p className="text-gray-300 mb-6">
            Analyze your submissions by topic to understand which areas you excel in and where you can improve.
          </p>
          <div className="grid md:grid-cols-3 gap-4 text-sm">
            <div className="bg-white/5 rounded-lg p-4 border border-white/10">
              <div className="text-2xl mb-2">📊</div>
              <div className="text-white font-semibold mb-1">Success Rates</div>
              <div className="text-gray-400">Per-topic performance</div>
            </div>
            <div className="bg-white/5 rounded-lg p-4 border border-white/10">
              <div className="text-2xl mb-2">🎯</div>
              <div className="text-white font-semibold mb-1">Difficulty Analysis</div>
              <div className="text-gray-400">Easy/Medium/Hard breakdown</div>
            </div>
            <div className="bg-white/5 rounded-lg p-4 border border-white/10">
              <div className="text-2xl mb-2">💡</div>
              <div className="text-white font-semibold mb-1">Improvement Areas</div>
              <div className="text-gray-400">Focus suggestions</div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  const displayedTopics = showAll ? data.topicAnalytics : data.topicAnalytics.slice(0, 8);

  return (
    <div className="space-y-8">
      {/* Header and Overview */}
      <div className="bg-white/5 backdrop-blur-sm rounded-3xl p-8 border border-white/10">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold text-white">🏷️ Topic Analytics</h2>
          <div className="flex items-center space-x-3">
            {data && (
              <button
                onClick={() => fetchTopicsData(!enhancedMode)}
                disabled={loading}
                className={`px-4 py-2 text-white rounded-lg transition-colors text-sm font-medium border ${
                  enhancedMode 
                    ? 'bg-purple-500 hover:bg-purple-600 border-purple-500' 
                    : 'bg-white/10 hover:bg-white/20 border-white/20'
                }`}
                title={enhancedMode ? 'Switch to fast mode (recent submissions only)' : 'Switch to enhanced mode (more historical data)'}
              >
                {loading ? '🔄' : enhancedMode ? '⚡ Fast Mode' : '🚀 Enhanced Mode'}
              </button>
            )}
            <button
              onClick={() => fetchTopicsData(enhancedMode)}
              disabled={loading}
              className="px-4 py-2 bg-orange-500 hover:bg-orange-600 text-white rounded-lg transition-colors text-sm disabled:opacity-50"
            >
              {loading ? '🔄' : '🔄 Refresh'}
            </button>
          </div>
        </div>

        {/* Overall Statistics */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
          <div className="text-center">
            <div className="text-2xl font-bold text-white">{data.overallStats.totalTopicsAnalyzed}</div>
            <div className="text-gray-300 text-sm">Topics Found</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-green-400">{data.overallStats.averageSuccessRate}%</div>
            <div className="text-gray-300 text-sm">Avg Success Rate</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-purple-400">{data.overallStats.totalProblemsAnalyzed}</div>
            <div className="text-gray-300 text-sm">Problems Analyzed</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-orange-400">{data.overallStats.totalSubmissionsAnalyzed}</div>
            <div className="text-gray-300 text-sm">Submissions</div>
          </div>
        </div>

        {/* Analysis Metadata */}
        {data.metadata.note && (
          <div className={`backdrop-blur-sm rounded-xl p-4 mb-6 border ${
            data.metadata.enhanced 
              ? 'bg-purple-500/10 border-purple-500/20' 
              : 'bg-blue-500/10 border-blue-500/20'
          }`}>
            <div className="flex items-start space-x-3">
              <div className={`text-lg ${data.metadata.enhanced ? 'text-purple-400' : 'text-blue-400'}`}>
                {data.metadata.enhanced ? '🚀' : 'ℹ️'}
              </div>
              <div>
                <div className={`text-sm font-semibold mb-1 ${
                  data.metadata.enhanced ? 'text-purple-300' : 'text-blue-300'
                }`}>
                  {data.metadata.enhanced ? 'Enhanced Analysis' : 'Standard Analysis'}
                </div>
                <div className="text-gray-300 text-sm">{data.metadata.note}</div>
                <div className="text-gray-400 text-xs mt-1">
                  Analyzed {data.metadata.problemsAnalyzed} of {data.metadata.totalUniqueProblems} unique problems
                  {data.metadata.enhanced && (
                    <span className="ml-2 text-purple-400">
                      • {data.metadata.totalSubmissionsAnalyzed} total submissions
                    </span>
                  )}
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Strongest Topic & Improvement Areas */}
      <div className="grid lg:grid-cols-2 gap-6">
        {/* Strongest Topic */}
        {data.overallStats.strongestTopic && (
          <div className="bg-white/5 backdrop-blur-sm rounded-3xl p-6 border border-white/10">
            <h3 className="text-xl font-bold text-white mb-4">🏆 Strongest Topic</h3>
            <div className="bg-gradient-to-r from-green-500/20 to-emerald-500/20 rounded-xl p-4 border border-green-500/30">
              <div className="flex items-center space-x-3 mb-3">
                <span className="text-2xl">{getTopicIcon(data.overallStats.strongestTopic.topicName)}</span>
                <div>
                  <div className="text-lg font-semibold text-white">{data.overallStats.strongestTopic.topicName}</div>
                  <div className="text-green-300 text-sm">
                    {data.overallStats.strongestTopic.successRate}% success rate
                  </div>
                </div>
              </div>
              <div className="grid grid-cols-3 gap-2 text-sm">
                <div className="text-center">
                  <div className="text-white font-semibold">{data.overallStats.strongestTopic.totalAttempts}</div>
                  <div className="text-gray-300">Attempts</div>
                </div>
                <div className="text-center">
                  <div className="text-green-400 font-semibold">{data.overallStats.strongestTopic.successfulAttempts}</div>
                  <div className="text-gray-300">Solved</div>
                </div>
                <div className="text-center">
                  <div className="text-purple-400 font-semibold">{data.overallStats.strongestTopic.problems.length}</div>
                  <div className="text-gray-300">Problems</div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Improvement Areas */}
        <div className="bg-white/5 backdrop-blur-sm rounded-3xl p-6 border border-white/10">
          <h3 className="text-xl font-bold text-white mb-4">🎯 Focus Areas</h3>
          {data.overallStats.improvementAreas.length > 0 ? (
            <div className="space-y-3">
              {data.overallStats.improvementAreas.slice(0, 3).map((topic) => (
                <div key={topic.slug} className="bg-orange-500/10 rounded-lg p-3 border border-orange-500/20">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <span className="text-lg">{getTopicIcon(topic.topicName)}</span>
                      <div>
                        <div className="text-white font-medium text-sm">{topic.topicName}</div>
                        <div className="text-orange-300 text-xs">{topic.successRate}% success rate</div>
                      </div>
                    </div>
                    <div className="text-right text-xs text-gray-400">
                      {topic.successfulAttempts}/{topic.totalAttempts}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-4">
              <div className="text-3xl mb-2">🎉</div>
              <p className="text-gray-300 text-sm">Great job! No clear improvement areas found.</p>
            </div>
          )}
        </div>
      </div>

      {/* Topics Grid */}
      <div className="bg-white/5 backdrop-blur-sm rounded-3xl p-8 border border-white/10">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-xl font-bold text-white">All Topics Performance</h3>
          {data.topicAnalytics.length > 8 && (
            <button
              onClick={() => setShowAll(!showAll)}
              className="px-4 py-2 bg-white/10 hover:bg-white/20 text-white rounded-lg transition-colors text-sm border border-white/20"
            >
              {showAll ? 'Show Less' : `Show All (${data.topicAnalytics.length})`}
            </button>
          )}
        </div>

        {displayedTopics.length > 0 ? (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
            {displayedTopics.map((topic) => (
              <div key={topic.slug} className="bg-white/5 rounded-xl p-4 border border-white/10 hover:bg-white/10 transition-all">
                <div className="flex items-center space-x-3 mb-3">
                  <span className="text-xl">{getTopicIcon(topic.topicName)}</span>
                  <div className="flex-1">
                    <div className="text-white font-semibold text-sm">{topic.topicName}</div>
                    <div className="text-gray-400 text-xs">{topic.problems.length} problems</div>
                  </div>
                  <div className={`px-2 py-1 rounded text-xs border ${getSuccessRateColor(topic.successRate)}`}>
                    {topic.successRate}%
                  </div>
                </div>

                <div className="grid grid-cols-3 gap-2 mb-3 text-xs">
                  <div className="text-center">
                    <div className="text-white font-semibold">{topic.totalAttempts}</div>
                    <div className="text-gray-400">Total</div>
                  </div>
                  <div className="text-center">
                    <div className="text-green-400 font-semibold">{topic.successfulAttempts}</div>
                    <div className="text-gray-400">Solved</div>
                  </div>
                  <div className="text-center">
                    <div className="text-red-400 font-semibold">{topic.failedAttempts}</div>
                    <div className="text-gray-400">Failed</div>
                  </div>
                </div>

                {/* Difficulty Breakdown */}
                <div className="space-y-1">
                  {['easy', 'medium', 'hard'].map((diff) => {
                    const diffData = topic.difficulty[diff as keyof typeof topic.difficulty];
                    if (diffData.attempted === 0) return null;
                    
                    const successRate = Math.round((diffData.solved / diffData.attempted) * 100);
                    const diffColors = {
                      easy: 'bg-green-500',
                      medium: 'bg-yellow-500', 
                      hard: 'bg-red-500'
                    };
                    
                    return (
                      <div key={diff} className="flex items-center space-x-2 text-xs">
                        <div className="w-12 text-gray-400 capitalize">{diff}:</div>
                        <div className="flex-1 bg-gray-700 rounded-full h-1.5">
                          <div
                            className={`h-1.5 rounded-full ${diffColors[diff as keyof typeof diffColors]}`}
                            style={{ width: `${successRate}%` }}
                          ></div>
                        </div>
                        <div className="text-gray-300 w-8">{successRate}%</div>
                      </div>
                    );
                  })}
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-8">
            <div className="text-4xl mb-4">📊</div>
            <p className="text-gray-300">No topic data available for analysis</p>
          </div>
        )}
      </div>
    </div>
  );
}
