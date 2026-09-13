import { getCollection, insert, remove, delay } from './db';
import { currentMaxId } from './seed';

export async function listEvents() {
  await delay(200);
  return getCollection('calendarEvents');
}

export async function createEvent(data) {
  await delay(300);
  const id = currentMaxId('calendarEvents') + 1;
  const event = { id, ...data };
  insert('calendarEvents', event);
  return event;
}

export async function deleteEvent(id) {
  await delay(250);
  remove('calendarEvents', Number(id));
}
