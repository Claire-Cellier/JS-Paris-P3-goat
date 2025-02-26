import { useEffect, useState } from "react";
import "./AdvertSlot.css";

interface Slot {
	day: string;
	hour: string;
}

interface AdvertSlotProps {
	readonly selectedSlots: Slot[];
	readonly setSelectedSlots: React.Dispatch<React.SetStateAction<Slot[]>>;
}

function AdvertSlot({ selectedSlots, setSelectedSlots }: AdvertSlotProps) {
	const [days] = useState<{ name: string }[]>([
		{ name: "Lundi" },
		{ name: "Mardi" },
		{ name: "Mercredi" },
		{ name: "Jeudi" },
		{ name: "Vendredi" },
		{ name: "Samedi" },
		{ name: "Dimanche" },
	]);

	const [reservedSlots, setReservedSlots] = useState<Slot[]>([]);

	useEffect(() => {
		const storedReservations = JSON.parse(
			localStorage.getItem("reservations") ?? "[]",
		);
		setReservedSlots(storedReservations);
	}, []);

	const hours = [8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20];

	const isSlotReserved = (day: string, hour: number) => {
		return reservedSlots.some(
			(slot) => slot.day === day && slot.hour === `${hour}:00`,
		);
	};

	const toggleSlot = (day: string, hour: number) => {
		if (isSlotReserved(day, hour)) return;

		setSelectedSlots((prevSlots: Slot[]) => {
			const newSlot = { day, hour: `${hour}:00` };
			const isAlreadySelected = prevSlots.some(
				(slot: Slot) => slot.day === newSlot.day && slot.hour === newSlot.hour,
			);

			if (isAlreadySelected) {
				return prevSlots.filter(
					(slot: Slot) =>
						!(slot.day === newSlot.day && slot.hour === newSlot.hour),
				);
			}

			if (prevSlots.length < 3) {
				return [...prevSlots, newSlot];
			}

			return prevSlots;
		});
	};

	return (
		<div className="week-scheduler">
			<div className="scheduler-grid">
				{days.map((day) => (
					<div key={day.name} className="day-column">
						<strong>{day.name}</strong>
						{hours.map((hour) => {
							const reserved = isSlotReserved(day.name, hour);

							return (
								<button
									key={`${day.name}-${hour}`}
									className={`slot-button${
										selectedSlots.some(
											(slot) =>
												slot.day === day.name && slot.hour === `${hour}:00`,
										)
											? " selected"
											: ""
									}${reserved ? " reserved" : ""}`}
									type="button"
									onClick={() => toggleSlot(day.name, hour)}
									disabled={reserved}
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

export default AdvertSlot;
