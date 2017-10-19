import json
import logging

from game_state import (
    broadcast_message,
    GameStates,
    send_message,
)

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
    def test_join_game(self):
        host = "Phil"
        player = "Mathew"

        host_connection = yield websocket_connect(
            'ws://localhost:{}/ws?name={}'.format(self.port, host)
        )

        response = yield host_connection.read_message()
        response = json.loads(response)
        assert_valid_login_message(response, [host])

        game = response['data']['game']
        player_connection = yield websocket_connect(
            'ws://localhost:{}/ws?name={}&game={}'.format(self.port, player, game)
        )

        response = yield player_connection.read_message()
        response = json.loads(response)
        assert_valid_login_message(response, [host, player])

        response = yield host_connection.read_message()
        response = json.loads(response)
        assert_valid_login_message(response, [host, player])

    @gen_test
    def test_change_state_write_host(self):
        c = yield websocket_connect(
            'ws://localhost:{}/ws?name={}'.format(self.port, 'Phil')
        )

        _ = yield c.read_message()  # login message


        send_message(
            c,
            message="change_state",
            data={'state': GameStates.WRITE.value},
        )

        response = yield c.read_message()
        response = json.loads(response)
        assert response['data'] is not None, response
        assert response['error'] is None, response

    @gen_test
    def test_change_state_write_not_host_error(self):
        host = "Phil"
        player = "Mathew"

        host_connection = yield websocket_connect(
            'ws://localhost:{}/ws?name={}'.format(self.port, host)
        )

        response = yield host_connection.read_message()  # login message
        response = json.loads(response)
        game = response['data']['game']
        player_connection = yield websocket_connect(
            'ws://localhost:{}/ws?name={}&game={}'.format(self.port, player, game)
        )

        _ = yield player_connection.read_message() # login message


        send_message(
            player_connection,
            message="change_state",
            data={'state': GameStates.WRITE.value},
        )

        response = yield player_connection.read_message()
        response = json.loads(response)
        assert response['data'] is None, response
        assert response['error'] is not None, response

    @gen_test
    def test_change_state_write_all_players_recv_message(self):
        host = "Phil"
        player = "Mathew"

        host_connection = yield websocket_connect(
            'ws://localhost:{}/ws?name={}'.format(self.port, host)
        )

        response = yield host_connection.read_message()  # login message
        response = json.loads(response)

        game = response['data']['game']
        player_connection = yield websocket_connect(
            'ws://localhost:{}/ws?name={}&game={}'.format(self.port, player, game)
        )

        _ = yield player_connection.read_message() # login message


        send_message(
            host_connection,
            message="change_state",
            data={'state': GameStates.WRITE.value},
        )

        response = yield host_connection.read_message()
        response = json.loads(response)
        assert response['data'] is not None, response
        assert response['error'] is None, response

        response = yield player_connection.read_message()
        response = json.loads(response)
        assert response['data'] is not None, response
        assert response['error'] is None, response



def assert_valid_login_message(response, player_list):
    assert 'data' in response, response
    assert 'msg' in response, response
    assert 'error' in response, response

    assert response['msg'] == 'login', response['msg']
    assert all(key in response['data'] for key in ('game', 'players')), response['data']
    assert len(response['data']['players']) == len(player_list), '{} {}'.format(len(response['data']['players']), len(player_list))
    assert all(player in player_list for player in response['data']['players']), response['data']['players']