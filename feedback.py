import os
import requests
from tornado.web import HTTPError, RequestHandler


class FeedbackHandler(RequestHandler):
    def post(self):
        feedback = self.get_argument('feedback')
        api_key = os.environ.get('MAILGUN_KEY')
        if api_key:
            resp = requests.post(
                "https://api.mailgun.net/v3/mathewantony.com",
                auth=("api", api_key),
                data={"from": "Superlatives Feedback <postmaster@mathewantony.com>",
                      "to": ["superlatives-feedback@googlegroups.com"],
                      "subject": "Superlatives Feedback",
                      "text": feedback})
            if resp.status_code != 200:
                raise HTTPError(resp.status_code, resp.content)
        else:
            raise HTTPError(505, 'API Key not set.')