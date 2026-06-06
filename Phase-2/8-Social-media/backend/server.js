import app from "./app.js";
import http from "http";
import {initSocket} from '../auth/sockets/socket.js'

const PORT = process.env.PORT || 3000;
const server = http.createServer(app)
initSocket(server)
app.listen(PORT, () => {
  console.log(`Server is Running on ${PORT}`);
});