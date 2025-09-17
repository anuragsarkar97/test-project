import React from 'react';
import ReactDOM from 'react-dom/client';
import * as d3 from 'd3';
import * as THREE from 'three';
import { Chart } from 'chart.js/auto';
import { gsap } from 'gsap';
import _ from 'lodash';
import moment from 'moment';
import './styles.scss';

// Heavy imports and initialization
const heavyModules = [
  () => import('./components/HeavyComponent'),
  () => import('./utils/HeavyUtils'),
  () => import('./services/DataService'),
  () => import('./services/AnalyticsService'),
  () => import('./components/Dashboard'),
  () => import('./components/Charts'),
  () => import('./components/ThreeScene'),
  () => import('./utils/MathUtils'),
  () => import('./utils/DataProcessor'),
  () => import('./services/ApiService')
];

class Application {
  constructor() {
    this.modules = new Map();
    this.data = this.generateHeavyData();
    this.init();
  }

  async init() {
    console.log('Loading heavy application...');
    
    // Load all modules dynamically
    const modulePromises = heavyModules.map(async (moduleLoader, index) => {
      const module = await moduleLoader();
      this.modules.set(`module_${index}`, module);
      return module;
    });

    await Promise.all(modulePromises);
    
    this.setupThreeJS();
    this.setupD3Visualizations();
    this.setupCharts();
    this.setupAnimations();
    this.render();
  }

  generateHeavyData() {
    return {
      timeSeries: _.range(10000).map(i => ({
        timestamp: moment().subtract(i, 'minutes').toDate(),
        value: Math.sin(i / 100) * 100 + Math.random() * 50,
        category: `category_${i % 20}`,
        metadata: {
          id: i,
          processed: false,
          tags: _.range(Math.floor(Math.random() * 10)).map(j => `tag_${j}`),
          nested: {
            level1: { level2: { level3: Math.random() * 1000 } }
          }
        }
      })),
      matrix: _.range(100).map(() => _.range(100).map(() => Math.random())),
      graph: this.generateGraphData(1000, 5000),
      spatial: this.generateSpatialData(5000)
    };
  }

  generateGraphData(nodes, edges) {
    const nodeData = _.range(nodes).map(i => ({
      id: i,
      label: `Node ${i}`,
      value: Math.random() * 100,
      category: Math.floor(Math.random() * 10),
      position: { x: Math.random() * 1000, y: Math.random() * 1000 }
    }));

    const edgeData = _.range(edges).map(i => ({
      source: Math.floor(Math.random() * nodes),
      target: Math.floor(Math.random() * nodes),
      weight: Math.random(),
      type: ['directed', 'undirected'][Math.floor(Math.random() * 2)]
    }));

    return { nodes: nodeData, edges: edgeData };
  }

  generateSpatialData(count) {
    return _.range(count).map(i => ({
      id: i,
      coordinates: {
        x: (Math.random() - 0.5) * 1000,
        y: (Math.random() - 0.5) * 1000,
        z: (Math.random() - 0.5) * 1000
      },
      properties: {
        color: `hsl(${Math.random() * 360}, 70%, 50%)`,
        size: Math.random() * 10 + 1,
        opacity: Math.random() * 0.8 + 0.2
      }
    }));
  }

  setupThreeJS() {
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
    const renderer = new THREE.WebGLRenderer();
    
    renderer.setSize(800, 600);
    document.getElementById('three-container').appendChild(renderer.domElement);

    // Create complex geometry
    const geometries = [
      new THREE.BoxGeometry(1, 1, 1),
      new THREE.SphereGeometry(0.5, 32, 32),
      new THREE.ConeGeometry(0.5, 1, 32),
      new THREE.TorusGeometry(0.5, 0.2, 16, 100)
    ];

    // Add many objects
    for (let i = 0; i < 1000; i++) {
      const geometry = geometries[Math.floor(Math.random() * geometries.length)];
      const material = new THREE.MeshBasicMaterial({ 
        color: Math.random() * 0xffffff,
        transparent: true,
        opacity: Math.random() * 0.8 + 0.2
      });
      
      const mesh = new THREE.Mesh(geometry, material);
      mesh.position.set(
        (Math.random() - 0.5) * 20,
        (Math.random() - 0.5) * 20,
        (Math.random() - 0.5) * 20
      );
      mesh.rotation.set(
        Math.random() * Math.PI,
        Math.random() * Math.PI,
        Math.random() * Math.PI
      );
      
      scene.add(mesh);
    }

    camera.position.z = 15;

    const animate = () => {
      requestAnimationFrame(animate);
      
      scene.children.forEach(child => {
        if (child instanceof THREE.Mesh) {
          child.rotation.x += 0.01;
          child.rotation.y += 0.01;
        }
      });
      
      renderer.render(scene, camera);
    };
    
    animate();
  }

