import { Component, h } from '@stencil/core';

@Component({
  tag: 'map-container',
  styleUrl: 'map-container.css',
  shadow: true,
})
export class MapContainer {

  render() {
    return (

      <div class="flex">
        <div class="w-2/3" id="map-container">
          <map-component></map-component>
        </div>
        <div class="w-1/3" id="ui-container">
          <address-search></address-search>
          <polygon-entry></polygon-entry>
        </div>
      </div>

    );
  }

}
