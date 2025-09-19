// Briefify Competitive Intelligence Logic
// AI-powered analysis and recommendations for hackathon success

import { v } from "convex/values";
import { query, mutation, action } from "./_generated/server";
import { api } from "./_generated/api";

// Core analysis functions for judge intelligence
export class CompetitiveIntelligence {

  /**
   * Analyze judge content and extract competitive insights
   */
  static async analyzeJudgeContent(content: string, judgeId: string): Promise<{
    sentiment: "positive" | "neutral" | "negative";
    topics: string[];
    technicalKeywords: string[];
    preferences: string[];
    relevanceScore: number;
  }> {
    // AI-powered content analysis
    const analysisPrompt = `
    Analyze this content from hackathon judge ${judgeId}:
    "${content}"

    Extract:
    1. Sentiment towards different technologies
    2. Technical topics mentioned
    3. Preference indicators for project evaluation
    4. Relevance to hackathon judging (0-100 score)

    Return JSON with: sentiment, topics, technicalKeywords, preferences, relevanceScore
    `;

    // Implementation would use OpenAI/Claude API
    // For now, return structured mock data
    return {
      sentiment: "positive",
      topics: ["developer experience", "scalability", "innovation"],
      technicalKeywords: ["react", "typescript", "database", "api"],
      preferences: ["clean code", "thorough documentation", "real-world utility"],
      relevanceScore: 85
    };
  }

  /**
   * Generate strategic recommendations based on judge profiles
   */
  static generateStrategicRecommendations(judges: any[]): Array<{
    category: string;
    recommendation: string;
    reasoning: string;
    priority: "high" | "medium" | "low";
    alignedJudges: string[];
    estimatedImpact: number;
  }> {
    const recommendations = [];

    // Analyze judge composition for technical depth requirement
    const technicalJudges = judges.filter(j =>
      j.leadershipStyle?.technicalDepth === "high" ||
      j.technicalExpertise?.length > 3
    );

    if (technicalJudges.length > 0) {
      recommendations.push({
        category: "technical",
        recommendation: "Implement advanced Convex features like transactions, scheduled functions, and real-time subscriptions",
        reasoning: `${technicalJudges.length} judges have deep technical backgrounds and will evaluate architectural sophistication`,
        priority: "high" as const,
        alignedJudges: technicalJudges.map(j => j.judgeId),
        estimatedImpact: 90
      });
    }

    // Analyze for DevX focus
    const devExperienceJudges = judges.filter(j =>
      j.title?.toLowerCase().includes("devx") ||
      j.title?.toLowerCase().includes("developer experience")
    );

    if (devExperienceJudges.length > 0) {
      recommendations.push({
        category: "presentation",
        recommendation: "Create exceptional developer documentation with interactive examples and clear onboarding flow",
        reasoning: "Developer Experience judges will heavily weight ease of use and documentation quality",
        priority: "high" as const,
        alignedJudges: devExperienceJudges.map(j => j.judgeId),
        estimatedImpact: 85
      });
    }

    // Analyze for community/GTM focus
    const communityJudges = judges.filter(j =>
      j.title?.toLowerCase().includes("community") ||
      j.title?.toLowerCase().includes("gtm")
    );

    if (communityJudges.length > 0) {
      recommendations.push({
        category: "features",
        recommendation: "Add social sharing features and community engagement elements to demonstrate viral potential",
        reasoning: "Community and GTM judges will evaluate market potential and user engagement",
        priority: "medium" as const,
        alignedJudges: communityJudges.map(j => j.judgeId),
        estimatedImpact: 75
      });
    }

    // OpenAI judge specific
    const openAIJudges = judges.filter(j => j.company?.toLowerCase() === "openai");
    if (openAIJudges.length > 0) {
      recommendations.push({
        category: "technical",
        recommendation: "Showcase sophisticated AI integration beyond basic completions - use function calling, embeddings, and advanced prompt engineering",
        reasoning: "OpenAI judges will expect innovative use of AI capabilities, not just simple API calls",
        priority: "high" as const,
        alignedJudges: openAIJudges.map(j => j.judgeId),
        estimatedImpact: 95
      });
    }

    return recommendations;
  }

  /**
   * Calculate submission optimization score
   */
  static calculateOptimizationScore(
    currentFeatures: string[],
    judges: any[],
    recommendations: any[]
  ): {
    overallScore: number;
    categoryScores: {
      technical: number;
      integration: number;
      creativity: number;
      presentation: number;
    };
    topRisks: string[];
    quickWins: string[];
  } {
    let technicalScore = 60; // Base score
    let integrationScore = 50;
    let creativityScore = 70;
    let presentationScore = 40;

    // Analyze current features against judge preferences
    const convexFeatures = currentFeatures.filter(f => f.toLowerCase().includes("convex"));
    if (convexFeatures.length > 2) integrationScore += 20;

    const aiFeatures = currentFeatures.filter(f => f.toLowerCase().includes("ai"));
    if (aiFeatures.length > 1) creativityScore += 15;

    // Identify risks and quick wins
    const topRisks = [];
    const quickWins = [];

    if (integrationScore < 70) {
      topRisks.push("Insufficient Convex integration depth");
      quickWins.push("Add real-time subscriptions and transactions");
    }

    if (presentationScore < 60) {
      topRisks.push("Poor documentation and developer experience");
      quickWins.push("Create interactive demo and clear README");
    }

    const overallScore = Math.round(
      (technicalScore * 0.3 + integrationScore * 0.3 + creativityScore * 0.2 + presentationScore * 0.2)
    );

    return {
      overallScore,
      categoryScores: {
        technical: technicalScore,
        integration: integrationScore,
        creativity: creativityScore,
        presentation: presentationScore,
      },
      topRisks,
      quickWins,
    };
  }
}

