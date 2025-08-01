import { mockExperts } from "@/services/mockData/experts.json";

class ExpertService {
  constructor() {
    this.experts = [...mockExperts];
  }

  async getAll() {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 300));
    return [...this.experts];
  }

  async getById(id) {
    await new Promise(resolve => setTimeout(resolve, 200));
    const expert = this.experts.find(e => e.Id === parseInt(id));
    if (!expert) {
      throw new Error("Expert not found");
    }
    return { ...expert };
  }

  async getByUserId(userId) {
    await new Promise(resolve => setTimeout(resolve, 250));
    const expert = this.experts.find(e => e.userId === parseInt(userId));
    if (!expert) {
      throw new Error("Expert profile not found");
    }
    return { ...expert };
  }

  async create(expertData) {
    await new Promise(resolve => setTimeout(resolve, 400));
    
    const newExpert = {
      ...expertData,
      Id: Math.max(...this.experts.map(e => e.Id)) + 1,
      contentCount: 0
    };
    
    this.experts.push(newExpert);
    return { ...newExpert };
  }

  async update(id, expertData) {
    await new Promise(resolve => setTimeout(resolve, 350));
    
    const index = this.experts.findIndex(e => e.Id === parseInt(id));
    if (index === -1) {
      throw new Error("Expert not found");
    }
    
    this.experts[index] = { ...this.experts[index], ...expertData };
    return { ...this.experts[index] };
  }

  async delete(id) {
    await new Promise(resolve => setTimeout(resolve, 300));
    
    const index = this.experts.findIndex(e => e.Id === parseInt(id));
    if (index === -1) {
      throw new Error("Expert not found");
    }
    
    this.experts.splice(index, 1);
    return true;
  }

  async updateContentCount(expertId, count) {
    await new Promise(resolve => setTimeout(resolve, 150));
    
    const index = this.experts.findIndex(e => e.Id === parseInt(expertId));
    if (index !== -1) {
      this.experts[index].contentCount = count;
    }
  }
}

export const expertService = new ExpertService();