// Strip trailing /api if present (legacy Vercel env var bug)
const rawBase = process.env.NEXT_PUBLIC_API_URL || "https://city-quest-explorer-api.onrender.com";
const API_BASE = rawBase.replace(/\/api\/?$/i, "");

// Auth token management
let authToken: string | null = null;

export function setAuthToken(token: string | null) {
  authToken = token;
}



export interface City {
  id: string;
  name: string;
  slug: string;
  country: string;
  state?: string;
  latitude?: number | null;
  longitude?: number | null;
  imageUrl?: string | null;
  createdAt: string;
}

export interface Route {
  id: string;
  cityId: string;
  storyId: string;
  name: string;
  description: string;
  difficulty: "EASY" | "MEDIUM" | "HARD";
  distanceMeters: number;
  estimatedMinutes: number;
  isDefault?: boolean;
  status?: string;
  story?: { id: string; name: string };
  missions?: Mission[];
  checkpoints?: Checkpoint[];
  conditions?: Record<string, unknown>;
  missionCount?: number;
}

export interface Checkpoint {
  id: string;
  routeId: string;
  name: string;
  description: string;
  latitude: number;
  longitude: number;
  orderIndex: number;
  qrCodes?: Array<{ id: string; code: string }>;
}

export interface Team {
  id: string;
  routeId: string;
  name: string;
  captainId: string;
  createdAt: string;
  members?: TeamMember[];
}

export interface TeamMember {
  id: string;
  teamId: string;
  userId: string;
  role: string;
  joinedAt: string;
  user?: User;
}

export interface User {
  id: string;
  email: string;
  name: string;
  role: string;
  supabaseUserId?: string;
  createdAt: string;
}

export interface GameSession {
  id: string;
  teamId: string;
  routeId: string;
  cityId: string;
  storyId?: string;
  status: "ACTIVE" | "COMPLETED" | "ABANDONED";
  startedAt: string;
  finishedAt?: string;
  score: number;
  hintsUsed?: number;
  errors?: number;
  team?: Team;
  route?: { id: string; name: string };
  city?: { id: string; name: string };
}

export interface Ranking {
  id: string;
  routeId: string;
  teamId: string;
  score: number;
  position: number;
  team?: Team;
}

export interface Game {
  id: string;
  cityId: string;
  name: string;
  description: string | null;
  durationMinutes: number;
  difficulty: string;
  status: string;
  maxPlayers: number;
  imageUrl: string | null;
  city?: City;
  stories?: Array<{ id: string; name: string; status: string; routes?: Array<{ id: string; name: string }> }>;
}

export interface Story {
  id: string;
  gameId: string;
  name: string;
  introduction: string | null;
  lore: string | null;
  objectives: string[] | null;
  rules: string | null;
  status: string;
  routes?: Array<{ id: string; name: string; difficulty: string; status: string }>;
  endings?: Array<{ id: string; name: string; orderIndex: number }>;
}

export interface Mission {
  id: string;
  routeId: string;
  title: string;
  narrative: string | null;
  description: string | null;
  orderIndex: number;
  difficulty: number;
  isLastMission: boolean;
  checkpoint?: Checkpoint | null;
  challenges?: Challenge[];
}

export interface Challenge {
  id: string;
  missionId: string;
  type: string;
  prompt: string;
  hint1?: string | null;
  hint2?: string | null;
  hint3?: string | null;
  hint4?: string | null;
  orderIndex: number;
  penalty: number;
  answers?: ChallengeAnswer[];
}

export interface ChallengeAnswer {
  id: string;
  challengeId: string;
  value: string;
  label?: string | null;
  isCorrect: boolean;
  penalty: number;
  orderIndex: number;
}

export interface Notification {
  id: string;
  type: string;
  teamName: string;
  location: string;
  actors: string[];
  message: string;
  status: string;
  createdAt: string;
}

