import { openaiService } from "@/services/api/openaiService";

class QueryService {
  constructor() {
    // Initialize ApperClient with Project ID and Public Key
    const { ApperClient } = window.ApperSDK;
    this.apperClient = new ApperClient({
      apperProjectId: import.meta.env.VITE_APPER_PROJECT_ID,
      apperPublicKey: import.meta.env.VITE_APPER_PUBLIC_KEY
    });
    this.tableName = 'query';
  }

  async getAll() {
    try {
      const params = {
        fields: [
          { field: { Name: "Name" } },
          { field: { Name: "Tags" } },
          { field: { Name: "Owner" } },
          { field: { Name: "subject" } },
          { field: { Name: "question" } },
          { field: { Name: "response" } },
          { field: { Name: "sources" } },
          { field: { Name: "timestamp" } },
          { field: { Name: "creditsUsed" } },
          { field: { Name: "embedding" } },
          { field: { Name: "aiMetadata" } },
          { field: { Name: "isFromFallback" } },
          { field: { Name: "error" } },
          { field: { Name: "clientId" } },
          { field: { Name: "expertId" } }
        ],
        orderBy: [
          {
            fieldName: "timestamp",
            sorttype: "DESC"
          }
        ]
      };

      const response = await this.apperClient.fetchRecords(this.tableName, params);
      
      if (!response.success) {
        console.error(response.message);
        return [];
      }

      return response.data || [];
    } catch (error) {
      if (error?.response?.data?.message) {
        console.error("Error fetching queries:", error?.response?.data?.message);
      } else {
        console.error(error.message);
      }
      return [];
    }
  }

  async getById(id) {
    try {
      const params = {
        fields: [
          { field: { Name: "Name" } },
          { field: { Name: "Tags" } },
          { field: { Name: "Owner" } },
          { field: { Name: "subject" } },
          { field: { Name: "question" } },
          { field: { Name: "response" } },
          { field: { Name: "sources" } },
          { field: { Name: "timestamp" } },
          { field: { Name: "creditsUsed" } },
          { field: { Name: "embedding" } },
          { field: { Name: "aiMetadata" } },
          { field: { Name: "isFromFallback" } },
          { field: { Name: "error" } },
          { field: { Name: "clientId" } },
          { field: { Name: "expertId" } }
        ]
      };

      const response = await this.apperClient.getRecordById(this.tableName, id, params);
      
      if (!response.success) {
        console.error(response.message);
        return null;
      }

      return response.data;
} catch (error) {
      if (error?.response?.data?.message) {
        console.error(`Error fetching query with ID ${id}:`, error?.response?.data?.message);
      } else {
        console.error(error.message);
      }
      return null;
    }
  }

  async create(queryData) {
    try {
      // Only include Updateable fields
      const params = {
        records: [{
          Name: queryData.Name,
          Tags: queryData.Tags,
          Owner: parseInt(queryData.Owner?.Id || queryData.Owner),
          subject: queryData.subject,
          question: queryData.question,
          response: queryData.response,
          sources: queryData.sources,
          timestamp: queryData.timestamp || new Date().toISOString(),
          creditsUsed: parseInt(queryData.creditsUsed) || 0,
          embedding: queryData.embedding,
          aiMetadata: queryData.aiMetadata,
          isFromFallback: queryData.isFromFallback === true || queryData.isFromFallback === "true",
          error: queryData.error,
          clientId: parseInt(queryData.clientId?.Id || queryData.clientId),
          expertId: parseInt(queryData.expertId?.Id || queryData.expertId)
        }]
      };

      const response = await this.apperClient.createRecord(this.tableName, params);
      
      if (!response.success) {
        console.error(response.message);
        return null;
      }

      if (response.results) {
        const successfulRecords = response.results.filter(result => result.success);
        const failedRecords = response.results.filter(result => !result.success);
        
        if (failedRecords.length > 0) {
          console.error(`Failed to create ${failedRecords.length} query records:${JSON.stringify(failedRecords)}`);
          
          failedRecords.forEach(record => {
            record.errors?.forEach(error => {
              console.error(`${error.fieldLabel}: ${error.message}`);
            });
            if (record.message) console.error(record.message);
          });
        }
        
        return successfulRecords.length > 0 ? successfulRecords[0].data : null;
      }
    } catch (error) {
      if (error?.response?.data?.message) {
        console.error("Error creating query:", error?.response?.data?.message);
      } else {
        console.error(error.message);
      }
      return null;
    }
  }

