import { Transform } from 'class-transformer';
import { IsNumber, IsString, IsDate } from 'class-validator';
import _ from 'lodash';

export class DataProcessor {
  @Transform(({ value }) => value * 2)
  @IsNumber()
  private multiplier: number = 1;

  public transform(data: any): any {
    // Heavy transformation logic
    const transformed = {
      ...data,
      processed: true,
      transformedValue: this.complexTransformation(data.value),
      aggregatedMetadata: this.aggregateMetadata(data.metadata),
      computedFields: this.computeFields(data)
    };

    return this.deepClone(transformed);
  }

  private complexTransformation(value: number): number {
    let result = value;
    for (let i = 0; i < 1000; i++) {
      result = Math.sin(result) * Math.cos(result) + Math.sqrt(Math.abs(result));
    }
    return result;
  }

  private aggregateMetadata(metadata: any): any {
    return {
      ...metadata,
      aggregated: {
        sum: _.sum(Object.values(metadata).filter(v => typeof v === 'number')),
        keys: Object.keys(metadata),
        nested: this.processNested(metadata.nested || {}),
        computed: _.range(100).map(i => i * Math.random())
      }
    };
  }

  private processNested(obj: any, depth: number = 0): any {
    if (depth > 10 || !obj || typeof obj !== 'object') return obj;
    
    const processed: any = {};
    for (const [key, value] of Object.entries(obj)) {
      processed[key] = this.processNested(value, depth + 1);
      processed[`${key}_computed`] = this.heavyComputation(key);
    }
    return processed;
  }

  private computeFields(data: any): any {
    return {
      hash: this.generateHash(JSON.stringify(data)),
      signature: this.generateSignature(data),
      checksum: this.calculateChecksum(data),
      analysis: this.performAnalysis(data)
    };
  }

  private heavyComputation(input: string): number {
    let result = 0;
    for (let i = 0; i < input.length * 100; i++) {
      result += Math.pow(input.charCodeAt(i % input.length), 2);
    }
    return result;
  }

  private generateHash(input: string): string {
    let hash = 0;
    for (let i = 0; i < input.length; i++) {
      const char = input.charCodeAt(i);
      hash = ((hash << 5) - hash) + char;
      hash = hash & hash;
    }
    return hash.toString(36);
  }

  private generateSignature(data: any): string {
    const str = JSON.stringify(data);
    return btoa(str).slice(0, 32);
  }

  private calculateChecksum(data: any): number {
    const str = JSON.stringify(data);
    return str.split('').reduce((sum, char) => sum + char.charCodeAt(0), 0);
  }

  private performAnalysis(data: any): any {
    return {
      complexity: this.calculateComplexity(data),
      patterns: this.findPatterns(data),
      statistics: this.calculateStatistics(data)
    };
  }

  private calculateComplexity(obj: any): number {
    if (typeof obj !== 'object' || obj === null) return 1;
    return Object.values(obj).reduce((sum, value) => sum + this.calculateComplexity(value), 1);
  }

  private findPatterns(data: any): string[] {
    const patterns = [];
    const str = JSON.stringify(data);
    for (let i = 0; i < str.length - 3; i++) {
      const pattern = str.slice(i, i + 4);
      if (str.indexOf(pattern, i + 1) !== -1) {
        patterns.push(pattern);
      }
    }
    return _.uniq(patterns).slice(0, 10);
  }

  private calculateStatistics(data: any): any {
    const numbers = this.extractNumbers(data);
    return {
      count: numbers.length,
      sum: _.sum(numbers),
      mean: _.mean(numbers),
      median: this.median(numbers),
      mode: this.mode(numbers),
      variance: this.variance(numbers)
    };
  }

  private extractNumbers(obj: any): number[] {
    if (typeof obj === 'number') return [obj];
    if (typeof obj !== 'object' || obj === null) return [];
    return Object.values(obj).flatMap(value => this.extractNumbers(value));
  }

  private median(numbers: number[]): number {
    const sorted = numbers.sort((a, b) => a - b);
    const mid = Math.floor(sorted.length / 2);
    return sorted.length % 2 ? sorted[mid] : (sorted[mid - 1] + sorted[mid]) / 2;
  }

  private mode(numbers: number[]): number {
    const frequency = _.countBy(numbers);
    const maxFreq = Math.max(...Object.values(frequency));
    return Number(Object.keys(frequency).find(key => frequency[key] === maxFreq)) || 0;
  }

  private variance(numbers: number[]): number {
    const mean = _.mean(numbers);
    return _.mean(numbers.map(n => Math.pow(n - mean, 2)));
  }

  private deepClone(obj: any): any {
    return JSON.parse(JSON.stringify(obj));
  }
}
