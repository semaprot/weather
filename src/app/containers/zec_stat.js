import _ from 'lodash';
import React, { Component } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { Grid, Row, Col } from 'react-bootstrap';
import { fetchZecStat } from '../actions/getZecStat';
import { fetchZecWorkers } from '../actions/getZecWorkers';
import { fetchZecPrices } from '../actions/getZecPrices';
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
        color: "#446e9b",
        paddingTop: "10px",
        paddingLeft: "50px",
        paddingRight: "50px",
    },
    coution: {
      color: "red",
    },
};

class ZEC extends Component {
    constructor(props) {
        super(props);

        this.props.fetchZecStat();
        this.props.fetchZecWorkers();
        this.props.fetchZecPrices();

        this.state = {
            time: Date.now()
        };
    }

    componentWillReceiveProps(nextProps) {
      // console.log('nextProps', nextProps);
      this.setState({
          zecStat: nextProps.zecStat.zecStat.data,
          zecWorkers: nextProps.zecWorkers.zecWorkers.data,
          zecPrices: nextProps.zecPrices.zecPrices.data,
      })
    }

    componentDidMount() {
        this.interval = setInterval(() =>
            this.setState({
                time: Date.now(),
                zecStat: this.props.fetchZecStat(),
                zecWorkers: this.props.fetchZecWorkers(),
                zecPrices: this.props.fetchZecPrices(),
            })
            , TICK_INTERVAL);
    }

    componentWillUnmount() {
        clearInterval(this.interval);
    }

    _isOutwork() {
      // console.log('this.state.zecWorkers', this.state.zecWorkers);
        if(this.state.zecWorkers.offline == 0) {
          return (<div></div>)
        } else {
          return (
            <div style={styles.coution}>
              <div>CAUTION: GPU OUTWORK</div>
              <table className="table table-hover">
                  <tbody>
                    {
                        this.state.zecWorkers.workers.map((worker) => {
                          return (
                            <tr key={worker.id}>
                                <td>{worker.id}</td>
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
        if(!Object.getOwnPropertyNames(this.props.zecWorkers).length) {return <div></div>;}

        return (
            <div style={styles.component}>

                {this._isOutwork()}

                ZEC ( {this.state.zecPrices.price_usd} USD / {this.state.zecPrices.price_eur} EUR )

                <table className="table table-hover">
                    <thead>
                    <tr>
                        <th>Total balance</th>
                        <th>{"Hashrate ( " + this.state.zecStat.userParams.w_count + " miners )"}</th>
                        <th>paid</th>
                        <th>paid, usd</th>
                        <th>paid, eur</th>
                    </tr>
                    </thead>
                    <tbody>
                      <tr key={"total-balance"}>
                          <td>{_.round(this.state.zecStat.userParams.balance, 5)} ({_.round(this.state.zecStat.userParams.balance * this.state.zecPrices.price_usd, 2)} / {_.round(this.state.zecStat.userParams.balance * this.state.zecPrices.price_eur, 2)})</td>
                          <td>{this.state.zecStat.userParams.hashrate + " Sol/s"}</td>
                          <td>{this.state.zecStat.userParams.e_sum}</td>
                          <td>{_.round(this.state.zecStat.userParams.e_sum * this.state.zecPrices.price_usd, 2)}</td>
                          <td>{_.round(this.state.zecStat.userParams.e_sum * this.state.zecPrices.price_eur, 2)}</td>
                      </tr>
                    </tbody>
                </table>
            </div>
        )
    }
}

function mapStateToProps({ zecStat, zecWorkers, zecPrices }) {
    return { zecStat, zecWorkers, zecPrices };
}

function mapDispatchToProps(dispatch) {
    return bindActionCreators({ fetchZecStat, fetchZecWorkers, fetchZecPrices }, dispatch);
}

export default connect(mapStateToProps, mapDispatchToProps)(ZEC);
