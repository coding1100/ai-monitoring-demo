// Deterministic Seeded Pseudo-Random Number Generator (Mulberry32)
export class SeededPRNG {
  private state: number;

  constructor(seedString: string) {
    let h = 1779033703 ^ seedString.length;
    for (let i = 0; i < seedString.length; i++) {
      h = Math.imul(h ^ seedString.charCodeAt(i), 3432918353);
      h = (h << 13) | (h >>> 19);
    }
    this.state = h >>> 0;
  }

  // Returns number in [0, 1)
  next(): number {
    let t = (this.state += 0x6d2b79f5);
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  }

  // Returns integer in [min, max]
  nextInt(min: number, max: number): number {
    return Math.floor(this.next() * (max - min + 1)) + min;
  }

  // Returns random element from array
  pick<T>(array: T[]): T {
    return array[Math.floor(this.next() * array.length)];
  }

  // Returns multiple elements without replacement
  pickMultiple<T>(array: T[], count: number): T[] {
    const copy = [...array];
    const picked: T[] = [];
    for (let i = 0; i < count && copy.length > 0; i++) {
      const idx = Math.floor(this.next() * copy.length);
      picked.push(copy.splice(idx, 1)[0]);
    }
    return picked;
  }

  // Returns boolean with probability p
  chance(probability: number): boolean {
    return this.next() < probability;
  }
}

// Latency simulator helper (300ms to 900ms)
export const fakeDelay = (ms?: number): Promise<void> => {
  const delayTime = ms ?? (300 + Math.floor(Math.random() * 600));
  return new Promise((resolve) => setTimeout(resolve, delayTime));
};
