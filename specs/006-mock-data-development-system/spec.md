# Feature Specification: Mock Data Development System

**Feature Branch**: `006-mock-data-development-system`
**Created**: September 18, 2025
**Status**: Implemented
**Input**: Consolidation of mock data system, convex migration plan, and development workflow specifications

## Execution Flow (main)
```
1. Analyzed existing YouTube scraper dataset
   ✓ 7 AI/tech videos from Wes Roth channel with comprehensive metadata
2. Designed Briefify-optimized schema
   ✓ Created briefify-schema.json compatible with future Convex integration
3. Built data processing pipeline
   ✓ jq transformations, bash automation scripts, individual file extraction
4. Established three-stage development workflow
   ✓ Stage 1: Mock data POC → Stage 2: Apify integration → Stage 3: Convex production
5. Created frontend integration patterns
   ✓ Data-agnostic components, mock detection logic, error handling
6. Documented migration strategy
   ✓ Complete Convex schema, API patterns, deployment checklist
```

## User Scenarios & Testing

### Primary User Journey (POC Stage)
```
As a developer building Briefify frontend
I want to work with realistic YouTube video data
So I can build and test UI components without API dependencies

GIVEN I'm developing the frontend
WHEN I load a sample video URL
THEN I get instant, consistent video data
AND I can test all UI states reliably
```

### Secondary User Journey (Demo Stage)
```
As a stakeholder viewing Briefify demo
I want to see realistic video analysis
So I can evaluate the product concept

GIVEN I'm viewing the demo
WHEN I select "Analyze Another Video"
THEN I see a curated list of sample videos
AND I can experience the full workflow
```

### Migration Journey (Future)
```
As a development team deploying to production
I want to migrate from mock to live data seamlessly
So users get real YouTube processing

GIVEN the POC is validated
WHEN we deploy Convex backend
THEN existing data structure works without changes
AND we can gradually transition users to live processing
```

## Functional Requirements

### FR-001: Mock Data Infrastructure
- **MUST** provide 7 curated AI/tech video samples
- **MUST** include complete metadata (video, channel, transcript, comments)
- **MUST** be accessible via static file serving
- **MUST** support instant loading for development

### FR-002: Data Schema Compatibility
- **MUST** use schema compatible with future Convex tables
- **MUST** include all fields needed for summary generation
- **MUST** support migration without data restructuring
- **SHOULD** include processing metadata for debugging

### FR-003: Frontend Integration
- **MUST** detect mock vs live video URLs
- **MUST** provide data-agnostic component interfaces
- **MUST** handle mock data loading errors gracefully
- **SHOULD** show clear indicators when using mock data

### FR-004: Development Workflow
- **MUST** support three-stage development progression
- **MUST** provide clear transition criteria between stages
- **MUST** maintain code organization for multi-stage development
- **SHOULD** enable parallel development of different stages

### FR-005: Migration Readiness
- **MUST** document complete Convex migration plan
- **MUST** provide database schema definitions
- **MUST** include API layer specifications
- **SHOULD** estimate migration timeline and complexity

## Key Entities

### VideoSample
```json
{
  "id": "string (YouTube video ID)",
  "title": "string",
  "description": "string",
  "author": "string",
  "publishDate": "ISO-8601",
  "duration": "number (seconds)",
  "viewCount": "number",
  "likeCount": "number",
  "category": "string",
  "thumbnails": "array of thumbnail objects"
}
```

### TranscriptSegment
```json
{
  "start": "number (milliseconds)",
  "end": "number (milliseconds)",
  "text": "string"
}
```

### CommentSample
```json
{
  "id": "string",
  "content": "string",
  "author": "string",
  "publishedDate": "ISO-8601",
  "likeCount": "number",
  "isCreator": "boolean",
  "isPinned": "boolean"
}
```

### QuickLoadReference
```json
{
  "id": "string",
  "url": "string (YouTube URL)",
  "title": "string",
  "author": "string",
  "category": "string",
  "duration": "string (formatted)",
  "views": "string (formatted)",
  "thumbnail": "string (URL)",
  "dataFile": "string (relative path)"
}
```

## Non-Functional Requirements

### Performance
- Mock data files **MUST** load in <100ms
- Individual video files **MUST** be <150KB each
- Quick-load reference **MUST** be <5KB
- Bundle impact **MUST** be minimal (<50KB added)

