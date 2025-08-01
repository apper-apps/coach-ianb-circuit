class UserService {
  constructor() {
    this.tableName = 'app_User';
    this.apperClient = null;
  }

  _initializeClient() {
    if (!this.apperClient) {
      if (!window.ApperSDK) {
        throw new Error('Apper SDK not loaded. Make sure the SDK script is included in your HTML.');
      }
      const { ApperClient } = window.ApperSDK;
      this.apperClient = new ApperClient({
        apperProjectId: import.meta.env.VITE_APPER_PROJECT_ID,
        apperPublicKey: import.meta.env.VITE_APPER_PUBLIC_KEY
      });
    }
    return this.apperClient;
  }
async getAll() {
    try {
      const client = this._initializeClient();
      
      const params = {
        fields: [
          { field: { Name: "Name" } },
          { field: { Name: "email" } },
          { field: { Name: "role" } },
          { field: { Name: "credits" } },
          { field: { Name: "createdAt" } },
          { field: { Name: "password" } },
          { field: { Name: "Tags" } },
          { field: { Name: "Owner" } }
        ],
        orderBy: [
          {
            fieldName: "createdAt",
            sorttype: "DESC"
          }
        ]
      };

      const response = await client.fetchRecords(this.tableName, params);
      
      if (!response.success) {
        console.error(response.message);
        throw new Error(response.message);
      }

      return response.data || [];
    } catch (error) {
      if (error?.response?.data?.message) {
        console.error("Error fetching users:", error?.response?.data?.message);
      } else {
        console.error("Error fetching users:", error.message);
      }
      throw error;
    }
  }

async getById(id) {
    try {
      const client = this._initializeClient();
      
      const params = {
        fields: [
          { field: { Name: "Name" } },
          { field: { Name: "email" } },
          { field: { Name: "role" } },
          { field: { Name: "credits" } },
          { field: { Name: "createdAt" } },
          { field: { Name: "password" } },
          { field: { Name: "Tags" } },
          { field: { Name: "Owner" } },
          { field: { Name: "CreatedOn" } },
          { field: { Name: "ModifiedOn" } }
        ]
      };

      const response = await client.getRecordById(this.tableName, id, params);
      
      if (!response.success) {
        console.error(response.message);
        throw new Error(response.message);
      }

      return response.data;
    } catch (error) {
      if (error?.response?.data?.message) {
        console.error(`Error fetching user with ID ${id}:`, error?.response?.data?.message);
      } else {
        console.error(`Error fetching user with ID ${id}:`, error.message);
      }
      throw error;
    }
  }

async getByRole(role) {
    try {
      const client = this._initializeClient();
      
      const params = {
        fields: [
          { field: { Name: "Name" } },
          { field: { Name: "email" } },
          { field: { Name: "role" } },
          { field: { Name: "credits" } },
          { field: { Name: "createdAt" } }
        ],
        where: [
          {
            FieldName: "role",
            Operator: "EqualTo",
            Values: [role]
          }
        ]
      };

      const response = await client.fetchRecords(this.tableName, params);
      
      if (!response.success) {
        console.error(response.message);
        throw new Error(response.message);
      }

      return response.data || [];
    } catch (error) {
      if (error?.response?.data?.message) {
        console.error(`Error fetching users by role ${role}:`, error?.response?.data?.message);
      } else {
        console.error(`Error fetching users by role ${role}:`, error.message);
      }
      throw error;
    }
  }

async create(userData) {
    try {
      const client = this._initializeClient();
      
      // Filter to only include Updateable fields
      const updateableData = {
        Name: userData.Name,
        email: userData.email,
        role: userData.role,
        credits: userData.credits || 0,
        password: userData.password,
        createdAt: new Date().toISOString()
      };

      // Include optional fields if provided
      if (userData.Tags) updateableData.Tags = userData.Tags;
      if (userData.Owner) updateableData.Owner = parseInt(userData.Owner);

      const params = {
        records: [updateableData]
      };

      const response = await client.createRecord(this.tableName, params);
      
      if (!response.success) {
        console.error(response.message);
        throw new Error(response.message);
      }

      if (response.results) {
        const successfulRecords = response.results.filter(result => result.success);
        const failedRecords = response.results.filter(result => !result.success);
        
        if (failedRecords.length > 0) {
          console.error(`Failed to create user records:${JSON.stringify(failedRecords)}`);
          throw new Error(failedRecords[0].message || "Failed to create user");
        }
        
        return successfulRecords[0]?.data;
      }
    } catch (error) {
      if (error?.response?.data?.message) {
        console.error("Error creating user:", error?.response?.data?.message);
      } else {
        console.error("Error creating user:", error.message);
      }
      throw error;
    }
  }

async update(id, userData) {
    try {
      const client = this._initializeClient();
      
      // Filter to only include Updateable fields
      const updateableData = {
        Id: parseInt(id)
      };

      // Only include fields that are provided and updateable
      if (userData.Name !== undefined) updateableData.Name = userData.Name;
      if (userData.email !== undefined) updateableData.email = userData.email;
      if (userData.role !== undefined) updateableData.role = userData.role;
      if (userData.credits !== undefined) updateableData.credits = userData.credits;
      if (userData.password !== undefined) updateableData.password = userData.password;
      if (userData.Tags !== undefined) updateableData.Tags = userData.Tags;
      if (userData.Owner !== undefined) updateableData.Owner = parseInt(userData.Owner);

      const params = {
        records: [updateableData]
      };

      const response = await client.updateRecord(this.tableName, params);
      
      if (!response.success) {
        console.error(response.message);
        throw new Error(response.message);
      }

      if (response.results) {
        const successfulUpdates = response.results.filter(result => result.success);
        const failedUpdates = response.results.filter(result => !result.success);
        
        if (failedUpdates.length > 0) {
          console.error(`Failed to update user records:${JSON.stringify(failedUpdates)}`);
          throw new Error(failedUpdates[0].message || "Failed to update user");
        }
        
        return successfulUpdates[0]?.data;
      }
    } catch (error) {
      if (error?.response?.data?.message) {
        console.error("Error updating user:", error?.response?.data?.message);
      } else {
        console.error("Error updating user:", error.message);
      }
      throw error;
    }
  }

async delete(id) {
    try {
      const client = this._initializeClient();
      
      const params = {
        RecordIds: [parseInt(id)]
      };

      const response = await client.deleteRecord(this.tableName, params);
      
      if (!response.success) {
        console.error(response.message);
        throw new Error(response.message);
      }

      if (response.results) {
        const failedDeletions = response.results.filter(result => !result.success);
        
        if (failedDeletions.length > 0) {
          console.error(`Failed to delete user records:${JSON.stringify(failedDeletions)}`);
          throw new Error(failedDeletions[0].message || "Failed to delete user");
        }
        
        return true;
      }
    } catch (error) {
      if (error?.response?.data?.message) {
        console.error("Error deleting user:", error?.response?.data?.message);
      } else {
        console.error("Error deleting user:", error.message);
      }
      throw error;
    }
  }
}

export const userService = new UserService();