async function fetchApi<T>(
  endpoint: string,
  options?: RequestInit
): Promise<T> {
  const headers: Record<string, string> = {
    "Content-Type": "application/json",
  };

  // Include auth token if available
  if (authToken) {
    headers["Authorization"] = `Bearer ${authToken}`;
  }

  // Merge custom headers
  const customHeaders = options?.headers as Record<string, string> | undefined;
  if (customHeaders) {
    Object.assign(headers, customHeaders);
  }

  const url = `${API_BASE}${endpoint}`;
  const res = await fetch(url, {
    ...options,
    headers,
  });

  if (!res.ok) {
    const body = await res.text().catch(() => "");
    throw new Error(`API Error ${res.status}: ${res.statusText}${body ? " - " + body : ""}`);
  }

  // Handle void responses (e.g., DELETE)
  const contentType = res.headers.get("content-type");
  if (contentType && contentType.includes("application/json")) {
    return res.json();
  }
  return undefined as T;
}

// ── Cities ──
export const citiesApi = {
  list: () => fetchApi<City[]>("/cities"),
  get: (id: string) => fetchApi<City>(`/cities/${id}`),
  create: (data: Partial<City>) =>
    fetchApi<City>("/cities", {
      method: "POST",
      body: JSON.stringify(data),
    }),
  update: (id: string, data: Partial<City>) =>
    fetchApi<City>(`/cities/${id}`, {
      method: "PATCH",
      body: JSON.stringify(data),
    }),
  remove: (id: string) =>
    fetchApi<void>(`/cities/${id}`, {
      method: "DELETE",
    }),
};

// ── Routes (BC = backward compatible w/ old 2-arg create) ──
export const routesApi = {
  list: (cityId: string) => fetchApi<Route[]>(`/cities/${cityId}/routes`),
  get: (routeId: string) => fetchApi<Route>(`/routes/${routeId}`),
  getByCity: (cityId: string, routeId: string) => fetchApi<Route>(`/cities/${cityId}/routes/${routeId}`),
  create: (storyId: string, cityId: string, data: Partial<Route>) =>
    fetchApi<Route>(`/stories/${storyId}/cities/${cityId}/routes`, {
      method: "POST",
      body: JSON.stringify(data),
    }),
  createByCity: (cityId: string, data: Partial<Route> & { storyId: string }) =>
    fetchApi<Route>(`/cities/${cityId}/routes`, {
      method: "POST",
      body: JSON.stringify(data),
    }),
  update: (routeId: string, data: Partial<Route>) =>
    fetchApi<Route>(`/routes/${routeId}`, {
      method: "PATCH",
      body: JSON.stringify(data),
    }),
  assignMissions: (routeId: string, missionIds: string[]) =>
    fetchApi<Route>(`/routes/${routeId}/missions`, {
      method: "PATCH",
      body: JSON.stringify({ missionIds }),
    }),
  remove: (routeId: string) =>
    fetchApi<void>(`/routes/${routeId}`, { method: "DELETE" }),
  listByStory: (storyId: string) => fetchApi<Route[]>(`/stories/${storyId}/routes`),
};

// ── Teams ──
export const teamsApi = {
  list: (routeId: string) => fetchApi<Team[]>(`/routes/${routeId}/teams`),
  get: (routeId: string, teamId: string) =>
    fetchApi<Team>(`/routes/${routeId}/teams/${teamId}`),
  create: (routeId: string, data: Partial<Team>) =>
    fetchApi<Team>(`/routes/${routeId}/teams`, {
      method: "POST",
      body: JSON.stringify(data),
    }),
};

// ── Rankings ──
export const rankingsApi = {
  list: (routeId: string) =>
    fetchApi<Ranking[]>(`/routes/${routeId}/rankings`),
  create: (routeId: string, data: Partial<Ranking>) =>
    fetchApi<Ranking>(`/routes/${routeId}/rankings`, {
      method: "POST",
      body: JSON.stringify(data),
    }),
};

// ── Users ──
export const usersApi = {
  list: () => fetchApi<User[]>("/users"),
  get: (id: string) => fetchApi<User>(`/users/${id}`),
  getMe: () => fetchApi<User>("/users/me"),
  create: (data: { email: string; name: string; password: string; role?: string }) =>
    fetchApi<User>("/users", {
      method: "POST",
      body: JSON.stringify(data),
    }),
  update: (id: string, data: { name?: string; password?: string; role?: string }) =>
    fetchApi<User>(`/users/${id}`, {
      method: "PATCH",
      body: JSON.stringify(data),
    }),
  updateMe: (data: Partial<User>) =>
    fetchApi<User>("/users/me", {
      method: "PATCH",
      body: JSON.stringify(data),
    }),
  remove: (id: string) =>
    fetchApi<void>(`/users/${id}`, {
      method: "DELETE",
    }),
};

