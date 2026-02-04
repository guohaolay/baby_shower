import { useState } from "react";
import "./RSVPForm.css";
import person from "../images/person.png";

export const RSVPForm = () => {
  const [isLoading, setIsLoading] = useState(false);

  // 1. Initialize state from LocalStorage if it exists
  const [formDataState, setFormDataState] = useState(() => {
    const saved = localStorage.getItem("stork-skyway-rsvp");
    return saved ? JSON.parse(saved) : null;
  });

  // Track if we are currently looking at the form or the "ticket"
  const [isEditing, setIsEditing] = useState(false);

  // Track plusOne separately for the UI icons
  const [plusOne, setPlusOne] = useState(formDataState?.hasGuest || false);

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

    const data = {
      // Keep existing UUID if editing, otherwise generate new one
      uuid: formDataState?.uuid || crypto.randomUUID(),
      attending: isCheckingIn,
      hasGuest: plusOne,
      email: formData.get("email"),
      name: formData.get("name"),
      updatedAt: new Date().toISOString(),
    };

    try {
      await fetch(
        "https://script.google.com/macros/s/AKfycbw0Hk-sOysKYBiAiDQgS3p0aoi89Ioguo7Ype2MjFY0B9aDWn5rXPCWgEVseFeEWVn5dQ/exec",
        {
          method: "POST",
          mode: "no-cors",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(data),
        },
      );

      localStorage.setItem("stork-skyway-rsvp", JSON.stringify(data));
      setFormDataState(data);
      setIsEditing(false); // Go back to the "Ticket" view
    } catch (err) {
      console.error("Error!", err);
    } finally {
      setIsLoading(false);
    }
  };

  // 2. Show the "Ticket" view if data exists and we aren't editing
  if (formDataState && !isEditing) {
    return (
      <form>
        <p>
          {formDataState.attending ? "✅ Checked In" : "❌ Flight Cancelled"}
          <br />
          Passenger: {formDataState.name}
          {plusOne ? " + 1" : ""}
          <br />
          Email: {formDataState.email}
          <br />
          Confirmation: <code>{formDataState.uuid.slice(0, 8)}</code>
        </p>
        <footer>
          <button onClick={() => setIsEditing(true)} id="edit-btn">
            Edit Flight Details
          </button>
        </footer>
      </form>
    );
  }

  // 3. The Form (with defaultValue for auto-fill)
  return (
    <form onSubmit={handleSubmit}>
      <label htmlFor="name">Passenger name:</label>
      <input
        type="text"
        name="name"
        id="name"
        required
        disabled={isLoading}
        defaultValue={formDataState?.name || ""}
      />

      <label htmlFor="email">Email:</label>
      <input
        type="email"
        name="email"
        id="email"
        required
        disabled={isLoading}
        defaultValue={formDataState?.email || ""}
      />

      <label className="checkbox-label">
        <input
          type="checkbox"
          name="plus-one"
          onChange={handlePlusOne}
          checked={plusOne}
          disabled={isLoading}
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
          <span>{formDataState ? "Update" : "Check in"}</span>
          <img src={person} height={20} alt="person icon" />
          {plusOne && <img src={person} height={20} alt="companion icon" />}
        </button>
      </footer>
    </form>
  );
};
