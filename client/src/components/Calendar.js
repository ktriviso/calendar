import React, { Component } from 'react';
import moment from 'moment'
import CheckList from './CheckList'
import Day from './Day'
import './css/calendar.css';

export default class Calendar extends Component {
  constructor(props){
    super(props);
    this.state = {
      formatDate: moment(),
      weekdays: moment.weekdays(),
      weekdaysShort: moment.weekdaysShort(),
      months: moment.months(),
      showMonthList: false,
      showCheckList: false
    }
  }

  componentDidMount(){
    const user = localStorage.getItem('user')
    this.setState({
      user: user
    })
    this.getEventsFromDatabase()
  }

  getEventsFromDatabase = () => {
    fetch(`api`, {
      method: 'GET',
      headers: {'Content-Type': 'application/json'}
    })
    .then((response) => response.json())
    .then((data) => {
      this.setState({
          eventsFromDatabase: data
      })
    })
    .catch((err) => console.log(err))
  }

  getCurrentYear = () => {
    return this.state.formatDate.format('Y')
  }

  getCurrentMonth = () => {
    return this.state.formatDate.format('MMMM')
  }

  getDaysInMonth = () => {
    return this.state.formatDate.daysInMonth()
  }

  getCurrentDate = () => {
    return this.state.formatDate.get('date')
  }

  getCurrentDay  = () => {
    return this.state.formatDate.get('D')
  }

  firstDayOfMonth = () => {
    let date = this.state.formatDate
    let firstDay = moment(date).startOf('month').format('d')
    return firstDay
  }

  lastDayOfMonth = () => {
    let date = this.state.formatDate
    let lastDay = moment(date).endOf('month').format('d')
    return lastDay
  }

  SelectList = (props) => {
    let popup = props.data.map((data) => {
      return (
        <div key={data}>
          <a href="#" onClick={(e) => {this.changeMonth(e, data)}}>
          {data}
          </a>
        </div>
      )
    })

    return (
      <div className="month-dropdown">
      {popup}
      </div>
    )
  }

  setMonth = (month) => {
    // needed help for the moment.js current month update
    // https://www.youtube.com/watch?v=5vYJO0zRfbQ
    let updatedMonth = this.state.months.indexOf(month)
    let formatDate = Object.assign({}, this.state.formatDate)
    formatDate = moment(formatDate).set("month", updatedMonth)
    this.setState({
      formatDate: formatDate
    })
  }

  changeMonth = (e, data) => {
    e.preventDefault()
    this.setMonth(data)
  }

  showMonths = () => {
    this.setState({
      showMonthList: !this.state.showMonthList
    })
  }

  MonthNav = () => {
    return (
      <h3 className="month" onClick={this.showMonths}>
      {this.getCurrentMonth()}
      {this.state.showMonthList ? <this.SelectList data={this.state.months} /> : null}
      </h3>
    )
  }

  toggleCheckList = () => {
    this.setState({
      showCheckList: !this.state.showCheckList
    })
  }

  shouldUpdate = (newEventAdded) => {
    if(newEventAdded){
      this.getEventsFromDatabase()
    }

  }

  render() {
    // how many blanks to leave in the begining of the month
    let blanks = []
    for(let i = 0; i < this.firstDayOfMonth(); i++){
      blanks.push(
        <td key={i*50} className='emptySlot'>
          {''}
        </td>
      )
    }
    // how many blanks to leave in the end of the month
    let endBlanks = []
    for(let j = this.lastDayOfMonth(); j < 7; j++){
      endBlanks.push(
        <td key={j*90+1} className='emptySlot'>
          {''}
        </td>
      )
    }

    let daysInMonth = []
    for(let i = 1; i < this.getDaysInMonth(); i++){
      // highlights the current date for day and month
      let className = (i === this.getCurrentDay() && (moment().format('MMMM') === this.getCurrentMonth()))? 'day current-day' : 'day'
      if(this.state.eventsFromDatabase){
        let dayEvents = this.state.eventsFromDatabase.filter((eve) => {
          return (eve.event_date === i && eve.event_month === this.getCurrentMonth())
        })
        daysInMonth.push(
          <Day className={className} key={i} index={i} eventsFromDatabase={dayEvents} shouldUpdate={this.shouldUpdate} currentMonth={this.getCurrentMonth()} />
        )
      } else {
        daysInMonth.push(
          <Day className={className} key={i} index={i} eventsFromDatabase={null}
          shouldUpdate={this.shouldUpdate} currentMonth={this.getCurrentMonth()} />
        )
      }
    }

    let weekdays = this.state.weekdaysShort.map((day) => {
      return (
        <td key={day}>{day}</td>
      )
    })

    const totalSlots = [...blanks, ...daysInMonth, ...endBlanks]
    let rows = []
    let cells = []

    // you need to break the totalSlots into rows of 7, so filter by index
    totalSlots.forEach((row, i) => {
      if(i % 7 !== 0){
        cells.push(row)
      } else {
        let newRow = cells.slice()
        rows.push(newRow)
        cells = []
        cells.push(row)
      }

      if(i === totalSlots.length -1){
        let newRow = cells.slice()
        rows.push(newRow)
      }
    })

    let elements = rows.map((elem, i) => {
      return (
        <tr key={i}>
          {elem}
        </tr>
      )
    })

    return (
      <div id="root">

      <header>
        <p onClick={this.toggleCheckList}>Hey {this.state.user ? this.state.user : null}, <b>toggle</b> me</p>
        <CheckList isCheckListOpen={this.state.showCheckList} />
        <h1>Welcome {this.state.user ? this.state.user : null}</h1>
      </header>

      <div className='calendar-container'>
        <table className='calendar'>
          <thead>
            <tr className='calendar-header'>
              <td colSpan='7'>
                <this.MonthNav />
              </td>
            </tr>
          </thead>
          <tbody>
            <tr className='weekdays'>
              {weekdays}
            </tr>
            {elements}
          </tbody>
        </table>
      </div>

      </div>
    );
  }
}

// {this.getCurrentMonth()}
