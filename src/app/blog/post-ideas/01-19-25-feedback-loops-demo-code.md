# User Feedback Loops Demo: PostHog + Convex Integration

## Complete Implementation Guide

This document provides a working demo of how to implement user feedback loops using PostHog for analytics and Convex for real-time backend processing.

## PostHog Enhanced Tracking Implementation

### 1. User Journey Tracking Component

```typescript
// src/hooks/useUserJourney.ts
import { useEffect, useState } from 'react';
import { trackEvent } from '@/lib/posthog';

interface JourneyStep {
  step: string;
  timestamp: number;
  duration?: number;
  metadata?: Record<string, any>;
}

export function useUserJourney(journeyName: string) {
  const [currentStep, setCurrentStep] = useState<string>('');
  const [journeySteps, setJourneySteps] = useState<JourneyStep[]>([]);
  const [startTime, setStartTime] = useState<number>(Date.now());

  const startJourney = (initialStep: string, metadata?: Record<string, any>) => {
    const timestamp = Date.now();
    setStartTime(timestamp);
    setCurrentStep(initialStep);

    const step: JourneyStep = {
      step: initialStep,
      timestamp,
      metadata
    };

    setJourneySteps([step]);

    trackEvent(`journey_started`, {
      journey_name: journeyName,
      initial_step: initialStep,
      ...metadata
    });
  };

  const moveToStep = (step: string, metadata?: Record<string, any>) => {
    const timestamp = Date.now();
    const prevStep = journeySteps[journeySteps.length - 1];
    const duration = prevStep ? timestamp - prevStep.timestamp : 0;

    const newStep: JourneyStep = {
      step,
      timestamp,
      duration,
      metadata
    };

    setCurrentStep(step);
    setJourneySteps(prev => [...prev, newStep]);

    trackEvent(`journey_step_${step}`, {
      journey_name: journeyName,
      previous_step: prevStep?.step,
      step_duration: duration,
      total_journey_time: timestamp - startTime,
      ...metadata
    });
  };

  const completeJourney = (metadata?: Record<string, any>) => {
    const completionTime = Date.now();
    const totalDuration = completionTime - startTime;

    trackEvent(`journey_completed`, {
      journey_name: journeyName,
      total_steps: journeySteps.length,
      total_duration: totalDuration,
      final_step: currentStep,
      journey_path: journeySteps.map(s => s.step).join(' -> '),
      ...metadata
    });

    setCurrentStep('');
    setJourneySteps([]);
  };

  const abandonJourney = (reason?: string, metadata?: Record<string, any>) => {
    const abandonTime = Date.now();
    const totalDuration = abandonTime - startTime;

    trackEvent(`journey_abandoned`, {
      journey_name: journeyName,
      abandon_step: currentStep,
      abandon_reason: reason,
      total_duration: totalDuration,
      steps_completed: journeySteps.length,
      journey_path: journeySteps.map(s => s.step).join(' -> '),
      ...metadata
    });

    setCurrentStep('');
    setJourneySteps([]);
  };

  return {
    currentStep,
    journeySteps,
    startJourney,
    moveToStep,
    completeJourney,
    abandonJourney
  };
}
```

### 2. Enhanced Video Analysis Tracking

