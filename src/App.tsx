
import './App.css'
import { HotBalloon } from './Components/HotBalloon'
import { RSVPForm } from './Components/RSVPForm'

function App() {
  return (
    <>
      <HotBalloon />
      <h1>Declan's First Flight</h1>
      <p>Andrew's baby shower</p>
      <p>Date: 03/21/2026</p>
      <p>Time: 12pm - 3pm</p>
      <p>Location: 11209 12th ave NE, Seattle WA 98125</p>
      <a href="https://www.amazon.com/baby-reg/andrew-lay-may-2026-seattle/27MUHW5NPQ04U">Baby registry</a>
      <RSVPForm />
    </>
  )
}

export default App
