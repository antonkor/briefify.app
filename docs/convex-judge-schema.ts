// Convex Schema for Judge Intelligence Pipeline
// This schema supports the briefify pipeline for competitive hackathon intelligence

import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";

export default defineSchema({
  // Core judge profiles and intelligence
  judges: defineTable({
    judgeId: v.string(), // Unique identifier (e.g., "jamie-turner")
    name: v.string(),
    title: v.string(),
    company: v.string(),

    // Background and experience
    background: v.object({
      previousRoles: v.array(v.string()),
      education: v.optional(v.string()),
      location: v.optional(v.string()),
      experienceYears: v.optional(v.number()),
      startupExperience: v.boolean(),
      acquisitionExperience: v.optional(v.string()),
    }),

    // Technical expertise areas
    technicalExpertise: v.array(v.string()),

    // Leadership and evaluation style
    leadershipStyle: v.object({
      collaborative: v.boolean(),
      technicalDepth: v.string(), // "high", "medium", "low"
      startupMindset: v.boolean(),
      scalingFocus: v.boolean(),
    }),

    // Social presence for monitoring
    socialPresence: v.object({
      linkedin: v.optional(v.string()),
      twitter: v.optional(v.string()),
      github: v.optional(v.string()),
      activityLevel: v.string(), // "high", "moderate", "low"
    }),

    // AI-extracted preferences and themes
    contentThemes: v.array(v.string()),

    // Predicted evaluation criteria
    likelyEvaluationCriteria: v.array(v.string()),

    // Metadata
    lastUpdated: v.number(),
    confidenceScore: v.number(), // 0-100 confidence in data accuracy
  }),

  // Intelligence insights and analysis
  judgeInsights: defineTable({
    judgeId: v.string(),
    insightType: v.string(), // "preference", "bias", "pattern", "recommendation"

    // Core insight data
    insight: v.string(),
    confidence: v.number(), // 0-100 confidence score
    source: v.string(), // "linkedin", "twitter", "github", "blog", etc.

    // Analysis metadata
    extractedAt: v.number(),
    analysisMethod: v.string(), // "sentiment_analysis", "topic_modeling", etc.

    // Competitive impact
    competitiveRelevance: v.number(), // 0-100 how relevant for our submission
    actionable: v.boolean(),
  }).index("by_judge", ["judgeId"])
    .index("by_relevance", ["competitiveRelevance"])
    .index("by_type", ["insightType"]),

  // Competitive positioning recommendations
  strategicRecommendations: defineTable({
    category: v.string(), // "technical", "presentation", "features", "messaging"
    recommendation: v.string(),
    reasoning: v.string(),

    // Priority and impact
    priority: v.string(), // "high", "medium", "low"
    estimatedImpact: v.number(), // 0-100 expected scoring impact
    implementationEffort: v.string(), // "low", "medium", "high"

    // Judge alignment
    alignedJudges: v.array(v.string()), // Judge IDs this appeals to

    // Tracking
    status: v.string(), // "proposed", "in_progress", "implemented", "rejected"
    createdAt: v.number(),
    updatedAt: v.number(),
  }).index("by_priority", ["priority"])
    .index("by_category", ["category"])
    .index("by_status", ["status"]),

  // Content monitoring for judge activity
  judgeContent: defineTable({
    judgeId: v.string(),
    platform: v.string(), // "linkedin", "twitter", "blog", etc.
    contentType: v.string(), // "post", "comment", "article", "video"

    // Content details
    title: v.optional(v.string()),
    content: v.string(),
    url: v.optional(v.string()),
    publishedAt: v.number(),

    // Analysis results
    sentiment: v.optional(v.string()), // "positive", "neutral", "negative"
    topics: v.array(v.string()),
    technicalKeywords: v.array(v.string()),

    // Competitive intelligence value
    relevanceScore: v.number(), // 0-100 relevance to hackathon
    analyzed: v.boolean(),
    analyzedAt: v.optional(v.number()),
  }).index("by_judge", ["judgeId"])
    .index("by_platform", ["platform"])
    .index("by_relevance", ["relevanceScore"])
    .index("by_published", ["publishedAt"]),

  // Submission optimization tracking
  submissionOptimizations: defineTable({
    optimizationType: v.string(), // "feature_add", "tech_stack", "demo_script", "messaging"
    description: v.string(),

    // Judge targeting
    targetJudges: v.array(v.string()), // Specific judges this targets
    expectedScoreImpact: v.object({
      technical: v.number(),
      creativity: v.number(),
      integration: v.number(),
      presentation: v.number(),
    }),

    // Implementation
    status: v.string(), // "planned", "in_progress", "completed", "abandoned"
    implementedAt: v.optional(v.number()),

    // Results tracking
    actualImpact: v.optional(v.string()),
    lessons: v.optional(v.string()),

    createdAt: v.number(),
  }).index("by_type", ["optimizationType"])
    .index("by_status", ["status"]),

  // Pipeline execution logs
  pipelineExecutions: defineTable({
    executionId: v.string(),
    phase: v.string(), // "data_collection", "analysis", "recommendations"

    // Execution details
    startTime: v.number(),
    endTime: v.optional(v.number()),
    status: v.string(), // "running", "completed", "failed"

    // Results summary
    recordsProcessed: v.optional(v.number()),
    insightsGenerated: v.optional(v.number()),
    recommendationsCreated: v.optional(v.number()),

    // Error handling
    errors: v.optional(v.array(v.string())),
    warnings: v.optional(v.array(v.string())),

    // Metadata
    triggerSource: v.string(), // "scheduled", "manual", "webhook"
    configuration: v.optional(v.object({
      sources: v.array(v.string()),
      aiModel: v.string(),
      analysisDepth: v.string(),
    })),
  }).index("by_phase", ["phase"])
    .index("by_status", ["status"])
    .index("by_start_time", ["startTime"]),
});

// Types for TypeScript usage
export type Judge = {
  _id: string;
  judgeId: string;
  name: string;
  title: string;
  company: string;
  background: {
    previousRoles: string[];
    education?: string;
    location?: string;
    experienceYears?: number;
    startupExperience: boolean;
    acquisitionExperience?: string;
  };
  technicalExpertise: string[];
  leadershipStyle: {
    collaborative: boolean;
    technicalDepth: "high" | "medium" | "low";
    startupMindset: boolean;
    scalingFocus: boolean;
  };
  socialPresence: {
    linkedin?: string;
    twitter?: string;
    github?: string;
    activityLevel: "high" | "moderate" | "low";
  };
  contentThemes: string[];
  likelyEvaluationCriteria: string[];
  lastUpdated: number;
  confidenceScore: number;
};

export type JudgeInsight = {
  _id: string;
  judgeId: string;
  insightType: "preference" | "bias" | "pattern" | "recommendation";
  insight: string;
  confidence: number;
  source: string;
  extractedAt: number;
  analysisMethod: string;
  competitiveRelevance: number;
  actionable: boolean;
};

export type StrategicRecommendation = {
  _id: string;
  category: "technical" | "presentation" | "features" | "messaging";
  recommendation: string;
  reasoning: string;
  priority: "high" | "medium" | "low";
  estimatedImpact: number;
  implementationEffort: "low" | "medium" | "high";
  alignedJudges: string[];
  status: "proposed" | "in_progress" | "implemented" | "rejected";
  createdAt: number;
  updatedAt: number;
};