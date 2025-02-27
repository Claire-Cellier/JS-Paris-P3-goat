import "./ProfileDetails.css";
import { useEffect, useState } from "react";
import { useNavigate, useOutletContext, useParams } from "react-router-dom";
import ProfileCalendar from "../components/ProfilCalendar";
import type { Advert } from "../types/Advert";
import type { AppContextInterface } from "../types/appContext.type";

type Goat = {
	id: number;
	lastname: string;
	firstname: string;
	picture: string;
	presentation: string;
	video: string;
};

interface Slot {
	date: string;
	hour: string;
	advert: Advert;
}

function ProfilDetails() {
	const { id } = useParams<{ id: string }>();
	const [profile, setProfile] = useState<Goat | null>(null);
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState<string | null>(null);
	const [selectedSlot, setSelectedSlot] = useState<Slot | null>(null);
	const navigate = useNavigate();
	const { user } = useOutletContext<AppContextInterface>();
	const [activeSection, setActiveSection] = useState<string | null>(null);

	const toggleSection = (section: string) => {
		setActiveSection(activeSection === section ? null : section);
	};

	const handleKeyPress = (event: React.KeyboardEvent, section: string) => {
		if (event.key === "Enter" || event.key === " ") {
			toggleSection(section);
		}
	};

	useEffect(() => {
		const fetchProfilDetails = async () => {
			try {
				const response = await fetch(
					`${import.meta.env.VITE_API_URL}/api/goats/${id}`,
					{
						headers: {
							Authorization: `Bearer ${user.token}`,
						},
					},
				);

				if (!response.ok) {
					throw new Error("Erreur lors du chargement des données");
				}

				const data: Goat = await response.json();
				setProfile(data);
			} catch (error: unknown) {
				if (error instanceof Error) {
					setError(error.message || "Une erreur inconnue s'est produite.");
				} else {
					setError("Une erreur inconnue s'est produite.");
				}
			} finally {
				setLoading(false);
			}
		};

		fetchProfilDetails();
	}, [id, user.token]);

	if (loading) return <div className="status">Chargement...</div>;
	if (error) return <div className="status">Erreur : {error}</div>;
	if (!profile) return <div className="status">Aucune profil trouvé</div>;

	return (
		<div className="profileContainer">
			<div className="Profile">
				<div className="profilePresentation">
					<div className="pictureContainer">
						<img
							className="pictureGoat"
							src={
								profile.picture.startsWith("https")
									? profile.picture
									: `${import.meta.env.VITE_API_URL}/upload/${profile.picture}`
							}
							alt={profile.firstname}
						/>
					</div>
					<div className="textContainer">
						<h1>Bonjour {profile.firstname}</h1>
						<p className="profilePresentation">{profile.presentation}</p>
					</div>
				</div>
				<div className="calendar">
					<ProfileCalendar
						selectedSlot={selectedSlot}
						setSelectedSlot={setSelectedSlot}
					/>
				</div>
			</div>
			<div className="Recap">
				<div className="booking-button">
					<button
						type="button"
						className="yellow-button"
						onClick={() => navigate("/adverts")}
						onKeyPress={() => navigate("/adverts")}
					>
						Réserver un cours
					</button>
				</div>
				<div className="sous-parties">
					{[
						{ key: "recompenses", label: "Mes récompenses" },
						{ key: "statistiques", label: "Mes statistiques" },
						{ key: "modifier", label: "Modifier" },
					].map(({ key, label }) => (
						<div key={key}>
							<button
								type="button"
								className="lightblue-button"
								onClick={() => toggleSection(key)}
								onKeyDown={(e) => handleKeyPress(e, key)}
							>
								{label}
							</button>
							{activeSection === key && (
								<div className="collapse-content">
									{key === "modifier" && (
										<>
											<button type="button" className="darkblue-button">
												Mon profil
											</button>
											<button type="button" className="darkblue-button">
												Une annonce
											</button>
										</>
									)}
								</div>
							)}
						</div>
					))}
				</div>
			</div>
		</div>
	);
}

export default ProfilDetails;
