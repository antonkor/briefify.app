# Tasks: Interactive Workshop Mode with Feedback Analytics System

**Input**: Spec 015 - Workshop Mode with Feedback Analytics Integration
**Tech Stack**: Next.js 15, React 19, TypeScript, PostHog, Google Analytics, Tailwind CSS
**Feature Branch**: `015-workshop-mode-go`

## Execution Flow (main)
```
1. Analyzed current codebase structure
   → Next.js app with TypeScript, PostHog, Google Analytics
   → Existing workshop mode foundation identified
2. Extracted requirements from spec 015
   → 28 functional requirements across feedback, analytics, UI
   → Key entities: FeedbackEvent, WorkshopSession, AnalyticsEvent
3. Generated tasks by category:
   → Setup: Analytics configuration, types, utilities
   → Tests: Component tests, integration tests, analytics tests
   → Core: Feedback UI, workshop enhancements, analytics hooks
   → Integration: PostHog events, Google Analytics, feedback storage
   → Polish: Performance optimization, accessibility, documentation
4. Applied task dependencies:
   → Analytics setup before event tracking
   → Types before components
   → Components before integration tests
5. Marked parallel tasks [P] for different files
6. Generated 25 tasks with clear file paths and dependencies
```

## Format: `[ID] [P?] Description`
- **[P]**: Can run in parallel (different files, no dependencies)
- Include exact file paths in descriptions

## Phase 3.1: Setup & Configuration
- [ ] T001 Create feedback analytics types in src/types/feedback.ts
- [ ] T002 [P] Setup PostHog custom events configuration in src/config/analytics.ts
- [ ] T003 [P] Create Google Analytics workshop tracking utilities in src/utils/analytics.ts
- [ ] T004 [P] Add feedback storage utilities in src/utils/feedback.ts

## Phase 3.2: Tests First (TDD) ⚠️ MUST COMPLETE BEFORE 3.3
**CRITICAL: These tests MUST be written and MUST FAIL before ANY implementation**
- [ ] T005 [P] Component test for FeedbackButtons in src/components/__tests__/FeedbackButtons.test.tsx
- [ ] T006 [P] Component test for enhanced WorkshopControls in src/components/__tests__/WorkshopControls.test.tsx
- [ ] T007 [P] Hook test for useFeedbackAnalytics in src/hooks/__tests__/useFeedbackAnalytics.test.tsx
- [ ] T008 [P] Integration test for PostHog event tracking in src/__tests__/analytics-integration.test.tsx
- [ ] T009 [P] Integration test for complete workshop feedback flow in src/__tests__/workshop-feedback-flow.test.tsx

## Phase 3.3: Core Implementation (ONLY after tests are failing)
- [ ] T010 [P] Create FeedbackButtons component in src/components/FeedbackButtons.tsx
- [ ] T011 [P] Create FeedbackIndicator component in src/components/FeedbackIndicator.tsx
- [ ] T012 Enhance existing WorkshopControls with feedback integration in src/components/WorkshopControls.tsx
- [ ] T013 [P] Create useFeedbackAnalytics hook in src/hooks/useFeedbackAnalytics.ts
- [ ] T014 [P] Create useWorkshopSession hook in src/hooks/useWorkshopSession.ts
- [ ] T015 [P] Create FeedbackContext provider in src/contexts/FeedbackContext.tsx

## Phase 3.4: Analytics Integration
- [ ] T016 Integrate PostHog workshop events in existing useAnalytics hook (src/hooks/useAnalytics.ts)
- [ ] T017 [P] Create Google Analytics event tracking service in src/services/analyticsService.ts
- [ ] T018 Add feedback event tracking to existing workshop mode in src/app/page.tsx
- [ ] T019 [P] Create feedback aggregation utilities in src/utils/feedbackAggregation.ts
- [ ] T020 Implement privacy-compliant feedback storage in src/utils/feedbackStorage.ts

## Phase 3.5: Enhanced Workshop Mode Integration
- [ ] T021 Update existing useVideoAnalysis hook with feedback tracking (src/hooks/useVideoAnalysis.ts)
- [ ] T022 Add feedback buttons to workshop mode UI in main page component (src/app/page.tsx)
- [ ] T023 [P] Create FeedbackSummary component for analytics dashboard in src/components/FeedbackSummary.tsx
- [ ] T024 Implement strategic feedback placement throughout app in src/components/StrategicFeedback.tsx

## Phase 3.6: Polish & Optimization
- [ ] T025 [P] Add accessibility features for feedback buttons (ARIA labels, keyboard navigation)
- [ ] T026 [P] Performance optimization for analytics event batching in src/utils/eventBatching.ts
- [ ] T027 [P] Create feedback analytics documentation in docs/feedback-analytics.md
- [ ] T028 [P] Add feedback system to mobile responsive design
- [ ] T029 Run comprehensive testing of feedback loops and analytics integration