// ── Game Sessions ──
export const sessionsApi = {
  list: () => fetchApi<GameSession[]>("/games/sessions"),
  get: (sessionId: string) =>
    fetchApi<GameSession>(`/games/sessions/${sessionId}`),
  listByTeam: (teamId: string) =>
    fetchApi<GameSession[]>(`/games/teams/${teamId}/sessions`),
};

// ── Notifications ──
export const notificationsApi = {
  list: () => fetchApi<Notification[]>("/notifications"),
  create: (data: Partial<Notification>) =>
    fetchApi<Notification>("/notifications", {
      method: "POST",
      body: JSON.stringify(data),
    }),
};

// ── Game Templates ──
export const gamesTemplateApi = {
  listByCity: (cityId: string) => fetchApi<Game[]>(`/cities/${cityId}/games`),
  get: (gameId: string) => fetchApi<Game>(`/games/${gameId}`),
  create: (cityId: string, data: Partial<Game>) =>
    fetchApi<Game>(`/cities/${cityId}/games`, { method: "POST", body: JSON.stringify(data) }),
  update: (gameId: string, data: Partial<Game>) =>
    fetchApi<Game>(`/games/${gameId}`, { method: "PATCH", body: JSON.stringify(data) }),
  publish: (gameId: string) => fetchApi<Game>(`/games/${gameId}/publish`, { method: "POST" }),
  clone: (gameId: string) => fetchApi<Game>(`/games/${gameId}/clone`, { method: "POST" }),
};

// ── Stories ──
export const storiesApi = {
  listByGame: (gameId: string) => fetchApi<Story[]>(`/games/${gameId}/stories`),
  get: (storyId: string) => fetchApi<Story>(`/stories/${storyId}`),
  create: (gameId: string, data: Partial<Story>) =>
    fetchApi<Story>(`/games/${gameId}/stories`, { method: "POST", body: JSON.stringify(data) }),
  update: (storyId: string, data: Partial<Story>) =>
    fetchApi<Story>(`/stories/${storyId}`, { method: "PATCH", body: JSON.stringify(data) }),
};

// ── Missions ──
export const missionsApi = {
  listByRoute: (routeId: string) => fetchApi<Mission[]>(`/routes/${routeId}/missions`),
  get: (missionId: string) => fetchApi<Mission>(`/missions/${missionId}`),
  create: (routeId: string, data: { title: string; narrative?: string | null; description?: string | null; difficulty?: number; orderIndex: number }) =>
    fetchApi<Mission>(`/routes/${routeId}/missions`, {
      method: "POST", body: JSON.stringify(data),
    }),
  update: (routeId: string, missionId: string, data: { title?: string; narrative?: string | null; description?: string | null; difficulty?: number; orderIndex?: number }) =>
    fetchApi<Mission>(`/routes/${routeId}/missions/${missionId}`, {
      method: "PATCH", body: JSON.stringify(data),
    }),
  remove: (routeId: string, missionId: string) =>
    fetchApi<void>(`/routes/${routeId}/missions/${missionId}`, {
      method: "DELETE",
    }),
  reorder: (routeId: string, missionIds: string[]) =>
    fetchApi<Mission[]>(`/routes/${routeId}/missions/reorder`, {
      method: "POST", body: JSON.stringify({ missionIds }),
    }),
};

// ── Challenges ──
export const challengesApi = {
  listByMission: (missionId: string) => fetchApi<Challenge[]>(`/missions/${missionId}/challenges`),
  get: (challengeId: string) => fetchApi<Challenge>(`/challenges/${challengeId}`),
};

// ── Old Game Sessions (backward compat) ──
export const gamesApi = {
  getSession: (sessionId: string) =>
    fetchApi<GameSession>(`/games/sessions/${sessionId}`),
  listByTeam: (teamId: string) =>
    fetchApi<GameSession[]>(`/games/teams/${teamId}/sessions`),
};
