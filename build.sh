#!/bin/bash

echo "Installing dependencies for all projects..."
cd react-app
npm install
cd ..
cd webpack-heavy-app
npm install
cd ..
cd typescript-app
npm install
cd ..
cd node-microservices
npm install
echo "All installations complete!"