```typescript
// src/components/VideoAnalysis/TrackingWrapper.tsx
'use client';

import React, { useEffect, useState } from 'react';
import { useUserJourney } from '@/hooks/useUserJourney';
import { trackEvent } from '@/lib/posthog';

interface TrackingWrapperProps {
  children: React.ReactNode;
  videoId?: string;
  userId?: string;
}

export function TrackingWrapper({ children, videoId, userId }: TrackingWrapperProps) {
  const journey = useUserJourney('video_analysis');
  const [sessionId] = useState(() => Math.random().toString(36).substring(7));
  const [pageLoadTime] = useState(() => Date.now());
  const [userInteractions, setUserInteractions] = useState(0);

  // Track page performance
  useEffect(() => {
    const trackPagePerformance = () => {
      if (typeof window !== 'undefined' && 'performance' in window) {
        const perfData = performance.getEntriesByType('navigation')[0] as PerformanceNavigationTiming;

        trackEvent('page_performance', {
          session_id: sessionId,
          page_load_time: perfData.loadEventEnd - perfData.fetchStart,
          dom_ready_time: perfData.domContentLoadedEventEnd - perfData.fetchStart,
          time_to_interactive: perfData.loadEventEnd - perfData.fetchStart,
          page_type: 'video_analysis'
        });
      }
    };

    // Wait for page to fully load
    if (document.readyState === 'complete') {
      trackPagePerformance();
    } else {
      window.addEventListener('load', trackPagePerformance);
      return () => window.removeEventListener('load', trackPagePerformance);
    }
  }, [sessionId]);

  // Track user engagement
  useEffect(() => {
    let mouseMovements = 0;
    let scrollEvents = 0;
    let clickEvents = 0;

    const trackMouseMove = () => {
      mouseMovements++;
    };

    const trackScroll = () => {
      scrollEvents++;

      // Track scroll depth
      const scrollPercent = Math.round(
        (window.scrollY / (document.body.scrollHeight - window.innerHeight)) * 100
      );

      if (scrollPercent % 25 === 0 && scrollPercent > 0) {
        trackEvent('scroll_depth', {
          session_id: sessionId,
          scroll_percent: scrollPercent,
          video_id: videoId
        });
      }
    };

    const trackClick = (event: MouseEvent) => {
      clickEvents++;
      setUserInteractions(prev => prev + 1);

      const target = event.target as HTMLElement;
      trackEvent('user_click', {
        session_id: sessionId,
        element_tag: target.tagName.toLowerCase(),
        element_class: target.className,
        element_id: target.id,
        click_x: event.clientX,
        click_y: event.clientY,
        video_id: videoId
      });
    };

    document.addEventListener('mousemove', trackMouseMove);
    document.addEventListener('scroll', trackScroll);
    document.addEventListener('click', trackClick);

    // Send engagement summary every 30 seconds
    const engagementInterval = setInterval(() => {
      if (mouseMovements > 0 || scrollEvents > 0 || clickEvents > 0) {
        trackEvent('engagement_summary', {
          session_id: sessionId,
          mouse_movements: mouseMovements,
          scroll_events: scrollEvents,
          click_events: clickEvents,
          time_on_page: Date.now() - pageLoadTime,
          video_id: videoId
        });

        mouseMovements = 0;
        scrollEvents = 0;
        clickEvents = 0;
      }
    }, 30000);

    return () => {
      document.removeEventListener('mousemove', trackMouseMove);
      document.removeEventListener('scroll', trackScroll);
      document.removeEventListener('click', trackClick);
      clearInterval(engagementInterval);
    };
  }, [sessionId, pageLoadTime, videoId]);

  // Track tab visibility changes
  useEffect(() => {
    const handleVisibilityChange = () => {
      trackEvent(document.hidden ? 'tab_hidden' : 'tab_visible', {
        session_id: sessionId,
        time_on_page: Date.now() - pageLoadTime,
        video_id: videoId
      });
    };

    document.addEventListener('visibilitychange', handleVisibilityChange);
    return () => document.removeEventListener('visibilitychange', handleVisibilityChange);
  }, [sessionId, pageLoadTime, videoId]);

  return <>{children}</>;
}
```

### 3. Video Upload with Detailed Tracking

