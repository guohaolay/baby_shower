import { useState } from "react";
import "./RSVPForm.css";
import baggage from "../images/baggage.png";

export const RSVPForm = () => {
  const [attendance, setAttendance] = useState(true);
  const [hasPlusOne, setHasPlusOne] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleAttendance = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setAttendance(e.target.value === "yes");
  };

  const handlePlusOne = (e: React.ChangeEvent<HTMLInputElement>) => {
    setHasPlusOne(e.target.checked);
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoading(true);
    const formData = new FormData(e.currentTarget);

    const data = {
      attending: formData.get("attend") === "yes",
      hasGuest: formData.get("plus-one") === "1",
      email: formData.get("email"),
      name: formData.get("name"),
    };

    try {
      await fetch(
        "https://script.google.com/macros/s/AKfycbx8ipWk9Les5GFHGpzZLS8shzWOnLVs7zFAV6Op1dOVy-2gLB7eFBzpOdFaMPnWhNhl8g/exec",
        {
          method: "POST",
          mode: "no-cors",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(data),
        },
      );
      alert("TODO: RSVP Sent! See you there!");
      setIsLoading(false);
    } catch (err) {
      console.error("Error!", err);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <label htmlFor="name">Passenger:</label>
      <input type="text" name="name" id="name" required disabled={isLoading} />
      <label htmlFor="attend">Check-in</label>
      <select
        name="attend"
        id="attend"
        onChange={handleAttendance}
        disabled={isLoading}
      >
        <option value="yes">Checked In</option>
        <option value="no">Flight Cancelled</option>
      </select>
      {attendance && (
        <>
          <label htmlFor="plus-one">Baggage</label>
          <div id="baggage-counter">
            <input
              type="checkbox"
              name="plus-one"
              id="plus-one"
              value="1"
              disabled={isLoading}
              onChange={handlePlusOne}
            />
            {hasPlusOne ? 1 : 0}/1
            <img src={baggage} width="50" />
          </div>
          <label htmlFor="email">Email:</label>
          <input
            type="email"
            name="email"
            id="email"
            required
            disabled={isLoading}
          />
        </>
      )}
      <button type="submit" disabled={isLoading}>
        Submit
      </button>
    </form>
  );
};
