import { useState, } from 'react';
import './RSVPForm.css'

export const RSVPForm = () => {
    const [attendance, setAttendance] = useState(true);
    const [isLoading, setIsLoading] = useState(false);

    const handleAttendance = (e: React.ChangeEvent<HTMLInputElement>) => {
        setAttendance(e.target.value === "yes")
    }

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setIsLoading(true);
        const formData = new FormData(e.currentTarget);

        const data = {
            attending: formData.get('attend') === "yes",
            hasGuest: formData.get('plus-one') === '1',
            email: formData.get('email'),
            name: formData.get('name'),
        };

        try {
            await fetch('https://script.google.com/macros/s/AKfycbx8ipWk9Les5GFHGpzZLS8shzWOnLVs7zFAV6Op1dOVy-2gLB7eFBzpOdFaMPnWhNhl8g/exec', {
                method: 'POST',
                mode: 'no-cors',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(data)
            });
            alert("RSVP Sent! See you there!");
            setIsLoading(false);
        } catch (err) {
            console.error("Error!", err);
        }
    }

    return <form onSubmit={handleSubmit} >
        <label>
            Full name:
            <input type="text" name="name" required disabled={isLoading} />
        </label>
        <label>
            <input type="radio" name="attend" value="yes" id="yes" checked={attendance} onChange={handleAttendance} disabled={isLoading} />
            Can't wait to attend
        </label>
        <label>
            <input type="radio" name="attend" value="no" id="no" checked={!attendance} onChange={handleAttendance} disabled={isLoading} />
            Will celebrate from afar
        </label>
        {attendance &&
            <>
                <label>
                    <input type="checkbox" name="plus-one" value="1" disabled={isLoading} />
                    I am bringing a plus-one
                </label>
                <label>
                    Email:
                    <input type="email" name="email" required disabled={isLoading} />
                </label>
            </>
        }
        <button type="submit" disabled={isLoading}>Submit</button>
    </form>
}