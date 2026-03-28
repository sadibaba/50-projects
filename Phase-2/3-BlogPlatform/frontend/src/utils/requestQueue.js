class RequestQueue {
  constructor() {
    this.queue = [];
    this.processing = false;
    this.lastRequestTime = 0;
    this.minDelay = 2000; // 2 seconds between requests
  }

  async add(requestFn) {
    return new Promise((resolve, reject) => {
      this.queue.push({ requestFn, resolve, reject });
      this.processQueue();
    });
  }

  async processQueue() {
    if (this.processing || this.queue.length === 0) return;
    
    this.processing = true;
    
    while (this.queue.length > 0) {
      const now = Date.now();
      const timeSinceLastRequest = now - this.lastRequestTime;
      
      if (timeSinceLastRequest < this.minDelay) {
        const waitTime = this.minDelay - timeSinceLastRequest;
        console.log(`Waiting ${waitTime}ms before next request...`);
        await new Promise(resolve => setTimeout(resolve, waitTime));
      }
      
      const { requestFn, resolve, reject } = this.queue.shift();
      
      try {
        const result = await requestFn();
        this.lastRequestTime = Date.now();
        resolve(result);
      } catch (error) {
        reject(error);
      }
    }
    
    this.processing = false;
  }
}

export const requestQueue = new RequestQueue();