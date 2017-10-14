import itertools
import json
import logging
import random

from uuid import uuid4

from tornado.gen import coroutine
from tornado.web import MissingArgumentError
from tornado.websocket import WebSocketHandler


_game_map = {}  # game_id -> set(websockets)


GAME_STATES = (
    'WRITE',
    'ASSIGN',
    'READ',
)


class GameHandler(WebSocketHandler):

    def __init__(self, application, request, **kwargs):
        super(GameHandler, self).__init__(application, request, **kwargs)
        self.name = None
        self.game_id = None
        self.is_host = False
        self.game_state = None
        self.supers_written = []
        self.supers_assigned = []
        self.supers_received = []

    def open(self):
        try:
            self.name = self.get_argument(name='name')
        except MissingArgumentError:
            self.write_message(json.dumps({
                'msg': None,
                'data': None,
                'error': 'Please tell us your name.'
            }))
        else:
            game_id = self.get_argument(name='game', default=None)

            if game_id is None:
                game_id = unicode(uuid4())
                _game_map[game_id] = set()
                self.is_host = True
            try:
                _game_map[game_id].add(self)
                self.game_id = game_id
            except KeyError:
                self.write_message(json.dumps({
                    'msg': None,
                    'data': None,
                    'error': 'Game {} not found.'.format(game_id)
                }))
            else:
                self.broadcast_message(message='login', data={
                    'game':self.game_id,
                    'players':[player.name for player in _game_map[self.game_id]]
                })

    @coroutine
    def on_message(self, message):
        logging.error(message)
        raw = json.loads(message)

        # for now, if we receive an error, log it and quit.
        if raw['error']:
            logging.error(raw['error'])
            return

        msg = raw['msg']
        data = raw['data']

        if msg == 'change_state':
            try:
                state = data['state'].upper()
                assert state in GAME_STATES
            except (KeyError, AttributeError, AssertionError):
                self.send_message(error='Issues updating game state.')
            else:
                self.game_state = state
                if all(player.game_state == state for player in _game_map[self.game_id]):
                    self.broadcast_message(message=msg, data=data)
                    if state == 'ASSIGN':
                        all_supers = list(itertools.chain.from_iterable(
                            (players.supers_written for players in _game_map[self.game_id])
                        ))
                        random.shuffle(all_supers)
                        num_players = len(_game_map[self.game_id])
                        supers_to_assign = [all_supers[i::num_players] for i in xrange(num_players)]
                        for i, player in enumerate(_game_map[self.game_id]):
                            player.supers_assigned = supers_to_assign[i]
                            player.send_message(message='assign_supers_list', data={
                                'supers': supers_to_assign[i]
                            })
                    elif state == 'READ':
                        for player in _game_map[self.game_id]:
                            player.send_message(message='read_supers_list', data={
                                'supers': player.supers_received
                            })

        elif msg == 'write_supers':
            if not self.game_state == 'WRITE':
                self.send_message(error='Not a valid message in this game state.')
            else:
                self.supers_written.append(data['super'])
        elif msg == 'assign_super':
            if not self.game_state == 'ASSIGN':
                self.send_message(error='Not a valid message in this game state.')
            else:
                try:
                    recipient = next(player for player in _game_map[self.game_id]
                                     if player.name == data['name'])
                    recipient.supers_received.append(data['super'])
                except KeyError:
                    self.send_message(error='Issue assigning superlative.')
        else:
            raise ValueError('WebSocket Message {} does not exist'.format(msg))

    def send_message(self, message=None, data=None, error=None):
        assert any(v is not None for v in (message, data, error))
        self.write_message(json.dumps({
            'msg': message,
            'data': data,
            'error': error,
        }))

    def broadcast_message(self, message=None, data=None, error=None):
        for g in _game_map[self.game_id]:
            g.send_message(message, data, error)

    def on_close(self):
        _game_map[self.game_id].discard(self)
