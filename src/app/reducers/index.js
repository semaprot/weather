import { combineReducers } from 'redux';
import WeatherReducer from './reducer_weather';
import KrbReducer from './reducer_krb';
import KrbBtcReducer from './reducer_krb_btc';
import UahBtcReducer from './reducer_uah_btc';
import UsdBtcReducer from './reducer_usd_btc';
import EurBtcReducer from './reducer_eur_btc';
import XmrStatReducer from './reducer_xmr_stat';
import XmrBalanceReducer from './reducer_xmr_balance';
import XmrUsdReducer from './reducer_xmr_usd';
import XmrEurReducer from './reducer_xmr_eur';
import ZecStatReducer from './reducer_zec_stat';
import ZecWorkersReducer from './reducer_zec_workers';
import ZecPricesReducer from './reducer_zec_prices';

const rootReducer = combineReducers({
  weather: WeatherReducer,
  krb: KrbReducer,
  krbbtc: KrbBtcReducer,
  uahbtc: UahBtcReducer,
  usdbtc: UsdBtcReducer,
  eurbtc: EurBtcReducer,
  xmrStat: XmrStatReducer,
  xmrBalance: XmrBalanceReducer,
  xmrusd: XmrUsdReducer,
  xmreur: XmrEurReducer,
  zecStat: ZecStatReducer,
  zecWorkers: ZecWorkersReducer,
  zecPrices: ZecPricesReducer,
});

export default rootReducer;
