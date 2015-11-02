var MercModel = Backbone.Model.extend({
defaults: {
  mercName:"",
  kills:"",
  deaths:"",
  score:"",
  time:"",
  class:""
}
});

var MercCollection = Backbone.Collection.extend({
  model: MercModel,
  url: "/mercs",
  initialize: function(){
    // this.fetch({
    //   success:function(collection, res, options){
    //     // console.log("MercCollection:", collection);
    //     // console.log("Response is: ", res);
    //     console.log("Merc Collection fetched");
    //     this.collection.forEach(function(element){
    //       var merc = new MercsView({collection:this.collection, model:element})
    //     });
    //   }
    // });
  }
});
