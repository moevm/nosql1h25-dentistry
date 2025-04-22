const mockPatient = {
  id: 10,
  role: "patient",
  email: "patient@example.com",
};

const mockDentist = {
  id: 1,
  role: "specialist",
  email: "specialist@example.com",
};

const mockAdmin = {
  id: 1337,
  role: "admin",
  email: "admin@example.com",
};

const mockUsers = [mockPatient, mockDentist, mockAdmin];

const mockAuthApiService = {
  login: async (data) => {
    const { email, password } = data;
    const user = mockUsers.find((user) => user.email === email);

    if (!user) {
      throw new Error("Invalid credentials");
    }

    return {
      data: { user, token: "mockToken" },
    };
  },
  register: async (data) => {
    const { email, password } = data;
    const user = mockUsers.find((user) => user.email === email);

    if (user) {
      throw new Error("User already exists");
    }

    const newUser = {
      id: mockUsers.length + 1,
      role: "patient",
      email,
    };

    mockUsers.push(newUser);

    return {
      data: { user: newUser, token: "mockToken" },
    };
  },
};

export default mockAuthApiService;
