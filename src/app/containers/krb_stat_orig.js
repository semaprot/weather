import _ from 'lodash';
import React, { Component } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { Grid, Row, Col } from 'react-bootstrap';
import { fetchKrb } from '../actions/getKrbStat';
import _Chart from '../components/chart';
import { Chart } from 'react-google-charts';

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
        paddingTop: "50px",
    },
};

class KRB extends Component {
    constructor(props) {
        super(props);

        this.props.fetchKrb();

        this.state = {
            lastPayTime: 0,
            currentPay: 0,
            krb: this.props.krb.krb,
            time: Date.now()
        };
    }

    componentWillReceiveProps(nextProps) {
        // console.log('nextProps', this._getDate(nextProps.krb.krb.payments[1]).date)
        // console.log('nextProps', nextProps.krb.krb)
        //     console.log(this._getDate(nextProps.krb.krb.payments[1]).date + ' ' + this._getDate(nextProps.krb.krb.payments[1]).time)
            this.setState({
                lastPayTime: this._getDate(nextProps.krb.krb.payments[1]).date + ' ' + this._getDate(nextProps.krb.krb.payments[1]).time,
                currentPay: _.round(nextProps.krb.krb.stats.paid / KRB_SCALE, 2),
                krb: nextProps.krb.krb
            })

    }

