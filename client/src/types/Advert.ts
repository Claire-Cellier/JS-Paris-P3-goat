interface Advert {
	id: number;
	description: string;
	goat_picture: string;
	goat_firstname: string;
	main_tag_name: string;
	sub_tag_name: string;
	main_tag_id: number;
	sub_tag_id: number;
}

type MainTag = {
	id: number;
	name: string;
	subTags: SubTag[];
};
type SubTag = {
	id: number;
	name: string;
};
export type { Advert, MainTag, SubTag };