```typescript
// src/components/VideoInputForm/TrackedVideoInput.tsx
'use client';

import React, { useState, useCallback } from 'react';
import { useUserJourney } from '@/hooks/useUserJourney';
import { trackEvent } from '@/lib/posthog';

export function TrackedVideoInput() {
  const journey = useUserJourney('video_upload');
  const [uploadState, setUploadState] = useState<'idle' | 'uploading' | 'processing' | 'complete' | 'error'>('idle');
  const [uploadProgress, setUploadProgress] = useState(0);
  const [sessionId] = useState(() => Math.random().toString(36).substring(7));

  const handleFileSelect = useCallback((file: File) => {
    journey.startJourney('file_selected', {
      file_size: file.size,
      file_type: file.type,
      file_name: file.name.substring(0, 20), // Truncate for privacy
      session_id: sessionId
    });

    // Track file characteristics
    trackEvent('file_analysis', {
      session_id: sessionId,
      size_mb: Math.round(file.size / 1024 / 1024 * 100) / 100,
      type: file.type,
      estimated_duration: estimateVideoDuration(file.size), // Custom function
      upload_method: 'drag_drop' // or 'file_picker'
    });
  }, [journey, sessionId]);

  const handleUploadStart = useCallback(() => {
    journey.moveToStep('upload_started');
    setUploadState('uploading');

    const uploadStartTime = Date.now();

    // Track upload progress every 10%
    const progressInterval = setInterval(() => {
      setUploadProgress(prev => {
        const newProgress = Math.min(prev + 10, 100);

        trackEvent('upload_progress', {
          session_id: sessionId,
          progress_percent: newProgress,
          elapsed_time: Date.now() - uploadStartTime,
          estimated_remaining: estimateRemainingTime(newProgress, Date.now() - uploadStartTime)
        });

        if (newProgress === 100) {
          clearInterval(progressInterval);
          handleUploadComplete();
        }

        return newProgress;
      });
    }, 2000); // Simulate progress updates
  }, [journey, sessionId]);

  const handleUploadComplete = useCallback(() => {
    journey.moveToStep('upload_complete');
    setUploadState('processing');

    trackEvent('upload_completed', {
      session_id: sessionId,
      upload_duration: Date.now() - journey.startTime,
      file_processed: true
    });

    // Start analysis tracking
    journey.moveToStep('analysis_started');
    setTimeout(() => {
      journey.moveToStep('analysis_complete');
      setUploadState('complete');

      trackEvent('analysis_completed', {
        session_id: sessionId,
        total_process_time: Date.now() - journey.startTime,
        success: true
      });

      journey.completeJourney({
        session_id: sessionId,
        final_state: 'success'
      });
    }, 5000); // Simulate processing time
  }, [journey, sessionId]);

  const handleError = useCallback((error: string) => {
    setUploadState('error');

    journey.abandonJourney('upload_error', {
      session_id: sessionId,
      error_message: error,
      error_step: journey.currentStep
    });
  }, [journey, sessionId]);

  return (
    <div className="space-y-4">
      {/* Upload UI with tracking... */}
      <div className="border-2 border-dashed border-gray-300 rounded-lg p-6">
        <input
          type="file"
          accept="video/*"
          onChange={(e) => {
            if (e.target.files?.[0]) {
              handleFileSelect(e.target.files[0]);
              handleUploadStart();
            }
          }}
          className="w-full"
        />
      </div>

      {uploadState !== 'idle' && (
        <div className="space-y-2">
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div
              className="bg-blue-600 h-2 rounded-full transition-all duration-300"
              style={{ width: `${uploadProgress}%` }}
            />
          </div>
          <p className="text-sm text-gray-600">
            {uploadState === 'uploading' && `Uploading... ${uploadProgress}%`}
            {uploadState === 'processing' && 'Processing video...'}
            {uploadState === 'complete' && 'Analysis complete!'}
            {uploadState === 'error' && 'Upload failed'}
          </p>
        </div>
      )}
    </div>
  );
}

// Helper functions
function estimateVideoDuration(fileSize: number): number {
  // Rough estimate: 1MB per minute of video
  return Math.round(fileSize / 1024 / 1024);
}

function estimateRemainingTime(progress: number, elapsedTime: number): number {
  if (progress === 0) return 0;
  return Math.round((elapsedTime / progress) * (100 - progress));
}
```

## Convex Backend Integration

### 1. Schema Definition

