// Generated by CoffeeScript 1.3.3
(function() {
  var AreaSummary, CustomMap,
    __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; };

  CustomMap = (function() {

    function CustomMap(id) {
      this.toggleMarkerList = __bind(this.toggleMarkerList, this);

      this.handleExport = __bind(this.handleExport, this);

      this.handleMarkerRemovalTool = __bind(this.handleMarkerRemovalTool, this);

      this.handleDevMod = __bind(this.handleDevMod, this);

      var _this = this;
      this.blankTilePath = 'tiles/00empty.jpg';
      this.iconsPath = 'assets/images/icons/32x32';
      this.maxZoom = 7;
      this.lngContainer = $('#long');
      this.latContainer = $('#lat');
      this.devModInput = $('#dev-mod');
      this.optionsBox = $('#options-box');
      this.addMarkerLink = $('#add-marker');
      this.removeMarkerLink = $('#remove-marker');
      this.markerList = $('#marker-list');
      this.exportBtn = $('#export');
      this.exportWindow = $('#export-windows');
      this.canRemoveMarker = false;
      this.draggableMarker = false;
      this.visibleMarkers = true;
      this.gMapOptions = {
        center: new google.maps.LatLng(25.760319754713887, -35.6396484375),
        zoom: 6,
        minZoom: 4,
        maxZoom: this.maxZoom,
        streetViewControl: false,
        mapTypeControl: false,
        mapTypeControlOptions: {
          mapTypeIds: ["custom", google.maps.MapTypeId.ROADMAP]
        }
      };
      this.customMapType = new google.maps.ImageMapType({
        getTileUrl: function(coord, zoom) {
          var normalizedCoord, path;
          normalizedCoord = coord;
          if (normalizedCoord && (normalizedCoord.x < Math.pow(2, zoom)) && (normalizedCoord.x > -1) && (normalizedCoord.y < Math.pow(2, zoom)) && (normalizedCoord.y > -1)) {
            return path = 'tiles/' + zoom + '_' + normalizedCoord.x + '_' + normalizedCoord.y + '.jpg';
          } else {
            return _this.blankTilePath;
          }
        },
        tileSize: new google.maps.Size(256, 256),
        maxZoom: this.maxZoom,
        name: 'GW2 Map'
      });
      this.map = new google.maps.Map($(id)[0], this.gMapOptions);
      this.map.mapTypes.set('custom', this.customMapType);
      this.map.setMapTypeId('custom');
      google.maps.event.addListener(this.map, 'mousemove', function(e) {
        _this.lngContainer.html(e.latLng.lng());
        return _this.latContainer.html(e.latLng.lat());
      });
      google.maps.event.addListener(this.map, 'zoom_changed', function(e) {
        var overlay;
        if (_this.map.getZoom() === 4) {
          _this.visibleMarkers = false;
          _this.hideAllMarker();
          overlay = new AreaSummary(_this.map, Areas[0]);
          return overlay = new AreaSummary(_this.map, Areas[1]);
        } else if (_this.visibleMarkers === false) {
          console.log("showing marker");
          _this.visibleMarkers = true;
          return _this.showAllMarker();
        }
      });
      this.devModInput.bind('click', this.handleDevMod);
      this.gMarker = {};
      this.setAllMarkers();
      this.markerList.find('span').bind('click', function(e) {
        var coord, img, markerType, markerinfo, this_;
        this_ = $(e.currentTarget);
        markerType = this_.attr('data-type');
        coord = _this.map.getCenter();
        markerinfo = {
          "lng": coord.lat(),
          "lat": coord.lng(),
          "title": "--"
        };
        img = "" + _this.iconsPath + "/" + markerType + ".png";
        return _this.addMarkers(markerinfo, img, markerType);
      });
      this.addMarkerLink.bind('click', this.toggleMarkerList);
      this.removeMarkerLink.bind('click', this.handleMarkerRemovalTool);
      this.exportBtn.bind('click', this.handleExport);
      this.exportWindow.find('.close').click(function() {
        return _this.exportWindow.hide();
      });
    }

    CustomMap.prototype.addMarker = function(markerInfo, type) {
      var iconmid, iconsize, image, infoWindow, marker,
        _this = this;
      iconsize = 32;
      iconmid = iconsize / 2;
      image = new google.maps.MarkerImage(this.getIconURLByType(type), null, null, new google.maps.Point(iconmid, iconmid), new google.maps.Size(iconsize, iconsize));
      marker = new google.maps.Marker({
        position: new google.maps.LatLng(markerInfo.lng, markerInfo.lat),
        map: this.map,
        icon: image,
        draggable: this.draggableMarker,
        cursor: this.draggableMarker ? "move" : "pointer",
        title: "" + markerInfo.title
      });
      infoWindow = new google.maps.InfoWindow({
        content: ("" + markerInfo.desc) === "" ? "More info comming soon" : "" + markerInfo.desc,
        maxWidth: 200
      });
      marker["title"] = "" + markerInfo.title;
      marker["desc"] = "" + markerInfo.desc;
      marker["infoWindow"] = infoWindow;
      google.maps.event.addListener(marker, 'dragend', function(e) {
        return console.log("" + (e.latLng.lat()) + ", " + (e.latLng.lng()));
      });
      google.maps.event.addListener(marker, 'click', function(e) {
        if (_this.canRemoveMarker && _this.draggableMarker) {
          return _this.removeMarker(marker.__gm_id);
        } else {
          if (_this.currentOpenedInfoWindow) {
            _this.currentOpenedInfoWindow.close();
          }
          marker.infoWindow.open(_this.map, marker);
          return _this.currentOpenedInfoWindow = marker.infoWindow;
        }
      });
      if (!this.gMarker[type]) {
        this.gMarker[type] = [];
      }
      return this.gMarker[type].push(marker);
    };

    CustomMap.prototype.setAllMarkers = function() {
      var marker, markerArray, type, _results;
      _results = [];
      for (type in Markers) {
        markerArray = Markers[type];
        _results.push((function() {
          var _i, _len, _results1;
          _results1 = [];
          for (_i = 0, _len = markerArray.length; _i < _len; _i++) {
            marker = markerArray[_i];
            _results1.push(this.addMarker(marker, type));
          }
          return _results1;
        }).call(this));
      }
      return _results;
    };

    CustomMap.prototype.getIconURLByType = function(type) {
      var icon;
      for (icon in Resources.Icons) {
        if (icon === type) {
          return Resources.Icons[icon].url;
        }
      }
    };

    CustomMap.prototype.handleDevMod = function(e) {
      var this_;
      this_ = $(e.currentTarget);
      if (this_.prop('checked')) {
        this.setDraggableMarker(true);
        return this.optionsBox.addClass('active');
      } else {
        this.setDraggableMarker(false);
        this.optionsBox.removeClass('active');
        this.markerList.removeClass('active');
        return this.addMarkerLink.removeClass('active');
      }
    };

    CustomMap.prototype.handleMarkerRemovalTool = function(e) {
      if (this.removeMarkerLink.hasClass('active')) {
        this.removeMarkerLink.removeClass('active');
        this.optionsBox.removeClass('red');
        return this.canRemoveMarker = false;
      } else {
        this.removeMarkerLink.addClass('active');
        this.optionsBox.addClass('red');
        this.canRemoveMarker = true;
        this.markerList.removeClass('active');
        return this.addMarkerLink.removeClass('active');
      }
    };

    CustomMap.prototype.handleExport = function(e) {
      var jsonString, marker, markerObject, markers, markersId, nm, _i, _len, _ref;
      markerObject = {};
      _ref = this.gMarker;
      for (markersId in _ref) {
        markers = _ref[markersId];
        if (!markerObject[markersId]) {
          markerObject[markersId] = [];
        }
        for (_i = 0, _len = markers.length; _i < _len; _i++) {
          marker = markers[_i];
          nm = {
            "lng": marker.getPosition().lng(),
            "lat": marker.getPosition().lat(),
            "title": marker.title,
            "desc": marker.desc
          };
          markerObject[markersId].push(nm);
        }
      }
      jsonString = JSON.stringify(markerObject);
      this.exportWindow.find('.content').html(jsonString);
      return this.exportWindow.show();
    };

    CustomMap.prototype.removeMarker = function(id) {
      var marker, markers, markersId, _ref, _results,
        _this = this;
      _ref = this.gMarker;
      _results = [];
      for (markersId in _ref) {
        markers = _ref[markersId];
        this.gMarker[markersId] = _.reject(markers, function(m) {
          return m.__gm_id === id;
        });
        _results.push((function() {
          var _i, _len, _results1;
          _results1 = [];
          for (_i = 0, _len = markers.length; _i < _len; _i++) {
            marker = markers[_i];
            if (marker.__gm_id === id) {
              _results1.push(marker.setMap(null));
            } else {
              _results1.push(void 0);
            }
          }
          return _results1;
        })());
      }
      return _results;
    };

    CustomMap.prototype.setDraggableMarker = function(val) {
      var marker, markers, markersId, _ref, _results;
      this.draggableMarker = val;
      _ref = this.gMarker;
      _results = [];
      for (markersId in _ref) {
        markers = _ref[markersId];
        _results.push((function() {
          var _i, _len, _results1;
          _results1 = [];
          for (_i = 0, _len = markers.length; _i < _len; _i++) {
            marker = markers[_i];
            marker.setDraggable(val);
            if (val) {
              _results1.push(marker.setCursor('move'));
            } else {
              _results1.push(marker.setCursor('pointer'));
            }
          }
          return _results1;
        })());
      }
      return _results;
    };

    CustomMap.prototype.hideAllMarker = function() {
      var marker, markers, markersId, _ref, _results;
      _ref = this.gMarker;
      _results = [];
      for (markersId in _ref) {
        markers = _ref[markersId];
        _results.push((function() {
          var _i, _len, _results1;
          _results1 = [];
          for (_i = 0, _len = markers.length; _i < _len; _i++) {
            marker = markers[_i];
            _results1.push(marker.setVisible(false));
          }
          return _results1;
        })());
      }
      return _results;
    };

    CustomMap.prototype.showAllMarker = function() {
      var marker, markers, markersId, _ref, _results;
      _ref = this.gMarker;
      _results = [];
      for (markersId in _ref) {
        markers = _ref[markersId];
        _results.push((function() {
          var _i, _len, _results1;
          _results1 = [];
          for (_i = 0, _len = markers.length; _i < _len; _i++) {
            marker = markers[_i];
            _results1.push(marker.setVisible(true));
          }
          return _results1;
        })());
      }
      return _results;
    };

    CustomMap.prototype.toggleMarkerList = function(e) {
      var this_;
      this_ = $(e.currentTarget);
      this.markerList.toggleClass('active');
      this_.toggleClass('active');
      if (this_.hasClass('active')) {
        this.removeMarkerLink.removeClass('active');
        this.optionsBox.removeClass('red');
        return this.canRemoveMarker = false;
      }
    };

    return CustomMap;

  })();

  AreaSummary = (function() {

    function AreaSummary(map, area) {
      var neBound, swBound;
      swBound = new google.maps.LatLng(area.swLat, area.swLng);
      neBound = new google.maps.LatLng(area.neLat, area.neLng);
      this.bounds_ = new google.maps.LatLngBounds(swBound, neBound);
      this.area_ = area;
      this.div_ = null;
      this.height_ = 130;
      this.width_ = 150;
      this.setMap(map);
    }

    AreaSummary.prototype = new google.maps.OverlayView();

    AreaSummary.prototype.onAdd = function() {
      var div, li, panes, type, ul;
      div = document.createElement('div');
      div.style.borderWidth = "1px";
      div.style.borderColor = "red";
      div.style.backgroundColor = "#333";
      div.style.opacity = 0.8;
      div.style.color = "#FFF";
      div.style.position = "absolute";
      div.style.width = this.width_ + "px";
      div.style.height = this.height_ + "px";
      div.innerHTML = this.area_.name;
      ul = document.createElement('ul');
      for (type in this.area_.summary) {
        if (this.area_.summary[type] > 0) {
          li = document.createElement('li');
          li.innerHTML = Resources.Icons[type].label + " : " + this.area_.summary[type];
          ul.appendChild(li);
        }
      }
      div.appendChild(ul);
      this.div_ = div;
      panes = this.getPanes();
      return panes.overlayImage.appendChild(this.div_);
    };

    AreaSummary.prototype.draw = function() {
      var div, ne, overlayProjection, sw;
      overlayProjection = this.getProjection();
      sw = overlayProjection.fromLatLngToDivPixel(this.bounds_.getSouthWest());
      ne = overlayProjection.fromLatLngToDivPixel(this.bounds_.getNorthEast());
      div = this.div_;
      div.style.left = sw.x + ((ne.x - sw.x) - this.width_) / 2 + 'px';
      return div.style.top = ne.y + ((sw.y - ne.y) - this.height_) / 2 + 'px';
    };

    AreaSummary.prototype.setVisible = function(isVisible) {
      if (this.div_) {
        if (isVisible === true) {
          return this.div_.style.visibility = "visible";
        } else {
          return this.div_.style.visibility = "hidden";
        }
      }
    };

    return AreaSummary;

  })();

  $(function() {
    var myCustomMap;
    myCustomMap = new CustomMap('#map');
    return $('#notice').click(function() {
      return $(this).hide();
    });
  });

}).call(this);
