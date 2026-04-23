"use client";

import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { venuesApi } from "../../lib/api";

export default function GroundsPage() {
  const [venue, setVenue] = useState({ name: "", sport: "football", area: "", price_per_hour: 1200, amenities: "parking,lights" });
  const [booking, setBooking] = useState({ venue_id: "", user_id: "", slot: "", hours: 1 });
  const { data, refetch } = useQuery({ queryKey: ["venues"], queryFn: async () => (await venuesApi.get("/venues")).data });
  const { data: bookings, refetch: refetchBookings } = useQuery({ queryKey: ["bookings"], queryFn: async () => (await venuesApi.get("/bookings")).data });

  const createVenue = async () => {
    await venuesApi.post("/venues", { ...venue, price_per_hour: Number(venue.price_per_hour), amenities: venue.amenities.split(",").map((a) => a.trim()) });
    await refetch();
  };

  const createBooking = async () => {
    await venuesApi.post("/bookings", { ...booking, hours: Number(booking.hours) });
    await refetchBookings();
  };

  return (
    <section className="page-grid">
      <div className="card stack">
        <h2>Create Venue</h2>
        <input placeholder="Venue name" value={venue.name} onChange={(e) => setVenue({ ...venue, name: e.target.value })} />
        <input placeholder="Sport" value={venue.sport} onChange={(e) => setVenue({ ...venue, sport: e.target.value })} />
        <input placeholder="Area" value={venue.area} onChange={(e) => setVenue({ ...venue, area: e.target.value })} />
        <input placeholder="Price/hour" type="number" value={venue.price_per_hour} onChange={(e) => setVenue({ ...venue, price_per_hour: Number(e.target.value) })} />
        <input placeholder="Amenities comma separated" value={venue.amenities} onChange={(e) => setVenue({ ...venue, amenities: e.target.value })} />
        <button className="primary-btn" onClick={createVenue}>Create Venue</button>
      </div>
      <div className="card stack">
        <h2>Book Slot</h2>
        <input placeholder="Venue ID" value={booking.venue_id} onChange={(e) => setBooking({ ...booking, venue_id: e.target.value })} />
        <input placeholder="User ID" value={booking.user_id} onChange={(e) => setBooking({ ...booking, user_id: e.target.value })} />
        <input placeholder="Slot (2026-04-25 18:00)" value={booking.slot} onChange={(e) => setBooking({ ...booking, slot: e.target.value })} />
        <input placeholder="Hours" type="number" value={booking.hours} onChange={(e) => setBooking({ ...booking, hours: Number(e.target.value) })} />
        <button className="primary-btn" onClick={createBooking}>Book Venue</button>
      </div>
      <div className="card">
      <h2>Grounds & Turfs</h2>
      <div className="list">
        {(data ?? []).map((v: any) => (
          <div key={v.id} className="list-item">{v.name} - {v.sport} - {v.area} - Rs {v.price_per_hour}/hr - ID: {v.id}</div>
        ))}
      </div>
      </div>
      <div className="card">
        <h2>Recent Bookings</h2>
        <div className="list">
          {(bookings ?? []).map((b: any) => <div key={b.id} className="list-item">{b.venue_id} - {b.slot} - Rs {b.total_price}</div>)}
        </div>
      </div>
    </section>
  );
}
