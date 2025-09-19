# Quickstart: Application Refactor

**Time to Complete**: 5 minutes
**Prerequisites**: Node.js 18+, npm/yarn, Git

## 🚀 Developer Setup (New Contributors)

### 1. Clone and Install
```bash
# Clone repository
git clone [repository-url]
cd briefify.app

# Install dependencies
npm install

# Copy environment template
cp .env.example .env.local
```

### 2. Handle File Sync Conflicts (If Using OneDrive/Dropbox)

#### Option A: Exclude Build Directories
**OneDrive**:
1. Right-click OneDrive icon in system tray
2. Settings → Sync and backup → Manage backup
3. Add exclusions:
   - `.next`
   - `node_modules`
   - `.git`

**Dropbox**:
1. Preferences → Sync → Selective Sync
2. Uncheck the above directories

#### Option B: Move Project Outside Sync
```bash
# Move to non-synced location
cd C:\Projects  # or ~/Projects on Mac/Linux
git clone [repository-url]
```

### 3. Start Development Server
```bash
# Run with custom cache directory (if needed)
NEXT_BUILD_DIR=C:/temp/.next npm run dev

# Or standard run
npm run dev
```

### 4. Verify Setup
Open http://localhost:3000 and verify:
- ✅ Page loads without errors
- ✅ Can input YouTube URL
- ✅ Mock data loads correctly
- ✅ No console errors

## 🧪 Testing the Refactor

### Test 1: Error Boundaries
```javascript
// Trigger test error
// Navigate to: http://localhost:3000?test=error
// Expected: Error caught, fallback UI shown, app doesn't crash
```

### Test 2: Performance Monitoring
```javascript
// Open DevTools Console
// Expected output every 10 seconds:
// Performance: LCP=1234ms FID=45ms CLS=0.05
```

### Test 3: Build System
```bash
# Test production build
npm run build

# Expected: Build completes without file lock errors
# Time: <30 seconds
```

### Test 4: Mock Data Validation
```bash
# Test with missing mock data
rm public/sample-videos/quick-load.json
npm run dev

# Expected: Graceful error message, no crash
# Restore: git checkout public/sample-videos/quick-load.json
```

## 🔍 Verify Improvements

### Before Refactor Issues
- ❌ OneDrive file lock errors
- ❌ Uncaught errors crash app
- ❌ Slow page loads (>3s)
- ❌ No error recovery
- ❌ Poor developer experience

### After Refactor Success
- ✅ File conflicts handled
- ✅ All errors caught and logged
- ✅ Page loads <2s
- ✅ Graceful error recovery
- ✅ Clear setup documentation

## 📊 Performance Benchmarks

Run performance tests:
```bash
npm run test:performance
```

Expected results:
```
✓ Initial load: 1.8s (Target: <2s)
✓ Route transition: 250ms (Target: <300ms)
✓ Component render: 12ms (Target: <16ms)
✓ Bundle size: 420KB (Target: <500KB)
```

## 🛠️ Common Issues & Solutions

### Issue: "EPERM: operation not permitted"
**Solution**: OneDrive is locking files. See Step 2 above.

### Issue: Port 3000 already in use
**Solution**:
```bash
# Kill existing process
npx kill-port 3000
# Or use different port
PORT=3001 npm run dev
```

### Issue: Build cache corrupted
**Solution**:
```bash
# Clear all caches
rm -rf .next node_modules
npm install
npm run dev
```

### Issue: Mock data not loading
**Solution**: Ensure `/public/sample-videos/` directory exists with JSON files

## 🎯 Development Workflow

### 1. Before Making Changes
```bash
# Ensure clean state
git status
npm test
npm run lint
```

### 2. After Making Changes
```bash
# Run checks
npm run lint:fix
npm test
npm run build
```

### 3. Before Committing
```bash
# Pre-commit hooks run automatically
# If they fail:
npm run format
npm run lint:fix
```

## 📚 Key Files to Know

- **Error Handling**: `src/components/ErrorBoundary.tsx`
- **Performance**: `src/utils/performance.ts`
- **Build Config**: `next.config.js`
- **Mock Data**: `public/sample-videos/*.json`
- **Types**: `src/types/index.ts`

## ✅ Checklist for PR

Before submitting changes:
- [ ] All tests pass
- [ ] No TypeScript errors
- [ ] Performance benchmarks met
- [ ] Error boundaries added (if new component)
- [ ] Documentation updated (if needed)

## 🚨 Emergency Procedures

### App Won't Start
```bash
# Nuclear reset
rm -rf .next node_modules package-lock.json
npm install
npm run dev
```

### Performance Degradation
```bash
# Profile performance
npm run analyze
# Check bundle size
npm run bundle-analyze
```

### Debugging Errors
```javascript
// Enable verbose logging
localStorage.setItem('DEBUG', 'true');
window.location.reload();
// Check console for detailed logs
```

## 📞 Getting Help

1. Check `docs/troubleshooting.md`
2. Search existing issues
3. Ask in team chat with:
   - Error message
   - Steps to reproduce
   - Environment (OS, Node version)

---
**Questions?** This quickstart is maintained in `/specs/017-refactor-app/quickstart.md`