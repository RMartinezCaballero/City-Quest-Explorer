const API_BASE = process.env.NEXT_PUBLIC_API_URL || "https://city-quest-explorer-api.onrender.com/api";

export interface City {
  id: string;
  name: string;
  slug: string;
  country: string;
  createdAt: string;
}

export interface Route {
  id: string;
  cityId: string;
  name: string;
  description: string;
  difficulty: "EASY" | "MEDIUM" | "HARD";
  distanceMeters: number;
  estimatedMinutes: number;
  checkpoints?: Checkpoint[];
}

export interface Checkpoint {
  id: string;
  routeId: string;
  name: string;
  description: string;
  latitude: number;
  longitude: number;
  orderIndex: number;
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
  status: "ACTIVE" | "COMPLETED" | "ABANDONED";
  startedAt: string;
  finishedAt?: string;
  score: number;
  team?: Team;
}

export interface Ranking {
  id: string;
  routeId: string;
  teamId: string;
  score: number;
  position: number;
  team?: Team;
}

async function fetchApi<T>(
  endpoint: string,
  options?: RequestInit
): Promise<T> {
  const url = `${API_BASE}${endpoint}`;
  const res = await fetch(url, {
    headers: {
      "Content-Type": "application/json",
      ...options?.headers,
    },
    ...options,
  });

  if (!res.ok) {
    throw new Error(`API Error: ${res.status} ${res.statusText}`);
  }

  return res.json();
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
};

// ── Routes ──
export const routesApi = {
  list: (cityId: string) => fetchApi<Route[]>(`/cities/${cityId}/routes`),
  get: (cityId: string, routeId: string) =>
    fetchApi<Route>(`/cities/${cityId}/routes/${routeId}`),
  create: (cityId: string, data: Partial<Route>) =>
    fetchApi<Route>(`/cities/${cityId}/routes`, {
      method: "POST",
      body: JSON.stringify(data),
    }),
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

// ── NEW: Game Templates ──
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
  stories?: Array<{ id: string; name: string; status: string }>;
}

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

// ── NEW: Stories ──
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

export const storiesApi = {
  listByGame: (gameId: string) => fetchApi<Story[]>(`/games/${gameId}/stories`),
  get: (gameId: string, storyId: string) => fetchApi<Story>(`/games/${gameId}/stories/${storyId}`),
  create: (gameId: string, data: Partial<Story>) =>
    fetchApi<Story>(`/games/${gameId}/stories`, { method: "POST", body: JSON.stringify(data) }),
};

// ── NEW: Missions ──
export interface Mission {
  id: string;
  routeId: string;
  title: string;
  narrative: string | null;
  description: string | null;
  orderIndex: number;
  difficulty: number;
  isLastMission: boolean;
}

export const missionsApi = {
  listByRoute: (routeId: string) => fetchApi<Mission[]>(`/routes/${routeId}/missions`),
  get: (missionId: string) => fetchApi<Mission>(`/missions/${missionId}`),
  reorder: (routeId: string, missionIds: string[]) =>
    fetchApi<Mission[]>(`/routes/${routeId}/missions/reorder`, {
      method: "POST", body: JSON.stringify({ missionIds }),
    }),
};

// ── Game Sessions ──
export const gamesApi = {
  getSession: (sessionId: string) =>
    fetchApi<GameSession>(`/games/sessions/${sessionId}`),
  listByTeam: (teamId: string) =>
    fetchApi<GameSession[]>(`/games/teams/${teamId}/sessions`),
};
