#!/usr/local/bin/python
# -*- coding: utf-8 -*-
import os
from tornado.ioloop import IOLoop
from tornado.httpserver import HTTPServer
from tornado.web import (
    Application,
    StaticFileHandler,
    RequestHandler,
)


class CustomStaticFileHandler(StaticFileHandler):
    def write_error(self, status_code, **kwargs):
        self.write(r"<h1> 404 Not Found (╯°□°)╯︵ ┻━┻ ")


class MainHandler(RequestHandler):
    def get(self):
        self.render("web/html/index.html")


def main():
    application = Application(
        [
            (r"/", MainHandler),
            (r"/(.*)", CustomStaticFileHandler, {'path': ""}),
        ],
        debug=True,
        static_path=os.path.join(os.path.dirname(__file__), "web"),
    )
    http_server = HTTPServer(application)
    http_server.listen(5000)
    print("Server is running on port 5000....")
    IOLoop.instance().start()


if __name__ == "__main__":
    main()