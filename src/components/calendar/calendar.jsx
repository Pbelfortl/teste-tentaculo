import React from 'react'
import { useState } from 'react';
import FullCalendar from '@fullcalendar/react'
import dayGridPlugin from '@fullcalendar/daygrid' // a plugin!
import interactionPlugin from '@fullcalendar/interaction';
import "./calendar.scss"

export default function ({events}) {

  const [eventsDay, setEventsDay] = useState(new Date().toJSON().slice(0, 10))

    return (
      <div className="calendar">
        <FullCalendar
        timeZone={"local"}
        plugins={[ dayGridPlugin, interactionPlugin ]}
        initialView={"dayGridMonth"}
        titleFormat={{ year: 'numeric', month: 'short' }}
        aspectRatio={1}
        dateClick = {(info) => {
          setEventsDay(info.dateStr)
          }
        }
        height={"auto"}
        eventDisplay={"background"}
        editable={true}
        selectable={true}
        selectMirror={true}
        events={events}
        />
        
        <div className='events'>
          {events.map(event => (
            eventsDay === event.date &&
            <div>
              <p>{event.title}</p>
              <p>{event.date}</p>
            </div>
          ))}
        </div>
        
      </div>
      
    )
}