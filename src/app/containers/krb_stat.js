import _ from 'lodash';
import React, { Component } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { Grid, Row, Col } from 'react-bootstrap';
import { fetchKrb } from '../actions/getKrbStat';
import { fetchKrbBtc } from '../actions/getKrbBtc';
import { fetchUahBtc } from '../actions/getUahBtc';
import { fetchUsdBtc } from '../actions/getUsdBtc';
import { fetchEurBtc } from '../actions/getEurBtc';

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

class KRB extends Component {
    constructor(props) {
        super(props);

        this.props.fetchKrb();
        this.props.fetchKrbBtc();
        this.props.fetchUahBtc();
        this.props.fetchUsdBtc();
        this.props.fetchEurBtc();
    }

    componentWillReceiveProps(nextProps) {
      console.log('componentWillReceiveProps(nextProps)', nextProps)
        this.setState({
            charts: nextProps.krb.krb.charts,
            payments: nextProps.krb.krb.payments,
            stats:  nextProps.krb.krb.stats,
            rate: nextProps.krbbtc.krbBTC.Data.LastPrice / nextProps.usdbtc.usdBTC,
            usdBTC: nextProps.usdbtc.usdBTC,
            krbBTC: nextProps.krbbtc.krbBTC.Data.LastPrice,
            uahBTC: nextProps.uahbtc.uahBTC.bpi.UAH.rate,
            eurBTC: nextProps.eurbtc.eurBTC.bpi.EUR.rate,
        })
    }

    componentDidMount() {
        this.interval = setInterval(() =>
            this.setState({
                fetch: this.props.fetchKrb(),
                fetchKrbBtc: this.props.fetchKrbBtc(),
                fetchUsdBtc: this.props.fetchUsdBtc(),
                charts: this.props.krb.krb.charts,
                payments: this.props.krb.krb.payments,
                stats:  this.props.krb.krb.stats,
                time: Date.now()
            })
            , TICK_INTERVAL);
    }

    componentWillUnmount() {
        clearInterval(this.interval);
    }

    _getDate(timestamp) {
        let date = new Date(timestamp*1000);
        let day = date.getDate();
        let month = date.getMonth() + 1;
        let year = date.getFullYear();
        let hours = date.getHours();
        let minutes = date.getMinutes() < 9 ? "0" + date.getMinutes() : date.getMinutes();
        let seconds = date.getSeconds() < 9 ? "0" + date.getSeconds() : date.getSeconds();

       return day + '-' + month + '-' + year + ' ' + hours + ':' + minutes + ':' + seconds;
    }

    _getDay(timestamp) {
        let date = new Date(timestamp*1000);
        let day = date.getDate();

       return day;
    }

    _isDate(timestamp) {
        let isDate = false
        let date = new Date(timestamp*1000);
        let today = new Date();

        if(date.getFullYear() <= today.getFullYear()) {
          isDate = true;
        }

       return isDate;
    }

    _getKrbSatsTable() {
      return (
        <table className="table table-hover">
            <thead>
            <tr>
                <th>balance</th>
                <th>hashes</th>
                <th>hashrate</th>
                <th>paid</th>
            </tr>
            </thead>
            <tbody>
                <tr>
                    <td>{_.round(this.state.stats.balance / KRB_SCALE, 2)} ({_.round((this.state.stats.balance / KRB_SCALE) * this.state.rate, 4)})</td>
                    <td>{this.state.stats.hashes}</td>
                    <td>{this.state.stats.hashrate}</td>
                    <td>{this.state.stats.paid / KRB_SCALE} ({_.round((this.state.stats.paid / KRB_SCALE) * this.state.rate, 4)})</td>
                </tr>
            </tbody>
        </table>
      )
    }

    _getKrbPaymentsRows(payments) {
      let paymentIndex = 0;
      let paymentList = [{paymentsDate: null, paymentsAmount: null}];
      let paymentDailyList = [{paymentsDate: null, paymentsAmount: null}]
      let paymentsDate;
      let paymentsAmount = 0;
      let currentDate;
      let currentDay;
      let prevDate;

      payments.map((payment) => {
        currentDate = payment.replace(/.*?:/,'').replace(/:.*/,'');
        currentDay = this._getDay(currentDate);


        if(this._isDate(currentDate)) {
            if(prevDate == currentDay) {
              paymentList[paymentIndex - 1].paymentsAmount += paymentsAmount;
            } else {
              paymentList[paymentIndex] = {paymentsAmount: paymentsAmount, paymentsDate: this._getDate(currentDate)};
              prevDate = currentDay;
              paymentIndex++;
            }
        } else {
          paymentsAmount = currentDate / KRB_SCALE;
        }
      })

      return paymentList.map((paymentRow) => {
        return (
            <tr key={paymentRow.paymentsDate}>
                <td>{paymentRow.paymentsDate}</td>
                <td>{paymentRow.paymentsAmount} ({_.round((paymentRow.paymentsAmount) * this.state.rate, 4)})</td>
            </tr>
        );
      })
    }


    render() {
        if(!Object.getOwnPropertyNames(this.props.krb).length) {return <div></div>;}


        return (
            <div style={styles.component}>
                KRB ( {_.round(this.state.rate, 4)} USD )
                {/*console.log(this.state)*/}
                {this._getKrbSatsTable()}

                <table className="table table-hover">
                    <thead>
                    <tr>
                        <th>date/time</th>
                        <th>paid</th>
                    </tr>
                    </thead>
                    <tbody>
                      {this._getKrbPaymentsRows(this.state.payments)}
                    </tbody>
                </table>
            </div>
        )
    }
}

function mapStateToProps({ krb, krbbtc, uahbtc, usdbtc, eurbtc }) {
    return { krb, krbbtc, uahbtc, usdbtc, eurbtc };
}

function mapDispatchToProps(dispatch) {
    return bindActionCreators({ fetchKrb, fetchKrbBtc, fetchUsdBtc, fetchUahBtc, fetchEurBtc }, dispatch);
}

export default connect(mapStateToProps, mapDispatchToProps)(KRB);
