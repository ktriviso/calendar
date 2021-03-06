import React, { Component } from 'react';
import ViewEvent from './ViewEvent'
import CreateEvent from './CreateEvent'
import './css/day.css';

export default class Day extends Component {
  constructor(props){
    super(props)
    this.state = {
      day: this.props.index,
      isCreateEventOpen: false,
      isViewEventOpen: false,
      updateComp: false
    }
  }

  createEvent = (e) => {
    e.preventDefault()
    this.setState({ isCreateEventOpen: true})
  }

  viewEvent = (e) => {
    e.preventDefault()
    let targetEvent = this.state.calendar_event.find((eve) => {
      // radix err: set the defualt to 10 https://stackoverflow.com/questions/7818903/jslint-says-missing-radix-parameter-what-should-i-do
      if(parseInt(e.target.getAttribute('event_id'), 10) === eve.event_id){
        return eve
      }
      return null
    })
    this.setState({
      currentEvent: targetEvent
    })
    this.openViewEvent()
  }

  openViewEvent = () => {
    this.setState({ isViewEventOpen: true})
  }

  closeViewEvent = () => {
    this.setState({ isViewEventOpen: false })
  }

  closeCreateEvent = () => {
    this.setState({ isCreateEventOpen: false })
  }

  componentWillReceiveProps(nextProps){
    if(nextProps.eventsFromDatabase !== undefined){
      this.setState({
        calendar_event : nextProps.eventsFromDatabase
      })
    }
  }

  shouldUpdate = (eventAdded) => {
    // console.log(eventAdded)
    this.props.shouldUpdate(eventAdded)
  }

  render() {

    const conditionalViewEvent = this.state.isViewEventOpen ?
    <ViewEvent
      onClose={this.closeViewEvent}
      currentEvent={this.state.currentEvent}
      currentMonth={this.props.currentMonth}
      shouldUpdate={this.shouldUpdate}
    /> : null

    const conditionalCreateEvent = this.state.isCreateEventOpen ?
    <CreateEvent
      onClose={this.closeCreateEvent}
      currentDay={this.state.day}
      currentMonth={this.props.currentMonth}
      shouldUpdate={this.shouldUpdate}
    /> : null

    const scroll = this.state.calendar_event && this.state.calendar_event.length > 2 ? <span className="icon"><i className="fas fa-arrow-down icon-small"></i></span> : null

    const calendar_event = this.state.calendar_event ? this.state.calendar_event.map((eve, i) => {
      return <li key={eve.event_id} event_id={eve.event_id} onClick={this.viewEvent}>{eve.event_name}</li>
    }) : null

    return (
      <td key={this.props.index} className={this.props.className}>
        {conditionalCreateEvent}
        {conditionalViewEvent}
        <span>{this.props.index}</span>
        <ul>{calendar_event}</ul>
        {scroll}
        <span onClick={this.createEvent}><i className="fas fa-plus icon-small"></i></span>
      </td>
    );
  }
}
