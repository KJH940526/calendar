import React from 'react';
import events from './events';
import { Calendar, momentLocalizer, Views } from 'react-big-calendar'
import moment from 'moment'
import 'moment/locale/ko'
import _ from 'lodash'
import withDragAndDrop from 'react-big-calendar/lib/addons/dragAndDrop'

import 'react-big-calendar/lib/css/react-big-calendar.css';
import 'react-big-calendar/lib/addons/dragAndDrop/styles.scss'

moment.locale("ko")

const DragAndDropCalendar = withDragAndDrop(Calendar)

class App extends React.Component {
  constructor(...args) {
    super(...args)
    this.state = {
      events: _.cloneDeep(events),
      dayLayoutAlgorithm: 'no-overlap',
      displayDragItemInCell: true,
    }
    this.moveEvent = this.moveEvent.bind(this)
    this.newEvent = this.handleSelect.bind(this)
  }

  handleSelect = ({ start, end }) => {
    const title = window.prompt('일정을 추가하세요')
    if (title)
      this.setState({
        events: [
          ...this.state.events,
          {
            start,
            end,
            title,
          },
        ],
      })
  }


  handleDragStart = event => {
    this.setState({ draggedEvent: event })
  }

  dragFromOutsideItem = () => {
    return this.state.draggedEvent
  }

  onDropFromOutside = ({ start, end, allDay }) => {
    const { draggedEvent } = this.state

    const event = {
      title: draggedEvent.title,
      start,
      end,
      allDay: allDay,
    }

    this.setState({ draggedEvent: null })
    this.moveEvent({ event, start, end })
  }

  moveEvent = ({ event, start, end, isAllDay: droppedOnAllDaySlot }) => {
    const { events } = this.state

    let allDay = event.allDay

    if (!event.allDay && droppedOnAllDaySlot) {
      allDay = true
    } else if (event.allDay && !droppedOnAllDaySlot) {
      allDay = false
    }

    const nextEvents = events.map(existingEvent => {
      return existingEvent.title === event.title
        ? { ...existingEvent, start, end }
        : existingEvent
    })

    this.setState({
      events: nextEvents,
    })

  }

  resizeEvent = ({ event, start, end }) => {
    const { events } = this.state

    const nextEvents = events.map(existingEvent => {
      console.log(existingEvent);
      console.log(event.title);

      return existingEvent.title === event.title
        ? { ...existingEvent, start, end }
        : existingEvent
    })

    this.setState({
      events: nextEvents,
    })
  }


  onSelectEvent(pEvent) {
    const r = window.confirm("일정을 취소합니다.")
    if(r === true){
      this.setState((prevState, props) => {
        const events = [...prevState.events]
        const idx = events.indexOf(pEvent)
        events.splice(idx, 1);
        return { events };
      });
    }
  }


  render() {
    const localizer = momentLocalizer(moment)
    return (
      <>
        <h1>일정관리</h1>
        <DragAndDropCalendar
          style={{ height: 800 ,width: '100%' }}
          popup={true}                            //popup 만들어주는거 넘어갓을 때
          selectable={'ignoreEvents'}                              //선택할수 있게 만들어줌
          localizer={localizer}
          events={this.state.events}
          defaultView={Views.WEEK}
          scrollToTime={new Date()}
          defaultDate={moment().toDate()}
          onSelectSlot={this.handleSelect}
          dayLayoutAlgorithm={this.state.dayLayoutAlgorithm}


          onEventDrop={this.moveEvent}
          onEventResize={this.resizeEvent}
          onDragStart={console.log}
          dragFromOutsideItem={
          this.state.displayDragItemInCell ? this.dragFromOutsideItem : null
        }
        onDropFromOutside={this.onDropFromOutside}
        handleDragStart={this.handleDragStart}

        onSelectEvent = {event => this.onSelectEvent(event)}

        />
      </>
    )
  }
}

export default App;
