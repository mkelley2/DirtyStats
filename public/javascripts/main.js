var app = {};

$(document).ready(function(){
  app.mercs = new MercCollection;

  app.gui = new GUI(app.mercs, '#app');
});
