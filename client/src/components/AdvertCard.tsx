import "../components/AdvertCard.css";
import { useNavigate, useOutletContext } from "react-router-dom";
import { toast } from "react-toastify";
import onlineCourse from "../assets/onlineCourse.png";
import type { Advert } from "../types/Advert";
import type { AppContextInterface } from "../types/appContext.type";

interface AdvertCardProps {
	readonly advert: Advert;
}

function AdvertCard({ advert }: AdvertCardProps) {
	const navigate = useNavigate();
	const { user } = useOutletContext<AppContextInterface>();

	return (
		<div className="cards">
			<img
				className="online"
				src={onlineCourse}
				alt="online-course picto by HAJICON"
			/>
			<img
				className="goat-picture"
				src={
					advert.goat_picture.startsWith("https")
						? advert.goat_picture
						: `${import.meta.env.VITE_API_URL}/upload/${advert.goat_picture}`
				}
				alt={advert.goat_firstname}
			/>
			<h2 className="goat-firstname">{advert.goat_firstname}</h2>
			<div className="tags">
				<h3 className="main-tag-name">{advert.main_tag_name}</h3>
				<h3 className="sub-tag-name">{advert.sub_tag_name}</h3>
			</div>
			<div className="description">{advert.description}</div>
			<button
				type="button"
				className="yellow-button"
				onClick={() => {
					if (user) {
						navigate(`/adverts/${advert.id}`);
					} else {
						toast.error(
							"Tu dois être connecté pour accéder aux détails de l'annonce !",
						);
						navigate("/profile");
					}
				}}
			>
				En savoir plus
			</button>
		</div>
	);
}

export default AdvertCard;