  setupD3Visualizations() {
    const svg = d3.select('#d3-container')
      .append('svg')
      .attr('width', 800)
      .attr('height', 600);

    // Complex force simulation
    const simulation = d3.forceSimulation(this.data.graph.nodes)
      .force('link', d3.forceLink(this.data.graph.edges).id(d => d.id))
      .force('charge', d3.forceManyBody().strength(-30))
      .force('center', d3.forceCenter(400, 300))
      .force('collision', d3.forceCollide().radius(5));

    const link = svg.append('g')
      .selectAll('line')
      .data(this.data.graph.edges)
      .enter().append('line')
      .attr('stroke', '#999')
      .attr('stroke-opacity', 0.6)
      .attr('stroke-width', d => Math.sqrt(d.weight) * 2);

    const node = svg.append('g')
      .selectAll('circle')
      .data(this.data.graph.nodes)
      .enter().append('circle')
      .attr('r', d => Math.sqrt(d.value))
      .attr('fill', d => d3.schemeCategory10[d.category])
      .call(d3.drag()
        .on('start', dragstarted)
        .on('drag', dragged)
        .on('end', dragended));

    simulation.on('tick', () => {
      link
        .attr('x1', d => d.source.x)
        .attr('y1', d => d.source.y)
        .attr('x2', d => d.target.x)
        .attr('y2', d => d.target.y);

      node
        .attr('cx', d => d.x)
        .attr('cy', d => d.y);
    });

    function dragstarted(event, d) {
      if (!event.active) simulation.alphaTarget(0.3).restart();
      d.fx = d.x;
      d.fy = d.y;
    }

    function dragged(event, d) {
      d.fx = event.x;
      d.fy = event.y;
    }

    function dragended(event, d) {
      if (!event.active) simulation.alphaTarget(0);
      d.fx = null;
      d.fy = null;
    }
  }

  setupCharts() {
    // Time series chart
    const timeSeriesCtx = document.getElementById('timeseries-chart').getContext('2d');
    new Chart(timeSeriesCtx, {
      type: 'line',
      data: {
        labels: this.data.timeSeries.slice(0, 100).map(d => moment(d.timestamp).format('HH:mm')),
        datasets: [{
          label: 'Time Series Data',
          data: this.data.timeSeries.slice(0, 100).map(d => d.value),
          borderColor: 'rgb(75, 192, 192)',
          tension: 0.1
        }]
      },
      options: {
        responsive: true,
        scales: {
          y: {
            beginAtZero: true
          }
        }
      }
    });

    // Matrix heatmap
    const matrixCtx = document.getElementById('matrix-chart').getContext('2d');
    const matrixData = this.data.matrix.flat().map((value, index) => ({
      x: index % 100,
      y: Math.floor(index / 100),
      v: value
    }));

    new Chart(matrixCtx, {
      type: 'scatter',
      data: {
        datasets: [{
          label: 'Matrix Data',
          data: matrixData,
          backgroundColor: (ctx) => {
            const value = ctx.parsed.v;
            return `rgba(${Math.floor(value * 255)}, 100, 150, 0.8)`;
          }
        }]
      },
      options: {
        responsive: true,
        scales: {
          x: { type: 'linear', position: 'bottom' },
          y: { type: 'linear' }
        }
      }
    });
  }

  setupAnimations() {
    // GSAP animations
    gsap.timeline({ repeat: -1 })
      .to('.animated-element', { duration: 2, rotation: 360, scale: 1.2 })
      .to('.animated-element', { duration: 2, rotation: 0, scale: 1 });

    // Animate data points
    gsap.fromTo('.data-point', 
      { opacity: 0, y: 50 },
      { opacity: 1, y: 0, duration: 1, stagger: 0.1 }
    );
  }

  render() {
    const root = ReactDOM.createRoot(document.getElementById('root'));
    root.render(
      <div className="heavy-app">
        <h1>Heavy Webpack Application</h1>
        <div className="container">
          <div id="three-container" className="visualization-panel"></div>
          <div id="d3-container" className="visualization-panel"></div>
          <div className="charts-panel">
            <canvas id="timeseries-chart"></canvas>
            <canvas id="matrix-chart"></canvas>
          </div>
          <div className="animated-elements">
            {_.range(50).map(i => (
              <div key={i} className="animated-element data-point">
                Element {i}
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }
}

// Initialize application
new Application();
