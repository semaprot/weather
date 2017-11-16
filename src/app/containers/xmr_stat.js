import _ from 'lodash';
import React, { Component } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { Grid, Row, Col } from 'react-bootstrap';
import { fetchXmrStat } from '../actions/getXmrStat';
import { fetchXmrBalance } from '../actions/getXmrBalance';
import { fetchXmrUSD } from '../actions/getXmrUSD';
import { fetchXmrEUR } from '../actions/getXmrEUR';
import Chart from '../components/chart';

const XMR_SCALE = 1000000000000;
const XMR_KHs = 1000;
const TICK_INTERVAL = 60000;
const COUTION_OUTWORK_TIME = 30;
const DAY_AGO = 1440;
const styles = {
    initDate: {
        textAlign: 'left',
        fontSize: '12px',
    },
    lastDate: {
        textAlign: 'right',
        fontSize: '12px',
    },
    component: {
        color: "#AA0000",
        paddingTop: "10px",
        paddingLeft: "50px",
        paddingRight: "50px",
    },
    coution: {
      color: "red",
    },
};

class XMR extends Component {
    constructor(props) {
        super(props);

        this.props.fetchXmrStat();
        this.props.fetchXmrBalance();
        this.props.fetchXmrUSD();
        this.props.fetchXmrEUR();

        this.state = {
            miners: this.props.xmrStat.xmrStat,
            time: Date.now()
        };
    }

    componentWillReceiveProps(nextProps) {
      this.setState({
          miners: nextProps.xmrStat.xmrStat,
          stats: nextProps.xmrBalance.xmrBalance.stats || '',
          tickerUSD: nextProps.xmrusd.xmrUSD.ticker,
          tickerEUR: nextProps.xmreur.xmrEUR.ticker
      })
    }

    componentDidMount() {
        this.interval = setInterval(() =>
            this.setState({
                fetch: this.props.fetchXmrStat(),
                fetchBalance: this.props.fetchXmrBalance(),
                tickerUSD: this.props.fetchXmrUSD(),
                tickerEUR: this.props.fetchXmrEUR(),
                miners: this.props.xmrStat.xmrStat,
                stats: this.props.xmrBalance.xmrBalance.stats,
                time: Date.now()
            })
            , TICK_INTERVAL);
    }

    componentWillUnmount() {
        clearInterval(this.interval);
    }

    _replaceAdress(str) {
        let adressPrefix = str.substring(0,4);
        let missCharacters = '...';
        let adress = !str.match(/(.*[.])/g) ? str : str.match(/(.*[.])/g)[0];
        let minerID = str.match(/([.].*)/g, ) || '';
        let adressSuffix = adress.substring(adress.length - 5, adress.length - 1);

        return adressPrefix + missCharacters + adressSuffix + minerID;
    }

    _getDate(timestamp) {
        let date = new Date(timestamp*1000);
        let day = date.getUTCDate();
        let month = date.getMonth() + 1;
        let year = date.getFullYear();
        let hours = date.getHours();
        let minutes = "0" + date.getMinutes();
        let seconds = "0" + date.getSeconds();

       return day + '-' + month + '-' + year + '  ' + hours + ':' + minutes.substr(-2) + ':' + seconds.substr(-2);
    }

    _countHashrate() {
      let hashrate = 0;

        this.state.miners.map((miner) => {
          hashrate += miner.hashrate;
        })

      return hashrate;
    }

    _countActiveMiners() {
      let activeMiners = 0;

        this.state.miners.map((miner) => {
          if(miner.hashrate != 0) {
              activeMiners++;
          };
        })

      return activeMiners;
    }

    _isOutwork() {
      let nowDate = Date.now();
      // let minutesLater = nowDate.setMinutes(nowDate.getMinutes() - COUTION_OUTWORK_TIME);
      let minutesLater = new Date();
      minutesLater.setMinutes(minutesLater.getMinutes() - COUTION_OUTWORK_TIME);

      let minutesLaterTimestamp = _.round(new Date(minutesLater).getTime() / 1000, 0);

      let dayAgo = new Date();
      dayAgo.setMinutes(dayAgo.getMinutes() - DAY_AGO);

      let dayAgoTimestamp = _.round(new Date(dayAgo).getTime() / 1000, 0);


      let isCoution = false;

      this.state.miners.map((miner) => {
          if(miner.hashrate != 0) {return;};

          if(miner.lastShare < dayAgoTimestamp) {return;};

          if(miner.lastShare > minutesLaterTimestamp) {return;};

          isCoution = true;
        })

        if(!isCoution) {
          return (<div></div>)
        } else {
          return (
            <div style={styles.coution}>
              <div>CAUTION: MORE THEN 30 MINUTES OUTWORK</div>
              <table className="table table-hover">
                  <tbody>
                    {
                      this.state.miners.map((miner) => {
                          if(miner.hashrate != 0) {return;};

                          if(miner.lastShare < dayAgoTimestamp) {return;};

                          if(miner.lastShare > minutesLaterTimestamp) {return;};

                          return (
                            <tr key={this._replaceAdress(miner.address)}>
                                <td>{this._replaceAdress(miner.address)}</td>
                            </tr>
                          )
                        })
                      }
                </tbody>
              </table>
            </div>
          )
        }
    }

    render() {
        if(!Object.getOwnPropertyNames(this.props.xmrStat).length) {return <div></div>;}
        let hashrateList = [];

        return (
            <div style={styles.component}>

                {this._isOutwork()}

                XMR ( {_.round(this.state.tickerUSD.price, 2)} USD / {_.round(this.state.tickerEUR.price, 2)} EUR )

                <table className="table table-hover">
                    <thead>
                    <tr>
                        <th>Total balance</th>
                        <th>{"Hashrate ( " + this._countActiveMiners() + " miners )"}</th>
                        <th>paid</th>
                        <th>paid, usd</th>
                        <th>paid, eur</th>
                    </tr>
                    </thead>
                    <tbody>
                      <tr key={"total-balance"}>
                          <td>{_.round(this.state.stats.balance / XMR_SCALE, 6) || 0} ({_.round((this.state.stats.balance / XMR_SCALE) * this.state.tickerUSD.price, 2) || 0} / {_.round((this.state.stats.balance / XMR_SCALE) * this.state.tickerEUR.price, 2) || 0})</td>
                          <td>{_.round(this._countHashrate() / XMR_KHs, 2) + " KH/s"}</td>
                          <td>{_.round(this.state.stats.paid / XMR_SCALE, 2) || 0}</td>
                          <td>{_.round((this.state.stats.paid / XMR_SCALE) * this.state.tickerUSD.price, 2) || 0}</td>
                          <td>{_.round((this.state.stats.paid / XMR_SCALE) * this.state.tickerEUR.price, 2) || 0}</td>
                      </tr>
                    </tbody>
                </table>
            </div>
        )
    }
}

function mapStateToProps({ xmrStat, xmrBalance, xmrusd, xmreur }) {
    return { xmrStat, xmrBalance, xmrusd, xmreur };
}

function mapDispatchToProps(dispatch) {
    return bindActionCreators({ fetchXmrStat, fetchXmrBalance, fetchXmrUSD, fetchXmrEUR }, dispatch);
}

export default connect(mapStateToProps, mapDispatchToProps)(XMR);
