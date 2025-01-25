import FullCalendar from '@fullcalendar/react'
import dayGridPlugin from '@fullcalendar/daygrid'
import Styles from "./UserDashboard.module.css"
import { useEffect, useState } from 'react'
import toast from 'react-hot-toast'
import { useNavigate } from 'react-router-dom'

export default function UserDashboard({ user }) {
  const [attendance, setAttendance] = useState([])
  const navigate = useNavigate()

  useEffect(() => {
    if (sessionStorage.getItem("auth-token")) {
      fetchAttendance();
    } else navigate("/login");
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [navigate, user]);

  const fetchAttendance = async () => {
    try {
      const token = sessionStorage.getItem('auth-token');
      const response = await fetch(`${process.env.REACT_APP_BACKEND_URL}/attendance/getAttendance`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'auth-token': token
        }
      });
      const data = await response.json();
      if (data.success) {
        if (data.user.admin) {
          navigate("/admin/dashboard")
        }
        else {
          setAttendance(data.attendance);
        }
      }
      else {
        toast.error(data.error);
        sessionStorage.removeItem("auth-token");
        navigate("/login")
      }
    } catch (error) {
      toast.error('Internal Server Error Occurred!');
      sessionStorage.removeItem("auth-token");
      navigate("/login")
    }
  };

  async function handleAddAttendance() {
    const today = new Date();
    const existingAttendance = attendance.find(entry => {
      return new Date(entry.date).getDate() === today.getDate();
    });
    if (existingAttendance) {
      toast.error('Attendance for today already exists.', { id: "atendanceAlreadyExist!" });
      return
    }
    toast.promise(
      new Promise(async (resolve, reject) => {
        const response = await fetch(`${process.env.REACT_APP_BACKEND_URL}/attendance/addAttendance`, {
          method: 'POST',
          headers: {
            'auth-token': sessionStorage.getItem("auth-token")
          }
        });
        const json = await response.json()
        if (json.success) {
          fetchAttendance();
          resolve('Attendance added successfully.');
        }
        else reject(json.error);
      }),
      {
        loading: 'Adding Attendance..',
        success: 'Attendance added successfully!',
        error: (error) => error.toString(),
      }
    )
  }

  const eventClassNames = (arg) => {
    switch (arg.event.title) {
      case 'absent':
        return 'absent';
      case 'present':
        return 'present';
      default:
        return 'absent';
    }
  };

  return (
    <div className="container mt-5 mb-5">
      <h1>Your Attendance</h1>
      <div className={Styles.userArea}>
        <div className={Styles.calenderArea}>
          <FullCalendar
            plugins={[dayGridPlugin]}
            initialView="dayGridMonth"
            events={attendance}
            contentHeight={"500px"}
            timeZone='Asia/Kolkata'
            eventClassNames={eventClassNames}
          />
        </div>
        <div className={Styles.addPresentButtonArea}>
          <h5>Add Your today's present </h5>
          <button className='btn btn-primary' onClick={handleAddAttendance}>Add</button>
        </div>
      </div>
    </div>
  )
}
