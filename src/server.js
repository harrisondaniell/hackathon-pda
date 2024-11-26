import app from "./app.js";
import { env } from "./env/index.js";

app.listen(env.PORT, () => {
  console.log(`Server running on http://localhost:${env.PORT}
    
    ${env.GOOGLE_REDIRECT_URL}`);
});
