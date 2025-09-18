#!/bin/bash

# Extract all remaining videos
jq '.[1]' poc-assets/json-sample/dataset_youtube-scraper_2025-09-18_16-24-11-952.json | jq -f poc-assets/extract-video-samples.jq > poc-assets/video-samples/8s6nGMcyr7k.json
jq '.[2]' poc-assets/json-sample/dataset_youtube-scraper_2025-09-18_16-24-11-952.json | jq -f poc-assets/extract-video-samples.jq > poc-assets/video-samples/RLj9gKsGlzo.json
jq '.[3]' poc-assets/json-sample/dataset_youtube-scraper_2025-09-18_16-24-11-952.json | jq -f poc-assets/extract-video-samples.jq > poc-assets/video-samples/bZkz4mFXeuQ.json
jq '.[4]' poc-assets/json-sample/dataset_youtube-scraper_2025-09-18_16-24-11-952.json | jq -f poc-assets/extract-video-samples.jq > poc-assets/video-samples/zXztsSRh904.json
jq '.[5]' poc-assets/json-sample/dataset_youtube-scraper_2025-09-18_16-24-11-952.json | jq -f poc-assets/extract-video-samples.jq > poc-assets/video-samples/xZCbQM-hGa4.json
jq '.[6]' poc-assets/json-sample/dataset_youtube-scraper_2025-09-18_16-24-11-952.json | jq -f poc-assets/extract-video-samples.jq > poc-assets/video-samples/XIu7XmiTfag.json

echo "Extraction complete!"