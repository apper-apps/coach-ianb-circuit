import { toast } from 'react-toastify';
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
      let errorMessage = "Failed to fetch users";
      if (error?.response?.data?.message && error.response.data.message.trim()) {
        errorMessage = error.response.data.message;
      } else if (error?.message && error.message.trim()) {
        errorMessage = error.message;
      } else if (typeof error === 'string' && error.trim()) {
        errorMessage = error;
      }
      console.error("Error fetching users:", errorMessage);
      toast.error(errorMessage);
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
      let errorMessage = `Failed to fetch user with ID ${id}`;
      if (error?.response?.data?.message && error.response.data.message.trim()) {
        errorMessage = error.response.data.message;
      } else if (error?.message && error.message.trim()) {
        errorMessage = error.message;
      } else if (typeof error === 'string' && error.trim()) {
        errorMessage = error;
      }
      console.error(`Error fetching user with ID ${id}:`, errorMessage);
      toast.error(errorMessage);
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
        console.error("User creation failed:", response.message);
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
      let errorMessage = "Failed to create user";
      if (error?.response?.data?.message && error.response.data.message.trim()) {
        errorMessage = error.response.data.message;
      } else if (error?.message && error.message.trim()) {
        errorMessage = error.message;
      } else if (typeof error === 'string' && error.trim()) {
        errorMessage = error;
      }
      console.error("Error creating user:", errorMessage);
      toast.error(errorMessage);
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
        console.error("User update failed:", response.message);
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
      let errorMessage = `Failed to update user with ID ${id}`;
      if (error?.response?.data?.message && error.response.data.message.trim()) {
        errorMessage = error.response.data.message;
      } else if (error?.message && error.message.trim()) {
        errorMessage = error.message;
      } else if (typeof error === 'string' && error.trim()) {
        errorMessage = error;
      }
      console.error(`Error updating user with ID ${id}:`, errorMessage);
      toast.error(errorMessage);
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
          console.error(`Failed to delete ${failedDeletions.length} user records: ${JSON.stringify(failedDeletions)}`);
          failedDeletions.forEach(record => {
            if (record.message) console.error(record.message);
          });
        }
        
        return successfulDeletions.length === params.RecordIds.length;
      }
      
      return true;
    } catch (error) {
      let errorMessage = "Failed to delete users";
      if (error?.response?.data?.message && error.response.data.message.trim()) {
        errorMessage = error.response.data.message;
      } else if (error?.message && error.message.trim()) {
        errorMessage = error.message;
      } else if (typeof error === 'string' && error.trim()) {
        errorMessage = error;
      }
      console.error("Error deleting users:", errorMessage);
      toast.error(errorMessage);
      return false;
    }
}

  // Create default demo users if they don't exist
async createDefaultAdmin() {
    try {
      console.log("Checking for existing demo users...");
      
      // Check if demo admin user already exists
      const adminParams = {
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
            Values: ["admin@demo.com"]
          }
        ]
      };

      const existingAdmin = await this.apperClient.fetchRecords(this.tableName, adminParams);
      let adminUser = null;
      
      if (existingAdmin.success && existingAdmin.data && existingAdmin.data.length > 0) {
        console.log("Demo admin user already exists");
        adminUser = existingAdmin.data[0];
      } else {
        console.log("Creating demo admin user...");
        
        // Create demo admin user
        const adminData = {
          Name: "Demo Administrator",
          email: "admin@demo.com",
          role: "super_admin",
          credits: 1000,
          password: "DemoAdmin123!",
          createdAt: new Date().toISOString()
        };

        adminUser = await this.create(adminData);
        if (!adminUser) {
          throw new Error("Failed to create demo admin user - no data returned");
        }
        console.log("Demo admin user created successfully");
      }

      // Check if demo SME user already exists
      const smeParams = {
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
            Values: ["expert@demo.com"]
          }
        ]
      };

      const existingSME = await this.apperClient.fetchRecords(this.tableName, smeParams);
      let smeUser = null;

      if (existingSME.success && existingSME.data && existingSME.data.length > 0) {
        console.log("Demo SME user already exists");
        smeUser = existingSME.data[0];
      } else {
        console.log("Creating demo SME user...");
        
        // Create demo SME user
        const smeData = {
          Name: "Demo Expert",
          email: "expert@demo.com", 
          role: "sme",
          credits: 0,
          password: "DemoExpert123!",
          createdAt: new Date().toISOString()
        };

        smeUser = await this.create(smeData);
        if (!smeUser) {
          throw new Error("Failed to create demo SME user - no data returned");
        }
        console.log("Demo SME user created successfully");
      }

      // Show success toast with both credentials
      toast.success("🎉 Demo users ready!\n\n👨‍💼 Admin: admin@demo.com / DemoAdmin123!\n🎓 Expert: expert@demo.com / DemoExpert123!", {
        position: "top-right",
        autoClose: 20000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        style: {
          whiteSpace: 'pre-line',
          fontSize: '14px',
          lineHeight: '1.5'
        }
      });

      console.log("Demo credentials available:");
      console.log("Admin: admin@demo.com / DemoAdmin123!");
      console.log("Expert: expert@demo.com / DemoExpert123!");
      
      return { admin: adminUser, sme: smeUser };
      
    } catch (error) {
      let errorMessage = "Failed to create demo users";
      if (error?.response?.data?.message && error.response.data.message.trim()) {
        errorMessage = error.response.data.message;
      } else if (error?.message && error.message.trim()) {
        errorMessage = error.message;
      } else if (typeof error === 'string' && error.trim()) {
        errorMessage = error;
      }
      console.error("Error creating demo users:", errorMessage);
      toast.error(`Demo user creation failed: ${errorMessage}`, {
        position: "top-right",
        autoClose: 8000,
      });
      return null;
    }
  }
}

export const userService = new UserService();