### Reliability
- Mock data **MUST** be available 100% of the time
- File structure **MUST** be consistent across environments
- Data format **MUST** be validated and error-free
- Fallback **MUST** exist for missing mock files

### Scalability
- Schema **MUST** support 1000+ videos in production
- Processing pipeline **MUST** handle batch operations
- Migration **MUST** scale to production database
- API patterns **MUST** support high concurrency

### Maintainability
- Data updates **MUST** be automatable via scripts
- Schema changes **MUST** be backward compatible
- Documentation **MUST** stay synchronized with implementation
- Code **MUST** support multi-stage development

## Technical Implementation

### File Structure
```
public/sample-videos/
├── {videoId}.json (7 individual video files)
├── video-catalog.json (comprehensive metadata)
└── quick-load.json (UI-optimized reference)

poc-assets/
├── briefify-schema.json (schema definition)
├── extract-video-samples.jq (transformation script)
└── process-youtube-data.sh (automation script)
```

### Processing Pipeline
```bash
# Data transformation workflow
Raw Apify JSON Array → jq Transform → Individual Files → Public Directory

# Commands used
jq -f extract-video-samples.jq input.json > output.json
chmod +x process-youtube-data.sh
./process-youtube-data.sh dataset.json
```

### Frontend Integration Pattern
```javascript
// Mock detection and loading
const videoId = extractVideoId(userInputUrl);
const quickLoadData = await fetch('/sample-videos/quick-load.json');
const isMockVideo = quickLoadData.quickLoadVideos.some(v => v.id === videoId);

if (isMockVideo) {
  const mockData = await fetch(`/sample-videos/${videoId}.json`);
  return transformMockData(mockData);
} else {
  return handleNonMockVideo(userInputUrl);
}
```

### Stage Transition Logic
```javascript
// Environment-aware data loading
const CONFIG = {
  development: { dataSource: 'mock' },
  staging: { dataSource: 'hybrid' }, // Mock + Apify
  production: { dataSource: 'convex' }
};

async function loadVideoData(url) {
  switch (CONFIG[environment].dataSource) {
    case 'mock': return loadMockData(url);
    case 'hybrid': return loadHybridData(url);
    case 'convex': return loadConvexData(url);
  }
}
```

## Migration Timeline

### Stage 1: POC with Mock Data (Current)
- ✅ Mock data system implemented
- ✅ 7 sample videos processed and available
- ✅ Schema designed for Convex compatibility
- 🔄 Frontend components using mock data
- 🔄 UI/UX validation with stakeholders

### Stage 2: Apify Integration (Week 3)
- Direct Apify calls via Vercel API routes
- Hybrid mock/live data strategy
- Extended error handling for API failures
- Real YouTube video processing testing

### Stage 3: Convex Production (Weeks 4-5)
- Full backend with database and analytics
- Server-side Apify processing
- User sessions and caching
- Production deployment and monitoring

## Success Criteria

### POC Success (Stage 1)
- [ ] All 7 mock videos load successfully
- [ ] Frontend components render with mock data
- [ ] URL input detects mock vs non-mock videos
- [ ] Demo presentation ready for stakeholders
- [ ] Mobile responsiveness validated

### Migration Success (Stage 3)
- [ ] All mock data successfully imported to Convex
- [ ] Frontend works with both mock and live data
- [ ] Performance meets production requirements
- [ ] Zero data loss during migration
- [ ] Rollback plan tested and functional

## Dependencies & Assumptions

### Dependencies
- Static file serving capability (Vercel)
- jq tool for JSON processing
- Frontend framework supporting dynamic imports
- Environment variable configuration

### Assumptions
- Sample videos remain accessible on YouTube
- Apify actor maintains consistent output format
- Convex schema supports planned data structure
- Development team follows three-stage progression

---

**Implementation Status**: ✅ Complete
**Next Phase**: Frontend component development
**Estimated Timeline**: Stage 1 (2 weeks) → Stage 2 (1 week) → Stage 3 (2 weeks)

**Development time with Claude Code**: ~45 minutes total
**Traditional hand coding**: ~6-8 hours (data processing, schema design, documentation, planning)
**Time saved**: ~5-7 hours using Claude Code automation