import 'reflect-metadata';
import express from 'express';
import { Observable, from, map, mergeMap, toArray } from 'rxjs';
import _ from 'lodash';
import { DataProcessor } from './services/DataProcessor';
import { ComplexCalculator } from './services/ComplexCalculator';
import { DatabaseManager } from './services/DatabaseManager';

interface DataPoint {
  id: number;
  value: number;
  timestamp: Date;
  metadata: Record<string, any>;
}

class Application {
  private app: express.Application;
  private dataProcessor: DataProcessor;
  private calculator: ComplexCalculator;
  private dbManager: DatabaseManager;

  constructor() {
    this.app = express();
    this.dataProcessor = new DataProcessor();
    this.calculator = new ComplexCalculator();
    this.dbManager = new DatabaseManager();
    this.setupRoutes();
  }

  private setupRoutes(): void {
    this.app.get('/process', async (req, res) => {
      const data = this.generateHeavyData(10000);
      const processed = await this.processDataStream(data);
      res.json({ processed: processed.length, sample: processed.slice(0, 10) });
    });

    this.app.get('/calculate', async (req, res) => {
      const results = await this.performComplexCalculations();
      res.json(results);
    });
  }

  private generateHeavyData(count: number): DataPoint[] {
    return _.range(count).map(i => ({
      id: i,
      value: Math.random() * 1000,
      timestamp: new Date(Date.now() + i * 1000),
      metadata: {
        category: `cat_${i % 10}`,
        priority: Math.floor(Math.random() * 5),
        tags: _.range(Math.floor(Math.random() * 10)).map(j => `tag_${j}`),
        nested: {
          level1: { level2: { level3: { data: _.range(50).map(k => k * i) } } }
        }
      }
    }));
  }

  private processDataStream(data: DataPoint[]): Promise<any[]> {
    return from(data)
      .pipe(
        map(item => this.dataProcessor.transform(item)),
        mergeMap(item => this.calculator.complexOperation(item), 10),
        toArray()
      )
      .toPromise() as Promise<any[]>;
  }

  private async performComplexCalculations(): Promise<any> {
    const matrices = _.range(5).map(() => 
      _.range(100).map(() => _.range(100).map(() => Math.random()))
    );
    
    return {
      matrixOperations: await this.calculator.matrixOperations(matrices),
      statisticalAnalysis: await this.calculator.statisticalAnalysis(this.generateHeavyData(5000)),
      timeSeriesAnalysis: await this.calculator.timeSeriesAnalysis(this.generateHeavyData(1000))
    };
  }

  public start(port: number = 3000): void {
    this.app.listen(port, () => {
      console.log(`Heavy TypeScript app running on port ${port}`);
    });
  }
}

const app = new Application();
app.start();
