export interface UserSummary { _id: string; name: string; username: string; avatar?: string; bio?: string; }
export interface User extends UserSummary { coverImage?: string; followers: Array<string | UserSummary>; following: Array<string | UserSummary>; }
export interface AuthResponse { token: string; user: User | { id: string; name: string; username: string; avatar?: string; bio?: string }; }
