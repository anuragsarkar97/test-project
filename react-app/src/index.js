import React from 'react';
import ReactDOM from 'react-dom/client';
import { Provider } from 'react-redux';
import { BrowserRouter } from 'react-router-dom';
import { configureStore } from '@reduxjs/toolkit';
import _ from 'lodash';
import moment from 'moment';
import App from './App';

const store = configureStore({
  reducer: {
    data: (state = { items: [] }, action) => {
      switch (action.type) {
        case 'ADD_ITEM':
          return { ...state, items: [...state.items, action.payload] };
        default:
          return state;
      }
    }
  }
});

// Generate heavy initial data
const heavyData = _.range(1000).map(i => ({
  id: i,
  name: `Item ${i}`,
  timestamp: moment().add(i, 'minutes').format(),
  data: _.range(100).map(j => ({ value: Math.random() * 1000, index: j }))
}));

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <Provider store={store}>
    <BrowserRouter>
      <App initialData={heavyData} />
    </BrowserRouter>
  </Provider>
);