## Dependencies
- Types (T001) before all component and hook tasks
- Analytics setup (T002-T004) before integration tasks (T016-T020)
- Tests (T005-T009) before implementation (T010-T015)
- Core components (T010-T015) before integration (T016-T020)
- Integration (T016-T020) before enhancement (T021-T024)
- All implementation before polish (T025-T029)

## Parallel Execution Examples

### Phase 3.1 Setup (Can run T002-T004 together):
```
Task: "Setup PostHog custom events configuration in src/config/analytics.ts"
Task: "Create Google Analytics workshop tracking utilities in src/utils/analytics.ts"
Task: "Add feedback storage utilities in src/utils/feedback.ts"
```

### Phase 3.2 Tests (Can run T005-T009 together):
```
Task: "Component test for FeedbackButtons in src/components/__tests__/FeedbackButtons.test.tsx"
Task: "Component test for enhanced WorkshopControls in src/components/__tests__/WorkshopControls.test.tsx"
Task: "Hook test for useFeedbackAnalytics in src/hooks/__tests__/useFeedbackAnalytics.test.tsx"
Task: "Integration test for PostHog event tracking in src/__tests__/analytics-integration.test.tsx"
Task: "Integration test for complete workshop feedback flow in src/__tests__/workshop-feedback-flow.test.tsx"
```

### Phase 3.3 Core Components (Can run T010-T011, T013-T015 together):
```
Task: "Create FeedbackButtons component in src/components/FeedbackButtons.tsx"
Task: "Create FeedbackIndicator component in src/components/FeedbackIndicator.tsx"
Task: "Create useFeedbackAnalytics hook in src/hooks/useFeedbackAnalytics.ts"
Task: "Create useWorkshopSession hook in src/hooks/useWorkshopSession.ts"
Task: "Create FeedbackContext provider in src/contexts/FeedbackContext.tsx"
```

## File Impact Analysis
- **Shared files requiring sequential updates**:
  - `src/app/page.tsx` (T018, T022) - Must be sequential
  - `src/hooks/useAnalytics.ts` (T016) - Enhancement of existing
  - `src/hooks/useVideoAnalysis.ts` (T021) - Enhancement of existing

- **New files enabling parallel development**:
  - All component files (T010-T011, T023-T024)
  - All hook files (T013-T014)
  - All utility files (T002-T004, T017, T019-T020, T026)
  - All test files (T005-T009)

## Notes for Implementation
- Leverage existing PostHog integration (already configured)
- Extend current workshop mode foundation (already implemented)
- Ensure feedback UI matches existing design system
- Maintain performance with efficient event batching
- Follow existing TypeScript patterns and conventions
- Integrate with current mobile-first responsive design

## Success Criteria
- [ ] Thumbs up/down feedback buttons visible above workshop mode
- [ ] All workshop interactions tracked in PostHog with proper events
- [ ] Google Analytics receives workshop mode and feedback events
- [ ] Feedback collection respects user privacy preferences
- [ ] Strategic feedback opportunities placed throughout normal app flow
- [ ] Mobile responsive feedback interfaces
- [ ] Accessible feedback controls for all users
- [ ] Performance impact minimal (<50ms additional load time)

## Analytics Events to Implement
### PostHog Custom Events
- `workshop_mode_activated`
- `workshop_stage_navigated`
- `workshop_feedback_submitted`
- `workshop_session_completed`
- `micro_feedback_interaction`
- `strategic_feedback_placed`

### Google Analytics Events
- Category: "Workshop Mode", "User Feedback", "Feature Engagement"
- Actions: "Stage Navigation", "Feedback Submission", "Session Completion"
- Labels: Stage names, sentiment values, user journey context

## Task Generation Rules Applied
1. **From Spec Requirements**: Each FR requirement mapped to implementation task
2. **From Existing Code**: Enhanced existing workshop mode and analytics hooks
3. **From Tech Stack**: TypeScript types, React components, Next.js integration
4. **TDD Approach**: Tests before implementation for all new components
5. **Parallel Optimization**: Different files marked [P] for concurrent development

## Validation Checklist
- [x] All spec requirements (FR-001 through FR-028) covered by tasks
- [x] Existing codebase integration planned
- [x] Tests written before implementation (TDD)
- [x] Parallel tasks truly independent (different files)
- [x] Each task specifies exact file path
- [x] Dependencies clearly defined
- [x] Analytics integration comprehensive (PostHog + Google Analytics)
- [x] Privacy and accessibility considerations included