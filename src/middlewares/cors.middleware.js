import cors from "cors";

const corsOptions = {
  origin: "*",
  methods: ["GET", "POST", "PUT", "PATCH", "DELETE"],
  allowedHeaders: ["Content-Type", "Authorization"],
  credentials: true,
};

const corsMiddleware = cors(corsOptions);

export default corsMiddleware;
