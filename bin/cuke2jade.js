#!/usr/bin/env node

// Only work on std-in at the moment
var cukeme = require('../');
var JSONStream = require('JSONStream');
process.stdout.write('link(rel="stylesheet" href="https://maxcdn.bootstrapcdn.com/bootstrap/3.3.2/css/bootstrap.min.css")\n');
process.stdin
  .pipe(JSONStream.parse('*'))
  .pipe(cukeme.jadify)
  .pipe(process.stdout);
