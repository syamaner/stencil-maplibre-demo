class Place {
    place_id: number;
    licence: string;
    powered_by: string;
    boundingbox: string[];
    lat: number;
    lon: number;
    display_name: string;
    class: string;
    type: string;
    importance: number;

    constructor(
        place_id: number,
        licence: string,
        powered_by: string,
        boundingbox: string[],
        lat: number,
        lon: number,
        display_name: string,
        class_: string,
        type: string,
        importance: number
    ) {
        this.place_id = place_id;
        this.licence = licence;
        this.powered_by = powered_by;
        this.boundingbox = boundingbox;
        this.lat = lat;
        this.lon = lon;
        this.display_name = display_name;
        this.class = class_;
        this.type = type;
        this.importance = importance;
    }
}