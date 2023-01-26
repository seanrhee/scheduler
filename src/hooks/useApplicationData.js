import { useState, useEffect } from 'react';
import axios from 'axios'

export default function useApplicationData() {
  const [state, setState] = useState({
    day: "Monday",
    days: [],
    appointments: {},
    interviewers: {}
  })

  
  const setDay = day => setState({ ...state, day });
  
  useEffect(() => {
    Promise.all([
      axios.get('/api/days'),
      axios.get('/api/appointments'),
      axios.get('/api/interviewers')
    ]).then((all) => {
      setState(prev => ({...prev, days: all[0].data, appointments: all[1].data, interviewers: all[2].data}))
    })
  }, [])

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
  
    return axios.put(`/api/appointments/${id}`, { interview })
    .then((result) => {
      setState((prev) => {
        return {...prev, appointments, days}
      })
    })
  }
  
  function cancelInterview(id) {
    const appointment = {
      ...state.appointments[id],
      interview: null
    };
    const appointments = {
      ...state.appointments,
      [id]: appointment
    }
    const days = updateSpots(id, appointments)
    const interviewDataFromAPI = `/api/appointments/${id}`;
    return axios.delete(interviewDataFromAPI)
      .then(() => {
        setState((prev) => {
          return {
            ...prev, appointments, days
          }
        })
      })
  }

  return {
    state,
    setDay,
    bookInterview,
    cancelInterview
  }
}