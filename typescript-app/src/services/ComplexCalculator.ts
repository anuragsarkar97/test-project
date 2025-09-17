import _ from 'lodash';

export class ComplexCalculator {
  public async complexOperation(data: any): Promise<any> {
    return new Promise((resolve) => {
      setTimeout(() => {
        const result = {
          ...data,
          calculated: this.performHeavyCalculation(data.value || 0),
          matrix: this.generateMatrix(10, 10),
          fourier: this.simpleFourierTransform(this.generateSignal(100)),
          prime: this.findPrimes(1000)
        };
        resolve(result);
      }, Math.random() * 10);
    });
  }

  public async matrixOperations(matrices: number[][][]): Promise<any> {
    const results = [];
    
    for (let i = 0; i < matrices.length; i++) {
      for (let j = i + 1; j < matrices.length; j++) {
        results.push({
          multiplication: this.multiplyMatrices(matrices[i], matrices[j]),
          addition: this.addMatrices(matrices[i], matrices[j]),
          determinant_i: this.calculateDeterminant(matrices[i]),
          determinant_j: this.calculateDeterminant(matrices[j])
        });
      }
    }

    return {
      operations: results.length,
      sample: results.slice(0, 3),
      eigenvalues: this.calculateEigenvalues(matrices[0])
    };
  }

  public async statisticalAnalysis(data: any[]): Promise<any> {
    const values = data.map(d => d.value);
    
    return {
      descriptive: {
        mean: _.mean(values),
        median: this.median(values),
        mode: this.mode(values),
        variance: this.variance(values),
        skewness: this.calculateSkewness(values),
        kurtosis: this.calculateKurtosis(values)
      },
      distributions: {
        normal: this.normalDistribution(values),
        exponential: this.exponentialDistribution(values),
        poisson: this.poissonDistribution(values)
      },
      correlations: this.calculateCorrelations(data),
      regression: this.linearRegression(data)
    };
  }

  public async timeSeriesAnalysis(data: any[]): Promise<any> {
    const timeSeries = data.map(d => ({ time: d.timestamp, value: d.value }));
    
    return {
      trend: this.calculateTrend(timeSeries),
      seasonality: this.detectSeasonality(timeSeries),
      autocorrelation: this.calculateAutocorrelation(timeSeries),
      movingAverages: this.calculateMovingAverages(timeSeries, [5, 10, 20]),
      forecast: this.simpleForecasting(timeSeries, 10)
    };
  }

  private performHeavyCalculation(input: number): number {
    let result = input;
    for (let i = 0; i < 10000; i++) {
      result = Math.sin(result) + Math.cos(result * 2) + Math.sqrt(Math.abs(result));
      if (i % 1000 === 0) {
        result = result % 1000; // Prevent overflow
      }
    }
    return result;
  }

  private generateMatrix(rows: number, cols: number): number[][] {
    return _.range(rows).map(() => 
      _.range(cols).map(() => Math.random() * 100)
    );
  }

  private multiplyMatrices(a: number[][], b: number[][]): number[][] {
    const result = [];
    for (let i = 0; i < a.length; i++) {
      result[i] = [];
      for (let j = 0; j < b[0].length; j++) {
        let sum = 0;
        for (let k = 0; k < b.length; k++) {
          sum += a[i][k] * b[k][j];
        }
        result[i][j] = sum;
      }
    }
    return result;
  }

  private addMatrices(a: number[][], b: number[][]): number[][] {
    return a.map((row, i) => row.map((val, j) => val + b[i][j]));
  }

  private calculateDeterminant(matrix: number[][]): number {
    const n = matrix.length;
    if (n === 1) return matrix[0][0];
    if (n === 2) return matrix[0][0] * matrix[1][1] - matrix[0][1] * matrix[1][0];
    
    let det = 0;
    for (let i = 0; i < n; i++) {
      const subMatrix = matrix.slice(1).map(row => 
        row.filter((_, j) => j !== i)
      );
      det += Math.pow(-1, i) * matrix[0][i] * this.calculateDeterminant(subMatrix);
    }
    return det;
  }

  private calculateEigenvalues(matrix: number[][]): number[] {
    // Simplified power iteration method
    const n = matrix.length;
    const eigenvalues = [];
    
    for (let iter = 0; iter < 3; iter++) {
      let vector = _.range(n).map(() => Math.random());
      
      for (let i = 0; i < 100; i++) {
        const newVector = this.matrixVectorMultiply(matrix, vector);
        const norm = Math.sqrt(_.sum(newVector.map(x => x * x)));
        vector = newVector.map(x => x / norm);
      }
      
      const eigenvalue = this.vectorDotProduct(
        this.matrixVectorMultiply(matrix, vector),
        vector
      );
      eigenvalues.push(eigenvalue);
    }
    
    return eigenvalues;
  }