```typescript
// convex/schema.ts
import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";

export default defineSchema({
  user_events: defineTable({
    session_id: v.string(),
    event_name: v.string(),
    properties: v.object({
      // Dynamic properties object
    }),
    timestamp: v.number(),
    user_id: v.optional(v.string()),
    page_url: v.string(),
    user_agent: v.string(),
  })
  .index("by_session", ["session_id"])
  .index("by_event", ["event_name"])
  .index("by_timestamp", ["timestamp"]),

  user_journeys: defineTable({
    session_id: v.string(),
    journey_name: v.string(),
    steps: v.array(v.object({
      step: v.string(),
      timestamp: v.number(),
      duration: v.optional(v.number()),
      metadata: v.optional(v.object({}))
    })),
    status: v.union(v.literal("active"), v.literal("completed"), v.literal("abandoned")),
    total_duration: v.optional(v.number()),
    completion_rate: v.optional(v.number()),
  })
  .index("by_journey", ["journey_name"])
  .index("by_status", ["status"]),

  analytics_insights: defineTable({
    insight_type: v.string(),
    data: v.object({}),
    generated_at: v.number(),
    time_range: v.string(),
  })
  .index("by_type", ["insight_type"])
  .index("by_date", ["generated_at"]),
});
```

### 2. Event Processing Functions

