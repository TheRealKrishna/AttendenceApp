import FullCalendar from '@fullcalendar/react'
import dayGridPlugin from '@fullcalendar/daygrid'
import { useEffect, useState } from 'react'
import toast from 'react-hot-toast'
import { useNavigate, useParams } from 'react-router-dom'
import { Button } from "react-bootstrap";
import { IoMdArrowRoundBack } from "react-icons/io";

export default function UserAttendance() {
  const [attendance, setAttendance] = useState([])
  const [user, setUser] = useState([])
  const navigate = useNavigate();
  const { id } = useParams()

  useEffect(() => {
    if (sessionStorage.getItem("auth-token")) {
      fetchAttendance();
    } else navigate("/login");
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [navigate]);

  const fetchAttendance = async () => {
    try {
      const token = sessionStorage.getItem('auth-token');
      const response = await fetch(`${process.env.REACT_APP_BACKEND_URL}/attendance/getAttendanceById`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'auth-token': token
        },
        body: JSON.stringify({ id: id })
      });
      const data = await response.json();
      if (data.success) {
        setAttendance(data.attendance);
        setUser(data.user)
      }
      else {
        toast.error(data.error,{id:"error"});
        navigate("/user/dashboard")
      }
    } catch (error) {
      toast.error('Internal Server Error Occurred!',{id:"error"});
      navigate("/user/dashboard")
    }
  };


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
      <Button onClick={() => navigate("/admin/dashboard")}><IoMdArrowRoundBack /> Back</Button>
      <h1>{user?.name}'s Attendance</h1>
      <div className="mt-3">
        <FullCalendar
          plugins={[dayGridPlugin]}
          initialView="dayGridMonth"
          events={attendance}
          contentHeight={"500px"}
          timeZone='Asia/Kolkata'
          eventClassNames={eventClassNames}
        />
      </div>
    </div>
  )
}
