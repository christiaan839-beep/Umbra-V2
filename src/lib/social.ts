import { ai } from "@/lib/ai";

interface PostResult {
  platform: string;
  status: "published" | "simulated";
  postId?: string;
  url?: string;
}

/** Publish a post to a platform (simulated — wire up Meta Graph API / X API in production) */
export async function publishPost({ platform, content }: { platform: string; content: string }): Promise<PostResult> {
  // In production: wire up Meta Graph API, X API, LinkedIn API
  console.log(`[Social] Publishing to ${platform}: ${content.slice(0, 80)}...`);
  return {
    platform,
    status: "simulated",
    postId: `post_${Date.now()}`,
    url: `https://${platform}.com/p/${Date.now()}`,
  };
}

/** Adapt content for multiple platforms and publish all */
export async function adaptAndPublish(
  content: string,
  platforms: string[]
): Promise<{ adaptations: Record<string, string>; results: PostResult[] }> {
  const adaptations: Record<string, string> = {};
  const results: PostResult[] = [];

  for (const platform of platforms) {
    const adapted = await ai(
      `Adapt this content for ${platform}. Keep the core message but optimize for the platform's format, tone, and character limits.\n\nOriginal:\n${content}`,
      { system: `You are a social media expert for ${platform}. Adapt content to maximize engagement on this specific platform. Include relevant hashtags.` }
    );
    adaptations[platform] = adapted;
    const result = await publishPost({ platform, content: adapted });
    results.push(result);
  }

  return { adaptations, results };
}
