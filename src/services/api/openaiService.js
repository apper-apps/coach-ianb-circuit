class OpenAIService {
  constructor() {
    // Note: In production, API key should be in environment variables
    // For now, this will need to be configured when deploying
    this.apiKey = import.meta.env.VITE_OPENAI_API_KEY || '';
    this.baseURL = 'https://api.openai.com/v1';
  }

  async generateResponse(query, context = '', subject = '') {
    if (!this.apiKey) {
      throw new Error('OpenAI API key not configured');
    }

    try {
      const systemPrompt = this.buildSystemPrompt(subject, context);
      
      const response = await fetch(`${this.baseURL}/chat/completions`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${this.apiKey}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          model: 'gpt-4',
          messages: [
            {
              role: 'system',
              content: systemPrompt
            },
            {
              role: 'user',
              content: query
            }
          ],
          max_tokens: 1000,
          temperature: 0.7,
        }),
      });

      if (!response.ok) {
        throw new Error(`OpenAI API error: ${response.status}`);
      }

      const data = await response.json();
      return {
        response: data.choices[0]?.message?.content || 'I apologize, but I could not generate a response at this time.',
        usage: data.usage,
        model: data.model
      };
    } catch (error) {
      console.error('OpenAI API Error:', error);
      throw error;
    }
  }

  async createEmbedding(text) {
    if (!this.apiKey) {
      throw new Error('OpenAI API key not configured');
    }

    try {
      const response = await fetch(`${this.baseURL}/embeddings`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${this.apiKey}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          model: 'text-embedding-3-small',
          input: text,
        }),
      });

      if (!response.ok) {
        throw new Error(`OpenAI Embedding API error: ${response.status}`);
      }

      const data = await response.json();
      return {
        embedding: data.data[0]?.embedding || [],
        usage: data.usage,
        model: data.model
      };
    } catch (error) {
      console.error('OpenAI Embedding API Error:', error);
      throw error;
    }
  }

  async createMultipleEmbeddings(texts) {
    if (!this.apiKey) {
      throw new Error('OpenAI API key not configured');
    }

    try {
      const response = await fetch(`${this.baseURL}/embeddings`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${this.apiKey}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          model: 'text-embedding-3-small',
          input: texts,
        }),
      });

      if (!response.ok) {
        throw new Error(`OpenAI Embedding API error: ${response.status}`);
      }

      const data = await response.json();
      return {
        embeddings: data.data.map(item => item.embedding),
        usage: data.usage,
        model: data.model
      };
    } catch (error) {
      console.error('OpenAI Embedding API Error:', error);
      throw error;
    }
  }

  buildSystemPrompt(subject, context) {
    const basePrompt = `You are an expert AI assistant specializing in providing helpful, accurate, and actionable advice. You should provide comprehensive responses that are practical and easy to understand.`;
    
    const subjectPrompts = {
      "Leadership": `${basePrompt} Focus on leadership development, team management, communication skills, and organizational behavior. Provide specific strategies and actionable steps.`,
      "Business Strategy": `${basePrompt} Focus on strategic planning, market analysis, competitive positioning, and business growth. Include frameworks and methodologies where relevant.`,
      "Health & Wellness": `${basePrompt} Focus on holistic health approaches including physical, mental, and emotional well-being. Provide evidence-based recommendations.`,
      "Technology": `${basePrompt} Focus on technology trends, digital transformation, and practical implementation strategies. Consider both technical and business perspectives.`,
      "Personal Development": `${basePrompt} Focus on self-improvement, skill development, goal setting, and personal growth strategies. Provide motivational and practical guidance.`
    };

    let prompt = subjectPrompts[subject] || basePrompt;
    
    if (context) {
      prompt += `\n\nAdditional context: ${context}`;
    }
    
    prompt += `\n\nPlease provide a helpful, detailed response that addresses the user's question directly and offers practical next steps.`;
    
    return prompt;
  }

  // Helper method to calculate cosine similarity between embeddings
  calculateCosineSimilarity(embedding1, embedding2) {
    if (embedding1.length !== embedding2.length) {
      throw new Error('Embeddings must have the same length');
    }

    let dotProduct = 0;
    let norm1 = 0;
    let norm2 = 0;

    for (let i = 0; i < embedding1.length; i++) {
      dotProduct += embedding1[i] * embedding2[i];
      norm1 += embedding1[i] * embedding1[i];
      norm2 += embedding2[i] * embedding2[i];
    }

    norm1 = Math.sqrt(norm1);
    norm2 = Math.sqrt(norm2);

    if (norm1 === 0 || norm2 === 0) {
      return 0;
    }

    return dotProduct / (norm1 * norm2);
  }

  // Helper method to find most similar embeddings
  findSimilarContent(queryEmbedding, contentEmbeddings, threshold = 0.7) {
    const similarities = contentEmbeddings.map((content, index) => ({
      index,
      similarity: this.calculateCosineSimilarity(queryEmbedding, content.embedding),
      content: content
    }));

    return similarities
      .filter(item => item.similarity >= threshold)
      .sort((a, b) => b.similarity - a.similarity);
  }
}

export const openaiService = new OpenAIService();