#!/usr/bin/env node

// Only work on std-in at the moment
var cukeme = require('../');
var JSONStream = require('JSONStream');
process.stdout.write('link(rel="stylesheet" href="http://bootswatch.com/paper/bootstrap.css")\n');
process.stdin
  .pipe(JSONStream.parse('*'))
  .pipe(cukeme.jadify)
  .pipe(process.stdout);
