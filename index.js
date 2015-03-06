var through = require('through');
var EOL = '\n';

var LOOKUP = {
  'passed': 'text-success',
  'failed': 'text-danger',
  'undefined': 'text-warning'
};

module.exports = function (opts) {
  if (opts.header) {
    process.stdout.write('header.row' + EOL);
    process.stdout.write('  h1.col-md-offset-2.col-md-10 ' + opts.header + EOL);
  }
  return {
    jadify: through(function (data) {
      var queue = [];
      var overall = 'passed';
      queue.push('section' + EOL);
      queue.push('  div.row' + EOL);
      queue.push('    div.col-md-offset-1.col-md-10' + EOL);
      queue.push('      article.col-md-offset-1.col-md-10' + EOL);
      queue.push('        div.panel.panel-default' + EOL);
      queue.push('          div.panel-heading' + EOL);
      queue.push('            h4 ' + data.keyword + ': ' + data.name + EOL);
      if (data.description) {
      queue.push('            p.h6 ' + data.description + EOL);
      }
      queue.push('          div.panel-body ' + EOL);
      data.elements.forEach(function (el, index, array) {
      queue.push('            article.row' + EOL);
      queue.push('              h4.col-md-12 ' + el.keyword + ': ' + el.name + EOL);
      el.steps.forEach(function (step) {
      queue.push('              div.col-sm-offset-3.col-sm-9' + EOL);
      queue.push('                h5.' + LOOKUP[step.result.status] + ' ' + step.keyword + step.name + EOL);
          if (step.result.status === 'undefined' && overall !== 'failed') {
            overall = 'undefined';
          } else if (step.result.status === 'failed') {
            overall = 'failed';
          }
        });
      if (index !== array.length - 1) {
      queue.push('            hr' + EOL);
      }
      });
      queue.push(EOL);

      queue.forEach(function (item) {
        this.queue(item.replace('{color}', LOOKUP[overall]));
      }.bind(this));
    })
  };
};
