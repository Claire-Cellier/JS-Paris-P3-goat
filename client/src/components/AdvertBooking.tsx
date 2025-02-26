import { useEffect, useState } from "react";
import "./AdvertBooking.css";
import type { Advert } from "../types/Advert";

interface Slot {
	date: string;
	hour: string;
}

interface AdvertBookingProps {
	readonly selectedSlot: Slot | null;
	readonly setSelectedSlot: (slot: Slot | null) => void;
	readonly advert: Advert;
}

function AdvertBooking({
	selectedSlot,
	setSelectedSlot,
	advert,
}: AdvertBookingProps) {
	const [currentWeekOffset, setCurrentWeekOffset] = useState(0);
	const [days, setDays] = useState<{ name: string; fullDate: string }[]>([]);
	const [availableSlots, setAvailableSlots] = useState<Slot[]>([]);

	useEffect(() => {
		const storedReservations: Slot[] = JSON.parse(
			localStorage.getItem("reservations") ?? "[]",
		);

		if (advert) {
			setAvailableSlots((prevSlots) => [
				...prevSlots,
				...advert.slots.filter(
					(reserved) =>
						!prevSlots.some(
							(slot) =>
								slot.date !== reserved.date && slot.hour !== reserved.hour,
						),
				),
			]);
		} else {
			setAvailableSlots((prevSlots) => [
				...prevSlots,
				...storedReservations.filter(
					(reserved) =>
						!prevSlots.some(
							(slot) =>
								slot.date === reserved.date && slot.hour === reserved.hour,
						),
				),
			]);
		}
	}, [advert]);

	useEffect(() => {
		const generateDays = (weekOffset: number) => {
			const startDate = new Date();
			startDate.setDate(
				startDate.getDate() - startDate.getDay() + 1 + weekOffset * 7,
			);
			const days = [
				"Lundi",
				"Mardi",
				"Mercredi",
				"Jeudi",
				"Vendredi",
				"Samedi",
				"Dimanche",
			];

			return days.map((day, index) => {
				const date = new Date(startDate);
				date.setDate(startDate.getDate() + index);
				return {
					name: day,
					fullDate: date.toISOString().split("T")[0],
				};
			});
		};

		setDays(generateDays(currentWeekOffset));
	}, [currentWeekOffset]);

	const hours = [8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20];

	const isSlotAvailable = (date: string, hour: number) => {
		return availableSlots.some(
			(slot) =>
				slot.date === date &&
				slot.hour === `${hour.toString().padStart(2, "0")}:00`,
		);
	};

	const toggleSlot = (
		day: { name: string; fullDate: string },
		hour: number,
	) => {
		if (!isSlotAvailable(day.fullDate, hour)) return;
		setSelectedSlot({ date: day.fullDate, hour: `${hour}:00` });
	};

	return (
		<div className="scheduler">
			<h2>(Semaine {currentWeekOffset})</h2>
			<div className="scheduler-header">
				<button
					type="button"
					onClick={() => setCurrentWeekOffset((prev) => prev - 1)}
				>
					Semaine Précédente
				</button>
				<button
					type="button"
					onClick={() => setCurrentWeekOffset((prev) => prev + 1)}
				>
					Semaine Suivante
				</button>
			</div>
			<div className="scheduler-grid">
				{days.map((day) => (
					<div key={day.fullDate} className="day-column">
						<strong>{day.name}</strong>
						{hours.map((hour) => {
							const available = isSlotAvailable(day.fullDate, hour);

							return (
								<button
									key={`${day.fullDate}-${hour}`}
									className={[
										"slot-button",
										selectedSlot?.date === day.fullDate &&
										selectedSlot?.hour === `${hour}:00`
											? "selected"
											: "",
										available ? "" : "unavailable",
									].join(" ")}
									type="button"
									onClick={() => toggleSlot(day, hour)}
									disabled={!available}
								>
									{`${hour}:00`}
								</button>
							);
						})}
					</div>
				))}
			</div>
		</div>
	);
}

export default AdvertBooking;
