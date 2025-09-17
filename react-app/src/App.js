import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import _ from 'lodash';

const Container = styled.div`
  padding: 20px;
  max-width: 1200px;
  margin: 0 auto;
`;

const Grid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: 20px;
  margin-top: 20px;
`;

const Card = styled.div`
  border: 1px solid #ddd;
  border-radius: 8px;
  padding: 16px;
  background: white;
  box-shadow: 0 2px 4px rgba(0,0,0,0.1);
`;

function App({ initialData }) {
  const [data, setData] = useState(initialData);
  const [processedData, setProcessedData] = useState([]);

  useEffect(() => {
    // Heavy computation
    const processed = data.map(item => ({
      ...item,
      average: _.meanBy(item.data, 'value'),
      sum: _.sumBy(item.data, 'value'),
      max: _.maxBy(item.data, 'value')?.value,
      min: _.minBy(item.data, 'value')?.value,
      sorted: _.sortBy(item.data, 'value'),
      grouped: _.groupBy(item.data, d => Math.floor(d.value / 100))
    }));
    setProcessedData(processed);
  }, [data]);

  return (
    <Container>
      <h1>Heavy React Application</h1>
      <p>Processing {data.length} items with complex calculations</p>
      <Grid>
        {processedData.slice(0, 50).map(item => (
          <Card key={item.id}>
            <h3>{item.name}</h3>
            <p>Average: {item.average?.toFixed(2)}</p>
            <p>Sum: {item.sum?.toFixed(2)}</p>
            <p>Range: {item.min?.toFixed(2)} - {item.max?.toFixed(2)}</p>
            <p>Data points: {item.data.length}</p>
          </Card>
        ))}
      </Grid>
    </Container>
  );
}

export default App;