  private matrixVectorMultiply(matrix: number[][], vector: number[]): number[] {
    return matrix.map(row => 
      _.sum(row.map((val, i) => val * vector[i]))
    );
  }

  private vectorDotProduct(a: number[], b: number[]): number {
    return _.sum(a.map((val, i) => val * b[i]));
  }

  private generateSignal(length: number): number[] {
    return _.range(length).map(i => 
      Math.sin(2 * Math.PI * i / 10) + 
      0.5 * Math.sin(2 * Math.PI * i / 5) + 
      0.25 * Math.random()
    );
  }

  private simpleFourierTransform(signal: number[]): any[] {
    const N = signal.length;
    const result = [];
    
    for (let k = 0; k < N / 2; k++) {
      let real = 0, imag = 0;
      for (let n = 0; n < N; n++) {
        const angle = -2 * Math.PI * k * n / N;
        real += signal[n] * Math.cos(angle);
        imag += signal[n] * Math.sin(angle);
      }
      result.push({
        frequency: k,
        magnitude: Math.sqrt(real * real + imag * imag),
        phase: Math.atan2(imag, real)
      });
    }
    
    return result;
  }

  private findPrimes(limit: number): number[] {
    const primes = [];
    const sieve = new Array(limit + 1).fill(true);
    
    for (let i = 2; i <= limit; i++) {
      if (sieve[i]) {
        primes.push(i);
        for (let j = i * i; j <= limit; j += i) {
          sieve[j] = false;
        }
      }
    }
    
    return primes;
  }

