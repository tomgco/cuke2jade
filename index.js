var through = require('through');
var EOL = '\n';

var LOOKUP = {
  'passed': 'text-success',
  'failed': 'text-danger',
  'undefined': 'text-warning',
  'skipped': 'text-primary'
};

module.exports = function (opts) {
  // We need to buffer =[
  var queue = [];
  var overall = [];

  var progress = {
    passed: 0,
    failed: 0,
    undefined: 0,
    skipped: 0
  };
  return {
    jadify: through(function (data) {
      var group = '';
      queue.push('section' + EOL);
      queue.push('  div.row' + EOL);
      queue.push('    div.col-md-offset-1.col-md-10' + EOL);
      queue.push('      article.col-md-offset-1.col-md-10' + EOL);
      queue.push('        div.panel.panel-default' + EOL);
      queue.push('          div.panel-heading' + EOL);
      queue.push('            h4.{color} ' + data.keyword + ': ' + data.name + EOL);
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
        progress[step.result.status]++;
        if (step.result.status === 'undefined' && group !== 'failed') {
          group = 'undefined';
        } else if (step.result.status === 'failed') {
          group = 'failed';
        } else if (step.result.status === 'skipped' && group !== 'undefined') {
          group = 'skipped';
        }
      });
      if (index !== array.length - 1) {
      queue.push('            hr' + EOL);
      }
      overall.push(group);
      });
      queue.push(EOL);
    }, function () {
      var total = Object.keys(progress).reduce(function (prev, curr) {
        return prev + progress[curr];
      }, 0);
      this.queue('mixin progress' + EOL);
      this.queue('  .progress' + EOL);
      this.queue('    .progress-bar.progress-bar-success(style="width: ' + (progress.passed / total) * 100 + '%")' + EOL);
      this.queue('    .progress-bar.progress-bar-warning(style="width: ' + (progress.undefined / total) * 100 + '%")' + EOL);
      this.queue('    .progress-bar.progress-bar-danger(style="width: ' + (progress.failed / total) * 100 + '%")' + EOL);
      this.queue('    .progress-bar.progress-bar-primary(style="width: ' + (progress.skipped / total) * 100 + '%")' + EOL);
      if (opts.progress) {
        this.queue('+progress' + EOL);
      }
      if (opts.header) {
        this.queue('header.row' + EOL);
        this.queue('  h1.col-md-offset-2.col-md-10 ' + opts.header + EOL);
      }
      queue.forEach(function (item) {
        this.queue(item.replace('{color}', LOOKUP[overall.shift()]));
      }.bind(this));
    })
  };
};
