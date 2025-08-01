import { mockQueries } from "@/services/mockData/queries.json";
import { openaiService } from "@/services/api/openaiService";

class QueryService {
  constructor() {
    this.queries = [...mockQueries];
  }

  async getAll() {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 300));
    return [...this.queries];
  }

  async getById(id) {
    await new Promise(resolve => setTimeout(resolve, 200));
    const query = this.queries.find(q => q.Id === parseInt(id));
    if (!query) {
      throw new Error("Query not found");
    }
    return { ...query };
  }

  async getByClient(clientId) {
    await new Promise(resolve => setTimeout(resolve, 250));
    return this.queries.filter(q => q.clientId === parseInt(clientId)).map(q => ({ ...q }));
  }

  async getByExpert(expertId) {
    await new Promise(resolve => setTimeout(resolve, 250));
    return this.queries.filter(q => q.expertId === parseInt(expertId)).map(q => ({ ...q }));
  }

async create(queryData) {
    try {
      // Generate AI response using OpenAI
      const aiResponse = await openaiService.generateResponse(
        queryData.question,
        '', // Context can be added here if available
        queryData.subject
      );

      // Create embedding for the query for future similarity search
      const queryEmbedding = await openaiService.createEmbedding(queryData.question);

      const sources = [
        "AI-Generated Response",
        "Expert Knowledge Integration",
        "Professional Best Practices"
      ];
      
      const newQuery = {
        ...queryData,
        Id: Math.max(...this.queries.map(q => q.Id)) + 1,
        response: aiResponse.response,
        sources: sources,
        timestamp: new Date().toISOString(),
        embedding: queryEmbedding.embedding,
        aiMetadata: {
          model: aiResponse.model,
          usage: aiResponse.usage,
          embeddingModel: queryEmbedding.model
        }
      };
      
      this.queries.push(newQuery);
      return { ...newQuery };
    } catch (error) {
      console.error('Error creating AI response:', error);
      
      // Fallback to mock response if OpenAI fails
      const fallbackResponses = {
        "Leadership": "Based on leadership best practices, I recommend focusing on developing your emotional intelligence, communication skills, and decision-making abilities. Start by setting clear expectations, providing regular feedback, and leading by example. Remember that great leaders inspire others through their actions and vision.",
        "Business Strategy": "For effective business strategy, begin with a thorough market analysis and competitive assessment. Define your unique value proposition and identify your target customer segments. Develop strategic objectives that align with your mission and create measurable milestones to track progress.",
        "Health & Wellness": "A holistic approach to health and wellness includes proper nutrition, regular exercise, adequate sleep, and stress management. Focus on creating sustainable habits rather than dramatic changes. Listen to your body and consult with healthcare professionals for personalized advice.",
        "Technology": "In today's digital landscape, staying current with technology trends is crucial. Focus on understanding how technology can solve real business problems rather than adopting technology for its own sake. Prioritize user experience and data security in all implementations.",
        "Personal Development": "Personal development is a continuous journey of self-improvement. Set clear goals, develop good habits, and maintain a growth mindset. Seek feedback from others, read regularly, and step outside your comfort zone to accelerate your growth.",
        "General": "Thank you for your question. Based on the available expert knowledge, I recommend taking a systematic approach to address your concern. Consider breaking down the problem into smaller, manageable parts and seeking additional resources or expert guidance as needed."
      };

      const sources = [
        "Expert Knowledge Base",
        "Professional Development Resources",
        "Industry Best Practices"
      ];
      
      const newQuery = {
        ...queryData,
        Id: Math.max(...this.queries.map(q => q.Id)) + 1,
        response: fallbackResponses[queryData.subject] || fallbackResponses["General"],
        sources: sources.slice(0, Math.floor(Math.random() * 3) + 1),
        timestamp: new Date().toISOString(),
        isFromFallback: true,
        error: error.message
      };
      
      this.queries.push(newQuery);
      return { ...newQuery };
    }
  }

  // New method to search similar queries using embeddings
  async findSimilarQueries(queryText, threshold = 0.7) {
    try {
      const queryEmbedding = await openaiService.createEmbedding(queryText);
      
      const queriesWithEmbeddings = this.queries.filter(q => q.embedding);
      const similarities = queriesWithEmbeddings.map(query => ({
        query,
        similarity: openaiService.calculateCosineSimilarity(
          queryEmbedding.embedding,
          query.embedding
        )
      }));

      return similarities
        .filter(item => item.similarity >= threshold)
        .sort((a, b) => b.similarity - a.similarity)
        .map(item => item.query);
    } catch (error) {
      console.error('Error finding similar queries:', error);
      return [];
    }
  }

  // New method to create embeddings for existing content
  async createContentEmbeddings(contentItems) {
    try {
      const texts = contentItems.map(item => 
        typeof item === 'string' ? item : item.content || item.description || ''
      );
      
      const embeddings = await openaiService.createMultipleEmbeddings(texts);
      
      return contentItems.map((item, index) => ({
        ...item,
        embedding: embeddings.embeddings[index]
      }));
    } catch (error) {
      console.error('Error creating content embeddings:', error);
      return contentItems;
    }
  }

  async update(id, queryData) {
    await new Promise(resolve => setTimeout(resolve, 350));
    
    const index = this.queries.findIndex(q => q.Id === parseInt(id));
    if (index === -1) {
      throw new Error("Query not found");
    }
    
    this.queries[index] = { ...this.queries[index], ...queryData };
    return { ...this.queries[index] };
  }

  async delete(id) {
    await new Promise(resolve => setTimeout(resolve, 300));
    
    const index = this.queries.findIndex(q => q.Id === parseInt(id));
    if (index === -1) {
      throw new Error("Query not found");
    }
    
    this.queries.splice(index, 1);
    return true;
  }

  async getAnalytics(expertId = null, startDate = null, endDate = null) {
    await new Promise(resolve => setTimeout(resolve, 400));
    
    let filteredQueries = [...this.queries];
    
    if (expertId) {
      filteredQueries = filteredQueries.filter(q => q.expertId === parseInt(expertId));
    }
    
    if (startDate) {
      filteredQueries = filteredQueries.filter(q => new Date(q.timestamp) >= new Date(startDate));
    }
    
    if (endDate) {
      filteredQueries = filteredQueries.filter(q => new Date(q.timestamp) <= new Date(endDate));
    }
    
    const totalQueries = filteredQueries.length;
    const totalCredits = filteredQueries.reduce((sum, q) => sum + q.creditsUsed, 0);
    const subjectBreakdown = filteredQueries.reduce((acc, q) => {
      acc[q.subject] = (acc[q.subject] || 0) + 1;
      return acc;
    }, {});
    
    return {
      totalQueries,
      totalCredits,
      subjectBreakdown,
      queries: filteredQueries
    };
  }
}

export const queryService = new QueryService();