    componentDidMount() {
        this.interval = setInterval(() =>
            this.setState({
                fetch: this.props.fetchKrb(),
                krb: this.props.krb.krb,
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
        let minutes = "0" + date.getMinutes();
        let seconds = "0" + date.getSeconds();

       return {
           date: day + '-' + month + '-' + year,
           time: hours + ':' + minutes.substr(-2) + ':' + seconds.substr(-2)
       };
    }

    _getDayMon(timestamp) {
        let date = new Date(timestamp*1000);
        let day = date.getDate() > 9 ? date.getDate().toString() : '0' + date.getDate();
        let month = (date.getMonth() + 1) > 9 ? (date.getMonth() + 1).toString() : '0' + (date.getMonth() + 1);
        let year = date.getFullYear();
        let hours = date.getHours();
        let minutes = "0" + date.getMinutes();
        let seconds = "0" + date.getSeconds();

        let dayMon = day.concat(month);

       return dayMon;
       // return {
       //     date: day + '-' + month + '-' + year,
       //     time: hours + ':' + minutes.substr(-2) + ':' + seconds.substr(-2)
       // };
    }
    _getDayMonHourMinutes(timestamp) {
        let date = new Date(timestamp*1000);
        let day = date.getDate();
        let month = date.getMonth() + 1;
        let year = date.getFullYear();
        let hours = date.getHours() > 9 ? date.getHours().toString() : '0' + date.getHours();
        let minutes = date.getMinutes() > 9 ? date.getMinutes().toString() : '0' + date.getMinutes();
        let seconds = date.getSeconds()

        let d_mhm = day + '.' + (month.toString().concat(hours.toString())).concat(minutes.toString());

        // console.log(month, hours, minutes, (month.toString().concat(hours.toString())).concat(minutes));

        let dayMonHoursMinutes = Number.parseFloat(day + '.' + (month.toString().concat(hours.toString())).concat(minutes));

       return dayMonHoursMinutes;
       // return {
       //     date: day + '-' + month + '-' + year,
       //     time: hours + ':' + minutes.substr(-2) + ':' + seconds.substr(-2)
       // };
    }
    _getKrbSatsTable() {
      return (
        <table className="table table-hover">
            <thead>
            <tr>
                <th>balance</th>
                <th>hashes</th>
                <th>hashrate</th>
                <th>hashrate (avg)</th>
                <th>paid</th>
                <th>last payments</th>
            </tr>
            </thead>
            <tbody>
                <tr>
                    <td>{_.round(this.state.krb.stats.balance / KRB_SCALE, 2)}</td>
                    <td>{this.state.krb.stats.hashes}</td>
                    <td>{this.state.krb.stats.hashrate}</td>
                    <td>{hashrateAvg}</td>
                    <td>{this.state.currentPay}</td>
                    <td>{this.state.lastPayTime}</td>
                </tr>
            </tbody>
        </table>
      )
    }

    render() {
        if(!Object.getOwnPropertyNames(this.props.krb).length) {return <div></div>;}

        let initDate = this._getDate(this.state.krb.charts.hashrate[0][0]);
        let lastDate = this._getDate(this.state.krb.charts.hashrate[this.state.krb.charts.hashrate.length - 1][0]);
        let krbCount = 0;
        let krbCountCurrentDay = 0;
        let hashrateCount = [];
        let hashrateList = [];
        let hashrateAvg;
        let currentDate;
        let paymentDate;
        let amountKrb;
        let prevPayDay;
        let paymentsList = [];
        let i = 0;
        let paymentDaysList = [];
        let rows = [
            [4, 4, '12'],
            [7, 7, '5.5'],
            [9, 9, '14'],
            [12, 12, '5'],
            [15, 15, '3.5'],
            [17, 17, '7'],
        ];
        let columns = [
            {
                type: 'number',
                label: 'Age1',
            },
            {
                type: 'number',
                label: 'Karbowanec',
            },
            {
                type: 'string',
                role: 'annotation',
            },
        ];
        let columnsH = [
            {
                type: 'number',
                label: 'Count',
            },
            {
                type: 'number',
                label: 'Hashrate',
            }
        ];

        this.state.krb.charts.hashrate.forEach((hashrate, ii) => {
            hashrateList[ii] = [ii, hashrate[1]];
            hashrateCount[ii] = hashrate[1];
        });


        _.reverse(this.state.krb.payments);

        prevPayDay = this._getDayMon(this.state.krb.payments[0]);
        // console.log(prevPayDay)
        this.state.krb.payments.forEach((payment) => {

            if(this._getDate(payment).date !== 'NaN-NaN-NaN') {

                let date = this._getDate(payment);
                if (currentDate !== date.date) {
                    // console.log(date.date)
                    paymentDate = this._getDayMon(payment);
                }
                currentDate = this._getDate(payment).date;
            }

            if (payment.match(/:/, '')) {
              // console.log(payment, prevPayDay, paymentDate)
                amountKrb = payment.replace(/.*?:/,'').replace(/:.*/,'') / KRB_SCALE;
                krbCount += amountKrb;
                krbCountCurrentDay += amountKrb;
                paymentsList[i] = [krbCount, amountKrb, null];

                if(prevPayDay !== paymentDate) {
                    // console.log('prevPayDay !== paymentDate', prevPayDay, paymentDate)
                    paymentsList[i][2] = krbCountCurrentDay.toString();
                    paymentDaysList[paymentDaysList.length] = krbCount + (Number.parseFloat(prevPayDay) / 10000);
                    prevPayDay = paymentDate;
                    krbCountCurrentDay = 0;
                }
                i++;
            }

        });

        paymentsList[i] = [krbCount, amountKrb, krbCountCurrentDay.toString()];
        paymentDaysList[paymentDaysList.length] = krbCount + (Number.parseFloat(prevPayDay) / 10000);

        hashrateAvg = _.round(_.sum(hashrateCount)/hashrateCount.length)

        // console.log(paymentsList, paymentDaysList)
        return (
            <div style={styles.component}>
                KRB
                {/*this._getKrbSatsTable()*/}
            </div>
        )
    }
}

function mapStateToProps({ krb }) {
    //console.log('mapStateToProps({ krb })', krb);
    return { krb };
}

function mapDispatchToProps(dispatch) {
    return bindActionCreators({ fetchKrb }, dispatch);
}

export default connect(mapStateToProps, mapDispatchToProps)(KRB);
