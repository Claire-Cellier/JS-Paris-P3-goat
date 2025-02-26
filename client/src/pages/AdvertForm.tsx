import "./AdvertForm.css";

import { useEffect, useState } from "react";
import { useNavigate, useOutletContext, useParams } from "react-router-dom";
import { toast } from "react-toastify";
import AdvertSlot from "../components/AdvertSlot";

import type { FormEventHandler } from "react";
import type { MainTag, SubTag } from "../types/Advert";
import type { AppContextInterface } from "../types/appContext.type";

interface Slot {
	day: string;
	hour: string;
}

const getNextDateForDay = (dayName: string): string => {
	const daysOfWeek = [
		"Dimanche",
		"Lundi",
		"Mardi",
		"Mercredi",
		"Jeudi",
		"Vendredi",
		"Samedi",
	];

	const today = new Date();
	const todayIndex = today.getDay();
	const targetIndex = daysOfWeek.indexOf(dayName);

	if (targetIndex === -1) throw new Error("Jour invalide");

	let daysToAdd = targetIndex - todayIndex;
	if (daysToAdd <= 0) daysToAdd += 7;

	const targetDate = new Date();
	targetDate.setDate(today.getDate() + daysToAdd);

	return targetDate.toISOString().split("T")[0];
};

const formatSlotsForBackend = (slots: Slot[]) => {
	return slots.map((slot) => ({
		start_at: `${getNextDateForDay(slot.day)} ${slot.hour}:00`,
	}));
};