  async update(id, queryData) {
    try {
      // Only include Updateable fields
      const params = {
        records: [{
          Id: id,
          Name: queryData.Name,
          Tags: queryData.Tags,
          Owner: parseInt(queryData.Owner?.Id || queryData.Owner),
          subject: queryData.subject,
          question: queryData.question,
          response: queryData.response,
          sources: queryData.sources,
          timestamp: queryData.timestamp,
          creditsUsed: parseInt(queryData.creditsUsed) || 0,
          embedding: queryData.embedding,
          aiMetadata: queryData.aiMetadata,
          isFromFallback: queryData.isFromFallback === true || queryData.isFromFallback === "true",
          error: queryData.error,
          clientId: parseInt(queryData.clientId?.Id || queryData.clientId),
          expertId: parseInt(queryData.expertId?.Id || queryData.expertId)
        }]
      };

      const response = await this.apperClient.updateRecord(this.tableName, params);
      
      if (!response.success) {
        console.error(response.message);
        return null;
      }

      if (response.results) {
        const successfulUpdates = response.results.filter(result => result.success);
        const failedUpdates = response.results.filter(result => !result.success);
        
        if (failedUpdates.length > 0) {
          console.error(`Failed to update ${failedUpdates.length} query records:${JSON.stringify(failedUpdates)}`);
          
          failedUpdates.forEach(record => {
            record.errors?.forEach(error => {
              console.error(`${error.fieldLabel}: ${error.message}`);
            });
            if (record.message) console.error(record.message);
          });
        }
        
        return successfulUpdates.length > 0 ? successfulUpdates[0].data : null;
      }
} catch (error) {
      if (error?.response?.data?.message) {
        console.error("Error updating query:", error?.response?.data?.message);
      } else {
        console.error(error.message);
      }
      return null;
    }
  }

  async delete(recordIds) {
    try {
      const params = {
        RecordIds: Array.isArray(recordIds) ? recordIds : [recordIds]
      };

      const response = await this.apperClient.deleteRecord(this.tableName, params);
      
      if (!response.success) {
        console.error(response.message);
        return false;
      }

      if (response.results) {
        const successfulDeletions = response.results.filter(result => result.success);
        const failedDeletions = response.results.filter(result => !result.success);
        
        if (failedDeletions.length > 0) {
          console.error(`Failed to delete ${failedDeletions.length} query records:${JSON.stringify(failedDeletions)}`);
          
          failedDeletions.forEach(record => {
            if (record.message) console.error(record.message);
          });
        }
        
        return successfulDeletions.length === params.RecordIds.length;
      }
    } catch (error) {
      if (error?.response?.data?.message) {
        console.error("Error deleting queries:", error?.response?.data?.message);
      } else {
        console.error(error.message);
      }
      return false;
    }
}
async getByClient(clientId) {
    try {
      const params = {
        fields: [
          { field: { Name: "Name" } },
          { field: { Name: "Tags" } },
          { field: { Name: "Owner" } },
          { field: { Name: "subject" } },
          { field: { Name: "question" } },
          { field: { Name: "response" } },
          { field: { Name: "sources" } },
          { field: { Name: "timestamp" } },
          { field: { Name: "creditsUsed" } },
          { field: { Name: "embedding" } },
          { field: { Name: "aiMetadata" } },
          { field: { Name: "isFromFallback" } },
          { field: { Name: "error" } },
          { field: { Name: "clientId" } },
          { field: { Name: "expertId" } }
        ],
        where: [
          {
            FieldName: "clientId",
            Operator: "EqualTo",
            Values: [parseInt(clientId)]
          }
        ],
        orderBy: [
          {
            fieldName: "timestamp",
            sorttype: "DESC"
          }
        ]
      };

      const response = await this.apperClient.fetchRecords(this.tableName, params);
      
      if (!response.success) {
        console.error(response.message);
        return [];
      }

      return response.data || [];
} catch (error) {
      if (error?.response?.data?.message) {
        console.error("Error fetching queries by client:", error?.response?.data?.message);
      } else {
        console.error(error.message);
      }
      return [];
    }
  }
  async getByExpert(expertId) {
    try {
      const params = {
        fields: [
          { field: { Name: "Name" } },
          { field: { Name: "subject" } },
          { field: { Name: "question" } },
          { field: { Name: "response" } },
          { field: { Name: "sources" } },
          { field: { Name: "timestamp" } },
          { field: { Name: "creditsUsed" } },
          { field: { Name: "clientId" } },
          { field: { Name: "expertId" } }
        ],
        where: [
          {
            FieldName: "expertId",
            Operator: "EqualTo",
            Values: [parseInt(expertId)]
          }
        ],
        orderBy: [
          {
            fieldName: "timestamp",
            sorttype: "DESC"
          }
        ]
      };

      const response = await this.apperClient.fetchRecords(this.tableName, params);
      
      if (!response.success) {
        console.error(response.message);
        return [];
      }

      return response.data || [];
    } catch (error) {
      if (error?.response?.data?.message) {
        console.error("Error fetching queries by expert:", error?.response?.data?.message);
      } else {
        console.error(error.message);
      }
      return [];
    }
  }

