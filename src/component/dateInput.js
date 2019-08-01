import React, {Component} from 'react';
import {StyleSheet, Text, View, InteractionManager} from 'react-native';
import {Navigation} from 'react-native-navigation';
import DatePicker from 'react-native-datepicker'


function now() {
    const d = new Date();
    const localTime = d.getTime();
    const localOffset = d.getTimezoneOffset() * 60000;
    const utc = localTime + localOffset;
    const offset = 8;   //东 8 区
    const beijingTime = utc + (3600000 * offset);
    
    return new Date(beijingTime);
}

export default class DateInput extends Component {

    constructor(props) {
        super(props);

        this.updateDate();
        this.state = {
            date: this.minDate
        };
    }

    componentDidMount() {
        InteractionManager.runAfterInteractions(() => {
            this.updateDate();
        });
    }

    updateDate() {
        this.nowDate = now();
        let nowMSec = this.nowDate.getTime();

        let minExpiredMSec =  8 * 24 * 3600000; // at least 7 days to expire
        let minExpiredDate = new Date(nowMSec + minExpiredMSec);
        this.minDate = this.formatDate(minExpiredDate);

        let maxExpiredMSec = 364 * 24 * 3600000; // at most 1 years to expire
        let maxExpireDate = new Date(nowMSec + maxExpiredMSec);
        this.maxDate = this.formatDate(maxExpireDate);
    }

    formatDate(date) {
        let year = date.getFullYear();
        let month = date.getMonth() + 1;
        let day = date.getDate();

        return year + '-' + month + '-' + day;
    }

    getDate() {
        return this.state.date;
    }

    render() {
        return (
            <DatePicker mode="date" format="YYYY-MM-DD" showIcon={false}
                style={this.props.style}
                customStyles={this.props.customStyles}

                confirmBtnText="确认"
                cancelBtnText="取消"

                placeholder="过期日期"
                minDate={this.minDate}
                maxDate={this.maxDate}
                date={this.state.date}

                onDateChange={(date) => {
                    this.setState({date: date})
                }}

                androidMode={'spinner'}
            />
        );
    }
}
