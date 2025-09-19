# Tasks: Blog Content Analytics System

**Input**: Design documents from `/specs/009-blog-schema-plan/`
**Prerequisites**: spec.md (available)

## Execution Flow (main)
```
1. Load spec.md from feature directory
   → Feature: Blog content analytics and tagging system
   → Extract: journal entries, commit analysis, tagging, mock data
2. No implementation plan found - generating tasks from spec directly
3. Generate tasks by category:
   → Setup: project structure, dependencies, schema design
   → Tests: data processing tests, integration tests
   → Core: content analysis, tagging engine, mock data generation
   → Integration: file processing, schema validation
   → Polish: unit tests, documentation
4. Apply task rules:
   → Different files = mark [P] for parallel
   → Same file = sequential (no [P])
   → Tests before implementation (TDD)
5. Number tasks sequentially (T001, T002...)
6. Generate dependency graph
7. Return: SUCCESS (tasks ready for execution)
```

## Format: `[ID] [P?] Description`
- **[P]**: Can run in parallel (different files, no dependencies)
- Include exact file paths in descriptions

## Path Conventions
- **Web app structure**: Next.js with TypeScript
- Paths assume `src/` directory structure from existing codebase

## Phase 3.1: Setup
- [ ] T001 Create blog content analytics directory structure in src/lib/blog/
- [ ] T002 [P] Initialize TypeScript interfaces for blog schema in src/types/blog.ts
- [ ] T003 [P] Create mock data directory and initial JSON structure in src/data/blog/

## Phase 3.2: Tests First (TDD) ⚠️ MUST COMPLETE BEFORE 3.3
**CRITICAL: These tests MUST be written and MUST FAIL before ANY implementation**
- [ ] T004 [P] Unit test for journal entry analysis in __tests__/blog/journal-analyzer.test.ts
- [ ] T005 [P] Unit test for commit message processing in __tests__/blog/commit-analyzer.test.ts
- [ ] T006 [P] Unit test for content tagging engine in __tests__/blog/content-tagger.test.ts
- [ ] T007 [P] Integration test for blog content generation in __tests__/blog/content-generator.test.ts
- [ ] T008 [P] Schema validation tests in __tests__/blog/schema-validator.test.ts

## Phase 3.3: Core Implementation (ONLY after tests are failing)
- [ ] T009 [P] BlogPost entity model in src/types/blog.ts
- [ ] T010 [P] ContentSource entity model in src/types/blog.ts
- [ ] T011 [P] Tag entity model with hierarchy support in src/types/blog.ts
- [ ] T012 [P] Insight entity model in src/types/blog.ts
- [ ] T013 [P] ContentAnalysis entity model in src/types/blog.ts
- [ ] T014 [P] Journal entry analyzer service in src/lib/blog/journal-analyzer.ts
- [ ] T015 [P] Commit message processor service in src/lib/blog/commit-analyzer.ts
- [ ] T016 [P] Content tagging engine in src/lib/blog/content-tagger.ts
- [ ] T017 Blog content generator orchestrator in src/lib/blog/content-generator.ts
- [ ] T018 Mock data generator utility in src/lib/blog/mock-data-generator.ts

## Phase 3.4: Integration
- [ ] T019 File system integration for journal reading in src/lib/blog/file-processor.ts
- [ ] T020 Git integration for commit message extraction in src/lib/blog/git-processor.ts
- [ ] T021 Schema validation middleware in src/lib/blog/schema-validator.ts
- [ ] T022 Content deduplication service in src/lib/blog/deduplicator.ts

## Phase 3.5: Mock Data & Schema
- [ ] T023 [P] Generate realistic blog post mock data in src/data/blog/posts.json
- [ ] T024 [P] Generate content source mock data in src/data/blog/sources.json
- [ ] T025 [P] Generate tag taxonomy mock data in src/data/blog/tags.json
- [ ] T026 [P] Generate insight examples mock data in src/data/blog/insights.json
- [ ] T027 [P] Create Convex-compatible schema definitions in src/lib/blog/convex-schema.ts

## Phase 3.6: Polish
- [ ] T028 [P] Unit tests for file processing in __tests__/blog/file-processor.test.ts
- [ ] T029 [P] Unit tests for git integration in __tests__/blog/git-processor.test.ts
- [ ] T030 [P] Performance tests for content analysis (<500ms per entry)
- [ ] T031 [P] Create API documentation in docs/blog-analytics.md
- [ ] T032 [P] Create usage examples in docs/blog-examples.md
- [ ] T033 Error handling and logging integration
- [ ] T034 Code cleanup and optimization

## Dependencies
- Setup (T001-T003) before tests (T004-T008)
- Tests (T004-T008) before implementation (T009-T018)
- Core models (T009-T013) before services (T014-T016)
- Services before orchestrator (T017)
- Core implementation before integration (T019-T022)
- Integration before mock data generation (T023-T027)
- Implementation before polish (T028-T034)

## Parallel Example
```
# Launch T004-T008 together (all different test files):
Task: "Unit test for journal entry analysis in __tests__/blog/journal-analyzer.test.ts"
Task: "Unit test for commit message processing in __tests__/blog/commit-analyzer.test.ts"
Task: "Unit test for content tagging engine in __tests__/blog/content-tagger.test.ts"
Task: "Integration test for blog content generation in __tests__/blog/content-generator.test.ts"
Task: "Schema validation tests in __tests__/blog/schema-validator.test.ts"

# Launch T009-T013 together (all in same types file - NO [P]):
# These must be done sequentially as they modify the same file

# Launch T014-T016 together (different service files):
Task: "Journal entry analyzer service in src/lib/blog/journal-analyzer.ts"
Task: "Commit message processor service in src/lib/blog/commit-analyzer.ts"
Task: "Content tagging engine in src/lib/blog/content-tagger.ts"
```

## Key Entities from Spec
Based on spec requirements FR-001 through FR-010:

1. **BlogPost**: Title, content, tags, publication status, source attribution
2. **ContentSource**: Origin metadata (journal entry, commit message), extraction timestamp
3. **Tag**: Hierarchical categorization (technical.frontend, business.stakeholder, learning.debugging)
4. **Insight**: Extracted content with confidence score, source reference, positioning suggestion
5. **ContentAnalysis**: Processing result with insights, tags, quality metrics

## Notes
- [P] tasks = different files, no dependencies
- Verify tests fail before implementing
- Commit after each task
- Mock data structure must be Convex-compatible for future integration
- Content analysis should handle privacy filtering (FR-009 clarification needed)
- Blog publication workflow undefined (FR-010 clarification needed)

## Validation Checklist
- [x] All entities have model tasks (T009-T013)
- [x] All core services have corresponding tests (T004-T008)
- [x] Tests come before implementation
- [x] Parallel tasks use different files
- [x] Each task specifies exact file path
- [x] Mock data generation included for development phase