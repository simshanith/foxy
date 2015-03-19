"use strict";
var assert = require("chai").assert;
var cli = require("../../../cli");
var connect = require("connect");
var http = require("http");
var output = "Some content";
describe("Running from command line", (function() {
  it("With no port", (function(done) {
    var app,
        server;
    var path = "/templates/page1.html";
    app = connect();
    app.use(path, (function(req, res) {
      return res.end(output);
    }));
    server = http.createServer(app).listen();
    var target = ("http://localhost:" + server.address().port);
    var out = cli({
      input: [target],
      flags: {}
    });
    var options = {
      hostname: "localhost",
      port: out.server.address().port,
      path: path,
      method: "GET",
      headers: {accept: "text/html"}
    };
    http.get(options, (function(res) {
      res.on("data", (function(chunk) {
        assert.include(chunk.toString(), "Some content");
        done();
      }));
      out.server.close();
    }));
  }));
  it("With port", (function(done) {
    var app,
        server;
    var path = "/templates/page1.html";
    app = connect();
    app.use(path, (function(req, res) {
      return res.end(output);
    }));
    server = http.createServer(app).listen();
    var target = ("http://localhost:" + server.address().port);
    var out = cli({
      input: [target],
      flags: {port: 3001}
    });
    var options = {
      hostname: "localhost",
      port: 3001,
      path: path,
      method: "GET",
      headers: {accept: "text/html"}
    };
    http.get(options, (function(res) {
      res.on("data", (function(chunk) {
        assert.include(chunk.toString(), "Some content");
        done();
      }));
      out.server.close();
    }));
  }));
  it("With HTTPS", (function() {
    var target = "https://localhost:3000";
    var out = cli({
      input: [target],
      flags: {port: 3001}
    });
    assert.equal(out.urls[0], "https://localhost:3001");
  }));
}));
