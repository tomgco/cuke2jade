var through = require('through');
var EOL = '\n';

var LOOKUP = {
  'passed': 'text-success',
  'failed': 'text-danger',
  'undefined': 'text-warning'
};

module.exports = function (opts) {
  return {
    jadify: through(function (data) {
      var queue = [];
      var overall = 'passed';
      if (opts.header) {
        queue.push('header.row' + EOL);
        queue.push('  h1.col-md-offset-1.col-md-11 ' + opts.header + EOL);
      }
      queue.push('section' + EOL);
      queue.push('  div.row' + EOL);
      queue.push('    div.col-md-offset-1.col-md-10' + EOL);
      queue.push('      article.col-md-offset-1.col-md-10' + EOL);
      queue.push('        div.panel.panel-default' + EOL);
      queue.push('          div.panel-heading' + EOL);
      queue.push('            h4 ' + data.keyword + ': ' + data.name + EOL);
      queue.push('          div.panel-body ' + data.description + EOL);
      data.elements.forEach(function (el) {
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
        queue.push('            hr' + EOL);
      });
      queue.push(EOL);

      queue.forEach(function (item) {
        this.queue(item.replace('{color}', LOOKUP[overall]));
      }.bind(this));
    })
  }
}
