export interface IStorage {
  // No persistent storage needed for this application
  // All conversion happens in memory
}

export class MemStorage implements IStorage {
  constructor() {
    // No storage needed for file conversion
  }
}

export const storage = new MemStorage();
