const fs = require("fs");
const http = require("http");
const url = require("url");

const data = fs.readFileSync(`${__dirname}/data/db.json`, "utf-8");
const card = fs.readFileSync(`${__dirname}/templates/card.html`, "utf-8");
const description = fs.readFileSync(
  `${__dirname}/templates/description.html`,
  "utf-8"
);
const overview = fs.readFileSync(
  `${__dirname}/templates/overview.html`,
  "utf-8"
);

const replaceTemplate = (template, data) => {
  let output = template.replace(/{%NAME%}/g, data.name);
  output = output.replace(/{%DESCRIPTION%}/g, data.description);
  output = output.replace(/{%ID%}/g, data.id);
  if (data.completed == false) {
    output = output.replace(/{%COMPLETED%}/g, "completed");
  }
  return output;
};

const dataObj = JSON.parse(data);

const server = http.createServer((req, res) => {
  const { query, pathname } = url.parse(req.url, true);

  //   Overview
  if (pathname === "/" || pathname === "/overview") {
    res.writeHead(200, { "Content-type": "text/html" });
    const overViewHTML = dataObj
      .map((element) => replaceTemplate(card, element))
      .join("");
    const output = overview.replace("{%CARDS%}", overViewHTML);
    res.end(output);
  }

  //   Description Page
  else if (pathname === "/description") {
    res.writeHead(200, { "Content-type": "text/html" });
    const product = dataObj[query.id];
    const output = replaceTemplate(description, product);
    res.end(output);
  }

  //   404 Page
  else {
    res.writeHead(404, { "Content-type": "text/html" });
    res.end("<h1>404</h1> <h2>Page Not Found</h2>");
  }
});

server.listen(3030, () => {
  console.log("Listening on port 8080");
});
