class ContentService {
  constructor() {
    // Initialize ApperClient with Project ID and Public Key
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
          { field: { Name: "Tags" } },
          { field: { Name: "Owner" } },
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

  async getById(id) {
    try {
      const params = {
        fields: [
          { field: { Name: "Name" } },
          { field: { Name: "Tags" } },
          { field: { Name: "Owner" } },
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

      const response = await this.apperClient.getRecordById(this.tableName, id, params);
      
      if (!response.success) {
        console.error(response.message);
        return null;
      }

      return response.data;
    } catch (error) {
      if (error?.response?.data?.message) {
        console.error(`Error fetching content with ID ${id}:`, error?.response?.data?.message);
      } else {
        console.error(error.message);
      }
      return null;
    }
  }

async create(contentData) {
    try {
      if (!contentData) {
        console.error("Content data is required");
        return null;
      }

      // Only include Updateable fields with proper validation
      const params = {
        records: [{
          Name: contentData.Name || contentData.title,
          Tags: contentData.Tags,
          Owner: contentData.Owner ? parseInt(contentData.Owner?.Id || contentData.Owner) : null,
          title: contentData.title,
          type: contentData.type,
          fileUrl: contentData.fileUrl,
          subject: contentData.subject,
          uploadedAt: contentData.uploadedAt || new Date().toISOString(),
          metadata: contentData.metadata ? JSON.stringify(contentData.metadata) : null,
          transcription: contentData.transcription || null,
          hasTranscription: contentData.hasTranscription ? "true" : "",
          transcriptionUpdatedAt: contentData.transcriptionUpdatedAt || null,
          smeId: contentData.smeId ? parseInt(contentData.smeId?.Id || contentData.smeId) : null
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
          console.error(`Failed to create ${failedRecords.length} content records:`, JSON.stringify(failedRecords));
          
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
        console.error("Error creating content:", error?.response?.data?.message);
      } else {
        console.error(error.message);
      }
      return null;
    }
  }

async update(id, contentData) {
    try {
      if (!id || !contentData) {
        console.error("ID and content data are required");
        return null;
      }

      // Only include Updateable fields with proper validation
      const params = {
        records: [{
          Id: parseInt(id),
          Name: contentData.Name || contentData.title,
          Tags: contentData.Tags,
          Owner: contentData.Owner ? parseInt(contentData.Owner?.Id || contentData.Owner) : null,
          title: contentData.title,
          type: contentData.type,
          fileUrl: contentData.fileUrl,
          subject: contentData.subject,
          uploadedAt: contentData.uploadedAt,
          metadata: contentData.metadata ? JSON.stringify(contentData.metadata) : null,
          transcription: contentData.transcription,
          hasTranscription: contentData.hasTranscription === true || contentData.hasTranscription === "true" ? "true" : "",
          transcriptionUpdatedAt: contentData.transcriptionUpdatedAt,
          smeId: contentData.smeId ? parseInt(contentData.smeId?.Id || contentData.smeId) : null
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
          console.error(`Failed to update ${failedUpdates.length} content records:`, JSON.stringify(failedUpdates));
          
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
        console.error("Error updating content:", error?.response?.data?.message);
      } else {
        console.error(error.message);
      }
      return null;
    }
  }

async delete(recordIds) {
    try {
      if (!recordIds || (Array.isArray(recordIds) && recordIds.length === 0)) {
        console.error("Record IDs are required for deletion");
        return false;
      }

      const ids = Array.isArray(recordIds) ? recordIds : [recordIds];
      const params = {
        RecordIds: ids.map(id => parseInt(id))
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
          console.error(`Failed to delete ${failedDeletions.length} content records:`, JSON.stringify(failedDeletions));
          
          failedDeletions.forEach(record => {
            if (record.message) console.error(record.message);
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

  async getBySmeId(smeId) {
    try {
      const params = {
        fields: [
          { field: { Name: "Name" } },
          { field: { Name: "Tags" } },
          { field: { Name: "Owner" } },
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

}

  async updateTranscription(id, transcriptionData) {
    try {
      if (!id || !transcriptionData) {
        console.error("ID and transcription data are required");
        return null;
      }

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