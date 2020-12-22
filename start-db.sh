#!/usr/bin/env bash

docker run --name graphql-backend-boilerplate -p 27017:27017 -v "$(pwd)/data":/data -ti -d mongo:4.4.2
