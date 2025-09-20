# Implementation Plan: Vibe Mode Quick Inspect

**Branch**: `019-vibe-mode-quick` | **Date**: September 20, 2025 | **Spec**: [spec.md](./spec.md)
**Input**: Feature specification from `/specs/019-vibe-mode-quick/spec.md`

## Execution Flow (/plan command scope)
```
1. Load feature spec from Input path
   → If not found: ERROR "No feature spec at {path}"
2. Fill Technical Context (scan for NEEDS CLARIFICATION)
   → Detect Project Type from context (web=frontend+backend, mobile=app+api)
   → Set Structure Decision based on project type
3. Fill the Constitution Check section based on the content of the constitution document.
4. Evaluate Constitution Check section below
   → If violations exist: Document in Complexity Tracking
   → If no justification possible: ERROR "Simplify approach first"
   → Update Progress Tracking: Initial Constitution Check
5. Execute Phase 0 → research.md
   → If NEEDS CLARIFICATION remain: ERROR "Resolve unknowns"
6. Execute Phase 1 → contracts, data-model.md, quickstart.md, agent-specific template file
7. Re-evaluate Constitution Check section
   → If new violations: Refactor design, return to Phase 1
   → Update Progress Tracking: Post-Design Constitution Check
8. Plan Phase 2 → Describe task generation approach (DO NOT create tasks.md)
9. STOP - Ready for /tasks command
```

**IMPORTANT**: The /plan command STOPS at step 7. Phases 2-4 are executed by other commands:
- Phase 2: /tasks command creates tasks.md
- Phase 3-4: Implementation execution (manual or via tools)

## Summary
Interactive inspection system for developers: When Vibe Mode is enabled, hovering over UI elements reveals inspection icons that display development insights in a popup, eliminating the need to open browser dev tools for quick component analysis.

## Technical Context
**Language/Version**: TypeScript/JavaScript (Next.js 15.5.3, React 19.0.0)
**Primary Dependencies**: Next.js, React, Tailwind CSS, Heroicons
**Storage**: N/A (stateless UI feature)
**Testing**: Jest/React Testing Library (standard Next.js setup)
**Target Platform**: Web browsers (modern JS/CSS support required)
**Project Type**: web (Next.js frontend application)
**Performance Goals**: <16ms hover response time, minimal layout thrash
**Constraints**: Must not interfere with existing UI interactions, lightweight DOM impact
**Scale/Scope**: All UI elements in application, extensible for future analytics integration
**User Context**: 019 (feature number)

## Constitution Check
*GATE: Must pass before Phase 0 research. Re-check after Phase 1 design.*

**Note**: Constitution file is template-only, no specific constitutional requirements identified. Standard development principles apply:
- Component-based architecture (follows existing React patterns)
- Minimal performance impact
- Clean separation of concerns
- Testable implementation

✅ **Initial Constitution Check: PASS** - No violations detected for UI enhancement feature

## Project Structure

### Documentation (this feature)
```
specs/019-vibe-mode-quick/
├── plan.md              # This file (/plan command output)
├── research.md          # Phase 0 output (/plan command)
├── data-model.md        # Phase 1 output (/plan command)
├── quickstart.md        # Phase 1 output (/plan command)
├── contracts/           # Phase 1 output (/plan command)
└── tasks.md             # Phase 2 output (/tasks command - NOT created by /plan)
```

### Source Code (repository root)
```
# Option 1: Single project (DEFAULT)
src/
├── components/
│   ├── VibeMode/
│   │   ├── InspectionIcon.tsx
│   │   ├── DevelopmentPopup.tsx
│   │   └── VibeInspector.tsx
│   └── ...existing components
├── hooks/
│   └── useVibeMode.ts
├── utils/
│   └── elementAnalysis.ts
└── types/
    └── vibe-mode.ts

tests/
├── contract/
├── integration/
└── unit/
    └── VibeMode/
```

**Structure Decision**: Option 1 (Single Next.js project) - matches existing codebase structure

## Phase 0: Outline & Research ✅

**Research Tasks Completed**:
1. ✅ React portal patterns for overlay positioning → Hybrid CSS/Portal approach recommended
2. ✅ DOM element analysis and metadata extraction techniques → Multi-layered analysis system
3. ✅ Popup positioning algorithms that handle viewport boundaries → Fixed positioning with boundary detection
4. ✅ Performance optimization for hover event handling → Debounced hover with CSS-first approach
5. ✅ Accessibility considerations for developer tool overlays → Developer tool exception pattern

**Output**: research.md with all research findings consolidated

