import { Component, Element, State, h } from '@stencil/core';
import {PubSub} from 'pubsub-js'
import '@github/auto-complete-element'
import { EventNames } from '../../utils/event-names';

@Component({ tag: 'address-search', styleUrl: 'address-search.css', shadow: true })
export class AddressSearch {

    @Element() hostElement: HTMLElement;
    @State() addresses: Place[];
    apiUrl: String = "https://geocode.maps.co/search?q=";
    autoComplete: any;

    componentDidLoad() {
        this.autoComplete = this.hostElement.shadowRoot.querySelector('auto-complete');
        if (this.autoComplete) {
            this.autoComplete.fetchResult = async (el: any) => {
                const uri = el;
                const searchParams = new URLSearchParams(uri.search);
                const searchText = searchParams.get('q');
                let response = await fetch(this.apiUrl + searchText);
                let jsonResult: Place[] = await response.json();
                this.addresses = jsonResult;
                console.log({ q: searchText, r: jsonResult });
                return jsonResult;
            }
        }
    }

    handleAddressSelection(address: Place): void {
        PubSub.publish(EventNames.AddressSelected, address);
    }

    render() {
        return (<div>
            <div class="max-h-96 overflow-y-auto">
                <auto-complete src="/users/search" for="users-popup">
                    <div class="flex flex-col items-left">
                        <label class="mb-2">Address</label>
                        <div class="flex">
                            <input id="inputField" name="inputField" class="py-2 px-4 border border-gray-300 rounded-l-md focus:outline-none focus:ring-2 focus:ring-blue-500 flex-grow" type="text" />
                            <button class="py-2 px-4 bg-blue-500 hover:bg-blue-600 text-white rounded-r-md focus:outline-none focus:ring-2 focus:ring-blue-500">X</button>
                        </div>
                    </div>
                    <ul id="users-popup"></ul>
                </auto-complete>
                <ul id="users-popup" class="grid gap-4">
                    {this.addresses && this.addresses.map((address: Place) => (<li class="flex items-center bg-white rounded-lg shadow-md px-4 py-2">  <span class="flex-grow">{
                        address.display_name
                    }, {
                            address.type
                        }, {
                            address.powered_by
                        }
                    </span>
                        <button class="ml-auto bg-blue-500 hover:bg-blue-600 text-white rounded px-4 py-2"
                            onClick={
                                () => this.handleAddressSelection(address)
                            }>
                            Select
                        </button>
                    </li>))
                    }
                </ul>
            </div>
        </div>);
    }
}
