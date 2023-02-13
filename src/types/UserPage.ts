import User from "./User";

type UserPage = {
  page: number;
  per_page: number;
  total: number;
  total_pages: number;
  data: User[];
}

export default UserPage;