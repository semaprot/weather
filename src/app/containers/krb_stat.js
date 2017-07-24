import _ from 'lodash';
import React, { Component } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { Grid, Row, Col } from 'react-bootstrap';
import { fetchXmrStat } from '../actions/getXmrStat';
import { fetchXmrBalance } from '../actions/getXmrBalance';

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
        paddingTop: "50px",
    },
};

class XMR extends Component {
    constructor(props) {
        super(props);

        this.props.fetchXmrStat();
        this.props.fetchXmrBalance();

        // console.log('balance: this.props.xmrBalance.xmrBalance.stats,', this.props.xmrStat)
        this.state = {
            miners: this.props.xmrStat.xmrStat,
            time: Date.now()
        };

    }

    componentWillReceiveProps(nextProps) {
        // console.log('nextProps', nextProps.xmrBalance.xmrBalance.stats)
        this.setState({
            miners: nextProps.xmrStat.xmrStat,
            stats: nextProps.xmrBalance.xmrBalance.stats,
        })
    }

    componentDidMount() {
        this.interval = setInterval(() =>
            this.setState({
                fetch: this.props.fetchXmrStat(),
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
                XMR
                <table className="table table-hover">
                    <thead>
                    <tr>
                        <th>adress</th>
                        <th>balance</th>
                        <th>hashes</th>
                        <th>hashrate</th>
                        <th>paid</th>
                    </tr>
                    </thead>
                    <tbody>
                            <tr key={"total-balance"}>
                                <td>Total balance</td>
                                <td>{_.round(this.state.stats.balance / XMR_SCALE, 6) || 0}</td>
                                <td>{this.state.stats.hashes}</td>
                                <td></td>
                                <td>{_.round(this.state.stats.paid / XMR_SCALE, 2) || 0}</td>
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
                                        </tr>
                                    )
                                })
                            }
                    </tbody>
                </table>

                <Chart data={hashrateList} color="blue" />

                <Grid>
                    <Row>
                        <Col xs={6} md={6}>
                            <div style={styles.initDate}>{/*this._getDate(this.state.xmr.charts.hashrate[0][0])*/}</div>
                        </Col>
                        <Col xs={6} md={6}>
                            <div style={styles.lastDate}>{/*this._getDate(this.state.xmr.charts.hashrate[this.state.xmr.charts.hashrate.length - 1][0])*/}</div>
                        </Col>
                    </Row>
                </Grid>
            </div>
        )
    }
}

function mapStateToProps({ xmrStat, xmrBalance }) {
    // console.log('mapStateToProps({ xmrBalance })', xmrBalance);
    return { xmrStat, xmrBalance };
}

function mapDispatchToProps(dispatch) {
    return bindActionCreators({ fetchXmrStat, fetchXmrBalance }, dispatch);
}

export default connect(mapStateToProps, mapDispatchToProps)(XMR);
