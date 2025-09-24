import { getGlobalConfig } from '@server/routerTrpc/config';
import { createTool } from '@mastra/core/tools';
import { tavily } from '@tavily/core';
import { z } from 'zod/v3';

export const webExtra = createTool({
  id: 'jina-web-crawler-tool',
  description: 'You are a web scraping assistant who can use the Jina API to crawl and analyze web content',
  inputSchema: z.object({
    urls: z.array(z.string()).describe('The URLs of the web page to crawl'),
  }) as any,
  execute: async ({ context }) => {
    try {
      const config = await getGlobalConfig({ useAdmin: true })
      console.log('config', config.tavilyApiKey)
      if (!config.tavilyApiKey) {
        return 'No tavily api key found,go to settings to set it "tavilyApiKey"'
      }
      const client = tavily({ apiKey: config.tavilyApiKey });
      const res = await client.extract(context.urls, {
        max_results: config?.tavilyMaxResult ?? 5,
        with_images: true
      })
      console.log('res', res)
      return res
    } catch (error) {
      return error.message;
    }
  }
});