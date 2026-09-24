export function formatCount(count: number): string {
    if (count < 1000) {
      return count.toString();
    }
  
    if (count < 1000000) {
      return `${(count / 1000).toFixed(1).replace(".0", "")}K`;
    }
  
    if (count < 1000000000) {
      return `${(count / 1000000).toFixed(1).replace(".0", "")}M`;
    }
  
    return `${(count / 1000000000).toFixed(1).replace(".0", "")}B`;
  }
  
  export function formatDate(date: string): string {
    const created = new Date(date);
    const now = new Date();
  
    const diff = now.getTime() - created.getTime();
  
    const seconds = Math.floor(diff / 1000);
    const minutes = Math.floor(seconds / 60);
    const hours = Math.floor(minutes / 60);
    const days = Math.floor(hours / 24);
  
    if (seconds < 60) {
      return "now";
    }
  
    if (minutes < 60) {
      return `${minutes}m`;
    }
  
    if (hours < 24) {
      return `${hours}h`;
    }
  
    if (days < 7) {
      return `${days}d`;
    }
  
    return created.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
    });
  }
  
export function cn(...classes: (string | undefined | false | null)[]) {
    return classes.filter(Boolean).join(" ");
  }

export function getTweetImages(tweet: { image?: string; images?: string[] }): string[] {
  return tweet.images?.filter(Boolean) ?? (tweet.image ? [tweet.image] : []);
}
