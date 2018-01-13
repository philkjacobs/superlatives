import itertools
import json
import logging
import random
import string

from enum import Enum
from tornado.gen import coroutine
from tornado.web import MissingArgumentError
from tornado.websocket import WebSocketHandler
MAX_NAME_LENGTH = 22

_game_map = {}  # game_id -> set(websockets)


class GameStates(Enum):
    WRITE = 'WRITE'
    ASSIGN = 'ASSIGN'
    READ = 'READ'


class GameHandler(WebSocketHandler):

    def check_origin(self, origin):
        return True     

    def __init__(self, application, request, **kwargs):
        super(GameHandler, self).__init__(application, request, **kwargs)
        self.name = None
        self.game_id = None
        self.is_host = False
        self.game_state = None
        self.supers_written = set()
        self.supers_assigned = []
        self.supers_received = []

    def open(self):
        try:
            self.name = self.get_argument(name='name')
            if not self.name.strip():
                raise MissingArgumentError(arg_name='name')
        except MissingArgumentError:
            send_message(self, error='Please tell us your name.')
        else:
            game_id = self.get_argument(name='game', default=None)

            if game_id is None:
                # if enough games are active this can loop infinitely
                # but 36^4 = 1.6million which means that is not a
                # realistic scenario in any near-term timeframe
                while game_id is None or game_id in _game_map:
                    game_id = u''.join(
                        random.choice(string.ascii_uppercase + string.digits)
                        for _ in xrange(4)
                    )
                _game_map[game_id] = set()
                self.is_host = True
            try:
                if len(self.name) > MAX_NAME_LENGTH:
                    raise ValueError('Please restart with a shorter name.')
                current_names = {player.name for player in _game_map[game_id]}
                if self.name in current_names:
                    raise ValueError('That name is already taken.')
                arbitrary_player = next(iter(_game_map[game_id]), None)
                if arbitrary_player and arbitrary_player.game_state is not None:
                    raise ValueError('This game is already in progress.')
                _game_map[game_id].add(self)
                self.game_id = game_id
            except KeyError:
                send_message(self, error='Game {} not found.'.format(game_id))
            except ValueError as e:
                send_message(self, error=str(e))
            else:
                broadcast_message(self, message='login', data={
                    'game':self.game_id,
                    'players':[player.name for player in _game_map[self.game_id]]
                })

    @coroutine
    def on_message(self, message):
        raw = json.loads(message)

        # for now, if we receive an error, log it and quit.
        if raw['error']:
            logging.error(raw['error'])
            return

        msg = raw['msg']
        data = raw['data']

        if msg == 'change_state':
            try:
                state = GameStates(data['state'].upper())
            except (KeyError, ValueError, TypeError):
                logging.debug(data)
                send_message(self, error='Issues updating game state.')
            else:
                if state == GameStates.WRITE:
                    if self.is_host:
                        for player in _game_map[self.game_id]:
                            player.game_state = GameStates.WRITE
                            send_message(player, message='change_state', data={'state': GameStates.WRITE.value})
                    else:
                        send_message(self, error='Only the host can start the game.')
                elif state == GameStates.ASSIGN and self.is_host and data.get('force', False):
                    for player in _game_map[self.game_id]:
                        player.game_state = GameStates.ASSIGN
                        send_message(player, message='change_state', data={'state': GameStates.ASSIGN.value})
                        self.send_assigned_supers()
                else:
                    self.game_state = state
                    waiters = [player for player in _game_map[self.game_id]
                               if player.game_state == state]
                    if len(waiters) == len(_game_map[self.game_id]):
                        broadcast_message(self, message=msg, data=data)
                        if state == GameStates.ASSIGN:
                            self.send_assigned_supers()
                        elif state == GameStates.READ:
                            self.send_received_supers()
                    else:
                        slackers = [player.name for player in _game_map[self.game_id]
                                    if player.game_state != state]
                        for player in waiters:
                            send_message(player, message='waiting_on', data={
                                'players': slackers
                            })

        elif msg == 'write_supers':
            if not self.game_state == GameStates.WRITE:
                send_message(self, error='Not a valid message in this game state.')
            elif not data['super'].strip():
                send_message(self, error='Please enter a non-empty value')
            else:
                self.supers_written.add(data['super'])
        elif msg == 'edit_super':
            if not self.game_state == GameStates.WRITE:
                send_message(self, error='Not a valid message in this game state.')
            elif not data['to'].strip() or not data['from'].strip():
                send_message(self, error='Please enter a non-empty value')
            else:
                self.supers_written.remove(data['from'])
                self.supers_written.add(data['to'])
        elif msg == 'remove_super':
            if not self.game_state == GameStates.WRITE:
                send_message(self, error='Not a valid message in this game state.')
            elif not data['super'].strip():
                send_message(self, error='Please enter a non-empty value')
            else:
                self.supers_written.remove(data['super'])
        elif msg == 'assign_super':
            if not self.game_state == GameStates.ASSIGN:
                send_message(self, error='Not a valid message in this game state.')
            else:
                try:
                    recipient = next(player for player in _game_map[self.game_id]
                                     if player.name == data['name'])
                    recipient.supers_received.append(data['super'])
                    send_message(recipient, message='assign_super', data={
                        'super': data['super']
                    })
                except KeyError:
                    send_message(self, error='Issue assigning award.')
        elif msg == 'ping':
            send_message(self, message='pong')
        else:
            raise ValueError('WebSocket Message {} does not exist'.format(msg))

    def on_close(self):
        if self.game_id in _game_map:
            _game_map[self.game_id].discard(self)

    def send_assigned_supers(self):
        all_supers = list(itertools.chain.from_iterable(
            (players.supers_written for players in _game_map[self.game_id])
        ))
        random.shuffle(all_supers)
        num_players = len(_game_map[self.game_id])
        supers_to_assign = [all_supers[i::num_players] for i in xrange(num_players)]
        for i, player in enumerate(_game_map[self.game_id]):
            player.supers_assigned = supers_to_assign[i]
            send_message(player, message='assign_supers_list', data={
                'supers': supers_to_assign[i]
            })

    def send_received_supers(self):
        for player in _game_map[self.game_id]:
            send_message(player, message='read_supers_list', data={
                'supers': player.supers_received
            })

def send_message(socket, message=None, data=None, error=None):
    assert any(v is not None for v in (message, data, error))
    msg = json.dumps({
        'msg': message,
        'data': data,
        'error': error,
    })
    logging.debug(msg)
    socket.write_message(msg)

def broadcast_message(socket, message=None, data=None, error=None):
    for g in _game_map[socket.game_id]:
        send_message(g, message, data, error)
