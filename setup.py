#!/usr/local/bin/python
# -*- coding: utf-8 -*-
import logging
import os

from tornado.ioloop import IOLoop
from tornado.httpserver import HTTPServer
from tornado.web import (
    Application,
    StaticFileHandler,
    RequestHandler,
)
from game_state import GameHandler
from feedback import FeedbackHandler

# Configuring logging to show debug statements with a certain format
logging.basicConfig(level=logging.DEBUG,
                    format='%(asctime)s %(levelname)s %(message)s')


class CustomStaticFileHandler(StaticFileHandler):
    def write_error(self, status_code, **kwargs):
        self.write(r"<h1> 404 Not Found (╯°□°)╯︵ ┻━┻ ")


class MainHandler(RequestHandler):
    def get(self):
        self.render("web/html/index.html")


class GlobalApplication(Application):
    def __init__(self):
        super(GlobalApplication, self).__init__(
            [
                (r"/", MainHandler),
                (r"/ws", GameHandler),
                (r"/feedback", FeedbackHandler),
                (r"/(.*)", CustomStaticFileHandler, {'path': ""}),
            ],
            debug=True,
            static_path=os.path.join(os.path.dirname(__file__), "web"),
        )


def main():
    ioloop = IOLoop.instance()
    app = GlobalApplication()
    http_server = HTTPServer(app)
    port = int(os.environ.get("PORT", 5000))
    http_server.listen(port)
    logging.debug('Server is running on port {port}'.format(port=port))
    ioloop.start()

if __name__ == "__main__":
    main()