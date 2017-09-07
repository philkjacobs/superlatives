#!/usr/local/bin/python
# -*- coding: utf-8 -*-
import os
from tornado.ioloop import IOLoop
from tornado.httpserver import HTTPServer
from tornado.web import (
    Application,
    HTTPError,
    RequestHandler,
    StaticFileHandler,
)


class MainHandler(RequestHandler):
    def get(self):
        self.write("Hello world")


class CustomStaticFileHandler(StaticFileHandler):
    def write_error(self, status_code, **kwargs):
        self.write(r"<h1> 404 Not Found (╯°□°)╯︵ ┻━┻ ")

def main():
    application = Application(
        [
            (r"/", MainHandler),
            (r"/(.*)", CustomStaticFileHandler, {'path': os.path.join(os.path.dirname(__file__), "web")}),
        ],
        debug=True,
        static_path=os.path.join(os.path.dirname(__file__), "web"),
    )
    http_server = HTTPServer(application)
    http_server.listen(5000)
    IOLoop.instance().start()


if __name__ == "__main__":
    main()