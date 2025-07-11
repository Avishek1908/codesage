# Co## ✨ Features

- 🚀 **Real-time LeetCode Data** - Fetch live user statistics and submission history
- 🏷️ **Topic-Based Analytics** - Deep insights into performance by coding topics (Arrays, DP, Graphs, etc.)
- 📊 **Beautiful Analytics Dashboard** - Visualize problem-solving progress with stunning charts
- 🎯 **Comprehensive Metrics** - Track acceptance rates, difficulty breakdown, and recent activity
- 📈 **Submission Timeline** - View detailed submission history with timestamps and languages
- 🏆 **Contest Performance** - Monitor contest ratings and participation
- 🌈 **Modern UI/UX** - Beautiful gradient designs with glassmorphism effects
- 📱 **Fully Responsive** - Optimized for desktop, tablet, and mobile devices
- ⚡ **Lightning Fast** - Built with Next.js 15 and Turbopack for optimal performanceeetCode Progress Tracker

A modern, beautiful web application that helps developers track and visualize their LeetCode progress with comprehensive analytics and insights.

## ✨ Features

- 🚀 **Real-time LeetCode Data** - Fetch live user statistics and submission history
- 📊 **Beautiful Analytics Dashboard** - Visualize problem-solving progress with stunning charts
- 🎯 **Comprehensive Metrics** - Track acceptance rates, difficulty breakdown, and recent activity
- 📈 **Submission Timeline** - View detailed submission history with timestamps and languages
- � **Contest Performance** - Monitor contest ratings and participation
- 🌈 **Modern UI/UX** - Beautiful gradient designs with glassmorphism effects
- 📱 **Fully Responsive** - Optimized for desktop, tablet, and mobile devices
- ⚡ **Lightning Fast** - Built with Next.js 15 and Turbopack for optimal performance

## 🛠️ Tech Stack

- **Frontend**: Next.js 15 with App Router, TypeScript, Tailwind CSS
- **Backend**: Next.js API Routes
- **Data Source**: LeetCode Query library for fetching LeetCode data
- **Styling**: Tailwind CSS with custom animations and glassmorphism effects
- **Performance**: Turbopack for fast development builds

## 🚀 Quick Start

1. **Clone and install dependencies:**
   ```bash
   git clone <repository-url>
   cd codesage
   npm install
   ```

2. **Start the development server:**
   ```bash
   npm run dev
   ```

3. **Open your browser:**
   Navigate to [http://localhost:3001](http://localhost:3001)

4. **Enter a LeetCode username:**
   Try usernames like: `jacoblincool`, `neal_wu`, or any valid LeetCode username

## 📁 Project Structure

```
src/
├── app/
│   ├── api/user/[username]/          # API endpoints
│   │   ├── route.ts                  # Full user profile
│   │   ├── stats/route.ts           # User statistics
│   │   ├── submissions/route.ts     # Submission history
│   │   ├── dashboard/route.ts       # Dashboard data
│   │   ├── topics/route.ts          # Topic analytics
│   │   ├── problem/[slug]/route.ts  # Problem details
│   │   └── submission/[id]/route.ts # Submission code
│   ├── dashboard/[username]/        # Dashboard pages
│   │   ├── page.tsx                 # Main dashboard
│   │   ├── loading.tsx              # Loading component
│   │   ├── error.tsx                # Error handling
│   │   ├── problem/[slug]/page.tsx  # Problem detail page
│   │   └── submission/[id]/page.tsx # Submission detail page
│   ├── layout.tsx                   # Root layout
│   ├── page.tsx                     # Landing page
│   └── globals.css                  # Global styles
├── components/                      # Reusable components
│   └── TopicsAnalytics.tsx         # Topic-based analytics component
└── lib/                            # Utility functions
```

## 🎨 Key Features Showcase

### 🏠 **Landing Page**
- Hero section with compelling copy
- Username input with form validation
- Feature showcase cards
- Animated background effects

### 📊 **Dashboard**
- **User Profile Section**: Avatar, ranking, location, education
- **Statistics Overview**: Total problems solved, acceptance rate, contest rating
- **Difficulty Breakdown**: Visual progress bars for Easy/Medium/Hard problems
- **Recent Submissions**: Timeline with status, language, and problem links
- **Topic Analytics**: Per-topic success rates, difficulty breakdown, and improvement suggestions
  - 🎯 **Success Rate Analysis**: See your performance across all coding topics
  - 📈 **Difficulty Insights**: Easy/Medium/Hard breakdown for each topic
  - 🏆 **Strongest Topics**: Identify your coding strengths
  - 🎯 **Focus Areas**: Get suggestions for topics that need improvement
  - 📊 **Visual Performance**: Color-coded success rates and interactive charts
- **Skills & Languages**: Technology tags and recent programming languages

### 🔌 **API Endpoints**
- `GET /api/user/[username]` - Complete user profile
- `GET /api/user/[username]/stats` - Core statistics
- `GET /api/user/[username]/submissions` - Submission history
- `GET /api/user/[username]/dashboard` - Comprehensive dashboard data
- `GET /api/user/[username]/topics` - Topic-based analytics and insights
- `GET /api/user/[username]/problem/[slug]` - Problem-specific submission details
- `GET /api/user/[username]/submission/[id]` - Individual submission code (limited)

## 🎯 Use Cases

- **Personal Progress Tracking**: Monitor your LeetCode journey over time with topic-based insights
- **Interview Preparation**: Analyze problem-solving patterns and identify weak areas by topic
- **Skill Assessment**: Understand your strengths across different coding domains (Arrays, DP, Graphs, etc.)
- **Competitive Programming**: Track contest performance and ratings
- **Study Planning**: Focus on specific topics based on success rate analysis
- **Team Management**: Monitor team members' progress (for educators/managers)
- **Portfolio Showcase**: Display coding achievements to potential employers

## 🤝 Contributing

We welcome contributions! Please feel free to submit issues, feature requests, or pull requests.

## 📄 License

This project is open source and available under the [MIT License](LICENSE).

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.
