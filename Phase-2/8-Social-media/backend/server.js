import app from "./app.js";
import http from "http";
import { initSocket } from "../backend/sockets/socket.js";

const PORT = process.env.PORT || 3000;
const server = http.createServer(app);
initSocket(server);
server.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});




// import app from "./app.js";
// import http from "http";
// import {initSocket} from '../backend/sockets/socket.js'

// const PORT = process.env.PORT || 3000;
// const server = http.createServer(app)
// initSocket(server)
// app.listen(PORT, () => {
//   console.log(`Server is Running on ${PORT}`);
// });