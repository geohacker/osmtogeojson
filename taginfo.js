var poly_tags = require("./polygon_features.json");


var structure = {
    "data_format": 1,
    "data_url": "https://raw.githubusercontent.com/tyrasd/osmtogeojson/taginfo/project.json",
    "data_updated": (new Date()).toISOString().replace(/[-:]|\.\d+/g,''),
    "project": {
        "name": "osmtogeojson",
        "description": "Converts OSM data to GeoJSON. Tags used to detect if a closed OSM way is to be output as a GeoJSON polygon rather than a LineString.",
        "project_url": "http://tyrasd.github.io/osmtogeojson/",
        "doc_url": "https://wiki.openstreetmap.org/wiki/Overpass_turbo/Polygon_Features",
        //"icon_url": "...",
        "contact_name": "Martin Raifer",
        "contact_email": "tyr.asd@gmail.com"
    },
    "tags": [
        {
            "key": "area",
            "value": "no",
            "object_types": ["way"],
            "description": "if area=no is present, a closed way is never be considered a polygon."
        }
    ]
};

for (var key in poly_tags) {
    var rule = poly_tags[key];
    if (rule === true) {
        structure.tags.push({
            "key": key,
            "object_types": ["area"],
            "description": "if this tag key is present, a closed way will be considered a polygon."
        });
    } else if (rule.included_values !== undefined) {
        for (var value in rule.included_values) {
            structure.tags.push({
                "key": key,
                "value": value,
                "object_types": ["area"],
                "description": "if this tag is present, a closed way will be considered a polygon."
            });
        }
    } else if (rule.excluded_values !== undefined) {
        structure.tags.push({
            "key": key,
            "object_types": ["area"],
            "description": "if this tag key is present, a closed way will be considered a polygon (except for some specific tag values)."
        });
        for (var value in rule.excluded_values) {
            structure.tags.push({
                "key": key,
                "value": value,
                "object_types": ["way"],
                "description": "doesn't trigger polygon detection, even though other values of the same tag key do."
            });
        }
    } else {
        console.error("invalid rule for key", key);
    }

}

process.stdout.write(
    JSON.stringify(structure, null, 4)
);