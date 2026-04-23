import axios from "axios";

export const usersApi = axios.create({ baseURL: process.env.NEXT_PUBLIC_USERS_API });
export const gamesApi = axios.create({ baseURL: process.env.NEXT_PUBLIC_GAMES_API });
export const venuesApi = axios.create({ baseURL: process.env.NEXT_PUBLIC_VENUES_API });
export const tournamentsApi = axios.create({ baseURL: process.env.NEXT_PUBLIC_TOURNAMENTS_API });
export const billingApi = axios.create({ baseURL: process.env.NEXT_PUBLIC_BILLING_API });
export const notificationsApi = axios.create({ baseURL: process.env.NEXT_PUBLIC_NOTIFICATIONS_API });
