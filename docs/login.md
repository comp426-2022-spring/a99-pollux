# login
This file describes the `/app/login-user` endpoint.

## Core details
* Endpoint: `/app/login-user`.
* Request method: `POST`.
* Body parameters:
    * `email`: string.
    * `password`: string.
* Response parameters:
    * `message`
    * `token` if the login is successful

Message relays whether the login was successful or not.  
