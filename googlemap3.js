/*
 *  Javascript associated with googlemap plugin
 *
 *  @author Borodin Oleg <onborodin@gmail.com>
 */

/*
 http://code.google.com/intl/ru/apis/maps/documentation/javascript/tutorial.html
 http://code.google.com/intl/ru/apis/maps/documentation/javascript/controls.html
 */

function dec2deg (dec) {
    var dec_abs = Math.abs(dec);
    var deg = Math.floor(dec_abs);
    var min = Math.floor((dec_abs - deg)*60);
    var sec = (((dec_abs - deg)*60 - min)*60).toFixed(4);
    if (dec < 0) deg=-deg;

    return (deg + '°' + min + '’' + sec + '”');
}

function allMarkersVisible(map){
        var countOfMarkers = map.markerArray.length;
        for (var m = 0; m < countOfMarkers; m++) {
//          map.markerArray[m].infoWindow.close();
            map.markerArray[m].setVisible(true);
        }
}


function allInfoWindowClose(map){
        var countOfMarkers = map.markerArray.length;
        for (var m = 0; m < countOfMarkers; m++) {
            map.markerArray[m].infoWindow.close();
//          map.markerArray[m].setVisible(true);
        }
}


function attachDesc(marker) {
    google.maps.event.addListener(marker, 'click', function() {
        var map = marker.getMap();
        var countOfMarkers = marker.getMap().markerArray.length;
        for (var m = 0; m < countOfMarkers; m++) {
            map.markerArray[m].infoWindow.close();
            map.markerArray[m].setVisible(true);
        }

        map.tmpLat = map.getCenter().lat();
        map.tmpLng = map.getCenter().lng();
        map.markerHelper.setVisible(false);
        map.markerHelper.infoWindow.close();
//      marker.setVisible(false);
        marker.infoWindow.setPosition(marker.getPosition());
        marker.infoWindow.open(marker.getMap()); // ...(marker.getMap()), marker) - corner to top marker

        var currentInfoWindow = marker.infoWindow;
        google.maps.event.addListener(currentInfoWindow, 'closeclick',
                function(){
                    var map = currentInfoWindow.map;
                    allMarkersVisible(map);
                    var tmpLatLng = new google.maps.LatLng(map.tmpLat, map.tmpLng);
                    map.panTo(tmpLatLng);
                }
        )
    });
}


function attachHelper(map) {
    google.maps.event.addListener(map, 'click', 
        function(event) {
            var lat = event.latLng.lat();
            var lng = event.latLng.lng();
            var centerLatLng = map.getCenter();
            var clat = centerLatLng.lat();
            var clng = centerLatLng.lng();
            var zoom = map.getZoom();

           allInfoWindowClose(map);

            var message = '<strong>Point latitude, longitude:</strong>  <br />' +
                lat.toFixed(7)+ ', ' + lng.toFixed(7) + '<br />' +
                dec2deg(lat) + ', ' + dec2deg(lng) + '<br />' +
                '<strong>Center latitude, longitude:</strong><br />' +
                clat.toFixed(7)+ ', ' + clng.toFixed(7) + '<br />' +
                '<strong>Zoom:</strong> ' + zoom;

            map.markerHelper.setVisible(false);
            map.markerHelper.setPosition(event.latLng);
            map.markerHelper.infoWindow.close();
            map.markerHelper.infoWindow.setContent(message);
            map.markerHelper.infoWindow.open(map, map.markerHelper);
        }
    );
}


function attachPanTo(map) {
    google.maps.event.addListener(map, 'click',
        function(event) {
            allInfoWindowClose(map);
            map.panTo(event.latLng);

        }
    );
}

