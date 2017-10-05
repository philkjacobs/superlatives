import json
import logging

from setup import GlobalApplication

from tornado.httpserver import HTTPServer
from tornado.testing import AsyncTestCase, bind_unused_port, gen_test
from tornado.websocket import websocket_connect

class TestWebsocketHandler(AsyncTestCase):

    @classmethod
    def setUpClass(cls):
        super(TestWebsocketHandler, cls).setUpClass()
        cls.app = GlobalApplication()

    def setUp(self):
        super(TestWebsocketHandler, self).setUp()
        server = HTTPServer(self.app)
        socket, self.port = bind_unused_port()
        server.add_socket(socket)

    @gen_test
    def test_create_game(self):
        c = yield websocket_connect(
            'ws://localhost:{}/ws?name={}'.format(self.port, 'Phil')
        )

        response = yield c.read_message()
        response = json.loads(response)

        assert_valid_login_message(response, ['Phil'])


    @gen_test
    def test_create_game_two_player(self):
        host = "Phil"
        player = "Mathew"

        host_connection = yield websocket_connect(
            'ws://localhost:{}/ws?name={}'.format(self.port, host)
        )

        response = yield host_connection.read_message()
        response = json.loads(response)
        assert_valid_login_message(response, [host])

        game = response['data']['game']
        logging.error(game)
        player_connection = yield websocket_connect(
            'ws://localhost:{}/ws?name={}&game={}'.format(self.port, player, game)
        )

        response = yield player_connection.read_message()
        response = json.loads(response)
        assert_valid_login_message(response, [host, player])

        response = yield host_connection.read_message()
        response = json.loads(response)
        assert_valid_login_message(response, [host, player])

def assert_valid_login_message(response, player_list):
    assert 'data' in response
    assert 'msg' in response
    assert 'error' in response

    assert response['msg'] == 'login'
    assert all(key in response['data'] for key in ('game', 'players'))
    assert len(response['data']['players']) == len(player_list)
    assert all(player in player_list for player in response['data']['players'])