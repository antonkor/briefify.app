- always show dev estimates in commits
- for the dev estimate include how long we worked on the project and how much time we saved.
- create local logging into session notes before creating commit message
# important-instruction-reminders
Do what has been asked; nothing more, nothing less.
NEVER create files unless they're absolutely necessary for achieving your goal.
ALWAYS prefer editing an existing file to creating a new one.
NEVER proactively create documentation files (*.md) or README files. Only create documentation files if explicitly requested by the User.

## Refactoring Guidelines (spec 017)

### File System Conflicts
- Check for OneDrive/Dropbox in path: `process.cwd().includes('OneDrive')`
- Use custom cache directories when sync services detected
- Always clean `.next` directory if permission errors occur

### Error Handling Pattern
```typescript
// Wrap components with error boundaries
<ErrorBoundary fallback={<ErrorFallback />}>
  <Component />
</ErrorBoundary>
```

### Performance Monitoring
- Track Core Web Vitals (LCP, FID, CLS)
- Component render time target: <16ms
- Page load target: <2s

### Build Optimization
- Set `NEXT_BUILD_DIR` for custom cache location
- Run `rm -rf .next` for corrupted cache
- Use `npm run build` to test production builds

### Mock Data Validation
- Always validate mock JSON before parsing
- Provide fallback data for missing files
- Log validation errors without crashing

### Testing Requirements
- Error boundaries: 100% coverage
- Data validation: 100% coverage
- Performance: Benchmark before/after changes