function init_googlemap3() {

    if (googleMapArray.length == 0) return;

    var maptypes = { map :      google.maps.MapTypeId.ROADMAP,
            normal :    google.maps.MapTypeId.ROADMAP,
            hybrid :    google.maps.MapTypeId.HYBRID,
            satellite : google.maps.MapTypeId.SATELLITE,
            terrain :   google.maps.MapTypeId.TERRAIN
    };

    // retrieve all google map containers
    var nodes = document.body.getElementsByTagName('div');
    var i=0;
    for (var j=0; j < nodes.length; j++) {
        if (nodes[j].className.match(/\bgooglemap3\b/)) {
            googleMapArray[i++].node = nodes[j];
        }
    }

    for (i=0; i < googleMapArray.length; i++) {
        var navcont = (googleMapArray[i].controls == 'off') ? false : true;
        var mapOptions = {
            zoom: googleMapArray[i].zoom,
            center: new google.maps.LatLng(googleMapArray[i].lat, googleMapArray[i].lng),
            mapTypeId: maptypes[googleMapArray[i].type],
            navigationControl: navcont,
            draggableCursor: "crosshair",
            draggingCursor: "move",
            disableDoubleClickZoom: false,
            keyboardShortcuts: false,
            mapTypeContro: true,
            mapTypeControlOptions: {
                style: google.maps.MapTypeControlStyle.DROPDOWN_MENU
//              style: google.maps.MapTypeControlStyle.HORIZONTAL_BAR
            },
            zoomControl: navcont,
            zoomControlOptions: {
//                              style: google.maps.ZoomControlStyle.SMALL,
                style: google.maps.ZoomControlStyle.LARGE,
                position: google.maps.ControlPosition.LEFT_CENTER
            },
            panControl: navcont,
            panControlOptions: {
                position: google.maps.ControlPosition.RIGHT_TOP
            },
            streetViewControl: false,
            streetViewControlOptions: {
                position: google.maps.ControlPosition.TOP_LEFT
            },
            scaleControl: navcont,
            scaleControlOptions: {
                position: google.maps.ControlPosition.BOTTOM_LEFT
            },
            scrollwheel: false
        };

        // extend google.maps.Map
        googleMapArray[i].map = new google.maps.Map(googleMapArray[i].node, mapOptions);
        googleMapArray[i].map.homeLatLng = new google.maps.LatLng(googleMapArray[i].lat,
                                      googleMapArray[i].lng)
        googleMapArray[i].map.tmpLat = 0;
        googleMapArray[i].map.tmpLng = 0;
//      googleMapArray[i].map.parent = googleMapArray;
//      googleMapArray[i].map.number = i;
        googleMapArray[i].map.markerArray = new Array();
        if (googleMapArray[i].overlay && googleMapArray[i].overlay.length > 0) {
            for (j=0; j < googleMapArray[i].overlay.length; j++) {
                googleMapArray[i].map.markerArray[j] = new google.maps.Marker({
                    position: new google.maps.LatLng(googleMapArray[i].overlay[j].lat,
                                     googleMapArray[i].overlay[j].lng),
                    clickable: true,
                    visible: true,
                    title: googleMapArray[i].overlay[j].msg,
                });

                googleMapArray[i].map.markerArray[j].setMap(googleMapArray[i].map);

                googleMapArray[i].map.markerArray[j].infoWindow = new google.maps.InfoWindow({
                                content:  googleMapArray[i].overlay[j].txt,
                                maxWidth: 600,
                                disableAutoPan: false,
                                size : new google.maps.Size(450, 350),
//                              position: googleMapArray[i].map.markerArray[j].getPosition()
                    });

//              googleMapArray[i].map.markerArray[j].setVisible(true);

                // pointer to parents
                googleMapArray[i].map.markerArray[j].infoWindow.map = googleMapArray[i].map;
                googleMapArray[i].map.markerArray[j].infoWindow.marker = googleMapArray[i].map.markerArray[j];
                attachDesc(googleMapArray[i].map.markerArray[j]);
            }
        }
        googleMapArray[i].map.markerHelper = new google.maps.Marker({
                clickable: true,
                visible: false,
                position: new google.maps.LatLng(0, 0)
            });
        googleMapArray[i].map.markerHelper.setMap(googleMapArray[i].map);
        googleMapArray[i].map.markerHelper.infoWindow = new google.maps.InfoWindow({
                            maxWidth: 600,
                            disableAutoPan: false
//                          size : new google.maps.Size(392, 120)
            });

        if (googleMapArray[i].helper != 'off') {
            attachHelper(googleMapArray[i].map);
        } else {
            attachPanTo(googleMapArray[i].map) 
        };

        if (googleMapArray[i].kml != 'off') {
            var ctaLayer = new google.maps.KmlLayer(kml);
            ctaLayer.setMap(googleMapArray[i].map);
        }
    }
} /* init_googleMapArray */

var googleMapArray = new Array();

/* EOF googlemap3.js */