```typescript
// convex/analytics.ts
import { mutation, query } from "./_generated/server";
import { v } from "convex/values";

// Store user events from PostHog
export const trackEvent = mutation({
  args: {
    session_id: v.string(),
    event_name: v.string(),
    properties: v.object({}),
    user_id: v.optional(v.string()),
    page_url: v.string(),
    user_agent: v.string(),
  },
  handler: async (ctx, args) => {
    const eventId = await ctx.db.insert("user_events", {
      ...args,
      timestamp: Date.now(),
    });

    // Trigger real-time analysis
    await ctx.scheduler.runAfter(0, "analyzeUserBehavior", {
      event_id: eventId,
      session_id: args.session_id,
    });

    return eventId;
  },
});

// Analyze user behavior patterns
export const analyzeUserBehavior = mutation({
  args: {
    event_id: v.id("user_events"),
    session_id: v.string(),
  },
  handler: async (ctx, args) => {
    // Get recent events for this session
    const sessionEvents = await ctx.db
      .query("user_events")
      .withIndex("by_session", (q) => q.eq("session_id", args.session_id))
      .order("desc")
      .take(10);

    // Detect patterns
    const patterns = detectBehaviorPatterns(sessionEvents);

    // If concerning pattern detected, create insight
    if (patterns.includes("potential_abandonment")) {
      await ctx.db.insert("analytics_insights", {
        insight_type: "user_at_risk",
        data: {
          session_id: args.session_id,
          risk_factors: patterns,
          recommended_actions: generateRecommendations(patterns),
        },
        generated_at: Date.now(),
        time_range: "real_time",
      });
    }

    return patterns;
  },
});

// Get analytics dashboard data
export const getDashboardData = query({
  args: {
    time_range: v.string(), // "1h", "24h", "7d", "30d"
  },
  handler: async (ctx, args) => {
    const timeStart = getTimeRangeStart(args.time_range);

    // Get events in time range
    const events = await ctx.db
      .query("user_events")
      .withIndex("by_timestamp", (q) => q.gte("timestamp", timeStart))
      .collect();

    // Calculate metrics
    const metrics = {
      total_events: events.length,
      unique_sessions: new Set(events.map(e => e.session_id)).size,
      top_events: getTopEvents(events),
      conversion_funnel: calculateConversionFunnel(events),
      user_flow: analyzeUserFlow(events),
      performance_metrics: calculatePerformanceMetrics(events),
      drop_off_points: identifyDropOffPoints(events),
    };

    return metrics;
  },
});

// Real-time journey tracking
export const updateJourney = mutation({
  args: {
    session_id: v.string(),
    journey_name: v.string(),
    step: v.string(),
    action: v.union(v.literal("start"), v.literal("step"), v.literal("complete"), v.literal("abandon")),
    metadata: v.optional(v.object({})),
  },
  handler: async (ctx, args) => {
    // Find existing journey
    const existingJourney = await ctx.db
      .query("user_journeys")
      .withIndex("by_session", (q) => q.eq("session_id", args.session_id))
      .filter((q) => q.eq(q.field("journey_name"), args.journey_name))
      .filter((q) => q.eq(q.field("status"), "active"))
      .first();

    const timestamp = Date.now();

    if (args.action === "start") {
      // Create new journey
      return await ctx.db.insert("user_journeys", {
        session_id: args.session_id,
        journey_name: args.journey_name,
        steps: [{
          step: args.step,
          timestamp,
          metadata: args.metadata,
        }],
        status: "active",
      });
    }

    if (!existingJourney) {
      throw new Error("No active journey found");
    }

    // Update existing journey
    const lastStep = existingJourney.steps[existingJourney.steps.length - 1];
    const duration = timestamp - lastStep.timestamp;

    const newSteps = [...existingJourney.steps, {
      step: args.step,
      timestamp,
      duration,
      metadata: args.metadata,
    }];

    const status = args.action === "complete" ? "completed" :
                  args.action === "abandon" ? "abandoned" : "active";

    const totalDuration = status !== "active" ?
      timestamp - existingJourney.steps[0].timestamp : undefined;

    await ctx.db.patch(existingJourney._id, {
      steps: newSteps,
      status,
      total_duration: totalDuration,
      completion_rate: calculateCompletionRate(newSteps, args.journey_name),
    });

    // Trigger insights generation
    if (status !== "active") {
      await ctx.scheduler.runAfter(0, "generateJourneyInsights", {
        journey_id: existingJourney._id,
      });
    }

    return existingJourney._id;
  },
});

// Helper functions
function detectBehaviorPatterns(events: any[]): string[] {
  const patterns: string[] = [];

  // Check for rapid consecutive events (possible frustration)
  const rapidEvents = events.filter((event, index) => {
    if (index === 0) return false;
    return event.timestamp - events[index - 1].timestamp < 1000; // Less than 1 second
  });

  if (rapidEvents.length > 3) {
    patterns.push("rapid_clicking");
  }

  // Check for long gaps (possible distraction)
  const longGaps = events.filter((event, index) => {
    if (index === 0) return false;
    return event.timestamp - events[index - 1].timestamp > 30000; // More than 30 seconds
  });

  if (longGaps.length > 0) {
    patterns.push("potential_abandonment");
  }

  // Check for error events
  const errorEvents = events.filter(e => e.event_name.includes("error"));
  if (errorEvents.length > 0) {
    patterns.push("error_encountered");
  }

  return patterns;
}

function generateRecommendations(patterns: string[]): string[] {
  const recommendations: string[] = [];

  if (patterns.includes("rapid_clicking")) {
    recommendations.push("Show helpful tooltips or loading states");
  }

  if (patterns.includes("potential_abandonment")) {
    recommendations.push("Consider showing engagement prompt or help");
  }

  if (patterns.includes("error_encountered")) {
    recommendations.push("Display better error recovery options");
  }

  return recommendations;
}

function getTimeRangeStart(range: string): number {
  const now = Date.now();
  switch (range) {
    case "1h": return now - 60 * 60 * 1000;
    case "24h": return now - 24 * 60 * 60 * 1000;
    case "7d": return now - 7 * 24 * 60 * 60 * 1000;
    case "30d": return now - 30 * 24 * 60 * 60 * 1000;
    default: return now - 24 * 60 * 60 * 1000;
  }
}

function calculateConversionFunnel(events: any[]) {
  const funnelSteps = [
    "page_view",
    "file_selected",
    "upload_started",
    "upload_complete",
    "analysis_complete"
  ];

  const funnel = funnelSteps.map(step => {
    const stepEvents = events.filter(e => e.event_name === step);
    return {
      step,
      count: stepEvents.length,
      unique_users: new Set(stepEvents.map(e => e.session_id)).size
    };
  });

  return funnel;
}
```

### 3. Real-time Dashboard Component

