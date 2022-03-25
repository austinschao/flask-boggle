from unittest import TestCase

from app import app, games

# Make Flask errors be real errors, not HTML pages with error info
app.config['TESTING'] = True

# This is a bit of hack, but don't use Flask DebugToolbar
app.config['DEBUG_TB_HOSTS'] = ['dont-show-debug-toolbar']


class BoggleAppTestCase(TestCase):
    """Test flask app of Boggle."""

    def setUp(self):
        """Stuff to do before every test."""

        self.client = app.test_client()
        app.config['TESTING'] = True

    def test_homepage(self):
        """Make sure information is in the session and HTML is displayed"""

        with self.client as client:
            response = client.get('/')
            html = response.get_data(as_text=True)

            self.assertIn('<table', html)
            self.assertEqual(response.status_code, 200)


    def test_api_new_game(self):
        """Test starting a new game."""

        with self.client as client:

            response = client.post("/api/new-game")
            json_response = response.get_json()

            self.assertTrue(isinstance(json_response["gameId"], str))
            self.assertTrue(isinstance(json_response["board"], list))


    def test_check_word(self):
        """Test checking for word."""

        with self.client as client:
            # Hard code board row
            response = client.post("/api/new-game")
            json_response = response.get_json()
            game_id = json_response["gameId"]
            game = games[game_id]
            game.board[0] = ["C", "A", "T", "R", "M"]


            # Testing for word on board
            resp = client.post("/api/score-word",
                    json={"gameId": json_response["gameId"], "word": "CAT"})
            json_resp = resp.get_json()
            self.assertEqual(json_resp["result"], "ok")


            resp = client.post("/api/score-word",
                    json={"gameId": json_response["gameId"], "word": "ZINCIFY"})
            json_resp = resp.get_json()
            self.assertEqual(json_resp["result"], "not-on-board")


            resp = client.post("/api/score-word",
                    json={"gameId": json_response["gameId"], "word": "XXX"})
            json_resp = resp.get_json()
            self.assertEqual(json_resp["result"], "not-word")