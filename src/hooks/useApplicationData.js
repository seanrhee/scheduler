import { useState, useEffect } from 'react';
import axios from 'axios'

export default function useApplicationData() {
  const [state, setState] = useState({
    day: "Monday",
    days: [],
    appointments: {},
    interviewers: {}
  })

  function updateSpots(id, appointments) {
    const selectedDay = state.days.find((day) => day.appointments.includes(id));
    const selectedIndex = state.days.findIndex((day) => day.appointments.includes(id));

    let spots = 0;

    if (!selectedDay) {
      return state.days;
    }

    for (const id of selectedDay.appointments) {
      if (appointments[id].interview === null) {
        spots++
      }
    }

    const days = [
      ...state.days
    ]
    
    days[selectedIndex] = { ...days[selectedIndex], spots }

    return days
  }
  
  function bookInterview(id, interview) {
    const appointment = {
      ...state.appointments[id],
      interview: { ...interview }
    };
    const appointments = {
      ...state.appointments,
      [id]: appointment
    };

    const days = updateSpots(id, appointments)
  
    return axios.put(`http://localhost:8001/api/appointments/${id}`, { interview })
    .then((result) => {
      console.log(result)
      setState((prev) => {
        return {...prev, appointments, days}
      })
    })
  }
  
  function cancelInterview(id, interview) {
    const appointment = {
      ...state.appointments[id],
      interview: { ...interview }
    };
    const appointments = {
      ...state.appointments,
      [id]: appointment
    };

    const days = updateSpots(id, appointments)
  
    return axios.delete(`http://localhost:8001/api/appointments/${id}`, { interview })
    .then((result) => {
      console.log(result)
      setState((prev) => {
        return {...prev, appointments, days}
      })
    })
  }

  const setDay = day => setState({ ...state, day });
  
  useEffect(() => {
    Promise.all([
      axios.get('http://localhost:8001/api/days'),
      axios.get('http://localhost:8001/api/appointments'),
      axios.get('http://localhost:8001/api/interviewers')
    ]).then((all) => {
      setState(prev => ({...prev, days: all[0].data, appointments: all[1].data, interviewers: all[2].data}))
    })
  }, [])

  return {
    state,
    setDay,
    bookInterview,
    cancelInterview
  }
}