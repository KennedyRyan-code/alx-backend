#!/usr/bin/env python3
"""
This module sets up a basic Flask app.
to configure available languages in our app
"""

from flask import Flask, render_template
from flask_babel import Babel

app = Flask(__name__)
babel = Babel(app)


class Config(object):
    """
    Config class for setting up language & timezone.
    """
    LANGUAGES = ["en", "fr"]
    BABEL_DEFAULT_LOCALE = "en"
    BABEL_DEFAULT_TIMEZONE = "UTF"


app.config.from_object(Config)


@app.route('/')
def index():
    """
    Render the index.html temp...
    """
    return render_template('1-index.html')


if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5000, debug=True)
