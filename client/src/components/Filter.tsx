import { useEffect, useState } from "react";
import "./Filter.css";

interface FilterProps {
	onSearch: (query: string, mainTagId?: number, subTagId?: number) => void;
	selectedMainTag: number | null;
	selectedSubTag: number | null;
}

function Filter({ onSearch, selectedMainTag, selectedSubTag }: FilterProps) {
	const [mainTags, setMainTags] = useState<{ id: number; name: string }[]>([]);
	const [subTags, setSubTags] = useState<{ id: number; name: string }[]>([]);
	const [isLoading, setIsLoading] = useState<boolean>(false);
	const [startIndex, setStartIndex] = useState(0);
	const [subStartIndex, setSubStartIndex] = useState(0);
	const visibleCount = 7;
	const visibleSubCount = 4;

	useEffect(() => {
		const fetchMainTags = async () => {
			setIsLoading(true);
			try {
				const response = await fetch(
					`${import.meta.env.VITE_API_URL}/api/advert/maintags`,
				);
				const data = await response.json();
				setMainTags(data);
			} catch (error) {
				console.error("Erreur récupération main tags:", error);
			} finally {
				setIsLoading(false);
			}
		};
		fetchMainTags();
	}, []);

	useEffect(() => {
		if (selectedMainTag === null) {
			setSubTags([]);
		} else {
			const fetchSubTags = async () => {
				setIsLoading(true);
				try {
					const response = await fetch(
						`${import.meta.env.VITE_API_URL}/api/advert/search/subtag/${selectedMainTag}`,
					);
					const data = await response.json();
					setSubTags(data);
				} catch (error) {
					console.error("Erreur récupération sub tags:", error);
				} finally {
					setIsLoading(false);
				}
			};
			fetchSubTags();
		}
	}, [selectedMainTag]);

	const handleNext = () => {
		setStartIndex((prevIndex) => (prevIndex + 1) % mainTags.length);
	};

	const handlePrev = () => {
		setStartIndex(
			(prevIndex) => (prevIndex - 1 + mainTags.length) % mainTags.length,
		);
	};

	const handleSubNext = () => {
		setSubStartIndex((prevIndex) => (prevIndex + 1) % subTags.length);
	};

	const handleSubPrev = () => {
		setSubStartIndex(
			(prevIndex) => (prevIndex - 1 + subTags.length) % subTags.length,
		);
	};

	if (isLoading) {
		return <div>Chargement...</div>;
	}

	return (
		<div className="filter-container">
			<div className="filter-wrapper">
				<button type="button" className="scroll-btn" onClick={handlePrev}>
					&lt;
				</button>
				<div className="filter-list">
					{mainTags
						.slice(startIndex, startIndex + visibleCount)
						.concat(
							mainTags.slice(
								0,
								Math.max(0, startIndex + visibleCount - mainTags.length),
							),
						)
						.map((tag) => (
							<button
								type="button"
								key={tag.id}
								onClick={() => onSearch("", tag.id, undefined)}
								className={`filter-btn ${selectedMainTag === tag.id ? "selected" : ""}`}
							>
								{tag.name}
							</button>
						))}
				</div>
				<button type="button" className="scroll-btn" onClick={handleNext}>
					&gt;
				</button>
			</div>

			{selectedMainTag && subTags.length > 0 && (
				<div className="sub-tags">
					<div className="filter-wrapper">
						<button
							type="button"
							className="scroll-btn"
							onClick={handleSubPrev}
						>
							&lt;
						</button>
						<div className="filter-list">
							{subTags
								.slice(subStartIndex, subStartIndex + visibleSubCount)
								.concat(
									subTags.slice(
										0,
										Math.max(
											0,
											subStartIndex + visibleSubCount - subTags.length,
										),
									),
								)
								.map((subTag) => (
									<button
										type="button"
										key={subTag.id}
										onClick={() =>
											onSearch("", selectedMainTag ?? undefined, subTag.id)
										}
										className={`filter-btn ${selectedSubTag === subTag.id ? "selected" : ""}`}
									>
										{subTag.name}
									</button>
								))}
						</div>
						<button
							type="button"
							className="scroll-btn"
							onClick={handleSubNext}
						>
							&gt;
						</button>
					</div>
				</div>
			)}
		</div>
	);
}

export default Filter;
