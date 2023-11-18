const Limit = {
  windowMs: 15 * 60 * 1000,
  limit: 100,
};

const Cors = {
  origin: "*",
  methods: ["GET", "POST", "PUT"],
};

export { Cors, Limit };
