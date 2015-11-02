var GUI = (function(){

var totalStats ={
  kills:0,
  deaths:0,
  score:0,
  time:0
}

var HomeView = Backbone.View.extend({
  id:"wrapper",
  render: function(){
    var $h1 = $("<h1 class='head'>").text("Welcome to Dirty Stats");
    var $mercsdiv = $("<div id='mercsdiv'>");

    this.$el.append($h1);
    this.$el.append($mercsdiv);
    $('#app').append(this.$el);
  },
  initialize: function(opts){
    if(opts){
      this.collection = opts.collection
    }
    this.render()
    console.log("homeview rendered");
    var holderview = new HolderView({collection:this.collection})
  },
  events:{}
});

var HolderView = Backbone.View.extend({
  render:function(){
    var $h2 = $('<h2>').text("Mercs List: ");
    var $holderdiv = $('<div id="holderdiv" class="col">')
    var $hengi = $('<h3>').text("Engi:");
    var $engidiv = $('<div id="engidiv" class="row">')
    var $hmedic = $('<h3>').text("Medic: ");
    var $medicdiv = $('<div id="medicdiv" class="row">')
    var $hsupport = $('<h3>').text("Support: ");
    var $supportdiv = $('<div id="supportdiv" class="row">')
    var $hrecon = $('<h3>').text("Recon: ");
    var $recondiv = $('<div id="recondiv" class="row">')
    var $hassault = $('<h3>').text("Assault: ");
    var $assaultdiv = $('<div id="assaultdiv" class="row">')

    $("#mercsdiv").append($h2);
    $("#mercsdiv").append($holderdiv);
    $($holderdiv).append($engidiv);
    $($engidiv).append($hengi);
    $($holderdiv).append($medicdiv);
    $($medicdiv).append($hmedic);
    $($holderdiv).append($supportdiv);
    $($supportdiv).append($hsupport);
    $($holderdiv).append($assaultdiv);
    $($assaultdiv).append($hassault);
    $($holderdiv).append($recondiv);
    $($recondiv).append($hrecon);
  },
  initialize: function(opts){
    if(opts){
      this.collection = opts.collection
    }
    this.render()
    var self = this

    console.log("holderview rendered");
    this.collection.fetch({
      success:function(){
        console.log("Collection Fetched");
        self.collection.forEach(function(element){
          var time = element.attributes.time;
          var x = time.split(":");
          var min = (parseInt(x[0])*60)+parseInt(x[1])+(parseInt(x[2])/60)

          totalStats.kills = parseInt(totalStats.kills) + parseInt(element.attributes.kills)
          totalStats.deaths = parseInt(totalStats.deaths) + parseInt(element.attributes.deaths)
          totalStats.score = parseInt(totalStats.score) + parseInt(element.attributes.score)
          totalStats.time = totalStats.time + min;
          var merc = new MercsView({collection:self.collection, model:element})
        });
        var data = new DataView({collection:self.collection})
      }
    })
  },
  events:{}
});

var MercsView = Backbone.View.extend({
  id:"mercdiv",
  class:"table table-striped table-hover merclist",
  render:function(){
    var $pmerc = $('<p id="merc">').text(this.model.attributes.mercName);
    this.$el.append($pmerc);

    if(this.model.attributes.class === "Engineer"){
    $("#engidiv").append(this.$el);
    }
    if(this.model.attributes.class === "Medic"){
    $("#medicdiv").append(this.$el);
    }
    if(this.model.attributes.class === "Support"){
    $("#supportdiv").append(this.$el);
    }
    if(this.model.attributes.class === "Recon"){
    $("#recondiv").append(this.$el);
    }
    if(this.model.attributes.class === "Assault"){
    $("#assaultdiv").append(this.$el);
    }
  },
  initialize: function(opts){
    if(opts){
      this.collection = opts.collection;
    }
    this.render();
  },
  events:{
    "click":"loadStats"
  },
  loadStats: function(){
    $('#mercdata').empty();
    var stats = new StatsView({model:this.model});
  }
});

var DataView = Backbone.View.extend({
  id: "datadiv",
  render:function(){
    var $statdiv = $("<div id='statdiv' class='col'>");
    var $initclick = $("<h4>").text("Please click on a merc to view Stats");
    var $datadiv = $("<div id='datadiv'>");
    var $mercdata = $("<div id='mercdata'>");
    var $allstats = $("<div id='allstats'>");

    var kdmerc;
    var mercskd=0;
    var spmmerc;
    var mercsspm=0;
    var data = this.collection.models;
    var mapped = data.forEach(function (element, index){
      if((element.attributes.kills/element.attributes.deaths)>mercskd){
        mercskd = (element.attributes.kills/element.attributes.deaths)
        kdmerc = element.attributes.mercName
      }
      var time = element.attributes.time;
      var x = time.split(":");
      var min = (parseInt(x[0])*60)+parseInt(x[1])+(parseInt(x[2])/60)
      var scorepmin = Math.round(element.attributes.score/min)
      if(scorepmin>mercsspm){
        mercsspm = scorepmin;
        spmmerc = element.attributes.mercName
      }
    });

    var $bestmercdiv = $("<div id='bestdiv'>");
    var $bestkd = $("<p>").text("Best K/D: " + kdmerc + " with " + Math.round(mercskd*100)/100);
    var $bestspm = $("<p>").text("Best SPM: " + spmmerc + " with " + mercsspm);


    var k_d = Math.round((totalStats.kills/totalStats.deaths)*100)/100;
    var spm = Math.round((totalStats.score/totalStats.time)*100)/100;
    var totalhr = totalStats.time/60
    var totalmin = (totalhr - Math.floor(totalhr))*60
    var totalsec = (totalmin - Math.floor(totalmin))*60

    var $allul = $("<ul>");
    var $allkd = $("<li>").text("Total K/D: " + k_d);
    var $allkills = $("<li>").text("Total Kills: " + totalStats.kills);
    var $alldeaths = $("<li>").text("Total Deaths: " + totalStats.deaths);
    var $allspm = $("<li>").text("Total SPM: " + spm);
    var $allscore = $("<li>").text("Total Score: " + totalStats.score);
    var $alltime = $("<li>").text("Total Time Played: " + Math.floor(totalhr) + ":" + Math.floor(totalmin) + ":" + Math.floor(totalsec));

    this.$el.append($allstats);
    $allstats.append($allkd);
    $allstats.append($allkills);
    $allstats.append($alldeaths);
    $allstats.append($allspm);
    $allstats.append($allscore);
    $allstats.append($alltime);

    this.$el.append($bestmercdiv);
    $bestmercdiv.append($bestkd);
    $bestmercdiv.append($bestspm);

    this.$el.append($mercdata);
    $mercdata.append($initclick);

    $('#wrapper').append(this.$el);
  },
  initialize: function(opts){
    if(opts){
      this.collection = opts.collection
    }
    this.render()
    var self = this

    console.log("data view rendered");
  },
  events:{}
});

var StatsView = Backbone.View.extend({
  id: "indvMercStats",
  render:function(){
    var time = this.model.attributes.time;
    var x = time.split(":");
    var min = (parseInt(x[0])*60)+parseInt(x[1])+(parseInt(x[2])/60)
    var scorepmin = Math.round(this.model.attributes.score/min)

    $ul = $('<ul>');
    $name = $('<li>').text("Name: " + this.model.attributes.mercName);
    $kd = $('<li>').text("K/d: " + Math.round((this.model.attributes.kills/this.model.attributes.deaths)*100)/100);
    $spm = $('<li>').text("SPM: " + scorepmin);
    $btn = $('<button type="button" id="btn">').text("Update")

    $ul.append($name);
    $ul.append($kd);
    $ul.append($spm);
    $ul.append($btn);
    this.$el.append($ul);
    $("#mercdata").append(this.$el);
  },
  initialize: function(opts){
    if(opts){
      this.collection = opts.collection
      this.model = opts.model;
    }
    this.render()
    console.log("stats view rendered");
  },
  events:{
    "click #btn":"update"
  },
  update: function(){
    $('#mercdata').empty();
    var stats = new UpdateMercView({model:this.model});
  }
});

var UpdateMercView = Backbone.View.extend({
  class:"form-group",
  render:function(){
    var $form = $('<div id="updateForm" class="form-horizontal">')
    var $edit = $("<p>").text("Editing: " + this.model.attributes.mercName)
    var $killLabel = $('<p>').text("New Kill count:")
    var $killbar = $("<input class='form-control' type='textbox' id='killbar' placeholder='"+this.model.attributes.kills+"'>")
    var $deathLabel = $('<p>').text("New Death count:")
    var $deathbar = $("<input class='form-control' type='textbox' id='deathbar' placeholder='"+this.model.attributes.deaths+"'>")
    var $scoreLabel = $('<p>').text("New Score:")
    var $scorebar = $("<input class='form-control' type='textbox' id='scorebar' placeholder='"+this.model.attributes.score+"'>")
    var $timeLabel = $('<p>').text("New Time:")
    var $timebar = $("<input class='form-control' type='textbox' id='timebar' placeholder='"+this.model.attributes.time+"'>")
    var $sbmt = $("<button role='button' id='submit' class='btn btn-primary'>").text("Submit")
    var $cncl = $("<button role='button' id='cancel' class='btn btn-default'>").text("Cancel")
    var $br = $("<br>")

    $form.append($edit);
    $form.append($killLabel);
    $form.append($killbar);
    $form.append($deathLabel);
    $form.append($deathbar);
    $form.append($scoreLabel);
    $form.append($scorebar);
    $form.append($timeLabel);
    $form.append($timebar);
    $form.append($br);
    $form.append($sbmt);
    $form.append($cncl);
    this.$el.append($form);
    $("#mercdata").append(this.$el);
  },
  initialize: function(opts){
    if(opts){
      this.collection = opts.collection;
      this.model = opts.model;
    }
    this.render()
    console.log("update view rendered");
  },
  events:{
    "click #submit": "updateData",
    "click #cancel": "cancelUpdate"
  },
  updateData: function(){
    if(($("input[id='scorebar']").val()) === ""){
        this.model.attributes.score =  this.model.attributes.score
    }else{
      this.model.attributes.score = $("input[id='scorebar']").val()
    }

    if(($("input[id='timebar']").val()) === ""){
        this.model.attributes.time =  this.model.attributes.time
    }else{
      this.model.attributes.time = $("input[id='timebar']").val()
    }

    if(($("input[id='killbar']").val()) === ""){
        this.model.attributes.kills =  this.model.attributes.kills
    }else{
      this.model.attributes.kills = $("input[id='killbar']").val()
    }

    if(($("input[id='deathbar']").val()) === ""){
        this.model.attributes.deaths =  this.model.attributes.deaths
    }else{
      this.model.attributes.deaths = $("input[id='deathbar']").val()
    }

    this.model.attributes.mercName = this.model.attributes.mercName
    this.model.attributes.class = this.model.attributes.class
    this.model.save({success:function(){
      console.log("model saved");
    }});
    $('#mercdata').empty();
    var stats = new StatsView({model:this.model});
  },
  cancelUpdate:function(){
    $('#mercdata').empty();
    var stats = new StatsView({model:this.model});
  }
});

function GUI(mercs){
  var homeview = new HomeView({collection:mercs})
}

return GUI;

}());
