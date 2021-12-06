const users = [
  {
    id: 1,
    name: "Admin User",
    username: "admin@vega.com",
    password: 1234,
    isAdmin: true,
  },
  {
    id: 2,
    name: "Aleksa Mitic",
    username: "aleksa@vega.com",
    password: 1234,
  },
  {
    id: 3,
    name: "Luka Vuckovic",
    username: "luka@vega.com",
    password: 1234,
  },
  {
    id: 4,
    name: "Milos Prolic",
    username: "prole@vega.com",
    password: 1234,
  },
  {
    id: 5,
    name: "Aleksandar Jeremic",
    username: "jera@vega.com",
    password: 1234,
  },
  {
    id: 6,
    name: "Katarina Radisic",
    username: "kaca@vega.com",
    password: 1234,
  },
];

export const sessions = {};

export function createSession(username, name) {
  const sessionId = String(Object.keys(sessions).length + 1);

  const session = { sessionId, username, valid: true, name };

  sessions[sessionId] = session;

  return session;
}
// get session is going to make sure that are session is valid
// and if it is it is going to return the session

export function getSession(sessionId) {
  const session = sessions[sessionId];

  return session && session.valid ? session : null;
}

export function invalidateSession(sessionId) {
  const session = sessions[sessionId];

  if (session) {
    sessions[sessionId].valid = false;
  }

  return sessions[sessionId];
}

export { users };
