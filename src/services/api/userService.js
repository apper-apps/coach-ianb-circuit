import { mockUsers } from "@/services/mockData/users.json";

class UserService {
  constructor() {
    this.users = [...mockUsers];
  }

  async getAll() {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 300));
    return [...this.users];
  }

  async getById(id) {
    await new Promise(resolve => setTimeout(resolve, 200));
    const user = this.users.find(u => u.Id === parseInt(id));
    if (!user) {
      throw new Error("User not found");
    }
    return { ...user };
  }

  async getByRole(role) {
    await new Promise(resolve => setTimeout(resolve, 250));
    return this.users.filter(u => u.role === role).map(u => ({ ...u }));
  }

  async create(userData) {
    await new Promise(resolve => setTimeout(resolve, 400));
    
    const newUser = {
      ...userData,
      Id: Math.max(...this.users.map(u => u.Id)) + 1,
      createdAt: new Date().toISOString()
    };
    
    this.users.push(newUser);
    return { ...newUser };
  }

  async update(id, userData) {
    await new Promise(resolve => setTimeout(resolve, 350));
    
    const index = this.users.findIndex(u => u.Id === parseInt(id));
    if (index === -1) {
      throw new Error("User not found");
    }
    
    this.users[index] = { ...this.users[index], ...userData };
    return { ...this.users[index] };
  }

  async delete(id) {
    await new Promise(resolve => setTimeout(resolve, 300));
    
    const index = this.users.findIndex(u => u.Id === parseInt(id));
    if (index === -1) {
      throw new Error("User not found");
    }
    
    this.users.splice(index, 1);
    return true;
  }
}

export const userService = new UserService();