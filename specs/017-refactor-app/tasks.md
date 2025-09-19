# Tasks: Application Refactor

**Input**: Design documents from `/specs/017-refactor-app/`
**Prerequisites**: plan.md (required), research.md, data-model.md, contracts/

## Execution Flow (main)
```
1. Load plan.md from feature directory
   → SUCCESS: Tech stack: Next.js 15.5, React 19, TypeScript, Jest
   → Extract: Maintain existing structure with improvements
2. Load optional design documents:
   → data-model.md: 6 entities (ErrorInfo, PerformanceMetric, etc.)
   → contracts/: 2 files (error-reporting, performance-metrics)
   → research.md: 8 technical decisions extracted
3. Generate tasks by category:
   → Setup: Environment configuration, Jest setup
   → Tests: Contract tests for APIs, error boundary tests
   → Core: Error handling, performance monitoring, data validation
   → Integration: Build system, file sync handling
   → Polish: Documentation, performance optimization
4. Apply task rules:
   → Different files = mark [P] for parallel
   → Same file = sequential (no [P])
   → Tests before implementation (TDD)
5. Number tasks sequentially (T001-T045)
6. Generate dependency graph
7. Create parallel execution examples
8. Validate: All contracts have tests, all entities have implementations
9. Return: SUCCESS (tasks ready for execution)
```

## Format: `[ID] [P?] Description`
- **[P]**: Can run in parallel (different files, no dependencies)
- Include exact file paths in descriptions

## Path Conventions
- **Project Type**: Next.js web application
- **Source**: `src/` at repository root
- **Tests**: `tests/` at repository root
- **Config**: Root level configuration files

## Phase 3.1: Setup & Configuration
- [ ] T001 Create tests directory structure (tests/unit, tests/integration, tests/setup.js)
- [ ] T002 Configure Jest in jest.config.js with Next.js and TypeScript support
- [ ] T003 [P] Create .env.example with required environment variables
- [ ] T004 [P] Add .next to .gitignore if not present
- [ ] T005 [P] Create scripts/clean-build.ps1 for Windows cache cleanup
- [ ] T006 [P] Create scripts/clean-build.sh for Unix cache cleanup
- [ ] T007 Update next.config.js to use custom cache directory (NEXT_BUILD_DIR)

## Phase 3.2: Tests First (TDD) ⚠️ MUST COMPLETE BEFORE 3.3
**CRITICAL: These tests MUST be written and MUST FAIL before ANY implementation**
- [ ] T008 [P] Contract test for POST /api/errors in tests/contract/test_error_reporting.js
- [ ] T009 [P] Contract test for GET /api/errors in tests/contract/test_error_retrieval.js
- [ ] T010 [P] Contract test for POST /api/metrics in tests/contract/test_metrics_reporting.js
- [ ] T011 [P] Contract test for GET /api/metrics in tests/contract/test_metrics_retrieval.js
- [ ] T012 [P] Integration test for error boundary recovery in tests/integration/test_error_boundary.js
- [ ] T013 [P] Integration test for mock data validation in tests/integration/test_mock_data.js
- [ ] T014 [P] Integration test for performance monitoring in tests/integration/test_performance.js
- [ ] T015 [P] Integration test for file sync detection in tests/integration/test_file_sync.js

## Phase 3.3: Core Implementation - Error Handling
- [ ] T016 Create ErrorBoundary component in src/components/ErrorBoundary.tsx
- [ ] T017 Create ErrorFallback component in src/components/ErrorFallback.tsx
- [ ] T018 Add error boundary to src/app/layout.tsx root layout
- [ ] T019 [P] Create error logger utility in src/utils/logger.ts
- [ ] T020 [P] Implement ErrorInfo model in src/types/error.ts
- [ ] T021 Create error reporting service in src/services/errorService.ts
- [ ] T022 Add error context provider in src/contexts/ErrorContext.tsx

## Phase 3.4: Core Implementation - Performance
- [ ] T023 [P] Create performance monitor in src/utils/performance.ts
- [ ] T024 [P] Implement PerformanceMetric model in src/types/performance.ts
- [ ] T025 Create performance service in src/services/performanceService.ts
- [ ] T026 Add Web Vitals tracking in src/app/layout.tsx
- [ ] T027 [P] Create performance context provider in src/contexts/PerformanceContext.tsx
- [ ] T028 Implement lazy loading for VideoCard in src/components/VideoCard.tsx
- [ ] T029 Add React.memo to CommentViewer in src/components/CommentViewer.tsx

