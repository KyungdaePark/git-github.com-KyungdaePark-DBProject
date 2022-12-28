// Copyright 2022 kms
//
// Licensed under the Apache License, Version 2.0 (the "License");
// you may not use this file except in compliance with the License.
// You may obtain a copy of the License at
//
//     http://www.apache.org/licenses/LICENSE-2.0
//
// Unless required by applicable law or agreed to in writing, software
// distributed under the License is distributed on an "AS IS" BASIS,
// WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
// See the License for the specific language governing permissions and
// limitations under the License.

import express from "express";
import logger from "morgan";
import path from "path";
import liveReload from 'livereload';
import connectLiveReload from 'connect-livereload';

import loginRouter from "./routes/login";
import bookingRouter from "./routes/booking";
import updateRouter from "./routes/update";
import deleteRouter from "./routes/delete"
import insertRouter from "./routes/insert"

const PORT = 3000;

const liveReloadServer = liveReload.createServer(); 
liveReloadServer.server.once("connection", () => {
  setTimeout(() => {
    liveReloadServer.refresh('/');
  }, 100)
});

const app = express();

app.use(connectLiveReload()); //connectLiveReload를 연결해줌.

app.use(express.urlencoded({ extended: false }));
app.use(express.json());

app.set("views", path.join(__dirname, "views"));
app.set("view engine", "hbs");
app.use(express.static(path.join(__dirname, 'public'))) // hbs가 css를 불러와 사용할건데 css가 어디있는지 설명해주는 코드

app.use(logger("dev"));

app.use("/", loginRouter);
app.use("/booking", bookingRouter);
app.use("/update", updateRouter);
app.use("/delete", deleteRouter);
app.use("/insert", insertRouter);

app.listen(PORT, () => {
  console.log(`Example app listening at http://localhost:${PORT}`);
});
