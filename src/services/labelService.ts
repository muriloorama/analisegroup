import { Label } from '../types/message';

export class LabelService {
  /**
   * Fetch available labels from the API
   */
  async fetchLabels(): Promise<{ data: Label[] | null; error: Error | null }> {
    try {
      // Make a GET request to the webhook endpoint
      const response = await fetch('https://flow.agencia.da1click.com/webhook/5c491001-8aa9-40ed-8592-labels', {
        method: 'GET',
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json'
        },
        // Ensure we don't cache the response
        cache: 'no-cache'
      });
      
      if (!response.ok) {
        throw new Error(`API responded with status: ${response.status}`);
      }
      
      const data = await response.json();
      console.log('Labels fetched successfully:', data); // Log for debugging
      
      return { data, error: null };
    } catch (err) {
      console.error('Error fetching labels:', err);
      return { 
        data: null, 
        error: err instanceof Error ? err : new Error('An unknown error occurred') 
      };
    }
  }
}