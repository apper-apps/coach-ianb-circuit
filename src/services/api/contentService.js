import { toast } from 'react-toastify';

class ContentService {
  constructor() {
    const { ApperClient } = window.ApperSDK;
    this.apperClient = new ApperClient({
      apperProjectId: import.meta.env.VITE_APPER_PROJECT_ID,
      apperPublicKey: import.meta.env.VITE_APPER_PUBLIC_KEY
    });
    this.tableName = 'content';
  }

  async getAll() {
    try {
      const params = {
        fields: [
          { field: { Name: "Name" } },
          { field: { Name: "title" } },
          { field: { Name: "type" } },
          { field: { Name: "fileUrl" } },
          { field: { Name: "subject" } },
          { field: { Name: "uploadedAt" } },
          { field: { Name: "metadata" } },
          { field: { Name: "transcription" } },
          { field: { Name: "hasTranscription" } },
          { field: { Name: "transcriptionUpdatedAt" } },
          { field: { Name: "smeId" } }
        ],
        orderBy: [
          {
            fieldName: "uploadedAt",
            sorttype: "DESC"
          }
        ]
      };

      const response = await this.apperClient.fetchRecords(this.tableName, params);
      
      if (!response.success) {
        console.error(response.message);
        toast.error(response.message);
        return [];
      }

      return response.data || [];
    } catch (error) {
      if (error?.response?.data?.message) {
        console.error("Error fetching content:", error?.response?.data?.message);
      } else {
        console.error(error.message);
      }
      return [];
    }
  }

  async getById(recordId) {
    try {
      const params = {
        fields: [
          { field: { Name: "Name" } },
          { field: { Name: "title" } },
          { field: { Name: "type" } },
          { field: { Name: "fileUrl" } },
          { field: { Name: "subject" } },
          { field: { Name: "uploadedAt" } },
          { field: { Name: "metadata" } },
          { field: { Name: "transcription" } },
          { field: { Name: "hasTranscription" } },
          { field: { Name: "transcriptionUpdatedAt" } },
          { field: { Name: "smeId" } }
        ]
      };
      
      const response = await this.apperClient.getRecordById(this.tableName, recordId, params);
      
      if (!response || !response.data) {
        return null;
      } else {
        return response.data;
      }
    } catch (error) {
      if (error?.response?.data?.message) {
        console.error(`Error fetching content with ID ${recordId}:`, error?.response?.data?.message);
      } else {
        console.error(error.message);
      }
      return null;
    }
  }

