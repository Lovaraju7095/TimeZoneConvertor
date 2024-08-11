import React, { Component } from 'react';
import moment from 'moment-timezone';
import DatePicker from 'react-datepicker';
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';
import TimeZoneDisplay from '../TimeZoneDisplay';
import './index.css'; // Import the CSS file

class TimeZoneConverter extends Component {
  constructor(props) {
    super(props);
    this.state = {
      timeZones: ['UTC', 'Asia/Kolkata'], // Default time zones
      currentTime: moment(),
      darkMode: false,
    };
  }

  handleTimeZoneAddition = (timeZone) => {
    this.setState(prevState => ({
      timeZones: [...prevState.timeZones, timeZone]
    }));
  };

  handleTimeZoneDeletion = (index) => {
    this.setState(prevState => ({
      timeZones: prevState.timeZones.filter((_, i) => i !== index)
    }));
  };

  onDragEnd = (result) => {
    if (!result.destination) return;
    const items = Array.from(this.state.timeZones);
    const [reorderedItem] = items.splice(result.source.index, 1);
    items.splice(result.destination.index, 0, reorderedItem);
    this.setState({ timeZones: items });
  };

  handleDateChange = (date) => {
    this.setState({ currentTime: moment(date) });
  };

  toggleDarkMode = () => {
    this.setState(prevState => ({ darkMode: !prevState.darkMode }));
  };

  reverseTimeZones = () => {
    this.setState(prevState => ({ timeZones: prevState.timeZones.reverse() }));
  };

  generateShareableLink = () => {
    const params = new URLSearchParams({ timeZones: this.state.timeZones.join(','), time: this.state.currentTime.toISOString() });
    return `${window.location.origin}?${params.toString()}`;
  };

  scheduleMeet = () => {
    const calendarUrl = `https://calendar.google.com/calendar/r/eventedit?dates=${this.state.currentTime.format('YYYYMMDDTHHmmss')}/${this.state.currentTime.add(1, 'hours').format('YYYYMMDDTHHmmss')}`;
    window.open(calendarUrl, '_blank');
  };

  render() {
    const { timeZones, currentTime, darkMode } = this.state;
    return (
      <div className={`container ${darkMode ? 'dark-mode' : ''}`}>
        <div className="date-picker">
          <DatePicker
            selected={currentTime.toDate()}
            onChange={this.handleDateChange}
            showTimeSelect
            dateFormat="Pp"
          />
        </div>
        <div className="buttons">
          <button onClick={this.reverseTimeZones}>Reverse Order</button>
          <button onClick={this.toggleDarkMode}>Toggle Dark Mode</button>
          <button onClick={() => window.prompt('Shareable Link', this.generateShareableLink())}>
            Generate Shareable Link
          </button>
          <button onClick={this.scheduleMeet}>Schedule Meet</button>
        </div>
        <DragDropContext onDragEnd={this.onDragEnd}>
          <Droppable droppableId="droppable">
            {(provided) => (
              <div {...provided.droppableProps} ref={provided.innerRef}>
                {timeZones.map((zone, index) => (
                  <Draggable key={zone} draggableId={zone} index={index}>
                    {(provided) => (
                      <div
                        ref={provided.innerRef}
                        {...provided.draggableProps}
                        {...provided.dragHandleProps}
                        className="timezone-item"
                      >
                        <TimeZoneDisplay
                          timeZone={zone}
                          currentTime={currentTime}
                          onDelete={() => this.handleTimeZoneDeletion(index)}
                        />
                      </div>
                    )}
                  </Draggable>
                ))}
                {provided.placeholder}
              </div>
            )}
          </Droppable>
        </DragDropContext>
      </div>
    );
  }
}

export default TimeZoneConverter;
