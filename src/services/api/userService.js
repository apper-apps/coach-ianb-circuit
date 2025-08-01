class UserService {
  constructor() {
    // Initialize ApperClient with Project ID and Public Key
    const { ApperClient } = window.ApperSDK;
    this.apperClient = new ApperClient({
      apperProjectId: import.meta.env.VITE_APPER_PROJECT_ID,
      apperPublicKey: import.meta.env.VITE_APPER_PUBLIC_KEY
    });
    this.tableName = 'app_User';
  }

  async getAll() {
    try {
      const params = {
        fields: [
          { field: { Name: "Name" } },
          { field: { Name: "Tags" } },
          { field: { Name: "Owner" } },
          { field: { Name: "email" } },
          { field: { Name: "role" } },
          { field: { Name: "credits" } },
          { field: { Name: "createdAt" } }
        ],
        orderBy: [
          {
            fieldName: "createdAt",
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
        console.error("Error fetching users:", error?.response?.data?.message);
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
          { field: { Name: "email" } },
          { field: { Name: "role" } },
          { field: { Name: "credits" } },
          { field: { Name: "createdAt" } }
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
        console.error(`Error fetching user with ID ${id}:`, error?.response?.data?.message);
      } else {
        console.error(error.message);
      }
      return null;
    }
  }

  async create(userData) {
    try {
      // Only include Updateable fields
      const params = {
        records: [{
          Name: userData.Name,
          Tags: userData.Tags,
          Owner: parseInt(userData.Owner?.Id || userData.Owner),
          email: userData.email,
          role: userData.role,
          credits: parseInt(userData.credits) || 0,
          createdAt: userData.createdAt || new Date().toISOString(),
          password: userData.password
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
          console.error(`Failed to create ${failedRecords.length} user records:${JSON.stringify(failedRecords)}`);
          
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
        console.error("Error creating user:", error?.response?.data?.message);
      } else {
        console.error(error.message);
      }
      return null;
    }
  }

  async update(id, userData) {
    try {
      // Only include Updateable fields
      const params = {
        records: [{
          Id: id,
          Name: userData.Name,
          Tags: userData.Tags,
          Owner: parseInt(userData.Owner?.Id || userData.Owner),
          email: userData.email,
          role: userData.role,
          credits: parseInt(userData.credits) || 0,
createdAt: userData.createdAt,
          password: userData.password
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
          console.error(`Failed to update ${failedUpdates.length} user records:${JSON.stringify(failedUpdates)}`);
          
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
        console.error("Error updating user:", error?.response?.data?.message);
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
          console.error(`Failed to delete ${failedDeletions.length} user records:${JSON.stringify(failedDeletions)}`);
          
          failedDeletions.forEach(record => {
            if (record.message) console.error(record.message);
          });
        }
        
        return successfulDeletions.length === params.RecordIds.length;
      }
      
      return true;
    } catch (error) {
      if (error?.response?.data?.message) {
        console.error("Error deleting users:", error?.response?.data?.message);
      } else {
        console.error(error.message);
      }
      return false;
    }
  }

  // Create default admin user if it doesn't exist
  async createDefaultAdmin() {
    try {
      // Check if admin user already exists
      const params = {
        fields: [
          {
            field: {
              Name: "Id"
            }
          },
          {
            field: {
              Name: "email"
            }
          },
          {
            field: {
              Name: "role"
            }
          }
        ],
        where: [
          {
            FieldName: "email",
            Operator: "EqualTo",
            Values: ["admin@coachinb.ai"]
          }
        ]
      };

const { ApperClient } = window.ApperSDK;
      const apperClient = new ApperClient({
        apperProjectId: import.meta.env.VITE_APPER_PROJECT_ID,
        apperPublicKey: import.meta.env.VITE_APPER_PUBLIC_KEY
      });

      const existingAdmin = await apperClient.fetchRecords(this.tableName, params);
      if (existingAdmin.success && existingAdmin.data && existingAdmin.data.length > 0) {
        console.log("Default admin user already exists");
        return existingAdmin.data[0];
      }

      // Create default admin user
      const adminData = {
        Name: "System Administrator",
        email: "admin@coachinb.ai",
        role: "super_admin",
        credits: 1000,
        password: "Admin123!",
        createdAt: new Date().toISOString()
      };

      const newAdmin = await this.create(adminData);
      
      if (newAdmin) {
        // Import toast here to avoid circular dependencies
        const { toast } = await import('react-toastify');
        toast.success("Default admin created! Email: admin@coachinb.ai, Password: Admin123!", {
          position: "top-right",
          autoClose: 10000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
        });
        console.log("Default admin user created successfully");
        return newAdmin;
      }
    } catch (error) {
      console.error("Error creating default admin:", error);
      // Import toast here to avoid circular dependencies
      const { toast } = await import('react-toastify');
      toast.error("Failed to create default admin user");
    }
  }
}

export const userService = new UserService();