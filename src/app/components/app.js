import React, { Component } from 'react';
import SearchBar from '../containers/search_bar'
import WeatherList from '../containers/weather_list'
import KrbStat from '../containers/krb_stat'
import XmrStat from '../containers/xmr_stat'

export default class App extends Component {
    _replaceAdress(str) {
        let adressPrefix = str.substring(0,4);
        let missCharacters = '...';
        let adress = !str.match(/(.*[.])/g) ? str : str.match(/(.*[.])/g)[0];
        let minerID = str.match(/([.].*)/g, ) || '';
        let adressSuffix = adress.substring(adress.length - 5, adress.length - 1);

        // console.log('str', adress, adress.length)
        // return "OK";
        return adressPrefix + missCharacters + adressSuffix + minerID;
    }
  render() {
    return (
      <div>
        {/*<SearchBar />*/}
        {/*<WeatherList />*/}
        {<KrbStat />}
        {/*<XmrStat />*/}
          {/*this._replaceAdress('4AF4HTbwQ3d9SbdKNUsPU39HTuLwEMtcY3mmTwtufSPPDbqBsUSsskq7tXDfNDZ8bj6T3Wyv9yY2xcH8FN2i36ZjD2RW4e6.IP42')*/}

        <hr />
      </div>
    );
  }
}