function AdvertForm() {
	const { user } = useOutletContext<AppContextInterface>();
	const [step, setStep] = useState(1);
	const [mainTags, setMainTags] = useState<MainTag[]>([]);
	const [subTags, setSubTags] = useState<SubTag[]>([]);
	const [selectedMainTag, setSelectedMainTag] = useState<number | null>(null);
	const [formData, setFormData] = useState<{
		main_tag_id: number | null;
		sub_tag_id: number | null;
		description: string;
		goat_id: number;
	}>({
		main_tag_id: null,
		sub_tag_id: null,
		description: "",
		goat_id: user.id,
	});

	const navigate = useNavigate();
	const [isFormValid, setIsFormValid] = useState(false);

	useEffect(() => {
		fetch(`${import.meta.env.VITE_API_URL}/api/main-tags`)
			.then((response) => response.json())
			.then((mainTags) => {
				setMainTags(mainTags);
			})
			.catch((error) =>
				toast.error(
					"Erreur de chargement des catégories principales 🐐",
					error,
				),
			);
	}, []);

	useEffect(() => {
		if (selectedMainTag !== null) {
			const mainTag = mainTags.find(
				(mainTag) => mainTag.id === selectedMainTag,
			);

			if (mainTag) {
				setSubTags(mainTag.subTags);
			}
		} else {
			setSubTags([]);
		}
	}, [mainTags, selectedMainTag]);

	useEffect(() => {
		const isValid =
			formData.main_tag_id !== null &&
			formData.sub_tag_id !== null &&
			formData.description.trim() !== "";
		setIsFormValid(isValid);
	}, [formData]);

	const [selectedSlots, setSelectedSlots] = useState<Slot[]>([]);

	const { id } = useParams<{ id: string }>();

	useEffect(() => {
		if (user?.id && id) {
			fetch(`${import.meta.env.VITE_API_URL}/api/goats/${id}`, {
				headers: {
					"Content-Type": "application/json",
					Authorization: `Bearer ${user.token}`,
				},
			})
				.then((response) => {
					if (!response.ok) {
						throw new Error(
							"Erreur lors du chargement des données utilisateur",
						);
					}
					return response.json();
				})
				.then((data) => {
					setFormData((prev) => ({
						...prev,
						goat_id: data.id,
					}));
				})
				.catch((error) => {
					toast.error(
						"Impossible de récupérer les infos de l'utilisateur 🐐",
						error,
					);
				});
		}
	}, [user, id]);

	const handleSubmit: FormEventHandler = async (event) => {
		event.preventDefault();

		if (
			formData.main_tag_id === null ||
			formData.sub_tag_id === null ||
			formData.description.trim() === "" ||
			selectedSlots.length === 0
		) {
			toast.error(
				"Tous les champs et au moins un créneau sont obligatoires ! 🐐",
			);
			return;
		}

		const formattedSlots = formatSlotsForBackend(selectedSlots);

		try {
			const response = await fetch(
				`${import.meta.env.VITE_API_URL}/api/adverts`,
				{
					method: "POST",
					headers: {
						"Content-Type": "application/json",
						Authorization: `Bearer ${user.token}`,
					},
					body: JSON.stringify({
						...formData,
						slots: formattedSlots,
					}),
				},
			);

			if (!response.ok) {
				throw new Error("Erreur lors de la création de l'annonce 🐐");
			}

			const result = await response.json();
			toast.info("Annonce créée avec succès !", result);

			setFormData({
				main_tag_id: null,
				sub_tag_id: null,
				description: "",
				goat_id: user.id,
			});
			setSelectedMainTag(null);
			setSelectedSlots([]);
			navigate("/adverts");
		} catch (error) {
			toast.error("Oups...il semble que ton annonce n'est pas complète 🐐");
		}
	};

	return (
		<div className="form-page">
			<h1 className="form-title">Crée ton annonce !</h1>
			<div className="advert-form">
				{step === 1 && (
					<form
						className="form"
						onSubmit={(event) => {
							event.preventDefault();
							handleSubmit(event);
						}}
					>
						<div className="form-group">
							<label htmlFor="main-tag-select">
								Quel savoir veux-tu transmettre ?
							</label>
							<select
								id="main-tag-select"
								className="tag-list"
								value={formData.main_tag_id ?? ""}
								onChange={(e) => {
									const mainTagId = e.target.value
										? Number(e.target.value)
										: null;
									setFormData((prev) => ({
										...prev,
										main_tag_id: mainTagId,
									}));
									setSelectedMainTag(mainTagId);
								}}
							>
								<option value="">Choisis un savoir</option>
								{mainTags.map((mainTag) => (
									<option key={mainTag.id} value={mainTag.id}>
										{mainTag.name}
									</option>
								))}
							</select>
						</div>

						<div className="form-group">
							<label htmlFor="sub-tag-select">
								Quelle sous-catégorie veux-tu proposer ?
							</label>
							<select
								className="tag-list"
								value={formData.sub_tag_id ? formData.sub_tag_id : ""}
								disabled={selectedMainTag === null}
								onChange={(e) => {
									const subTagId = e.target.value
										? Number(e.target.value)
										: null;
									setFormData((prev) => ({
										...prev,
										sub_tag_id: subTagId,
									}));
								}}
							>
								<option value="">
									{selectedMainTag === null
										? ""
										: "Choisis une sous-catégorie "}
								</option>
								{subTags.map((subTag) => (
									<option key={subTag.id} value={subTag.id}>
										{subTag.name}
									</option>
								))}
							</select>
						</div>

						<div className="form-group-description">
							<label htmlFor="description" className="description-label">
								Ajoute un texte descriptif à ton annonce
							</label>
							<input
								type="text"
								placeholder="Je suis un expert en... / Je peux t'aider à... / Je suis passionné par..."
								className="textDescription"
								value={formData.description}
								onChange={(e) =>
									setFormData((prev) => ({
										...prev,
										description: e.target.value,
									}))
								}
								required
							/>
						</div>

						<div className="submit-button">
							<button
								className={`darkblue-button ${
									!isFormValid ? "disabled-button" : ""
								}`}
								type="button"
								onClick={() => setStep(2)}
							>
								Suivant
							</button>
						</div>
					</form>
				)}

				{step === 2 && (
					<div className="advert-booking">
						<p>Sélectionne entre 1 à 3 créneaux :</p>
						<AdvertSlot
							selectedSlots={selectedSlots}
							setSelectedSlots={setSelectedSlots}
						/>
						<div className="navigateButtons">
							<button
								className="darkblue-button"
								type="button"
								onClick={() => setStep(1)}
							>
								Retour
							</button>
							<button
								className={`darkblue-button ${
									!isFormValid ? "disabled-button" : ""
								}`}
								type="button"
								disabled={!isFormValid}
								onClick={handleSubmit}
							>
								Valide ton annonce
							</button>
						</div>
					</div>
				)}
			</div>
		</div>
	);
}

export default AdvertForm;
