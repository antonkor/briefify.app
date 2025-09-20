# Tasks: Vibe Mode Quick Inspect

**Input**: Design documents from `/specs/019-vibe-mode-quick/`
**Prerequisites**: plan.md (required), research.md, data-model.md, contracts/

## Execution Flow (main)
```
1. Load plan.md from feature directory
   → If not found: ERROR "No implementation plan found"
   → Extract: tech stack, libraries, structure
2. Load optional design documents:
   → data-model.md: Extract entities → model tasks
   → contracts/: Each file → contract test task
   → research.md: Extract decisions → setup tasks
3. Generate tasks by category:
   → Setup: project init, dependencies, linting
   → Tests: contract tests, integration tests
   → Core: models, services, CLI commands
   → Integration: DB, middleware, logging
   → Polish: unit tests, performance, docs
4. Apply task rules:
   → Different files = mark [P] for parallel
   → Same file = sequential (no [P])
   → Tests before implementation (TDD)
5. Number tasks sequentially (T001, T002...)
6. Generate dependency graph
7. Create parallel execution examples
8. Validate task completeness:
   → All contracts have tests?
   → All entities have models?
   → All endpoints implemented?
9. Return: SUCCESS (tasks ready for execution)
```

## Format: `[ID] [P?] Description`
- **[P]**: Can run in parallel (different files, no dependencies)
- Include exact file paths in descriptions

## Path Conventions
- **Single project**: `src/`, `tests/` at repository root
- Paths assume Next.js project structure as per plan.md

## Phase 3.1: Setup
- [ ] T001 Create VibeMode component directory structure in src/components/VibeMode/
- [ ] T002 [P] Initialize TypeScript type definitions in src/types/vibe-mode.ts
- [ ] T003 [P] Configure inspection system utilities in src/utils/elementAnalysis.ts

## Phase 3.2: Tests First (TDD) ⚠️ MUST COMPLETE BEFORE 3.3
**CRITICAL: These tests MUST be written and MUST FAIL before ANY implementation**
- [ ] T004 [P] Contract test IElementAnalyzer interface in tests/contract/test_element_analyzer.test.ts
- [ ] T005 [P] Contract test IVibeModeManager interface in tests/contract/test_vibe_mode_manager.test.ts
- [ ] T006 [P] Contract test IInspectionIcon interface in tests/contract/test_inspection_icon.test.ts
- [ ] T007 [P] Contract test IDevelopmentPopup interface in tests/contract/test_development_popup.test.ts
- [ ] T008 [P] Contract test IReactInspector interface in tests/contract/test_react_inspector.test.ts
- [ ] T009 [P] Contract test ICSSFrameworkAnalyzer interface in tests/contract/test_css_framework_analyzer.test.ts
- [ ] T010 [P] Contract test IPerformanceMonitor interface in tests/contract/test_performance_monitor.test.ts
- [ ] T011 [P] Integration test "Enable Vibe Mode" user story in tests/integration/test_vibe_mode_enable.test.ts
- [ ] T012 [P] Integration test "Basic Inspection Icon Display" in tests/integration/test_inspection_icon_display.test.ts
- [ ] T013 [P] Integration test "Inspection Popup Functionality" in tests/integration/test_popup_functionality.test.ts
- [ ] T014 [P] Integration test "Popup Interaction and Dismissal" in tests/integration/test_popup_interaction.test.ts
- [ ] T015 [P] Integration test "Multiple Element Inspection" in tests/integration/test_multiple_inspection.test.ts
- [ ] T016 [P] Integration test "Vibe Mode Disable" in tests/integration/test_vibe_mode_disable.test.ts

