# Data Model: Vibe Mode Quick Inspect

**Feature**: 019-vibe-mode-quick
**Date**: September 20, 2025

## Entity Definitions

### 1. InspectionMetadata
**Purpose**: Comprehensive data structure containing all analysis information for a DOM element

```typescript
interface InspectionMetadata {
  // Basic DOM information
  element: {
    tagName: string
    id?: string
    classes: string[]
    attributes: Record<string, string>
    textContent?: string
  }

  // Computed styling information
  styles: {
    display: string
    position: string
    zIndex: string
    backgroundColor: string
    color: string
    dimensions: DOMRect
    boxModel: BoxModel
  }

  // React component information (when available)
  react?: {
    componentName?: string
    props?: Record<string, any>
    state?: any
    hooks?: HookInfo[]
    fiberNode?: any
  }

  // CSS framework analysis
  cssFramework: {
    tailwindClasses: TailwindClassInfo[]
    customClasses: string[]
    cssVariables: Record<string, string>
  }

  // Layout and positioning
  layout: {
    positioning: PositioningInfo
    flexbox?: FlexboxInfo
    grid?: GridInfo
    parentChain: ElementInfo[]
    children: ElementInfo[]
  }

  // Inspection metadata
  inspection: {
    timestamp: number
    analysisLevel: 'basic' | 'detailed' | 'comprehensive'
    isVisible: boolean
    isInteractive: boolean
  }
}
```

### 2. TailwindClassInfo
**Purpose**: Structured representation of Tailwind CSS classes with semantic meaning

```typescript
interface TailwindClassInfo {
  className: string
  category: 'spacing' | 'sizing' | 'colors' | 'layout' | 'typography' | 'effects'
  property: string
  value: string
  responsive?: 'sm' | 'md' | 'lg' | 'xl' | '2xl'
  pseudoClass?: 'hover' | 'focus' | 'active' | 'disabled'
  cssProperty: string
  cssValue: string
}
```

### 3. BoxModel
**Purpose**: Complete box model information for layout analysis

```typescript
interface BoxModel {
  content: DOMRect
  padding: {
    top: string
    right: string
    bottom: string
    left: string
  }
  border: {
    top: string
    right: string
    bottom: string
    left: string
  }
  margin: {
    top: string
    right: string
    bottom: string
    left: string
  }
}
```

### 4. InspectionPopupData
**Purpose**: Data structure for rendering the developer insights popup

```typescript
interface InspectionPopupData {
  target: Element
  metadata: InspectionMetadata
  position: PopupPosition
  content: {
    primary: InsightSection[]
    secondary: InsightSection[]
    comingSoon: ComingSoonFeature[]
  }
  settings: {
    showAdvanced: boolean
    includeReactInfo: boolean
    includeCSSAnalysis: boolean
    includePerformanceMetrics: boolean
  }
}
```

### 5. InsightSection
**Purpose**: Structured content sections for the inspection popup

```typescript
interface InsightSection {
  id: string
  title: string
  priority: 'high' | 'medium' | 'low'
  type: 'info' | 'warning' | 'error' | 'tip'
  content: {
    summary: string
    details?: string[]
    codeSnippet?: string
    links?: { text: string; url: string }[]
  }
  category: 'component' | 'styling' | 'performance' | 'accessibility' | 'layout'
}
```

### 6. ComingSoonFeature
**Purpose**: Future features to display in "Coming Soon" section

```typescript
interface ComingSoonFeature {
  id: string
  title: string
  description: string
  category: 'analytics' | 'feedback' | 'ai-insights' | 'performance' | 'collaboration'
  estimatedRelease?: string
  priority: 'high' | 'medium' | 'low'
  dependencies?: string[]
}
```

### 7. VibeInspectionState
**Purpose**: Global state management for the inspection system

```typescript
interface VibeInspectionState {
  isEnabled: boolean
  currentTarget?: Element
  activePopup?: InspectionPopupData
  hoveredElement?: Element
  settings: {
    showOnHover: boolean
    analysisLevel: 'basic' | 'detailed' | 'comprehensive'
    autoPosition: boolean
    keyboardShortcuts: boolean
    debugMode: boolean
  }
  cache: Map<Element, InspectionMetadata>
  performance: {
    analysisCount: number
    averageAnalysisTime: number
    cacheHitRate: number
  }
}
```

## Data Relationships

### Entity Relationships
```
VibeInspectionState (1) ─── (0..1) InspectionPopupData
InspectionPopupData (1) ─── (1) InspectionMetadata
InspectionMetadata (1) ─── (0..1) ReactComponentInfo
InspectionMetadata (1) ─── (*) TailwindClassInfo
InspectionMetadata (1) ─── (1) BoxModel
InspectionPopupData (1) ─── (*) InsightSection
InspectionPopupData (1) ─── (*) ComingSoonFeature
```

### State Transitions

#### Inspection Flow
1. **Idle** → **Hovering** (mouse enter element)
2. **Hovering** → **Analyzing** (debounce timeout reached)
3. **Analyzing** → **Ready** (analysis complete)
4. **Ready** → **Displaying** (icon clicked)
5. **Displaying** → **Idle** (popup closed)

#### Error States
- **Analyzing** → **Error** (analysis failed)
- **Error** → **Idle** (retry or dismiss)

## Validation Rules

### InspectionMetadata
- `element.tagName` must be valid HTML tag name
- `styles.dimensions` must have positive width/height
- `inspection.timestamp` must be valid Unix timestamp
- `react.componentName` must match React component naming conventions

### TailwindClassInfo
- `className` must match Tailwind CSS class patterns
- `category` must be one of predefined categories
- `responsive` breakpoint must be valid Tailwind breakpoint
- `cssProperty` and `cssValue` must be valid CSS

### InspectionPopupData
- `position` coordinates must be within viewport bounds
- `content.primary` must have at least one section
- `target` must be a valid DOM element

### VibeInspectionState
- `cache` size must not exceed 100 entries (performance constraint)
- `performance.analysisCount` must be non-negative
- `settings.analysisLevel` must be valid level

## Performance Considerations

### Cache Strategy
- **LRU Cache**: Maximum 100 analyzed elements
- **Cache Key**: Element reference + timestamp of last attribute change
- **Cache Invalidation**: On element attribute changes, removal from DOM

### Memory Management
- **Weak References**: Use WeakMap for element-to-metadata associations
- **Cleanup**: Automatic cleanup when elements are removed from DOM
- **Debouncing**: 100ms debounce for analysis to prevent excessive computation

### Analysis Levels
- **Basic**: DOM attributes, classes, basic computed styles
- **Detailed**: + React component info, Tailwind parsing
- **Comprehensive**: + full layout analysis, performance metrics

## Future Extensions

### Analytics Integration
- Track most inspected components
- Popular CSS patterns usage
- User interaction heatmaps

### AI Insights
- Component complexity analysis
- Accessibility recommendations
- Performance optimization suggestions

### Collaboration Features
- Share inspection snapshots
- Team component annotations
- Design system compliance checks

This data model provides a comprehensive foundation for the inspection system while maintaining performance through efficient caching and progressive enhancement.