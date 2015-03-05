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
      queue.push('header ' + opts.header + EOL);
      }
      queue.push('div.panel.panel-default' + EOL);
      queue.push('  div.panel-heading' + EOL);
      queue.push('    h3.{color} ' + data.keyword + ': ' + data.name + EOL); // Colour text
      queue.push('  div.panel-body ' + data.description + EOL);
      data.elements.forEach(function (el) {
      queue.push('    div.row' + EOL);
      queue.push('      div.col-sm-offset-2.col-sm-10' + EOL);
      queue.push('        h3 ' + el.keyword + ': ' + el.name + EOL);
      el.steps.forEach(function (step) {
      queue.push('      div.col-sm-offset-4.col-sm-10' + EOL);
      queue.push('        h4.' + LOOKUP[step.result.status] + ' ' + step.keyword + step.name + EOL);
        if (step.result.status === 'undefined' && overall !== 'failed') {
          overall = 'undefined';
        } else if (step.result.status === 'failed') {
          overall = 'failed';
        }
      });
      });
      queue.push(EOL);

      queue.forEach(function (item) {
        this.queue(item.replace('{color}', LOOKUP[overall]));
      }.bind(this));
    })
  };
}

;
