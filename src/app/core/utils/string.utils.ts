export class StringUtils {
    static capitalize(text: string): string {
      if (!text) return '';
      return text.charAt(0).toUpperCase() + text.slice(1).toLowerCase();
    }
  
    static truncate(text: string, limit: number): string {
      return text.length > limit ? text.substring(0, limit) + '...' : text;
    }
  }
  