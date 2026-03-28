class RequestDeduplicator {
  constructor() {
    this.pendingRequests = new Map();
  }

  async makeRequest(key, requestFn) {
    // If there's already a pending request with this key, return its promise
    if (this.pendingRequests.has(key)) {
      console.log(`Deduplicating request for: ${key}`);
      return this.pendingRequests.get(key);
    }

    // Create the request promise
    const promise = requestFn().finally(() => {
      // Remove from pending after completion
      this.pendingRequests.delete(key);
    });

    // Store the promise
    this.pendingRequests.set(key, promise);
    
    return promise;
  }
}

export const requestDeduplicator = new RequestDeduplicator();