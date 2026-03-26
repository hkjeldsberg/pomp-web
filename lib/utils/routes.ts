export const routes = {
  home: () => '/',
  routines: () => '/routines',
  routineNew: () => '/routines/new',
  routineEdit: (id: string) => `/routines/${id}`,
  exercises: () => '/exercises',
  workout: (sessionId: string) => `/workout/${sessionId}`,
  historyDetail: (sessionId: string) => `/history/${sessionId}`,
  statistics: () => '/statistics',
  login: () => '/login',
  register: () => '/register',
} as const;
