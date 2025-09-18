#!/bin/bash

# Script to process YouTube scraper data into individual video samples
# Usage: ./process-youtube-data.sh input.json

INPUT_FILE="$1"
OUTPUT_DIR="poc-assets/video-samples"

if [ -z "$INPUT_FILE" ]; then
    echo "Usage: $0 <input-json-file>"
    echo "Example: $0 poc-assets/json-sample/dataset_youtube-scraper_2025-09-18_16-24-11-952.json"
    exit 1
fi

if [ ! -f "$INPUT_FILE" ]; then
    echo "Error: Input file '$INPUT_FILE' not found"
    exit 1
fi

# Create output directory
mkdir -p "$OUTPUT_DIR"

echo "Processing YouTube data from: $INPUT_FILE"
echo "Output directory: $OUTPUT_DIR"

# Get number of videos
VIDEO_COUNT=$(jq 'length' "$INPUT_FILE")
echo "Found $VIDEO_COUNT videos"

# Extract each video as a separate file
for i in $(seq 0 $((VIDEO_COUNT - 1))); do
    VIDEO_ID=$(jq -r ".[$i].id" "$INPUT_FILE")
    OUTPUT_FILE="$OUTPUT_DIR/${VIDEO_ID}.json"

    echo "Extracting video $((i + 1))/$VIDEO_COUNT: $VIDEO_ID"

    # Extract single video and transform to briefify format
    jq ".[$i]" "$INPUT_FILE" | jq -f poc-assets/extract-video-samples.jq > "$OUTPUT_FILE"

    # Validate the output
    if jq empty "$OUTPUT_FILE" 2>/dev/null; then
        echo "✓ Created: $OUTPUT_FILE"
    else
        echo "✗ Error creating: $OUTPUT_FILE"
    fi
done

echo ""
echo "Processing complete!"
echo "Video samples saved to: $OUTPUT_DIR"
echo "Schema available at: poc-assets/briefify-schema.json"

# Create index file
INDEX_FILE="$OUTPUT_DIR/index.json"
echo "Creating index file: $INDEX_FILE"

jq '[.[] | {
    id: .id,
    title: .title,
    author: .author,
    publishDate: .publishDate,
    duration: .length,
    viewCount: .viewCount,
    filename: (.id + ".json")
}]' "$INPUT_FILE" > "$INDEX_FILE"

echo "✓ Created index: $INDEX_FILE"