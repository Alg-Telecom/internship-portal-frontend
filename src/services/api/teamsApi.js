import { http } from './httpClient';

// The real backend returns each team's `interns` as the full array of
// intern records (see backend/src/controllers/teamsController.js), not a
// ready-made count like the mock backend used to provide. Compute the
// same `internCount` convenience field here so every page (TeamsTable,
// TeamOverviewCard, ...) that reads team.internCount keeps working.
function resolveTeamCounts(team) {
  if (!team) return team;
  return { ...team, internCount: (team.interns || []).length };
}

export async function getTeams() {
  const teams = await http.get('/teams');
  return teams.map(resolveTeamCounts);
}

export async function getTeam(id) {
  const team = await http.get(`/teams/${id}`);
  return resolveTeamCounts(team);
}

export async function createTeam(data) {
  const team = await http.post('/teams', data);
  return resolveTeamCounts(team);
}

export async function updateTeam(id, patch) {
  const team = await http.patch(`/teams/${id}`, patch);
  return resolveTeamCounts(team);
}
