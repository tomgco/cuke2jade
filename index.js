var through = require('through');
var EOL = '\n';

module.exports.jadify = through(function (data) {
  this.queue('div.panel.panel-default' + EOL);
  this.queue('  div.panel-heading' + EOL);
  this.queue('    h3 ' + data.keyword + ': ' + data.name + EOL); // Colour text
  this.queue('  div.panel-body ' + data.description + EOL);
  data.elements.forEach(function (el) {
  this.queue('    div.row' + EOL);
  this.queue('      div.col-sm-offset-2.col-sm-10' + EOL);
  this.queue('        h3 ' + el.keyword + ': ' + el.name + EOL);
  el.steps.forEach(function (step) {
  this.queue('      div.col-sm-offset-4.col-sm-10' + EOL);
  this.queue('        h4.' + ((step.result.status === 'passed') ? 'green' : 'red') + ' ' + step.keyword + step.name + EOL);
  }.bind(this));
  }.bind(this));
  this.queue(EOL);
});
