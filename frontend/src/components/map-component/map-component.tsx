import { Component, State, h } from '@stencil/core';
import { Map, Marker, Popup } from 'maplibre-gl';
import { Feature, Polygon } from '@turf/turf'
import { PubSub } from 'pubsub-js'
import { EventNames } from '../../utils/event-names';

@Component({ tag: 'map-component', styleUrl: 'map-component.css', shadow: true })
export class MapComponent {
    @State() mapElement: HTMLElement;

    addressListenerSubscription: any;
    polygobListenerSubscription: any;

    map: Map | undefined;
    markers: {
        [name: string]: Marker
    } = {};

    polygons: {
        [name: string]: Feature<Polygon, string>
    } = {}

    onAddressSelected = (_msg: string, data: Place)  => {
        for (const key in this.markers) {
            this.markers[key].remove();
            delete this.markers[key];
        }
        this.map.flyTo({
            center: [
                data.lon, data.lat
            ],
            zoom: 15
        });
        if (!this.markers[data.place_id]) {
            this.markers[data.place_id] = new Marker().setLngLat([data.lon, data.lat]).addTo(this.map);
            this.markers[data.place_id].setPopup(new Popup().setHTML(`<h1>${data.display_name}</h1>`));
        }
    };

    onPolygonCaptured = (_msg: string, polygon: Feature<Polygon, string>)  => {
        let name = polygon.properties;
 
        for (const key in this.polygons) {
            this.map.removeLayer(key);
            this.map.removeSource(key);
        }

        this.polygons[name] = polygon;

        this.map.addSource(name, {
            'type': 'geojson',
            'data': polygon
        });

        this.map.addLayer({
            'id': name,
            'type': 'fill',
            'source': name,
            'layout': {},
            'paint': {
                'fill-color': '#088',
                'fill-opacity': 0.8
            }
        });

        this.map.flyTo({
            center: [
                polygon.geometry.coordinates[0][0][0], polygon.geometry.coordinates[0][0][1]
            ],
            zoom: 15
        });
    }
 
    disconnectedCallback() {
        if (this.addressListenerSubscription) {
            PubSub.unsubscribe(this.addressListenerSubscription);
        }
        if (this.polygobListenerSubscription) {
            PubSub.unsubscribe(this.polygobListenerSubscription);
        }
    }

    componentDidLoad() {
        this.addressListenerSubscription = PubSub.subscribe(EventNames.AddressSelected, this.onAddressSelected);
        this.polygobListenerSubscription = PubSub.subscribe(EventNames.PolygonCaptured, this.onPolygonCaptured);

        this.map = new Map({
            container: this.mapElement,
            style: `https://api.maptiler.com/maps/basic-v2/style.json?key=API_KEY_HERE`,
            center: [
                -0.1278, 51.5074
            ],
            zoom: 15
        });
    }

    render() {
        return  <div id="map" ref={(el) => this.mapElement = el as HTMLElement}></div>       
    }
} 
