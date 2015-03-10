var through = require('through');
var EOL = '\n';

var LOOKUP = {
  'passed': 'text-success',
  'failed': 'text-danger',
  'undefined': 'text-warning',
  'skipped': 'text-warning'
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
      queue.push('  div.col-md-6' + EOL);
      queue.push('    div.panel.panel-default' + EOL);
      queue.push('      div.panel-heading' + EOL);
      queue.push('        a(href="#' + data.id + '")' + EOL);
      queue.push('          h4#' + data.id + ' ' + data.name + EOL);
      queue.push('      div.panel-body ' + EOL);
      data.elements.forEach(function (el) {
      queue.push('        h4.{color}.col-md-12 ' + el.name + EOL);
      var group = 'passed';
      el.steps.forEach(function (step) {
        progress[step.result.status]++;
        if (step.result.status === 'failed' || group === 'failed') {
          group = 'failed';
          return;
        }

        if (step.result.status === 'skipped' || group === 'undefined') {
          group = 'undefined';
          return;
        }

        if (step.result.status === 'undefined' || group === 'undefined') {
          group = 'undefined';
          return;
        }
      });
      overall.push(group);
      });
      queue.push(EOL);
    }, function () {
      if (opts.header) {
        this.queue('header.row' + EOL);
        this.queue('  h1.col-md-offset-2.col-md-10 ' + opts.header + EOL);
      }
      var total = Object.keys(progress).reduce(function (prev, curr) {
        return prev + progress[curr];
      }, 0);
      this.queue('mixin progress' + EOL);
      this.queue('  .progress' + EOL);
      this.queue('    .progress-bar.progress-bar-success(style="width: ' + (progress.passed / total) * 100 + '%")' + EOL);
      this.queue('    .progress-bar.progress-bar-danger(style="width: ' + (progress.failed / total) * 100 + '%")' + EOL);
      this.queue('    .progress-bar.progress-bar-warning(style="width: ' + (progress.undefined / total) * 100 + '%")' + EOL);
      this.queue('    .progress-bar.progress-bar-warning(style="width: ' + (progress.skipped / total) * 100 + '%")' + EOL);
      if (opts.progress) {
        this.queue('+progress' + EOL);
      }
      this.queue('section.container' + EOL);
      queue.forEach(function (item) {
        if (item.indexOf('{color}') > -1) {
          this.queue(item.replace('{color}', LOOKUP[overall.shift()]));
        } else {
          this.queue(item);
        }
      }.bind(this));
    })
  };
};
