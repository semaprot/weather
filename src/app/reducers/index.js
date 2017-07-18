import { combineReducers } from 'redux';
import WeatherReducer from './reducer_weather';
import KrbReducer from './reducer_krb';
import XmrStatReducer from './reducer_xmr_stat';
import XmrBalanceReducer from './reducer_xmr_balance';

const rootReducer = combineReducers({
  weather: WeatherReducer,
  krb: KrbReducer,
  xmrStat: XmrStatReducer,
  xmrBalance: XmrBalanceReducer,
});

export default rootReducer;
