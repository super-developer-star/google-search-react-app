import React, { Component } from 'react';
import logo from './logo.svg';
import './App.css';
import Search from './Search';
import Map from './Map';
import CurrentLocation from './CurrentLocation';
import LocationList from './LocationList';

class App extends Component {

  constructor(props){
    super(props);

    // Extract the favorite location from local storage
    var favorites = [];
    if(localStorage.favorites){
        favorites = JSON.parse(localStorage.favorites);
    }
    // Nobody would get mad if we center it on Paris by default
    this.state = {
        favorites: favorites,
        currentAddress: 'Paris, France',
        mapCoordinates: {
          lat: 48.856614,
          lng: 2.3433319
        }
    };
  }

  toggleFavorite = (address) => {
    if(this.isAddressInFavorites(address)){
      this.removeFromFavorites(address);
    }
    else {
      this.addToFavorites(address);
    }
  }

  addToFavorites = (address) => {
    var favorites = this.state.favorites;
    favorites.push({
          address: address,
          timestamp: Date.now()
    });

    this.setState({ favorites: favorites });
    localStorage.favorites = JSON.stringify(favorites);
  }

  removeFromFavorites = (address) => {
    var favorites = this.state.favorites;
    var index = -1;

    for(var i = 0; i < favorites.length; i++){
      if(favorites[i] === address){
        index = i;
        break;
      }
    }
    if(index !== -1){
      favorites.splice(index, 1);
      this.setState({ favorites: favorites });
      localStorage.favorites = JSON.stringify(favorites);
    }
  }

  isAddressInFavorites = (address) => {
    var favorites = this.state.favorites;
    for(var i = 0; i < favorites.length; i++){
      if(favorites[i].address === address){
        return true;
      }
    }
    return false;
  }

  searchForAddress = (address) => {

    var _this = this;
    // We will use GMap's geocode functionality,
    // which is built on top of the Google Maps API

    Map.geocode({
      address: address,
      callback: function(results, status){
        if(status !== 'OK' ) return;
        var latlng = results[0].geometry.location;
        _this.setState({
          currentAddress: results[0].formatted_address,
          mapCoordinates: {
            lat: latlng.lat(),
            lng: latlng.lng()
          }
        });
      }
    });
  }

  render() {
    return (
      <div>
        <div className="App">
          <div className="App-header">
            <img src={logo} className="App-logo" alt="logo" />
            <h2>Welcome to React</h2>
          </div>
          <p className="App-intro">
            To get started, edit <code>src/App.js</code> and save to reload.
          </p>
        </div>
        <div>
          <h1>Google Maps Locations</h1>
          <Search onSearch={this.searchForAddress} />
          <Map lat={this.state.mapCoordinates.lat} lng={this.state.mapCoordinates.lng} />
          <CurrentLocation address={this.state.currentAddress}
                    favorite={this.isAddressInFavorites(this.state.currentAddress)}
                    onFavoriteToggle={this.toggleFavorite} />
          <LocationList location={this.state.favorites} activeLocationAddress={this.state.currentAddress}
                    onClick={this.searchForAddress} />
        </div>
      </div>
    )
  }
}

export default App;
