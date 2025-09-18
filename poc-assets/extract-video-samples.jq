# JQ script to extract individual video samples from YouTube scraper data
# Usage: jq -f extract-video-samples.jq input.json

# Transform a single video object to briefify format
{
  video: {
    id: .id,
    title: .title,
    description: .description,
    author: .author,
    publishDate: .publishDate,
    duration: .length,
    viewCount: .viewCount,
    likeCount: .likeCount,
    category: .category,
    thumbnails: .thumbnails | map({
      url: .url,
      width: .width,
      height: .height
    })
  },
  channel: {
    id: .channelMetadata.id,
    title: .channelMetadata.title,
    description: .channelMetadata.description,
    subscriberCount: .channelMetadata.subscriberCount,
    avatar: .channelMetadata.avatar
  },
  transcript: .transcript | map({
    start: .start,
    end: .end,
    text: (.texts | join(" "))
  }),
  comments: {
    totalCount: .comments.totalCount,
    sample: (.comments.comments | .[0:50] | map({
      id: .id,
      content: .content,
      author: .authorDisplayName,
      publishedDate: .publishedDate,
      likeCount: .likeCount,
      isCreator: .isCreator,
      isPinned: .isPinned
    }))
  },
  metadata: {
    extractedAt: (now | strftime("%Y-%m-%dT%H:%M:%SZ")),
    source: "apify-youtube-scraper",
    processingVersion: "1.0.0"
  }
}