## Phase 3.5: Core Implementation - Build & Data
- [ ] T030 Create file sync detector in src/utils/syncDetector.ts
- [ ] T031 [P] Implement BuildConfig model in src/types/build.ts
- [ ] T032 Create mock data validator in src/utils/mockDataValidator.ts
- [ ] T033 [P] Implement MockDataSchema model in src/types/mockData.ts
- [ ] T034 Add validation to mock data loading in src/utils/mockDataLoader.ts
- [ ] T035 Create data caching utility in src/utils/dataCache.ts

## Phase 3.6: Integration & Middleware
- [ ] T036 Implement error API endpoints in src/app/api/errors/route.ts
- [ ] T037 Implement metrics API endpoints in src/app/api/metrics/route.ts
- [ ] T038 Add error middleware to API routes
- [ ] T039 Configure performance monitoring in production build
- [ ] T040 Setup pre-commit hooks with Husky in .husky/

## Phase 3.7: Polish & Documentation
- [ ] T041 [P] Create comprehensive README.md with setup instructions
- [ ] T042 [P] Write troubleshooting guide in docs/troubleshooting.md
- [ ] T043 [P] Document architecture in docs/architecture.md
- [ ] T044 Run performance benchmarks and document results
- [ ] T045 Update all dependencies to latest stable versions

## Dependencies
- Setup (T001-T007) blocks all other tasks
- Tests (T008-T015) must complete before implementation
- Error handling (T016-T022) can run parallel with Performance (T023-T029)
- Build & Data (T030-T035) depends on models from T020, T024
- Integration (T036-T040) depends on core implementation
- Polish (T041-T045) can start anytime but complete last

## Parallel Execution Examples

### Setup Tasks (Run Together):
```bash
Task: "Create .env.example with required environment variables"
Task: "Add .next to .gitignore if not present"
Task: "Create scripts/clean-build.ps1 for Windows"
Task: "Create scripts/clean-build.sh for Unix"
```

### Contract Tests (Run Together):
```bash
Task: "Contract test for POST /api/errors"
Task: "Contract test for GET /api/errors"
Task: "Contract test for POST /api/metrics"
Task: "Contract test for GET /api/metrics"
```

### Model Creation (Run Together):
```bash
Task: "Implement ErrorInfo model in src/types/error.ts"
Task: "Implement PerformanceMetric model in src/types/performance.ts"
Task: "Implement BuildConfig model in src/types/build.ts"
Task: "Implement MockDataSchema model in src/types/mockData.ts"
```

### Documentation (Run Together):
```bash
Task: "Create comprehensive README.md"
Task: "Write troubleshooting guide"
Task: "Document architecture"
```

## Notes
- [P] tasks = different files, no dependencies
- Verify tests fail before implementing (TDD)
- Commit after each completed phase
- Run `npm test` after each implementation task
- Check performance metrics after optimization tasks

## Success Criteria
- [ ] All contract tests passing
- [ ] All integration tests passing
- [ ] Zero uncaught errors in production
- [ ] Page load time <2 seconds
- [ ] Build completes without file lock errors
- [ ] 80% test coverage achieved

## Risk Mitigation
- **OneDrive conflicts**: T007 implements custom cache directory
- **Missing error handling**: T016-T018 add comprehensive error boundaries
- **Performance issues**: T023-T029 implement monitoring and optimization
- **Developer confusion**: T041-T043 provide clear documentation

## Validation Checklist
- [x] All contracts have corresponding tests (T008-T011)
- [x] All entities have model tasks (T020, T024, T031, T033)
- [x] All tests come before implementation (Phase 3.2 before 3.3-3.6)
- [x] Parallel tasks truly independent (verified file paths)
- [x] Each task specifies exact file path
- [x] No task modifies same file as another [P] task

---
**Total Tasks**: 45
**Estimated Duration**: 2-3 days with parallel execution
**Critical Path**: Setup → Tests → Error Handling → Integration