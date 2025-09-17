#!/bin/bash

echo "Installing dependencies for all projects..."

cd react-app && npm install && cd ..
cd typescript-app && npm install && cd ..
cd node-microservices && npm install && cd ..
cd node-microservices/auth-service && npm install && cd ../..
cd node-microservices/api-gateway && npm install && cd ../..
cd node-microservices/worker-service && npm install && cd ../..
cd webpack-heavy-app && npm install

wait
echo "All installations complete!"
