import { combineReducers } from 'redux';
import WeatherReducer from './reducer_weather';
import KrbReducer from './reducer_krb';
import KrbBtcReducer from './reducer_krb_btc';
import UsdBtcReducer from './reducer_usd_btc';
import XmrStatReducer from './reducer_xmr_stat';
import XmrBalanceReducer from './reducer_xmr_balance';
import XmrUsdReducer from './reducer_xmr_usd';
import XmrEurReducer from './reducer_xmr_eur';

const rootReducer = combineReducers({
  weather: WeatherReducer,
  krb: KrbReducer,
  krbbtc: KrbBtcReducer,
  usdbtc: UsdBtcReducer,
  xmrStat: XmrStatReducer,
  xmrBalance: XmrBalanceReducer,
  xmrusd: XmrUsdReducer,
  xmreur: XmrEurReducer,
});

export default rootReducer;
