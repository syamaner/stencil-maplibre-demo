import { Component, Host, Element, State, h } from '@stencil/core';

import { PubSub } from 'pubsub-js'
import { EventNames } from '../../utils/event-names';
import { polygon } from '@turf/helpers';
import { Feature, Polygon } from '@turf/turf'
interface Coordinate {
  latitude: number;
  longitude: number;
}

@Component({
  tag: 'polygon-entry',
  styleUrl: 'polygon-entry.css',
  shadow: true,
})
export class PolygonEntry {

  @Element() host: HTMLElement;
  @State() coordinates: Coordinate[] = [];

  @State() isLatLon: boolean = true; // Default to Lat / Lon

  handleButtonClick = () => {
    console.log(this.coordinates);
    let coordinates = [[]];
    
    coordinates[0] = this.coordinates.map(coordinate =>
      this.isLatLon ? [coordinate.latitude, coordinate.longitude] : [coordinate.longitude, coordinate.latitude]);

    var poly: Feature<Polygon, string> = polygon(coordinates, "Salford");

    PubSub.publish(EventNames.PolygonCaptured, poly);
  }
  componentDidLoad() {

    const textarea = this.host.shadowRoot.querySelector('textarea');
    let event = new Event('input', {
      bubbles: true,
      cancelable: true,
    });
    textarea.dispatchEvent(event);
  
  }

  render() {
    return (
      <Host>
        <div>
          <div>
            <label >Please enter coordinates:</label>
            <textarea class="block p-2.5 w-full text-sm text-gray-900 bg-gray-50 rounded-lg border border-gray-300 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" onInput={(event) => this.handleTextareaChange(event)}>
            [-2.273084, 53.487207],&#13;&#10;
            [-2.268201, 53.487220],&#13;&#10;
            [-2.268108, 53.489675],&#13;&#10;
            [-2.272873, 53.489704],&#13;&#10;
            [-2.273084, 53.487207]
            </textarea>
          </div>

          <div class="flex items-center mb-4">
            <label>
              <input class="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600" type="radio" value="latlon" checked={this.isLatLon} onInput={this.handleOptionChange} /> Lat / Lon
            </label>
            <label>
              <input class="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600" type="radio" value="lonlat" checked={!this.isLatLon} onInput={this.handleOptionChange} /> Lon / Lat
            </label>
          </div>
          <div>
            <button class="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded" onClick={this.handleButtonClick}>Capture</button>
          </div>
        </div>
      </Host >
    );
  }

  handleOptionChange = (event) => {
    this.isLatLon = event.target.value === "latlon";
  }

  handleTextareaChange = (event) => {
    const lines = event.target.value.split('\n');
    this.coordinates = lines.map(line => {
      const [latitude, longitude] = line.replace("]", "").replace("[", "").split(',').map(Number);
      return { latitude, longitude };
    });
  }

}
