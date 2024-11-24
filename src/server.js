import app from "./app.js";
import { env } from "./env/index.js";

const PORT = env.PORT ? Number(env.PORT) : 3000;

app.listen(PORT, () => {
  console.log(
    `Server running on http://localhost:${PORT} ${process.env.JWT_SECRET}`
  );
});
