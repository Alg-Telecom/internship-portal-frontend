import { TeamStatus } from '../../domain/enums';
import { getCollection, insert, update, remove, findById, delay } from './db';
import { currentMaxId } from './seed';

export async function listTeams() {
  await delay();
  const teams = getCollection('teams');
  const users = getCollection('users');
  return teams.map((team) => ({
    ...team,
    supervisor: users.find((u) => u.id === team.supervisorId) || null,
    internCount: users.filter((u) => u.teamId === team.id).length,
  }));
}

export async function getTeam(id) {
  await delay();
  const team = findById('teams', Number(id));
  if (!team) throw new Error('Team not found.');
  return team;
}

export async function createTeam(data) {
  await delay(400);
  const id = currentMaxId('teams') + 1;
  const team = { id, status: TeamStatus.PLANNED, ...data };
  insert('teams', team);
  return team;
}

export async function updateTeam(id, patch) {
  await delay(300);
  return update('teams', Number(id), patch);
}

export async function deleteTeam(id) {
  await delay(250);
  remove('teams', Number(id));
}

export async function assignInternToTeam(internId, teamId) {
  await delay(300);
  return update('users', Number(internId), { teamId: teamId ? Number(teamId) : null });
}

export async function assignSupervisorToTeam(teamId, supervisorId) {
  await delay(300);
  return update('teams', Number(teamId), { supervisorId: Number(supervisorId) });
}
