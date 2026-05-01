export type UserPublicSnake = {
  email: string;
  first_name: string;
  last_name: string;
  red_id: string | null;
  major: string;
  academic_year: string;
};

export type AuthTokenResponseSnake = {
  access_token: string;
  token_type: string;
  user: UserPublicSnake;
};
