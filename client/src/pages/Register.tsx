import { Avatar } from "@mui/material";
import { useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import "./Register.css";

function Register() {
	const [profilePic, setProfilePic] = useState<string | null>(null);
	const avatar = useRef<HTMLInputElement | null>(null);
	const handleFileChange = () => {
		const file = avatar.current?.files?.[0];
		if (file) {
			setProfilePic(URL.createObjectURL(file));
		}
	};

	const [lastname, setLastname] = useState("");
	const [firstname, setFirstname] = useState("");
	const [bornAt, setBornAt] = useState("");
	const [email, setEmail] = useState("");
	const [password, setPassword] = useState("");
	const [presentation, setPresentation] = useState("");

	const [video, setVideo] = useState<string | null>(null);
	const videoInput = useRef<HTMLInputElement | null>(null);
	const handleVideoChange = () => {
		const file = videoInput.current?.files?.[0];
		if (file) {
			setVideo(URL.createObjectURL(file));
		}
	};

	const navigate = useNavigate();

	const handleSubmit = async () => {
		const form = new FormData();
		form.append("lastname", lastname);
		form.append("firstname", firstname);
		form.append("born_at", bornAt);
		form.append("email", email);
		form.append("password", password);
		form.append("presentation", presentation);

		if (avatar.current?.files?.[0]) {
			form.append("picture", avatar.current.files[0]);
		} else {
			throw new Error("La photo de profil est obligatoire");
		}

		if (videoInput.current?.files?.[0]) {
			form.append("video", videoInput.current.files[0]);
		} else form.append("video", "");

		try {
			const response = await fetch(`${import.meta.env.VITE_API_URL}/api/goats`, {
				method: "POST",
				body: form,
			});
			if (!response.ok) {
				throw new Error("Erreur lors de l'inscription 🐐");
			}

			const result = await response.json();
			toast.info("Inscription terminée avec succès ! ", result);
			navigate("/profile");
		} catch (error) {
			toast.error(
				"Oups...il semble que ton inscription ne soit pas complète 🐐",
			);
		}
	};

	return (
		<>
			<section className="register">
				<section className="profil">
					<h1>crée ton compte !</h1>
					<section className="user">
						<section className="informations">
							<h3>Qui es-tu ?</h3>
							<section className="profilPicture">
								<button
									type="button"
									className="avatar"
									onClick={() => {
										if (avatar.current) {
											avatar.current.click();
										}
									}}
								>
									<Avatar alt="Profil Picture" src={profilePic ?? undefined} />
									<input
										type="file"
										hidden
										ref={avatar}
										onChange={handleFileChange}
									/>
								</button>
							</section>
							<form className="form_items">
								<div className="form_inputs">
									<input
										name="lastname"
										type="text"
										value={lastname}
										onChange={(e) => setLastname(e.target.value)}
										required
									/>
									<label htmlFor="lastname">Nom</label>
								</div>
								<div className="form_inputs">
									<input
										type="text"
										value={firstname}
										onChange={(e) => setFirstname(e.target.value)}
										required
										name="firstname"
									/>
									<label htmlFor="firstname">Prénom</label>
								</div>
								<div className="form_birthday">
									<label htmlFor="bornAt">Date d'anniversaire</label>
									<input
										type="date"
										value={bornAt}
										onChange={(e) => setBornAt(e.target.value)}
										required
										name="birthday"
									/>
								</div>
							</form>
						</section>

						<section>
							<section className="connexion">
								<h3>Comment te connecter ?</h3>
								<div className="form_inputs">
									<input
										name="email"
										type="email"
										value={email}
										onChange={(e) => setEmail(e.target.value)}
										required
									/>
									<label htmlFor="email">Adresse email</label>
								</div>
								<div className="form_inputs">
									<input
										name="password"
										type="password"
										value={password}
										onChange={(e) => setPassword(e.target.value)}
										required
									/>
									<label htmlFor="password">Mot de passe</label>
								</div>
							</section>

							<section className="presentation">
								<h3>Parle nous un peu de toi : </h3>
								<div className="form_inputs">
									<input
										name="presentation"
										type="text"
										value={presentation}
										onChange={(e) => setPresentation(e.target.value)}
										required
									/>
									<label htmlFor="password">Je suis...</label>
								</div>

								<button
									type="button"
									onClick={() => videoInput.current?.click()}
									className="darkblue-button"
								>
									Ajouter une vidéo (optionnel)
								</button>
								<input
									type="file"
									accept="video/*"
									hidden
									ref={videoInput}
									onChange={handleVideoChange}
								/>
								{video && (
									// biome-ignore lint/a11y/useMediaCaption: <explanation>
									<video controls width="250">
										<source src={video} type="video/mp4" />
										Votre navigateur ne supporte pas la vidéo.
									</video>
								)}
							</section>
						</section>
					</section>
					<div className="submit-button">
						<button
							className="lightblue-button"
							type="button"
							onClick={handleSubmit}
							onSubmit={(e) => {
								e.preventDefault();
								handleSubmit();
							}}
						>
							Valider
						</button>
					</div>
				</section>
			</section>
		</>
	);
}

export default Register;
