const express = require("express");
const app = express();
require("dotenv").config();
const http = require("http").createServer(app);
const port = process.env.PORT || 4000;
const io = require("socket.io")(http, {
  cors: {
    origin: "*", //Allow all origins
  },
});

//file upload express
const fileUpload = require("express-fileupload");
app.use(
  fileUpload({
    useTempFiles: true,
    tempFileDir: "/tmp/",
  })
);

// const { uploadFileToS3, getFileListFromS3Bucket } = require("./functions/file_upload");

// uploadFileToS3("1688291040283-pexels-marcus-silva-16052900 (1).jpg", "./files/1688291040283-pexels-marcus-silva-16052900 (1).jpg");
// console.log(getFileListFromS3Bucket("securebackend"))

// cors
const cors = require("cors");
//Loop of allowed origins
const allowedOrigins = [
  "http://localhost:3001",
  "http://localhost:3000",
  "https://admin-for-all.vercel.app",
  "https://dauqunews.vercel.app",
  "https://secure-admin.vercel.app",
];

app.use(
  cors({
    origin: "*",
    credentials: true,
  })
);

//Connect to database
const connectDB = require("./config/database");
connectDB();

app.use(express.json());

// Configure the public folder to serve static files
app.use(express.static("./files"));

// app.post("/", upload.single('image'), async  (req, res) => {
//   const file = req.file
//   console.log(file)
//   const result = await uploadFile(file)
//   console.log(result)
//   res.send(result)
// });

app.get("/", (req, res) => {
  res.send("Secure API is running");
});

app.use("/register", require("./routes/register"));
app.use("/login", require("./routes/login"));
app.use("/profile", require("./routes/profile"));
app.use("/users", require("./routes/users"));
app.use("/news", require("./routes/news"));
app.use("/notification", require("./routes/notification"));
app.use("/category", require("./routes/category"));
app.use("/files", require("./routes/files"));
app.use("/interest", require("./routes/interest"));
app.use("/chat", require("./routes/messages/chat")(io));
app.use("/socket", require("./routes/socket")(io));
app.use("/room", require("./routes/messages/room"));
app.use("/member", require("./routes/member"));
app.use("/reaction", require("./routes/reaction"));
app.use("/transaction", require("./routes/transaction"));
app.use("/feed", require("./routes/feed"));
app.use("/dashboard", require("./routes/dashboard"));
app.use("/stripe", require("./routes/stripe"));


// // // Handle socket connections
// io.on("connection", (socket) => {
//   // Handle joining the room
//   socket.on("join_room", (room) => {
//     // Join the specified room
//     socket.join(room);

//     socket.on("send_message", (messageData) => {
//       // Broadcast the message data to all connected clients in the room
//       io.to(room).emit("message_received", messageData);
//     });
//   });
// });

http.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`);
});
