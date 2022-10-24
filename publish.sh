#!/bin/bash

npm run build
npm version patch
npm publish
git push origin master
