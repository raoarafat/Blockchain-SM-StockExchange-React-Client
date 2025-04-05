// A simple client-side database implementation using localStorage

class ClientDB {
  constructor(storeName) {
    this.storeName = storeName;
    // Initialize the store if it doesn't exist
    if (!localStorage.getItem(this.storeName)) {
      localStorage.setItem(this.storeName, JSON.stringify([]));
    }
  }

  // Get all items from the store
  getAll() {
    try {
      return JSON.parse(localStorage.getItem(this.storeName)) || [];
    } catch (error) {
      console.error('Error getting data from store:', error);
      return [];
    }
  }

  // Get a single item by id
  getById(id) {
    const items = this.getAll();
    return items.find((item) => item.id === id);
  }

  // Add a new item
  create(item) {
    try {
      const items = this.getAll();
      // Generate a simple ID if none exists
      const newItem = {
        ...item,
        id: item.id || Date.now().toString(),
        createdAt: new Date().toISOString(),
      };
      items.push(newItem);
      localStorage.setItem(this.storeName, JSON.stringify(items));
      return newItem;
    } catch (error) {
      console.error('Error creating item:', error);
      throw error;
    }
  }

  // Update an existing item
  update(id, updates) {
    try {
      const items = this.getAll();
      const index = items.findIndex((item) => item.id === id);
      if (index === -1) throw new Error(`Item with id ${id} not found`);

      items[index] = {
        ...items[index],
        ...updates,
        updatedAt: new Date().toISOString(),
      };
      localStorage.setItem(this.storeName, JSON.stringify(items));
      return items[index];
    } catch (error) {
      console.error('Error updating item:', error);
      throw error;
    }
  }

  // Delete an item
  delete(id) {
    try {
      const items = this.getAll();
      const filteredItems = items.filter((item) => item.id !== id);
      localStorage.setItem(this.storeName, JSON.stringify(filteredItems));
      return true;
    } catch (error) {
      console.error('Error deleting item:', error);
      throw error;
    }
  }

  // Clear all data
  clear() {
    localStorage.setItem(this.storeName, JSON.stringify([]));
  }
}

// Create specific stores for different entity types
export const investorDB =
  typeof window !== 'undefined' ? new ClientDB('investors') : null;
export const campaignDB =
  typeof window !== 'undefined' ? new ClientDB('campaigns') : null;

// You can add more stores as needed
