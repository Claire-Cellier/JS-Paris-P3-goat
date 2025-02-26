import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import "./FilterMainTag.css";

interface Tag {
	id: number;
	name: string;
}

function FilterMainTag() {
	const [displayedTags, setDisplayedTags] = useState<Tag[]>([]);
	const navigate = useNavigate();

	useEffect(() => {
		const fetchMainTags = async () => {
			try {
				const response = await fetch(
					`${import.meta.env.VITE_API_URL}/api/advert/maintags`,
				);
				if (!response.ok) {
					throw new Error(
						`Erreur HTTP : ${response.status} - ${response.statusText}`,
					);
				}
				const tags = await response.json();
				setDisplayedTags(tags.slice(0, 10));
			} catch (error) {
				console.error("Erreur lors de la récupération des mainTags :", error);
			}
		};

		fetchMainTags();
	}, []);

	const handleTagClick = (tag: Tag) => {
		navigate(`/adverts?tag=${tag.id}`);
	};

	return (
		<div className="filter-container">
			<h1>LES CATEGORIES</h1>
			<h2>
				Choisi le sujet qui t’intéresse et découvre les membres prêts à en
				discuter avec toi !
			</h2>
			<div className="tags-grid">
				{displayedTags.map((tag) => (
					<button
						key={tag.id}
						type="button"
						className="darkblue-button tag-button"
						onClick={() => handleTagClick(tag)}
					>
						{tag.name}
					</button>
				))}
			</div>

			<Link to="/adverts" className="categories-link">
				Plus de catégories
			</Link>
		</div>
	);
}

export default FilterMainTag;