  private median(numbers: number[]): number {
    const sorted = [...numbers].sort((a, b) => a - b);
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

  private calculateSkewness(numbers: number[]): number {
    const mean = _.mean(numbers);
    const variance = this.variance(numbers);
    const n = numbers.length;
    
    const skewness = numbers.reduce((sum, x) => 
      sum + Math.pow((x - mean) / Math.sqrt(variance), 3), 0
    ) / n;
    
    return skewness;
  }

  private calculateKurtosis(numbers: number[]): number {
    const mean = _.mean(numbers);
    const variance = this.variance(numbers);
    const n = numbers.length;
    
    const kurtosis = numbers.reduce((sum, x) => 
      sum + Math.pow((x - mean) / Math.sqrt(variance), 4), 0
    ) / n - 3;
    
    return kurtosis;
  }

  private normalDistribution(values: number[]): any {
    const mean = _.mean(values);
    const std = Math.sqrt(this.variance(values));
    
    return {
      parameters: { mean, std },
      pdf: values.map(x => 
        Math.exp(-0.5 * Math.pow((x - mean) / std, 2)) / (std * Math.sqrt(2 * Math.PI))
      ),
      cdf: values.map(x => 0.5 * (1 + this.erf((x - mean) / (std * Math.sqrt(2)))))
    };
  }

  private exponentialDistribution(values: number[]): any {
    const lambda = 1 / _.mean(values);
    
    return {
      parameters: { lambda },
      pdf: values.map(x => x >= 0 ? lambda * Math.exp(-lambda * x) : 0),
      cdf: values.map(x => x >= 0 ? 1 - Math.exp(-lambda * x) : 0)
    };
  }

  private poissonDistribution(values: number[]): any {
    const lambda = _.mean(values);
    
    return {
      parameters: { lambda },
      pmf: values.map(k => {
        const intK = Math.floor(k);
        return intK >= 0 ? Math.pow(lambda, intK) * Math.exp(-lambda) / this.factorial(intK) : 0;
      })
    };
  }

  private erf(x: number): number {
    // Approximation of error function
    const a1 =  0.254829592;
    const a2 = -0.284496736;
    const a3 =  1.421413741;
    const a4 = -1.453152027;
    const a5 =  1.061405429;
    const p  =  0.3275911;

    const sign = x >= 0 ? 1 : -1;
    x = Math.abs(x);

    const t = 1.0 / (1.0 + p * x);
    const y = 1.0 - (((((a5 * t + a4) * t) + a3) * t + a2) * t + a1) * t * Math.exp(-x * x);

    return sign * y;
  }

  private factorial(n: number): number {
    if (n <= 1) return 1;
    let result = 1;
    for (let i = 2; i <= n; i++) {
      result *= i;
    }
    return result;
  }

  private calculateCorrelations(data: any[]): any {
    const correlations: any = {};
    const fields = ['value', 'id'];
    
    for (let i = 0; i < fields.length; i++) {
      for (let j = i + 1; j < fields.length; j++) {
        const field1 = fields[i];
        const field2 = fields[j];
        const values1 = data.map(d => d[field1]).filter(v => typeof v === 'number');
        const values2 = data.map(d => d[field2]).filter(v => typeof v === 'number');
        
        correlations[`${field1}_${field2}`] = this.pearsonCorrelation(values1, values2);
      }
    }
    
    return correlations;
  }

  private pearsonCorrelation(x: number[], y: number[]): number {
    const n = Math.min(x.length, y.length);
    const sumX = _.sum(x.slice(0, n));
    const sumY = _.sum(y.slice(0, n));
    const sumXY = _.sum(x.slice(0, n).map((xi, i) => xi * y[i]));
    const sumX2 = _.sum(x.slice(0, n).map(xi => xi * xi));
    const sumY2 = _.sum(y.slice(0, n).map(yi => yi * yi));
    
    const numerator = n * sumXY - sumX * sumY;
    const denominator = Math.sqrt((n * sumX2 - sumX * sumX) * (n * sumY2 - sumY * sumY));
    
    return denominator === 0 ? 0 : numerator / denominator;
  }

  private linearRegression(data: any[]): any {
    const x = data.map((d, i) => i);
    const y = data.map(d => d.value);
    const n = data.length;
    
    const sumX = _.sum(x);
    const sumY = _.sum(y);
    const sumXY = _.sum(x.map((xi, i) => xi * y[i]));
    const sumX2 = _.sum(x.map(xi => xi * xi));
    
    const slope = (n * sumXY - sumX * sumY) / (n * sumX2 - sumX * sumX);
    const intercept = (sumY - slope * sumX) / n;
    
    return {
      slope,
      intercept,
      rSquared: this.calculateRSquared(x, y, slope, intercept),
      predictions: x.map(xi => slope * xi + intercept)
    };
  }

  private calculateRSquared(x: number[], y: number[], slope: number, intercept: number): number {
    const yMean = _.mean(y);
    const predictions = x.map(xi => slope * xi + intercept);
    
    const ssRes = _.sum(y.map((yi, i) => Math.pow(yi - predictions[i], 2)));
    const ssTot = _.sum(y.map(yi => Math.pow(yi - yMean, 2)));
    
    return 1 - (ssRes / ssTot);
  }

  private calculateTrend(timeSeries: any[]): any {
    const values = timeSeries.map(d => d.value);
    const indices = timeSeries.map((_, i) => i);
    
    return this.linearRegression(timeSeries.map((d, i) => ({ value: d.value, index: i })));
  }

  private detectSeasonality(timeSeries: any[]): any {
    const values = timeSeries.map(d => d.value);
    const periods = [7, 12, 24, 30]; // Common seasonal periods
    
    return periods.map(period => ({
      period,
      strength: this.calculateSeasonalStrength(values, period),
      pattern: this.extractSeasonalPattern(values, period)
    }));
  }

  private calculateSeasonalStrength(values: number[], period: number): number {
    if (values.length < period * 2) return 0;
    
    const seasonalMeans = _.range(period).map(i => {
      const seasonalValues = values.filter((_, idx) => idx % period === i);
      return _.mean(seasonalValues);
    });
    
    const overallMean = _.mean(values);
    const seasonalVariance = _.mean(seasonalMeans.map(mean => Math.pow(mean - overallMean, 2)));
    const totalVariance = this.variance(values);
    
    return totalVariance === 0 ? 0 : seasonalVariance / totalVariance;
  }

  private extractSeasonalPattern(values: number[], period: number): number[] {
    return _.range(period).map(i => {
      const seasonalValues = values.filter((_, idx) => idx % period === i);
      return _.mean(seasonalValues);
    });
  }

  private calculateAutocorrelation(timeSeries: any[]): number[] {
    const values = timeSeries.map(d => d.value);
    const maxLag = Math.min(20, Math.floor(values.length / 4));
    
    return _.range(1, maxLag + 1).map(lag => {
      const x = values.slice(0, -lag);
      const y = values.slice(lag);
      return this.pearsonCorrelation(x, y);
    });
  }

  private calculateMovingAverages(timeSeries: any[], windows: number[]): any {
    const values = timeSeries.map(d => d.value);
    
    return windows.reduce((acc, window) => {
      acc[`ma_${window}`] = values.map((_, i) => {
        if (i < window - 1) return null;
        const windowValues = values.slice(i - window + 1, i + 1);
        return _.mean(windowValues);
      }).filter(v => v !== null);
      return acc;
    }, {} as any);
  }

  private simpleForecasting(timeSeries: any[], steps: number): number[] {
    const values = timeSeries.map(d => d.value);
    const trend = this.calculateTrend(timeSeries);
    const lastIndex = values.length - 1;
    
    return _.range(steps).map(i => {
      const futureIndex = lastIndex + i + 1;
      return trend.slope * futureIndex + trend.intercept;
    });
  }
}
