var Leaflet    = require("leaflet");
module.exports = require("lib.Controller").extend("LeafletMapController", {

  L: Leaflet,

  init: function(options, cb){

    var opts      = this.config;
    var container = opts.container;
    var element;
    if(!container) element = document.body;
    else           element = document.querySelector(container);
    var self = this;

    Leaflet.Icon.Default.imagePath = opts.icon_default_image_path;

    if(opts.map_options.maxBounds){
      var southWest = Leaflet.latLng(opts.map_options.maxBounds.sw[0], opts.map_options.maxBounds.sw[1]);
      var northEast = Leaflet.latLng(opts.map_options.maxBounds.ne[0], opts.map_options.maxBounds.ne[1]);
      opts.map_options.maxBounds = Leaflet.latLngBounds(southWest, northEast);
    }

    if(opts.map_options.center){
      opts.map_options.center = Leaflet.latLng(opts.map_options.center[0], opts.map_options.center[1]);
    }

    this.map = Leaflet.map(element, opts.map_options);

    Leaflet.tileLayer(opts.tilelayer_api, {
      attribution: opts.attribution,
    }).addTo(this.map);

    this.map.setView(opts.center, 10);

    this.fitSize();

    if(this.mapEvents){
      for(var key in this.mapEvents){
        var hndl_name = this.mapEvents[key];
        this.map.on(key, this[hndl_name], self);
      }
    }

    cb();
    this.trigger("init");
  },

  fitSize: function(){
    setTimeout(this.map.invalidateSize.bind(this.map), 10);
  }
 
},
{
  L: Leaflet
});