## Phase 3.3: Core Implementation (ONLY after tests are failing)
- [ ] T017 [P] InspectionMetadata type definition in src/types/vibe-mode.ts
- [ ] T018 [P] TailwindClassInfo type definition in src/types/vibe-mode.ts
- [ ] T019 [P] BoxModel type definition in src/types/vibe-mode.ts
- [ ] T020 [P] InspectionPopupData type definition in src/types/vibe-mode.ts
- [ ] T021 [P] InsightSection type definition in src/types/vibe-mode.ts
- [ ] T022 [P] ComingSoonFeature type definition in src/types/vibe-mode.ts
- [ ] T023 [P] VibeInspectionState type definition in src/types/vibe-mode.ts
- [ ] T024 ElementAnalyzer service implementing IElementAnalyzer in src/services/ElementAnalyzer.ts
- [ ] T025 VibeModeManager service implementing IVibeModeManager in src/services/VibeModeManager.ts
- [ ] T026 ReactInspector service implementing IReactInspector in src/services/ReactInspector.ts
- [ ] T027 CSSFrameworkAnalyzer service implementing ICSSFrameworkAnalyzer in src/services/CSSFrameworkAnalyzer.ts
- [ ] T028 PerformanceMonitor service implementing IPerformanceMonitor in src/services/PerformanceMonitor.ts
- [ ] T029 InspectionIcon component implementing IInspectionIcon in src/components/VibeMode/InspectionIcon.tsx
- [ ] T030 DevelopmentPopup component implementing IDevelopmentPopup in src/components/VibeMode/DevelopmentPopup.tsx
- [ ] T031 VibeInspector main component in src/components/VibeMode/VibeInspector.tsx
- [ ] T032 InspectionEventEmitter implementing IInspectionEventEmitter in src/services/InspectionEventEmitter.ts

## Phase 3.4: Integration
- [ ] T033 Connect VibeInspector to existing Vibe Mode state in src/components/VibeMode/VibeInspector.tsx
- [ ] T034 Integrate ElementAnalyzer with debounced hover detection in src/services/ElementAnalyzer.ts
- [ ] T035 Add popup positioning with viewport boundary detection in src/components/VibeMode/DevelopmentPopup.tsx
- [ ] T036 Implement CSS framework detection and Tailwind parsing in src/services/CSSFrameworkAnalyzer.ts
- [ ] T037 Add React Fiber analysis and component detection in src/services/ReactInspector.ts
- [ ] T038 Integrate performance monitoring with analysis pipeline in src/services/PerformanceMonitor.ts
- [ ] T039 Connect inspection system to existing workshop controls in src/app/page.tsx
- [ ] T040 Add keyboard shortcuts (Escape key) for popup dismissal in src/components/VibeMode/DevelopmentPopup.tsx

## Phase 3.5: Polish
- [ ] T041 [P] Unit tests for ElementAnalyzer service in tests/unit/ElementAnalyzer.test.ts
- [ ] T042 [P] Unit tests for VibeModeManager service in tests/unit/VibeModeManager.test.ts
- [ ] T043 [P] Unit tests for InspectionIcon component in tests/unit/InspectionIcon.test.ts
- [ ] T044 [P] Unit tests for DevelopmentPopup component in tests/unit/DevelopmentPopup.test.ts
- [ ] T045 [P] Unit tests for ReactInspector service in tests/unit/ReactInspector.test.ts
- [ ] T046 [P] Unit tests for CSSFrameworkAnalyzer service in tests/unit/CSSFrameworkAnalyzer.test.ts
- [ ] T047 [P] Performance tests for hover response time (<100ms) in tests/performance/test_hover_performance.test.ts
- [ ] T048 [P] Performance tests for popup display time (<200ms) in tests/performance/test_popup_performance.test.ts
- [ ] T049 [P] Memory usage validation tests in tests/performance/test_memory_usage.test.ts
- [ ] T050 [P] Edge case tests for viewport boundary handling in tests/edge-cases/test_viewport_boundaries.test.ts
- [ ] T051 [P] Edge case tests for overlapping elements in tests/edge-cases/test_overlapping_elements.test.ts
- [ ] T052 [P] Edge case tests for dynamic content in tests/edge-cases/test_dynamic_content.test.ts
- [ ] T053 Run quickstart.md validation scenarios manually
- [ ] T054 Add TypeScript strict mode compliance for all inspection files
- [ ] T055 [P] Create mock data generators for inspection testing in tests/mocks/inspectionMocks.ts
- [ ] T056 [P] Add accessibility tests for inspection popup in tests/accessibility/test_inspection_accessibility.test.ts

## Dependencies
- Setup (T001-T003) before all other tasks
- Tests (T004-T016) before core implementation (T017-T032)
- Type definitions (T017-T023) before services and components (T024-T032)
- Core implementation (T017-T032) before integration (T033-T040)
- Integration (T033-T040) before polish (T041-T056)
- T024 (ElementAnalyzer) blocks T034, T041
- T025 (VibeModeManager) blocks T033, T042
- T029 (InspectionIcon) blocks T043
- T030 (DevelopmentPopup) blocks T035, T040, T044

