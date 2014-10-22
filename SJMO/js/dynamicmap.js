//var mapData = {
//    center: 'India',
//    location: [['Taj Mahal', 'http://en.wikipedia.org/wiki/Taj_Mahal‎'],
//                        ['Brihadeeswarar Temple', 'http://en.wikipedia.org/wiki/Brihadeeswarar_Temple'],
//                        ['Tamil Nadu'], ['http://ta.wikipedia.org/wiki/%E0%AE%A4%E0%AE%AE%E0%AE%BF%E0%AE%B4%E0%AF%8D'],
//                        ['Ganga River', 'http://en.wikipedia.org/wiki/Ganges'],
//                        ['Rashtrapati Bhavan', 'http://en.wikipedia.org/wiki/Rashtrapati_Bhavan'],
//                        ['Ajanta Caves', 'http://en.wikipedia.org/wiki/Ajanta_Caves'],
//                        ['ISKCON Temple Bangalore', 'http://en.wikipedia.org/wiki/ISKCON_Temple_Bangalore']]
//};
function initializeDynamicMap() {
    MapInitDyn();
    setTimeout(function () {
        MapInitDyn();
    }, 2000);
}
function MapInitDyn() {
    $('.map-canvas').each(function (index, elm) {
        var parElm = $(elm).closest('[an-data-role]');
        var spn = $(parElm).find('span.testScript')[0];
        var spnData = $(spn).text();
        if ($.trim(spnData) != '') {
            var mapDataTemp = JSON.parse(spnData);
            var geocoder = new google.maps.Geocoder();
            if (mapDataTemp.markers.length > 0) {
                geocoder.geocode({ 'address': mapDataTemp.markers[0].Text }, function (results, status) {
                    if (status == google.maps.GeocoderStatus.OK) {
                        var mapOptions = {
                            zoom: mapDataTemp.zoom,
                            center: results[0].geometry.location
                        };
                        //var map = new google.maps.Map(document.getElementById('map-canvas'), mapOptions);
                        var map = new google.maps.Map(elm, mapOptions);
                        loadLocations(map, mapDataTemp.markers);
                    }
                });
            }
            else {
                LoadDefaultMapDynamic(elm, mapDataTemp.zoom);
            }
        }
        else {
            LoadDefaultMapDynamic(elm, 6);
        }
    });
}
function LoadDefaultMapDynamic(elm, zoom) {
    var geocoder = new google.maps.Geocoder();
    geocoder.geocode({ 'address': 'Missouri' }, function (results, status) {
        if (status == google.maps.GeocoderStatus.OK) {
            var mapOptions = {
                zoom: zoom,
                center: results[0].geometry.location
            };
            //var map = new google.maps.Map(document.getElementById('map-canvas'), mapOptions);
            var map = new google.maps.Map(elm, mapOptions);
        }
    });
}
function loadMarker(map, markerLocation, data) {
    var marker = new google.maps.Marker({
        position: markerLocation,
        animation: google.maps.Animation.DROP,
        map: map,
        title: data['title'],
        url: data['url'],
        customInfo: data
    });
    google.maps.event.addListener(marker, 'click', function () {
        if (marker['customInfo'].lType == 'int') {
            var pid = "#prevPage" + marker['customInfo'].url;
            console.log(pid);
            PageTryLoad(pid, { transition: 'slidedown' });
        }
        else {
            console.log("124");
            // return function () {
            window.location.href = marker.url;
            //  }
        }
    });
}

function loadLocations(map, markers) {
    for (var i = 0, len = markers.length; i < len; i++) {
        GetGeocode(map, markers[i].Text, {
            'title': markers[i].Text, 'url': markers[i].Value,
            'lType': markers[i].lType, 'animation': markers[i].Animation
        }, loadMarker);
    }
}
function GetGeocode(map, address, data, callback) {
    var geocoder = new google.maps.Geocoder();
    geocoder.geocode({ 'address': address }, function (results, status) {
        if (status == google.maps.GeocoderStatus.OK) {
            callback(map, results[0].geometry.location, data);
        }
    });
}
function loadURL(marker) {
    //    return function () {
    //        console.log("qwe" + marker.url);
    //        window.location.href = marker.url;
    //    }
}