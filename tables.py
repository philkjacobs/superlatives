import os
from asyncio import ensure_future
from aiopg.sa import create_engine
from sqlalchemy import (
    Column,
    Integer,
    MetaData,
    String,
    Table,
)
from urllib import parse


# postgres is not a standard urllib.parse URL
parse.uses_netloc.append("postgres")
metadata = MetaData()
player_stats = Table(
    'player_stats',
    metadata,
    Column('id', Integer, primary_key=True),
    Column('open_ts', Integer),
    Column('close_ts', Integer),
    Column('state', String),
)


async def create_player_stats_table(conn):
    return await conn.execute('''CREATE TABLE IF NOT EXISTS player_stats (
        id serial PRIMARY KEY,
        open_ts bigint DEFAULT NULL,
        close_ts bigint DEFAULT NULL,
        state varchar(255) DEFAULT NULL
    )''')


async def async_db_call(fn):
    url = parse.urlparse(os.environ.get("DATABASE_URL", "postgres://localhost:5432/supers"))
    engine_attrs = {
        'database': url.path[1:],
        'user': url.username,
        'password': url.password,
        'host': url.hostname,
        'port': url.port,
    }
    async with create_engine(**engine_attrs) as engine:
        async with engine.acquire() as conn:
            return await fn(conn)


def setup_and_migrate_db(ioloop):
    return all([
        ioloop.run_until_complete(ensure_future(async_db_call(create_player_stats_table))),
    ])