  async createWithAI(queryData) {
    try {
      let aiResponse, queryEmbedding;
      let isFromFallback = false;
      let errorMessage = null;
      
      try {
        aiResponse = await openaiService.generateResponse(
          queryData.question,
          '',
          queryData.subject
        );

        queryEmbedding = await openaiService.createEmbedding(queryData.question);
      } catch (error) {
        console.error('Error creating AI response:', error);
        isFromFallback = true;
        errorMessage = error.message;
        
        const fallbackResponses = {
          "Leadership": "Based on leadership best practices, I recommend focusing on developing your emotional intelligence, communication skills, and decision-making abilities. Start by setting clear expectations, providing regular feedback, and leading by example. Remember that great leaders inspire others through their actions and vision.",
          "Business Strategy": "For effective business strategy, begin with a thorough market analysis and competitive assessment. Define your unique value proposition and identify your target customer segments. Develop strategic objectives that align with your mission and create measurable milestones to track progress.",
          "Health & Wellness": "A holistic approach to health and wellness includes proper nutrition, regular exercise, adequate sleep, and stress management. Focus on creating sustainable habits rather than dramatic changes. Listen to your body and consult with healthcare professionals for personalized advice.",
          "Technology": "In today's digital landscape, staying current with technology trends is crucial. Focus on understanding how technology can solve real business problems rather than adopting technology for its own sake. Prioritize user experience and data security in all implementations.",
          "Personal Development": "Personal development is a continuous journey of self-improvement. Set clear goals, develop good habits, and maintain a growth mindset. Seek feedback from others, read regularly, and step outside your comfort zone to accelerate your growth.",
          "General": "Thank you for your question. Based on the available expert knowledge, I recommend taking a systematic approach to address your concern. Consider breaking down the problem into smaller, manageable parts and seeking additional resources or expert guidance as needed."
        };

        aiResponse = {
          response: fallbackResponses[queryData.subject] || fallbackResponses["General"]
        };
      }

      const sources = isFromFallback ? 
        ["Expert Knowledge Base", "Professional Development Resources", "Industry Best Practices"] :
        ["AI-Generated Response", "Expert Knowledge Integration", "Professional Best Practices"];
      
      const params = {
        records: [
          {
            Name: queryData.Name || `Query: ${queryData.question.substring(0, 50)}...`,
            subject: queryData.subject,
            question: queryData.question,
            response: aiResponse.response,
            sources: Array.isArray(sources) ? sources.join(',') : sources,
            timestamp: new Date().toISOString(),
            creditsUsed: queryData.creditsUsed || 1,
            embedding: queryEmbedding?.embedding ? JSON.stringify(queryEmbedding.embedding) : null,
            aiMetadata: aiResponse.model ? JSON.stringify({
              model: aiResponse.model,
              usage: aiResponse.usage,
              embeddingModel: queryEmbedding?.model
            }) : null,
            isFromFallback: isFromFallback,
            error: errorMessage,
            clientId: parseInt(queryData.clientId),
            expertId: parseInt(queryData.expertId)
          }
        ]
      };
      
      const response = await this.apperClient.createRecord(this.tableName, params);
      
      if (!response.success) {
        console.error(response.message);
        return null;
      }
      
      if (response.results) {
        const successfulRecords = response.results.filter(result => result.success);
        const failedRecords = response.results.filter(result => !result.success);
        
        if (failedRecords.length > 0) {
          console.error(`Failed to create query ${failedRecords.length} records:${JSON.stringify(failedRecords)}`);
          
          failedRecords.forEach(record => {
            record.errors?.forEach(error => {
              console.error(`${error.fieldLabel}: ${error.message}`);
            });
            if (record.message) console.error(record.message);
          });
        }
        
        return successfulRecords.length > 0 ? successfulRecords[0].data : null;
      }
    } catch (error) {
      if (error?.response?.data?.message) {
        console.error("Error creating query:", error?.response?.data?.message);
      } else {
        console.error(error.message);
      }
      return null;
    }
  }

