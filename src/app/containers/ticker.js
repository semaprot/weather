import _ from 'lodash';
import React, { Component } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { Grid, Row, Col } from 'react-bootstrap';
import { fetchKrbBtc } from '../actions/getKrbBtc';
import { fetchUahBtc } from '../actions/getUahBtc';
import { fetchUsdBtc } from '../actions/getUsdBtc';
import { fetchEurBtc } from '../actions/getEurBtc';
import { fetchXmrUSD } from '../actions/getXmrUSD';
import { fetchXmrEUR } from '../actions/getXmrEUR';


const KRB_SCALE = 1000000000000;
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
        paddingTop: "20px",
        paddingLeft: "50px",
        paddingRight: "50px",
    },
};

class Ticker extends Component {
    constructor(props) {
        super(props);

        this.props.fetchKrbBtc();
        this.props.fetchUahBtc();
        this.props.fetchUsdBtc();
        this.props.fetchEurBtc();
        this.props.fetchXmrUSD();
        this.props.fetchXmrEUR();
    }

    componentWillReceiveProps(nextProps) {
      // console.log('componentWillReceiveProps(nextProps)', nextProps)
        this.setState({
            rate: nextProps.krbbtc.krbBTC.Data.LastPrice / nextProps.usdbtc.usdBTC,
            usdBTC: nextProps.usdbtc.usdBTC,
            krbBTC: nextProps.krbbtc.krbBTC.Data.LastPrice,
            uahBTC: nextProps.uahbtc.uahBTC.bpi.UAH.rate,
            eurBTC: nextProps.eurbtc.eurBTC.bpi.EUR.rate,
            tickerUSD: nextProps.xmrusd.xmrUSD.ticker,
            tickerEUR: nextProps.xmreur.xmrEUR.ticker
        })
    }

    componentDidMount() {
        this.interval = setInterval(() =>
            this.setState({
                fetchKrbBtc: this.props.fetchKrbBtc(),
                fetchUsdBtc: this.props.fetchUsdBtc(),
                tickerUSD: this.props.fetchXmrUSD(),
                tickerEUR: this.props.fetchXmrEUR(),
            })
            , TICK_INTERVAL);
    }

    componentWillUnmount() {
        clearInterval(this.interval);
    }

    render() {
        if(!Object.getOwnPropertyNames(this.props.usdbtc).length) {return <div></div>;}


        return (
            <div style={styles.component}>
            <div><p>Tickers
              XMR/USD ({_.round(this.state.tickerUSD.price, 2)})
              XMR/EUR ({_.round(this.state.tickerEUR.price, 2)})
              BTC/USD ({_.round(1 / this.state.usdBTC, 2)})
              BTC/EUR ({this.state.eurBTC})
              BTC/UAH ({this.state.uahBTC})
              KRB/USD ({_.round(this.state.rate, 4)})
              </p></div>
            </div>
        )
    }
}

function mapStateToProps({ krbbtc, uahbtc, usdbtc, eurbtc, xmrusd, xmreur }) {
    return { krbbtc, uahbtc, usdbtc, eurbtc, xmrusd, xmreur };
}

function mapDispatchToProps(dispatch) {
    return bindActionCreators({ fetchKrbBtc, fetchUsdBtc, fetchUahBtc, fetchEurBtc, fetchXmrUSD, fetchXmrEUR }, dispatch);
}

export default connect(mapStateToProps, mapDispatchToProps)(Ticker);
