#!/usr/bin/env node

// Only work on std-in at the moment
var cukeme = require('../');
var JSONStream = require('JSONStream');
var argv = require('argh').argv;

if (argv.bootstrap || argv.bootstrap === undefined) {
  process.stdout.write('link(rel="stylesheet" href="https://maxcdn.bootstrapcdn.com/bootstrap/3.3.2/css/bootstrap.min.css")\n');
}

if (argv.css) {
  argv.css.split(',').forEach(function (item) {
    process.stdout.write('link(rel="stylesheet" href="' + item + '")\n');
  });
}

process.stdin
  .pipe(JSONStream.parse('*'))
  .pipe(cukeme(argv).jadify)
  .pipe(process.stdout);
