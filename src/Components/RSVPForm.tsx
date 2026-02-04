import { useState } from "react";
import "./RSVPForm.css";
import person from "../images/person.png";

export const RSVPForm = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [plusOne, setPlusOne] = useState(false);

  const handlePlusOne = (e: React.ChangeEvent<HTMLInputElement>) => {
    setPlusOne(e.target.checked);
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoading(true);

    const submitter = (e.nativeEvent as SubmitEvent)
      .submitter as HTMLButtonElement;
    const isCheckingIn = submitter.value === "checkin";

    const formData = new FormData(e.currentTarget);

    const data = isCheckingIn
      ? {
          attending: "yes",
          hasGuest: plusOne ? "yes" : "no",
          email: formData.get("email"),
          name: formData.get("name"),
        }
      : {
          attending: "no",
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
      <label htmlFor="name">Passenger name:</label>
      <input
        type="text"
        name="name"
        id="name"
        required
        disabled={isLoading}
        placeholder="Your name here"
      />
      <label htmlFor="email">Email:</label>
      <input
        type="email"
        name="email"
        id="email"
        required
        disabled={isLoading}
        placeholder="Your email here"
      />
      <label>
        <input
          type="checkbox"
          name="plus-one"
          onChange={handlePlusOne}
          checked={plusOne}
        />
        Use companion pass
      </label>
      <footer>
        <button
          type="submit"
          disabled={isLoading}
          id="decline-btn"
          value="decline"
        >
          Decline
        </button>
        <button
          type="submit"
          disabled={isLoading}
          id="checkin-btn"
          value="checkin"
        >
          <span>Check in</span> <img src={person} height={20} />{" "}
          {plusOne ? <img src={person} height={20} /> : null}
        </button>
      </footer>
    </form>
  );
};
