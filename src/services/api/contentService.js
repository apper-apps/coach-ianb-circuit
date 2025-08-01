import { mockContent } from "@/services/mockData/content.json";

class ContentService {
  constructor() {
    this.content = [...mockContent];
  }

  async getAll() {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 350));
    return [...this.content];
  }

  async getById(id) {
    await new Promise(resolve => setTimeout(resolve, 200));
    const item = this.content.find(c => c.Id === parseInt(id));
    if (!item) {
      throw new Error("Content not found");
    }
    return { ...item };
  }

  async getBySME(smeId) {
    await new Promise(resolve => setTimeout(resolve, 300));
    return this.content.filter(c => c.smeId === parseInt(smeId)).map(c => ({ ...c }));
  }

  async getBySubject(subject) {
    await new Promise(resolve => setTimeout(resolve, 250));
    return this.content.filter(c => c.subject === subject).map(c => ({ ...c }));
  }

async create(contentData) {
    await new Promise(resolve => setTimeout(resolve, 500));
    
    const newContent = {
      ...contentData,
      Id: Math.max(...this.content.map(c => c.Id)) + 1,
      uploadedAt: new Date().toISOString(),
      transcription: contentData.transcription || null,
      hasTranscription: !!contentData.transcription
    };
    
    this.content.push(newContent);
    return { ...newContent };
  }

  async updateTranscription(id, transcriptionData) {
    await new Promise(resolve => setTimeout(resolve, 200));
    
    const contentIndex = this.content.findIndex(c => c.Id === parseInt(id));
    if (contentIndex === -1) {
      throw new Error('Content not found');
    }

    this.content[contentIndex] = {
      ...this.content[contentIndex],
      transcription: transcriptionData,
      hasTranscription: true,
      transcriptionUpdatedAt: new Date().toISOString()
    };

    return { ...this.content[contentIndex] };
  }

  async update(id, contentData) {
    await new Promise(resolve => setTimeout(resolve, 400));
    
    const index = this.content.findIndex(c => c.Id === parseInt(id));
    if (index === -1) {
      throw new Error("Content not found");
    }
    
    this.content[index] = { ...this.content[index], ...contentData };
    return { ...this.content[index] };
  }

  async delete(id) {
    await new Promise(resolve => setTimeout(resolve, 350));
    
    const index = this.content.findIndex(c => c.Id === parseInt(id));
    if (index === -1) {
      throw new Error("Content not found");
    }
    
    this.content.splice(index, 1);
    return true;
  }

  async search(query, subject = null, expertId = null) {
    await new Promise(resolve => setTimeout(resolve, 400));
    
    let results = [...this.content];
    
    if (subject) {
      results = results.filter(c => c.subject === subject);
    }
    
    if (expertId) {
      results = results.filter(c => c.smeId === parseInt(expertId));
    }
    
    if (query) {
      const searchTerm = query.toLowerCase();
      results = results.filter(c => 
        c.title.toLowerCase().includes(searchTerm) ||
        c.metadata?.description?.toLowerCase().includes(searchTerm) ||
        c.subject.toLowerCase().includes(searchTerm)
      );
    }
    
    return results.map(c => ({ ...c }));
  }
}

export const contentService = new ContentService();