## Phase 1: Design & Contracts ✅

### Completed Artifacts:
1. ✅ **data-model.md**: Comprehensive entity definitions with 7 main interfaces
   - InspectionMetadata (core analysis data)
   - TailwindClassInfo (CSS framework analysis)
   - InspectionPopupData (popup rendering data)
   - VibeInspectionState (global state management)
   - Validation rules and performance considerations

2. ✅ **contracts/inspection-api.ts**: Complete API contracts
   - 4 core service interfaces (IElementAnalyzer, IInspectionIcon, IDevelopmentPopup, IVibeModeManager)
   - Event system contracts with typed events
   - Integration contracts for React and CSS analysis
   - Error handling and configuration contracts

3. ✅ **quickstart.md**: User validation scenarios
   - 6-step implementation validation process
   - Edge case testing procedures
   - Performance and accessibility validation
   - Success criteria checklist
   - Troubleshooting guide

**Constitution Re-check**: ✅ PASS - No new violations introduced

## Phase 2: Task Planning Approach ✅
*This section describes what the /tasks command will do - DO NOT execute during /plan*

**Task Generation Strategy**:
- Load `.specify/templates/tasks-template.md` as base
- Generate tasks from Phase 1 design docs (contracts, data model, quickstart)
- Each contract interface → contract test task [P]
- Each data entity → TypeScript type definition task [P]
- Each user story from quickstart → integration test task
- Implementation tasks following TDD principles

**Detailed Task Breakdown Preview**:

### Foundation Tasks (Parallel Execution)
1. **Type Definitions** [P] - Create TypeScript interfaces from data-model.md
2. **Contract Tests** [P] - Test suites for each interface in inspection-api.ts
3. **Mock Data** [P] - Sample inspection data for testing

### Core Implementation Tasks (Sequential)
4. **Element Analyzer Service** - Implement IElementAnalyzer contract
5. **Vibe Mode Manager** - Implement IVibeModeManager contract
6. **CSS Framework Analyzer** - Implement ICSSFrameworkAnalyzer contract
7. **React Inspector** - Implement IReactInspector contract

### UI Component Tasks (Sequential)
8. **Inspection Icon Component** - Implement IInspectionIcon contract
9. **Development Popup Component** - Implement IDevelopmentPopup contract
10. **Popup Positioning System** - Viewport boundary handling logic

### Integration Tasks (Sequential)
11. **Vibe Mode Integration** - Connect with existing workshop controls
12. **Event System Setup** - Implement inspection event emitter
13. **Performance Monitoring** - Implement IPerformanceMonitor contract

### Testing & Validation Tasks (Parallel)
14. **Unit Tests** [P] - Component and service unit tests
15. **Integration Tests** [P] - Full user story validation from quickstart.md
16. **Performance Tests** [P] - Hover response time and memory usage validation

**Ordering Strategy**:
- **TDD First**: Contract tests before implementation
- **Dependency Order**: Types → Services → Components → Integration
- **Parallel Markers [P]**: Independent tasks for concurrent execution
- **Sequential Flow**: UI components depend on service implementations

**Estimated Output**: 16 numbered, ordered tasks in tasks.md with clear dependencies

**Critical Path**: Types → Element Analyzer → Vibe Mode Manager → Inspection Icon → Integration
**Parallel Streams**: Contract tests, Mock data, Performance monitoring can run independently

**IMPORTANT**: This phase is executed by the /tasks command, NOT by /plan

## Phase 3+: Future Implementation
*These phases are beyond the scope of the /plan command*

**Phase 3**: Task execution (/tasks command creates tasks.md)
**Phase 4**: Implementation (execute tasks.md following constitutional principles)
**Phase 5**: Validation (run tests, execute quickstart.md, performance validation)

## Complexity Tracking
*No constitutional violations identified - standard UI enhancement feature*

## Progress Tracking ✅
*This checklist is updated during execution flow*

**Phase Status**:
- [x] Phase 0: Research complete (/plan command)
- [x] Phase 1: Design complete (/plan command)
- [x] Phase 2: Task planning complete (/plan command - describe approach only)
- [ ] Phase 3: Tasks generated (/tasks command)
- [ ] Phase 4: Implementation complete
- [ ] Phase 5: Validation passed

**Gate Status**:
- [x] Initial Constitution Check: PASS
- [x] Post-Design Constitution Check: PASS
- [x] All NEEDS CLARIFICATION resolved
- [x] Complexity deviations documented (None required)

---
*Based on Constitution template - See `/.specify/memory/constitution.md`*
