mapboxgl.accessToken = 'pk.eyJ1IjoiaGVwcGxlcmoiLCJhIjoiMjNqTEVBNCJ9.pGqKqkUDlcFmKMPeoARwkg';

var map = new mapboxgl.Map({
    container: 'map',
    style: 'mapbox://styles/mapbox/streets-v9',
    center: [-121.8863, 37.3382],
    zoom: 10,
    bearing: -30,
    pitch: 60
});

var chapters = {
    'sj-all': {
        bearing: -30,
        center: [-121.8863, 37.3382],
        zoom: 10,
        pitch: 60
    },
    'mayfair': {
        // duration: 6000,
        center: [-121.839066, 37.353938],
        // bearing: 150,
        zoom: 15,
        pitch: 0,
        speed: 0.6
    },
    'losaltoshills': {
        bearing: 0,
        center: [-122.127972, 37.380252],
        zoom: 13,
        speed: 0.6,
        pitch: 40
    },
    'epa': {
        bearing: -20,
        center: [-122.142391,37.470090],
        zoom: 12.3,
        pitch: 65,
        speed: 0.6
    },
    'sj-all-final': {
        bearing:-35,
        center: [-121.8863, 37.3382],
        zoom: 10,
        pitch: 60
    },
};

// On every scroll event, check which element is on screen
window.onscroll = function() {
    var chapterNames = Object.keys(chapters);
    for (var i = 0; i < chapterNames.length; i++) {
        var chapterName = chapterNames[i];
        if (isElementOnScreen(chapterName)) {
            setActiveChapter(chapterName);
            break;
        }
    }
};

var activeChapterName = 'sj-all';
function setActiveChapter(chapterName) {
    if (chapterName === activeChapterName) return;

    map.flyTo(chapters[chapterName]);

    document.getElementById(chapterName).setAttribute('class', 'active');
    document.getElementById(activeChapterName).setAttribute('class', '');

    activeChapterName = chapterName;
}

function isElementOnScreen(id) {
    var element = document.getElementById(id);
    var bounds = element.getBoundingClientRect();
    return bounds.top < window.innerHeight && bounds.bottom > 0;
}


