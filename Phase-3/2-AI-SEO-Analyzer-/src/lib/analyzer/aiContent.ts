import type { SeoData, ContentData } from "@/types/analyzer";

export interface AIKeywordResult {
  keywords: string[];
  missingKeywords: string[];
  competitorKeywords?: string[];
}

export interface AIFAQResult {
  questions: Array<{
    question: string;
    answer: string;
  }>;
}

export async function generateAIKeywords(
  seo: SeoData,
  content: ContentData,
  competitorContent?: string
): Promise<AIKeywordResult> {
  // If no API key, return static suggestions
  if (!process.env.OPENAI_API_KEY) {
    return getStaticKeywords(seo, content);
  }

  try {
    const prompt = `
      Analyze this webpage content and suggest SEO keywords:
      
      Title: ${seo.title.value || "Not set"}
      Meta Description: ${seo.metaDescription.value || "Not set"}
      H1 Headings: ${content.headings.h1Count}
      Total Headings: ${content.headings.totalCount}
      
      Based on this information, suggest:
      1. Primary keywords (3-5 main topics)
      2. Secondary keywords (5-8 related terms)
      3. Missing keywords (important terms not found)
      
      Return as JSON: { primary: [], secondary: [], missing: [] }
    `;

    const response = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${process.env.OPENAI_API_KEY}`,
      },
      body: JSON.stringify({
        model: "gpt-3.5-turbo",
        messages: [{ role: "user", content: prompt }],
        temperature: 0.7,
      }),
    });

    const data = await response.json();
    const result = JSON.parse(data.choices[0].message.content);
    
    return {
      keywords: [...result.primary, ...result.secondary],
      missingKeywords: result.missing || [],
    };
  } catch (error) {
    console.error("AI keyword generation failed:", error);
    return getStaticKeywords(seo, content);
  }
}

export async function generateAIFAQ(
  seo: SeoData,
  content: ContentData
): Promise<AIFAQResult> {
  // If no API key, return static FAQs
  if (!process.env.OPENAI_API_KEY) {
    return getStaticFAQs(seo, content);
  }

  try {
    const prompt = `
      Based on this webpage content, generate 3-5 frequently asked questions (FAQs) that users might have:
      
      Title: ${seo.title.value || "Not set"}
      Meta Description: ${seo.metaDescription.value || "Not set"}
      H1: ${content.headings.h1Count} headings found
      
      Generate FAQs that are relevant to the content topic.
      Each FAQ should have a question and a brief answer.
      
      Return as JSON: { faqs: [{ question: "", answer: "" }] }
    `;

    const response = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${process.env.OPENAI_API_KEY}`,
      },
      body: JSON.stringify({
        model: "gpt-3.5-turbo",
        messages: [{ role: "user", content: prompt }],
        temperature: 0.7,
      }),
    });

    const data = await response.json();
    const result = JSON.parse(data.choices[0].message.content);
    
    return {
      questions: result.faqs || [],
    };
  } catch (error) {
    console.error("AI FAQ generation failed:", error);
    return getStaticFAQs(seo, content);
  }
}

// Fallback static functions
function getStaticKeywords(seo: SeoData, content: ContentData): AIKeywordResult {
  const keywords: string[] = [];
  
  // Extract potential keywords from title
  if (seo.title.value) {
    const titleWords = seo.title.value.split(' ').filter(w => w.length > 3);
    keywords.push(...titleWords.slice(0, 3));
  }
  
  // Add generic keywords
  if (keywords.length < 5) {
    keywords.push("SEO optimization", "content strategy", "webpage analysis");
  }
  
  return {
    keywords,
    missingKeywords: ["target audience", "user intent", "conversion optimization"],
  };
}

function getStaticFAQs(seo: SeoData, content: ContentData): AIFAQResult {
  return {
    questions: [
      {
        question: `What is ${seo.title.value || "this page"} about?`,
        answer: `This page covers ${seo.title.value || "the main topic"} and provides relevant information.`,
      },
      {
        question: "Is this content up to date?",
        answer: "Regular updates are recommended to keep content fresh and relevant.",
      },
      {
        question: "How can I improve my SEO?",
        answer: "Focus on quality content, proper heading structure, and relevant keywords.",
      },
    ],
  };
}