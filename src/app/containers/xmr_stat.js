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
const TICK_INTERVAL = 60000;
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
        paddingTop: "10px",
        paddingLeft: "50px",
        paddingRight: "50px",
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
          stats: nextProps.xmrBalance.xmrBalance.stats,
          tickerUSD: nextProps.xmrusd.xmrUSD.ticker,
          tickerEUR: nextProps.xmreur.xmrEUR.ticker
      })
    }

    componentDidMount() {
        this.interval = setInterval(() =>
            this.setState({
                fetch: this.props.fetchXmrStat(),
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
        let day = date.getDay();
        let month = date.getMonth() + 1;
        let year = date.getFullYear();
        let hours = date.getHours();
        let minutes = "0" + date.getMinutes();
        let seconds = "0" + date.getSeconds();

       return day + '-' + month + '-' + year + '  ' + hours + ':' + minutes.substr(-2) + ':' + seconds.substr(-2);
    }

    render() {
        if(!Object.getOwnPropertyNames(this.props.xmrStat).length) {return <div></div>;}
        let hashrateList = [];

        return (
            <div style={styles.component}>
                XMR ( {_.round(this.state.tickerUSD.price, 2)} USD / {_.round(this.state.tickerEUR.price, 2)} EUR )
                <table className="table table-hover">
                    <thead>
                    <tr>
                        <th>adress</th>
                        <th>balance</th>
                        <th>hashes</th>
                        <th>hashrate</th>
                        <th>paid</th>
                        <th>paid, usd</th>
                        <th>paid, eur</th>
                    </tr>
                    </thead>
                    <tbody>
                      <tr key={"total-balance"}>
                          <td>Total balance</td>
                          <td>{_.round(this.state.stats.balance / XMR_SCALE, 6) || 0} ({_.round((this.state.stats.balance / XMR_SCALE) * this.state.tickerUSD.price, 2) || 0} / {_.round((this.state.stats.balance / XMR_SCALE) * this.state.tickerEUR.price, 2) || 0})</td>
                          <td>{this.state.stats.hashes}</td>
                          <td></td>
                          <td>{_.round(this.state.stats.paid / XMR_SCALE, 2) || 0}</td>
                          <td>{_.round((this.state.stats.paid / XMR_SCALE) * this.state.tickerUSD.price, 2) || 0}</td>
                          <td>{_.round((this.state.stats.paid / XMR_SCALE) * this.state.tickerEUR.price, 2) || 0}</td>
                      </tr>
                          {
                            this.state.miners.map((miner) => {
                                if(miner.hashrate == 0) {return;};
                                return (
                                    <tr key={this._replaceAdress(miner.address)}>
                                        <td>{this._replaceAdress(miner.address)}</td>
                                        <td>{_.round(miner.balance / XMR_SCALE, 2) || 0}</td>
                                        <td>{miner.hashes}</td>
                                        <td>{_.round(miner.hashrate, 2)}</td>
                                        <td>{_.round(miner.paid / XMR_SCALE, 2) || 0}</td>
                                        <td></td>
                                        <td></td>
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

function mapStateToProps({ xmrStat, xmrBalance, xmrusd, xmreur }) {
    return { xmrStat, xmrBalance, xmrusd, xmreur };
}

function mapDispatchToProps(dispatch) {
    return bindActionCreators({ fetchXmrStat, fetchXmrBalance, fetchXmrUSD, fetchXmrEUR }, dispatch);
}

export default connect(mapStateToProps, mapDispatchToProps)(XMR);
