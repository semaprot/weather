import _ from 'lodash';
import React, { Component } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { Grid, Row, Col } from 'react-bootstrap';
import { fetchKrb } from '../actions/getKrbStat';

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
    }

    componentWillReceiveProps(nextProps) {
        // console.log('nextProps', nextProps)
        this.setState({
            charts: nextProps.krb.krb.charts,
            payments: nextProps.krb.krb.payments,
            stats:  nextProps.krb.krb.stats,
        })
    }

    componentDidMount() {
        this.interval = setInterval(() =>
            this.setState({
                fetch: this.props.fetchKrb(),
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
      // console.log('timestamp', timestamp.length);
        let isDate = false
        let date = new Date(timestamp*1000);
        let today = new Date();

        // console.log('date, today', date.getFullYear() <= today.getFullYear());

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
                    <td>{_.round(this.state.stats.balance / KRB_SCALE, 2)}</td>
                    <td>{this.state.stats.hashes}</td>
                    <td>{this.state.stats.hashrate}</td>
                    <td>{this.state.stats.paid  / KRB_SCALE}</td>
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
        // console.log(payment)
        currentDate = payment.replace(/.*?:/,'').replace(/:.*/,'');
        currentDay = this._getDay(currentDate);


        if(this._isDate(currentDate)) {
          // console.log('paymentsDate', this._getDate(payment.replace(/.*?:/,'').replace(/:.*/,'')))
          // console.log('prevDate == currentDate', prevDate, currentDay);

            if(prevDate == currentDay) {
              console.log('prevDate == currentDay, paymentIndex', prevDate, currentDay, paymentsAmount, paymentIndex);
              paymentList[paymentIndex - 1].paymentsAmount += paymentsAmount;
            } else {
              console.log('prevDate !== currentDay, paymentIndex', prevDate, currentDay, paymentsAmount, paymentIndex);
              paymentList[paymentIndex] = {paymentsAmount: paymentsAmount, paymentsDate: this._getDate(currentDate)};
              // paymentList[paymentIndex].paymentsDate = this._getDate(currentDate);
              prevDate = currentDay;
              paymentIndex++;
            }
            // console.log(paymentList[paymentIndex].paymentsAmount, currentDate)

        } else {
          paymentsAmount = currentDate / KRB_SCALE;
          // console.log('paymentsAmount', payment.replace(/.*?:/,'').replace(/:.*/,'') / KRB_SCALE);
          // if(prevDate == currentDay) {
          //
          //   paymentList[paymentIndex].paymentsAmount += currentDate / KRB_SCALE;
          //   // console.log(currentDay, paymentList[paymentIndex].paymentsAmount, currentDate / KRB_SCALE)
          // } else {
          //   paymentList[paymentIndex] = {paymentsAmount: currentDate / KRB_SCALE, paymentsDate: null};
          // }

        }
      })

      // paymentsMap1.entrySeq().forEach(e => console.log(`key: ${e[0]}, value: ${e[1]}`));

      // paymentIndex = 0;
      // prevDate = paymentList[0].paymentsDate;
      // paymentsAmount = paymentList[0].paymentsAmount;
      // paymentDailyList[paymentIndex] = {paymentsAmount: paymentsAmount, paymentsDate: prevDate};
      // paymentIndex++;
      //
      // paymentList.map((paymentRow) => {
      //   if(prevDate == paymentRow.paymentsDate) {
      //     paymentsAmount += paymentRow.paymentsAmount;
      //     paymentDailyList[paymentIndex] = {paymentsAmount: paymentsAmount, paymentsDate: paymentRow.paymentsDate};
      //   } else {
      //     prevDate = paymentRow.paymentsDate;
      //     paymentDailyList[paymentIndex] = {paymentsAmount: paymentRow.paymentsAmount, paymentsDate: paymentRow.paymentsDate};
      //     paymentIndex++;
      //   }
      // })

      console.log(paymentList);

      // return (
        return paymentList.map((paymentRow) => {
          // console.log(paymentRow)
          return (
              <tr key={paymentRow.paymentsDate}>
                  <td>{paymentRow.paymentsDate}</td>
                  <td>{paymentRow.paymentsAmount}</td>
              </tr>
          );
        })
      // )
    }


    render() {
        if(!Object.getOwnPropertyNames(this.props.krb).length) {return <div></div>;}
        // let hashrateList = [];

        return (
            <div style={styles.component}>
                KRB
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

function mapStateToProps({ krb }) {
    // console.log('mapStateToProps({ fetchKrb })', fetchKrb);
    return { krb };
}

function mapDispatchToProps(dispatch) {
    return bindActionCreators({ fetchKrb }, dispatch);
}

export default connect(mapStateToProps, mapDispatchToProps)(KRB);
