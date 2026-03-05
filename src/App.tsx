import "./App.css";
// import { HotBalloon } from "./Components/HotBalloon";
import logo from "./images/logo.png";
import { useState } from "react";

function App() {
  const [formDataState] = useState(() => {
    const saved = localStorage.getItem("stork-skyway-rsvp");
    return saved ? JSON.parse(saved) : null;
  });

  return (
    <main>
      {/* <HotBalloon /> */}
      <h1 className="segment">
        <img src={logo} height={60} />
        Stork Skyway
      </h1>
      <section id="ticket" className="segment">
        {formDataState ? (
          <>
            <p>
              Paging all passengers! You are cleared for arrival at Declan's
              Baby Shower. Please <strong>check in by March 1st</strong> to
              secure your seat on this special flight and finalize our flight
              manifest.
            </p>
            <dl>
              <dt>Departure:</dt>
              <dd>March 21 2026 from 12:00 PM - 15:00 PM</dd>
              <dt>Cargo:</dt>
              <dd>
                Help stock our in-flight baby{" "}
                <a
                  href="https://www.amazon.com/baby-reg/andrew-lay-may-2026-seattle/27MUHW5NPQ04U"
                  target="_blank"
                >
                  essentials
                </a>
              </dd>
              <dt>Destination:</dt>
              <dd>
                11209 12th ave NE, Seattle WA 98125{" "}
                <a
                  href="https://maps.app.goo.gl/vtwt4mbqKFshrfyG8"
                  target="_blank"
                >
                  map{" "}
                </a>
              </dd>
            </dl>
            <p>
              {formDataState.attending
                ? "✅ Checked In"
                : "❌ Flight Cancelled"}
              <br />
              Passenger: {formDataState.name}
              {formDataState?.hasGuest ? " + 1" : ""}
              <br />
              Email: {formDataState.email}
              <br />
              Confirmation: <code>{formDataState.uuid.slice(0, 8)}</code>
            </p>
          </>
        ) : (
          <>
            <p>Check-in is now closed.</p>
            <dl>
              <dt>Departure:</dt>
              <dd>March 21 2026 from 12:00 PM - 15:00 PM</dd>
              <dt>Cargo:</dt>
              <dd>
                Help stock our in-flight baby{" "}
                <a
                  href="https://www.amazon.com/baby-reg/andrew-lay-may-2026-seattle/27MUHW5NPQ04U"
                  target="_blank"
                >
                  essentials
                </a>
              </dd>
              <dt>Destination:</dt>
              <dd>
                11209 12th ave NE, Seattle WA 98125{" "}
                <a
                  href="https://maps.app.goo.gl/vtwt4mbqKFshrfyG8"
                  target="_blank"
                >
                  map{" "}
                </a>
              </dd>
            </dl>
          </>
        )}
      </section>
    </main>
  );
}

export default App;
