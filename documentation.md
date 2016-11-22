API documentation

# Background
APINAME serves historical screenshots and metadata for a given website or date range. You can retrieve all websites stored for a particular year; or a visual history of a given website across a specified date range. Screenshots and metadata are generated from the [Wayback Machine API]() and [screenshot api name](), and cached within the api. If your desired website doesn't exist you can add it to the database by providing the url of the website you would like to add. You will get back JSON with a url to the desired image.

Return list of all data:

Method: GET
Endpoint: /api/v1/designs
Usage: get list of all data

Response:
On success, the HTTP status code in the response header is 200 ('OK').
<!-- In case of server error, the header status code is a 5xx error code and the response body contains an error object.     -->

Example Request

request
  .get(/api/v1/designs)
  .end(err, res)

Example Response:
  {
    "designs":[{
      "id":1,
      "image_url":"https://pbs.twimg.com/profile_images/791038006220115968/Rn3F352i.jpg",
      "page_url":"trademe.co.nz",
      "year":2000,
      "timestamp": "20001206122310"
      }, {
      "id":2,
      "image_url":"http://weknowyourdreams.com/images/cat/cat-02.jpg",
      "page_url":"facebook.com",
      "year":2001,
      "timestamp": "20010306121310"
    }
  ]}

Return list filtered by year:

  Method: GET
  Endpoint: /api/v1/designs/:year
  Usage: get list of data filtered by year

  Example Request

  request
    .get(/api/v1/designs/2000)
    .end(err, res)

  Example Response:
    {
      "designs":[{
        "id":1,
        "image_url":"https://pbs.twimg.com/profile_images/791038006220115968/Rn3F352i.jpg",
        "page_url":"trademe.co.nz",
        "year":2000,
        "timestamp": "20001206122310"
        }, {
        "id":3,
        "image_url":"http://weknowyourdreams.com/images/cat/cat-02.jpg",
        "page_url":"facebook.com",
        "year":2000,
        "timestamp": "20001006102311"
      }
    ]}

    If the requested year has no data in the database an empty array with the key of year will be returned

    Example Response:
    {"year":[]}


    Return list filtered by website url:

      Method: GET
      Endpoint: /api/v1/designs/url/:websiteURL
      Usage: get list of data filtered by year

      Example Request

      request
        .get(/api/v1/designs/url/trademe.co.nz)
        .end(err, res)

      Example Response:
        {
          "designs":[{
            "id":1,
            "image_url":"https://pbs.twimg.com/profile_images/791038006220115968/Rn3F352i.jpg",
            "page_url":"trademe.co.nz",
            "year":2000,
            "timestamp": "20001206122310"
            }, {
            "id":8,
            "image_url":"http://weknowyourdreams.com/images/cat/cat-02.jpg",
            "page_url":"trademe.co.nz",
            "year":2005,
            "timestamp": "20001006102311"
          }
        ]}

If the requested website url is not in the database an empty array with the key of websiteURL will be returned

Example Response:
{"websiteURL":[]}        

Add a website to the database

//provide a url and a date range
//if a date range is not provided, it is 2000 - 2010
//will return all screenshots for the entered website, it will take a few minutes

Method: POST,
Endpoint: /generate
Usage: generate screenshots and metadata for the given url and date range

Example Request

request
  .post(/api/v1/designs/generate)
  .send({"websiteURL": "trademe.co.nz", date-range: {"start":2001, "end":2002}})
  .end(err, res)


  Example Response:
    {
      "designs":[{
        "id":199,
        "image_url":"https://pbs.twimg.com/profile_images/791038006220115968/Rn3F352i.jpg",
        "page_url":"trademe.co.nz",
        "year":2001,
        "timestamp": "20011206122310"
        }, {
        "id":200,
        "image_url":"http://weknowyourdreams.com/images/cat/cat-02.jpg",
        "page_url":"trademe.co.nz",
        "year":2002,
        "timestamp": "20021006102311"
      }
    ]}