  async findSimilarQueries(queryText, threshold = 0.7) {
    try {
      const queryEmbedding = await openaiService.createEmbedding(queryText);
      
      const params = {
        fields: [
          { field: { Name: "Name" } },
          { field: { Name: "subject" } },
          { field: { Name: "question" } },
          { field: { Name: "response" } },
          { field: { Name: "embedding" } }
        ],
        where: [
          {
            FieldName: "embedding",
            Operator: "HasValue",
            Values: []
          }
        ]
      };

      const response = await this.apperClient.fetchRecords(this.tableName, params);
      
      if (!response.success) {
        return [];
      }

      const queriesWithEmbeddings = response.data || [];
      const similarities = queriesWithEmbeddings.map(query => {
        let embedding;
        try {
          embedding = JSON.parse(query.embedding);
        } catch (e) {
          return null;
        }

        return {
          query,
          similarity: openaiService.calculateCosineSimilarity(
            queryEmbedding.embedding,
            embedding
          )
        };
      }).filter(item => item !== null);

      return similarities
        .filter(item => item.similarity >= threshold)
        .sort((a, b) => b.similarity - a.similarity)
        .map(item => item.query);
    } catch (error) {
      console.error('Error finding similar queries:', error);
      return [];
    }
  }

  async getAnalytics(expertId = null, startDate = null, endDate = null) {
    try {
      let where = [];
      
      if (expertId) {
        where.push({
          FieldName: "expertId",
          Operator: "EqualTo",
          Values: [parseInt(expertId)]
        });
      }
      
      if (startDate) {
        where.push({
          FieldName: "timestamp",
          Operator: "GreaterThanOrEqualTo",
          Values: [startDate]
        });
      }
      
      if (endDate) {
        where.push({
          FieldName: "timestamp",
          Operator: "LessThanOrEqualTo",
          Values: [endDate]
        });
      }

      const params = {
        fields: [
          { field: { Name: "subject" } },
          { field: { Name: "creditsUsed" } },
          { field: { Name: "timestamp" } }
        ],
        where: where.length > 0 ? where : undefined
      };

      const response = await this.apperClient.fetchRecords(this.tableName, params);
      
      if (!response.success) {
        console.error(response.message);
        return {
          totalQueries: 0,
          totalCredits: 0,
          subjectBreakdown: {},
          queries: []
        };
      }

      const filteredQueries = response.data || [];
      const totalQueries = filteredQueries.length;
      const totalCredits = filteredQueries.reduce((sum, q) => sum + (q.creditsUsed || 0), 0);
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
    } catch (error) {
      if (error?.response?.data?.message) {
        console.error("Error fetching analytics:", error?.response?.data?.message);
      } else {
        console.error(error.message);
      }
      return {
        totalQueries: 0,
        totalCredits: 0,
        subjectBreakdown: {},
        queries: []
      };
    }
  }
}

export const queryService = new QueryService();