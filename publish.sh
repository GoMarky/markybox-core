#!/bin/bash

npm run lib
npm version patch
npm publish
git push origin master
