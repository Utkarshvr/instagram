export default interface CommentType {
  id?: string;
  comment: string;
  itemId: string;
  item_type: "post" | "comment";
  owner: string;
}