  async getBySME(smeId) {
    try {
      const params = {
        fields: [
          { field: { Name: "Name" } },
          { field: { Name: "title" } },
          { field: { Name: "type" } },
          { field: { Name: "fileUrl" } },
          { field: { Name: "subject" } },
          { field: { Name: "uploadedAt" } },
          { field: { Name: "metadata" } },
          { field: { Name: "hasTranscription" } },
          { field: { Name: "smeId" } }
        ],
        where: [
          {
            FieldName: "smeId",
            Operator: "EqualTo",
            Values: [parseInt(smeId)]
          }
        ],
        orderBy: [
          {
            fieldName: "uploadedAt",
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
        console.error("Error fetching content by SME:", error?.response?.data?.message);
      } else {
        console.error(error.message);
      }
      return [];
    }
  }

  async getBySubject(subject) {
    try {
      const params = {
        fields: [
          { field: { Name: "Name" } },
          { field: { Name: "title" } },
          { field: { Name: "type" } },
          { field: { Name: "fileUrl" } },
          { field: { Name: "subject" } },
          { field: { Name: "uploadedAt" } },
          { field: { Name: "metadata" } },
          { field: { Name: "hasTranscription" } },
          { field: { Name: "smeId" } }
        ],
        where: [
          {
            FieldName: "subject",
            Operator: "EqualTo",
            Values: [subject]
          }
        ],
        orderBy: [
          {
            fieldName: "uploadedAt",
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
        console.error("Error fetching content by subject:", error?.response?.data?.message);
      } else {
        console.error(error.message);
      }
      return [];
    }
  }

  async create(contentData) {
    try {
      // Only include Updateable fields
      const params = {
        records: [
          {
            Name: contentData.Name || contentData.title,
            title: contentData.title,
            type: contentData.type,
            fileUrl: contentData.fileUrl,
            subject: contentData.subject,
            uploadedAt: contentData.uploadedAt || new Date().toISOString(),
            metadata: contentData.metadata ? JSON.stringify(contentData.metadata) : null,
            transcription: contentData.transcription || null,
            // Convert hasTranscription to proper format for Checkbox field type
            hasTranscription: contentData.hasTranscription ? "true" : "",
            transcriptionUpdatedAt: contentData.transcriptionUpdatedAt || null,
            smeId: parseInt(contentData.smeId)
          }
        ]
      };
      
      const response = await this.apperClient.createRecord(this.tableName, params);
      
      if (!response.success) {
        console.error(response.message);
        toast.error(response.message);
        return null;
      }
      
      if (response.results) {
        const successfulRecords = response.results.filter(result => result.success);
        const failedRecords = response.results.filter(result => !result.success);
        
        if (failedRecords.length > 0) {
          console.error(`Failed to create content ${failedRecords.length} records:${JSON.stringify(failedRecords)}`);
          
          failedRecords.forEach(record => {
            record.errors?.forEach(error => {
              toast.error(`${error.fieldLabel}: ${error.message}`);
            });
            if (record.message) toast.error(record.message);
          });
        }
        
        return successfulRecords.length > 0 ? successfulRecords[0].data : null;
      }
    } catch (error) {
      if (error?.response?.data?.message) {
        console.error("Error creating content:", error?.response?.data?.message);
      } else {
        console.error(error.message);
      }
      return null;
    }
  }

  async updateTranscription(id, transcriptionData) {
    try {
      const updateData = {
        transcription: transcriptionData,
        hasTranscription: "true", // Checkbox field format
        transcriptionUpdatedAt: new Date().toISOString()
      };
      
      return await this.update(id, updateData);
    } catch (error) {
      if (error?.response?.data?.message) {
        console.error("Error updating transcription:", error?.response?.data?.message);
      } else {
        console.error(error.message);
      }
      return null;
    }
  }

  async update(id, contentData) {
    try {
      // Only include Updateable fields
      const params = {
        records: [
          {
            Id: parseInt(id),
            Name: contentData.Name || contentData.title,
            title: contentData.title,
            type: contentData.type,
            fileUrl: contentData.fileUrl,
            subject: contentData.subject,
            uploadedAt: contentData.uploadedAt,
            metadata: contentData.metadata ? JSON.stringify(contentData.metadata) : null,
            transcription: contentData.transcription,
            hasTranscription: contentData.hasTranscription === true || contentData.hasTranscription === "true" ? "true" : "",
            transcriptionUpdatedAt: contentData.transcriptionUpdatedAt,
            smeId: parseInt(contentData.smeId)
          }
        ]
      };
      
      const response = await this.apperClient.updateRecord(this.tableName, params);
      
      if (!response.success) {
        console.error(response.message);
        toast.error(response.message);
        return null;
      }
      
      if (response.results) {
        const successfulUpdates = response.results.filter(result => result.success);
        const failedUpdates = response.results.filter(result => !result.success);
        
        if (failedUpdates.length > 0) {
          console.error(`Failed to update content ${failedUpdates.length} records:${JSON.stringify(failedUpdates)}`);
          
          failedUpdates.forEach(record => {
            record.errors?.forEach(error => {
              toast.error(`${error.fieldLabel}: ${error.message}`);
            });
            if (record.message) toast.error(record.message);
          });
        }
        
        return successfulUpdates.length > 0 ? successfulUpdates[0].data : null;
      }
    } catch (error) {
      if (error?.response?.data?.message) {
        console.error("Error updating content:", error?.response?.data?.message);
      } else {
        console.error(error.message);
      }
      return null;
    }
  }

  async delete(recordIds) {
    try {
      const ids = Array.isArray(recordIds) ? recordIds : [recordIds];
      const params = {
        RecordIds: ids.map(id => parseInt(id))
      };
      
      const response = await this.apperClient.deleteRecord(this.tableName, params);
      
      if (!response.success) {
        console.error(response.message);
        toast.error(response.message);
        return false;
      }
      
      if (response.results) {
        const successfulDeletions = response.results.filter(result => result.success);
        const failedDeletions = response.results.filter(result => !result.success);
        
        if (failedDeletions.length > 0) {
          console.error(`Failed to delete content ${failedDeletions.length} records:${JSON.stringify(failedDeletions)}`);
          
          failedDeletions.forEach(record => {
            if (record.message) toast.error(record.message);
          });
        }
        
        return successfulDeletions.length === ids.length;
      }
    } catch (error) {
      if (error?.response?.data?.message) {
        console.error("Error deleting content:", error?.response?.data?.message);
      } else {
        console.error(error.message);
      }
      return false;
    }
  }

  async search(query, subject = null, expertId = null) {
    try {
      let where = [];
      
      if (subject) {
        where.push({
          FieldName: "subject",
          Operator: "EqualTo",
          Values: [subject]
        });
      }
      
      if (expertId) {
        where.push({
          FieldName: "smeId",
          Operator: "EqualTo",
          Values: [parseInt(expertId)]
        });
      }
      
      if (query) {
        // Use OR logic for text search across multiple fields
        const searchConditions = [
          {
            FieldName: "title",
            Operator: "Contains",
            Values: [query]
          },
          {
            FieldName: "subject",
            Operator: "Contains",
            Values: [query]
          }
        ];
        
        if (where.length > 0) {
          // Combine existing filters with search using whereGroups for complex logic
          where = [{
            operator: "AND",
            subGroups: [
              {
                conditions: where,
                operator: "AND"
              },
              {
                conditions: searchConditions,
                operator: "OR"
              }
            ]
          }];
        } else {
          where = searchConditions;
        }
      }

      const params = {
        fields: [
          { field: { Name: "Name" } },
          { field: { Name: "title" } },
          { field: { Name: "type" } },
          { field: { Name: "fileUrl" } },
          { field: { Name: "subject" } },
          { field: { Name: "uploadedAt" } },
          { field: { Name: "metadata" } },
          { field: { Name: "hasTranscription" } },
          { field: { Name: "smeId" } }
        ],
        where: where.length > 0 ? where : undefined,
        orderBy: [
          {
            fieldName: "uploadedAt",
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
        console.error("Error searching content:", error?.response?.data?.message);
      } else {
        console.error(error.message);
      }
      return [];
    }
  }
}

export const contentService = new ContentService();

export const contentService = new ContentService();