```typescript
// src/components/Analytics/RealTimeDashboard.tsx
'use client';

import React, { useState, useEffect } from 'react';
import { useQuery } from 'convex/react';
import { api } from '@/convex/_generated/api';

export function RealTimeDashboard() {
  const [timeRange, setTimeRange] = useState('24h');
  const dashboardData = useQuery(api.analytics.getDashboardData, { time_range: timeRange });

  if (!dashboardData) {
    return <div>Loading analytics...</div>;
  }

  return (
    <div className="p-6 space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">User Feedback Analytics</h1>
        <select
          value={timeRange}
          onChange={(e) => setTimeRange(e.target.value)}
          className="px-3 py-2 border rounded"
        >
          <option value="1h">Last Hour</option>
          <option value="24h">Last 24 Hours</option>
          <option value="7d">Last 7 Days</option>
          <option value="30d">Last 30 Days</option>
        </select>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-white p-4 rounded-lg shadow">
          <h3 className="text-sm font-medium text-gray-500">Total Events</h3>
          <p className="text-2xl font-bold">{dashboardData.total_events.toLocaleString()}</p>
        </div>
        <div className="bg-white p-4 rounded-lg shadow">
          <h3 className="text-sm font-medium text-gray-500">Unique Sessions</h3>
          <p className="text-2xl font-bold">{dashboardData.unique_sessions.toLocaleString()}</p>
        </div>
        <div className="bg-white p-4 rounded-lg shadow">
          <h3 className="text-sm font-medium text-gray-500">Avg Events/Session</h3>
          <p className="text-2xl font-bold">
            {(dashboardData.total_events / dashboardData.unique_sessions).toFixed(1)}
          </p>
        </div>
        <div className="bg-white p-4 rounded-lg shadow">
          <h3 className="text-sm font-medium text-gray-500">Conversion Rate</h3>
          <p className="text-2xl font-bold">
            {(dashboardData.conversion_funnel[dashboardData.conversion_funnel.length - 1]?.count /
              dashboardData.conversion_funnel[0]?.count * 100 || 0).toFixed(1)}%
          </p>
        </div>
      </div>

      {/* Conversion Funnel */}
      <div className="bg-white p-6 rounded-lg shadow">
        <h3 className="text-lg font-semibold mb-4">Conversion Funnel</h3>
        <div className="space-y-3">
          {dashboardData.conversion_funnel.map((step, index) => {
            const percentage = index === 0 ? 100 :
              (step.count / dashboardData.conversion_funnel[0].count * 100);

            return (
              <div key={step.step} className="flex items-center space-x-4">
                <div className="w-32 text-sm font-medium">{step.step}</div>
                <div className="flex-1 bg-gray-200 rounded-full h-6">
                  <div
                    className="bg-blue-600 h-6 rounded-full flex items-center justify-center text-white text-xs"
                    style={{ width: `${percentage}%` }}
                  >
                    {percentage.toFixed(1)}%
                  </div>
                </div>
                <div className="w-20 text-sm text-gray-600">
                  {step.count} users
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Top Events */}
      <div className="bg-white p-6 rounded-lg shadow">
        <h3 className="text-lg font-semibold mb-4">Most Common Events</h3>
        <div className="space-y-2">
          {dashboardData.top_events.slice(0, 10).map((event: any, index: number) => (
            <div key={event.name} className="flex justify-between items-center py-2 border-b">
              <span className="font-medium">{event.name}</span>
              <span className="text-gray-600">{event.count} times</span>
            </div>
          ))}
        </div>
      </div>

      {/* Drop-off Points */}
      {dashboardData.drop_off_points.length > 0 && (
        <div className="bg-red-50 p-6 rounded-lg border border-red-200">
          <h3 className="text-lg font-semibold text-red-800 mb-4">⚠️ Drop-off Points Detected</h3>
          <div className="space-y-2">
            {dashboardData.drop_off_points.map((point: any, index: number) => (
              <div key={index} className="text-red-700">
                <strong>{point.step}</strong>: {point.drop_rate.toFixed(1)}% drop-off rate
                <div className="text-sm text-red-600 ml-4">{point.recommendation}</div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
```

## Integration Summary

This demo shows how to:

1. **Track comprehensive user journeys** with PostHog enhanced tracking
2. **Process analytics data in real-time** using Convex backend functions
3. **Generate actionable insights** from user behavior patterns
4. **Display analytics data** in a real-time dashboard
5. **Detect and respond to** user experience issues as they happen

The system captures:
- Page performance metrics
- User engagement patterns
- Conversion funnel data
- Drop-off point analysis
- Real-time user journey tracking
- Error and frustration indicators

This creates a complete feedback loop where user behavior data directly informs UX improvements and can trigger real-time interventions to improve user experience.