import * as cheerio from "cheerio";

export interface SchemaData {
  hasSchema: boolean;
  types: string[];
  count: number;
  details: Array<{
    type: string;
    properties: Record<string, any>;
  }>;
}

export function parseSchema(html: string): SchemaData {
  const $ = cheerio.load(html);
  const details: Array<{ type: string; properties: Record<string, any> }> = [];
  const types: string[] = [];

  $('script[type="application/ld+json"]').each((_, el) => {
    try {
      const content = $(el).html();
      if (!content) return;
      
      const data = JSON.parse(content);
      
      // Handle single schema
      if (data['@type']) {
        types.push(data['@type']);
        details.push({
          type: data['@type'],
          properties: data,
        });
      }
      
      // Handle @graph (multiple schemas)
      if (data['@graph'] && Array.isArray(data['@graph'])) {
        data['@graph'].forEach((item: any) => {
          if (item['@type']) {
            types.push(item['@type']);
            details.push({
              type: item['@type'],
              properties: item,
            });
          }
        });
      }
    } catch {
      // Invalid JSON - skip
    }
  });

  return {
    hasSchema: details.length > 0,
    types,
    count: details.length,
    details,
  };
}

export function getSchemaRecommendations(schemaData: SchemaData): string[] {
  const recommendations: string[] = [];
  
  if (!schemaData.hasSchema) {
    recommendations.push("Add structured data (JSON-LD) to help search engines understand your content");
    recommendations.push("Consider implementing Article schema for blog posts");
    recommendations.push("Consider implementing Product schema for e-commerce pages");
    recommendations.push("Consider implementing FAQ schema for Q&A content");
    return recommendations;
  }

  // Check if FAQ schema is missing
  if (!schemaData.types.some(t => t.toLowerCase().includes('faq'))) {
    recommendations.push("Add FAQ schema to improve visibility in search results");
  }

  // Check if Article schema is missing
  if (!schemaData.types.some(t => t.toLowerCase().includes('article') || t.toLowerCase().includes('blog'))) {
    recommendations.push("Add Article schema for better content representation");
  }

  // Check if Product schema is missing
  if (!schemaData.types.some(t => t.toLowerCase().includes('product'))) {
    recommendations.push("Add Product schema if you're selling products");
  }

  return recommendations;
}