import { useState } from 'react'
import logo from './assets/logo.png'
import './App.css'

function App() {
  const [count, setCount] = useState(0)

  return (
    <>
      <img src={logo} />
      <h1>Andrew's baby shower: Declan's First Flight</h1>
      <p>Date: 03/21/2026</p>
      <p>Time: 12pm - 3pm</p>
      <p>Location: 11209 12th ave NE, Seattle WA 98125</p>
      // TODO: RSVP form
      // TODO: Baby registry
      // TODO: https://developers.google.com/apps-script/guides/web
    </>
  )
}

export default App
