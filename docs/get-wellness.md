# get-wellness
This file describes the `/app/get-wellness` endpoint.

## Core details
* Endpoint: `/app/get-wellness`.
* Request method: `POST`.
* Body parameters:
    * `token`: string.
* Response parameters:
    * `message` message describing success or failure
    * `email` user's email
    * `dayArray` array of days as ints from 1 to 31 
    * `monthArray` array of months as ints from 1 to 12
    * `yearArray` array of years as ints
    * `wellnessArray` array of ints from 1 to 10
Message relays whether the call was successful or not.  If not, then the parameters following message are ommitted from the response.  