// Convex mutations and queries for the briefify pipeline

export const analyzeJudges = action({
  args: {},
  handler: async (ctx) => {
    // Fetch all judges from database
    const judges = await ctx.runQuery(api.judges.listAll);

    // Generate strategic recommendations
    const recommendations = CompetitiveIntelligence.generateStrategicRecommendations(judges);

    // Store recommendations in database
    for (const rec of recommendations) {
      await ctx.runMutation(api.strategicRecommendations.create, {
        category: rec.category,
        recommendation: rec.recommendation,
        reasoning: rec.reasoning,
        priority: rec.priority,
        estimatedImpact: rec.estimatedImpact,
        implementationEffort: "medium",
        alignedJudges: rec.alignedJudges,
        status: "proposed",
      });
    }

    return { recommendationsGenerated: recommendations.length };
  },
});

export const getCompetitiveIntelligence = query({
  args: {},
  handler: async (ctx) => {
    const judges = await ctx.db.query("judges").collect();
    const recommendations = await ctx.db
      .query("strategicRecommendations")
      .withIndex("by_priority")
      .collect();

    const insights = await ctx.db
      .query("judgeInsights")
      .withIndex("by_relevance")
      .order("desc")
      .take(10);

    // Calculate current optimization score
    const currentFeatures = ["convex database", "real-time updates", "ai insights"];
    const optimizationScore = CompetitiveIntelligence.calculateOptimizationScore(
      currentFeatures,
      judges,
      recommendations
    );

    return {
      judges: judges.length,
      recommendations: recommendations.filter(r => r.priority === "high"),
      topInsights: insights,
      optimizationScore,
      competitiveAdvantages: [
        "Deep Convex integration with advanced features",
        "Sophisticated AI-powered content analysis",
        "Real-time insights delivery system",
        "Judge-optimized presentation strategy"
      ],
    };
  },
});

export const generateDailyBrief = mutation({
  args: {},
  handler: async (ctx) => {
    const now = Date.now();

    // Get recent judge activity
    const recentContent = await ctx.db
      .query("judgeContent")
      .withIndex("by_published")
      .filter(q => q.gt(q.field("publishedAt"), now - 24 * 60 * 60 * 1000)) // Last 24 hours
      .collect();

    // Get high-priority recommendations
    const highPriorityRecs = await ctx.db
      .query("strategicRecommendations")
      .withIndex("by_priority")
      .filter(q => q.eq(q.field("priority"), "high"))
      .filter(q => q.eq(q.field("status"), "proposed"))
      .collect();

    // Generate brief summary
    const brief = {
      date: new Date().toISOString(),
      judgeActivity: recentContent.length,
      criticalRecommendations: highPriorityRecs.length,
      keyActions: highPriorityRecs.slice(0, 3).map(r => ({
        action: r.recommendation,
        impact: r.estimatedImpact,
        effort: r.implementationEffort
      })),
      competitiveThreats: [
        "Other teams may have deeper sponsor integrations",
        "AI sophistication arms race with OpenAI judge",
        "Developer experience bar raising rapidly"
      ],
      opportunities: [
        "Judge preference data shows technical depth preference",
        "Community judge values viral/social features",
        "DevX judge weights documentation heavily"
      ]
    };

    return brief;
  },
});

// Utility functions for pipeline orchestration

export const executePipeline = action({
  args: {
    phase: v.string(),
    configuration: v.optional(v.object({
      sources: v.array(v.string()),
      aiModel: v.string(),
      analysisDepth: v.string(),
    }))
  },
  handler: async (ctx, { phase, configuration }) => {
    const executionId = `exec_${Date.now()}`;

    // Log pipeline start
    await ctx.runMutation(api.pipelineExecutions.create, {
      executionId,
      phase,
      startTime: Date.now(),
      status: "running",
      triggerSource: "manual",
      configuration,
    });

    try {
      let result;

      switch (phase) {
        case "data_collection":
          result = await collectJudgeData(ctx);
          break;
        case "analysis":
          result = await analyzeCollectedData(ctx);
          break;
        case "recommendations":
          result = await generateRecommendations(ctx);
          break;
        default:
          throw new Error(`Unknown phase: ${phase}`);
      }

      // Log success
      await ctx.runMutation(api.pipelineExecutions.update, {
        executionId,
        status: "completed",
        endTime: Date.now(),
        ...result
      });

      return { success: true, ...result };

    } catch (error) {
      // Log failure
      await ctx.runMutation(api.pipelineExecutions.update, {
        executionId,
        status: "failed",
        endTime: Date.now(),
        errors: [error.message]
      });

      throw error;
    }
  },
});

// Helper functions (would be implemented based on specific data sources)
async function collectJudgeData(ctx: any) {
  // Implementation for Apify/web scraping
  return { recordsProcessed: 0, insightsGenerated: 0 };
}

async function analyzeCollectedData(ctx: any) {
  // Implementation for AI analysis
  return { recordsProcessed: 0, insightsGenerated: 0 };
}

async function generateRecommendations(ctx: any) {
  // Implementation for recommendation generation
  return { recommendationsCreated: 0 };
}