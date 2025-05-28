/// <reference path="./apiTypes.js" />

const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

/** @type {CustomUser[]} */
const mockDentists = [
  { id: 1, username: "dr_smith", email: "smith@example.com", role_id: 2 },
  { id: 2, username: "dr_jane", email: "jane@example.com", role_id: 2 },
];

/** @type {CustomUser[]} */
const mockClients = [
  { id: 10, username: "john_doe", email: "john@example.com", role_id: 3 },
];

/** @type {Record[]} */
const mockRecords = [
  {
    id: 1,
    dentist: mockDentists[0],
    patient: mockClients[0],
    status: "scheduled",
    appointment_date: new Date().toISOString(),
    duration: 30,
    notes: "Первичный приём",
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
    actual_date: null,
  },
];

const mockApiService = {
  getDentists: async () => {
    await delay(300);
    return { data: mockDentists };
  },

  createDentist: async (data) => {
    await delay(300);
    const newDentist = { ...data, id: Date.now() };
    mockDentists.push(newDentist);
    return { data: newDentist };
  },

  getDentistById: async (id) => {
    await delay(300);
    return { data: mockDentists.find((d) => d.id === id) };
  },

  updateDentistById: async (id, data) => {
    await delay(300);
    const index = mockDentists.findIndex((d) => d.id === id);
    mockDentists[index] = { ...mockDentists[index], ...data };
    return { data: mockDentists[index] };
  },

  deleteDentistById: async (id) => {
    await delay(300);
    const index = mockDentists.findIndex((d) => d.id === id);
    if (index !== -1) mockDentists.splice(index, 1);
    return { data: null };
  },

  getCurrentDentist: async () => {
    await delay(300);
    return { data: mockDentists[0] };
  },

  getCurrentClient: async () => {
    await delay(300);
    return { data: mockClients[0] };
  },

  getRecords: async () => {
    await delay(300);
    return { data: mockRecords };
  },

  getRecordById: async (id) => {
    await delay(300);
    return { data: mockRecords.find((r) => r.id === id) };
  },

  createRecord: async (data) => {
    await delay(300);
    const newRecord = {
      ...data,
      id: Date.now(),
      dentist: mockDentists[0],
      patient: mockClients[0],
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    };
    mockRecords.push(newRecord);
    return { data: newRecord };
  },
};

export default mockApiService;