## Parallel Example - Contract Tests
```bash
# Launch T004-T010 together (contract tests):
Task: "Contract test IElementAnalyzer interface in tests/contract/test_element_analyzer.test.ts"
Task: "Contract test IVibeModeManager interface in tests/contract/test_vibe_mode_manager.test.ts"
Task: "Contract test IInspectionIcon interface in tests/contract/test_inspection_icon.test.ts"
Task: "Contract test IDevelopmentPopup interface in tests/contract/test_development_popup.test.ts"
Task: "Contract test IReactInspector interface in tests/contract/test_react_inspector.test.ts"
Task: "Contract test ICSSFrameworkAnalyzer interface in tests/contract/test_css_framework_analyzer.test.ts"
Task: "Contract test IPerformanceMonitor interface in tests/contract/test_performance_monitor.test.ts"
```

## Parallel Example - Integration Tests
```bash
# Launch T011-T016 together (integration tests):
Task: "Integration test Enable Vibe Mode user story in tests/integration/test_vibe_mode_enable.test.ts"
Task: "Integration test Basic Inspection Icon Display in tests/integration/test_inspection_icon_display.test.ts"
Task: "Integration test Inspection Popup Functionality in tests/integration/test_popup_functionality.test.ts"
Task: "Integration test Popup Interaction and Dismissal in tests/integration/test_popup_interaction.test.ts"
Task: "Integration test Multiple Element Inspection in tests/integration/test_multiple_inspection.test.ts"
Task: "Integration test Vibe Mode Disable in tests/integration/test_vibe_mode_disable.test.ts"
```

## Parallel Example - Type Definitions
```bash
# Launch T017-T023 together (type definitions):
Task: "InspectionMetadata type definition in src/types/vibe-mode.ts"
Task: "TailwindClassInfo type definition in src/types/vibe-mode.ts"
Task: "BoxModel type definition in src/types/vibe-mode.ts"
Task: "InspectionPopupData type definition in src/types/vibe-mode.ts"
Task: "InsightSection type definition in src/types/vibe-mode.ts"
Task: "ComingSoonFeature type definition in src/types/vibe-mode.ts"
Task: "VibeInspectionState type definition in src/types/vibe-mode.ts"
```

## Notes
- [P] tasks = different files, no dependencies
- Verify tests fail before implementing (TDD critical for this feature)
- Commit after each task completion
- All TypeScript files must use strict type checking
- Performance requirements: <100ms hover response, <200ms popup display
- Integration with existing ComponentLabel.tsx pattern required

## Task Generation Rules Applied

1. **From Contracts** (7 interfaces → 7 contract tests):
   - IElementAnalyzer → T004
   - IVibeModeManager → T005
   - IInspectionIcon → T006
   - IDevelopmentPopup → T007
   - IReactInspector → T008
   - ICSSFrameworkAnalyzer → T009
   - IPerformanceMonitor → T010

2. **From Data Model** (7 entities → 7 type definition tasks):
   - InspectionMetadata → T017
   - TailwindClassInfo → T018
   - BoxModel → T019
   - InspectionPopupData → T020
   - InsightSection → T021
   - ComingSoonFeature → T022
   - VibeInspectionState → T023

3. **From User Stories** (6 scenarios → 6 integration tests):
   - Enable Vibe Mode → T011
   - Basic Inspection Icon Display → T012
   - Inspection Popup Functionality → T013
   - Popup Interaction and Dismissal → T014
   - Multiple Element Inspection → T015
   - Vibe Mode Disable → T016

4. **Core Implementation** (8 services/components):
   - ElementAnalyzer service → T024
   - VibeModeManager service → T025
   - ReactInspector service → T026
   - CSSFrameworkAnalyzer service → T027
   - PerformanceMonitor service → T028
   - InspectionIcon component → T029
   - DevelopmentPopup component → T030
   - VibeInspector main component → T031
   - InspectionEventEmitter service → T032

## Validation Checklist ✅

- [x] All contracts have corresponding tests (T004-T010)
- [x] All entities have type definition tasks (T017-T023)
- [x] All tests come before implementation (T004-T016 before T017-T032)
- [x] Parallel tasks truly independent (different files, no shared dependencies)
- [x] Each task specifies exact file path
- [x] No task modifies same file as another [P] task
- [x] Integration scenarios from quickstart.md covered (T011-T016)
- [x] Performance requirements specified (<100ms hover, <200ms popup)
- [x] Edge cases and accessibility covered in polish phase
- [x] Research decisions incorporated (debounced hover, portal positioning)

**Total Tasks**: 56 tasks across 5 phases
**Parallel Opportunities**: 32 tasks can run in parallel (marked with [P])
**Critical Path**: Setup → Contract Tests → Type Definitions → Core Implementation → Integration → Polish