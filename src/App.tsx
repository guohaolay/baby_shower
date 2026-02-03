import "./App.css";
// import { HotBalloon } from "./Components/HotBalloon";
import { RSVPForm } from "./Components/RSVPForm";

function App() {
  return (
    <>
      {/* <HotBalloon /> */}
      <h1 className="segment">Stork Skyway</h1>
      <section id="ticket" className="segment">
        <dl>
          <dt>Departure date:</dt>
          <dd>03/21/2026 12:00 PM</dd>
          <dt>Time:</dt>
          <dd>12:00 - 15:00</dd>
          <dt>Destination:</dt>
          <dd>
            <a href="https://maps.app.goo.gl/vtwt4mbqKFshrfyG8">
              11209 12th ave NE, Seattle WA 98125
            </a>
          </dd>
        </dl>
        <RSVPForm />
        <a href="https://www.amazon.com/baby-reg/andrew-lay-may-2026-seattle/27MUHW5NPQ04U">
          Baby registry
        </a>
      </section>
    </>
  );
}

export default App;
