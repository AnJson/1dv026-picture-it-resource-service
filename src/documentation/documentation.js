export const documentation = {
  message: 'Welcome to the resource-api! Please read these documentation.',
  base_url: 'https://cscloud8-48.lnu.se/picture-it/api/v1/',
  services: [
    {
      name: 'images',
      description: 'This is an API for uploading and collecting personal base64-encoded png, gif and jpeg images.',
      authentication: 'JWT',
      base_url: 'https://cscloud8-48.lnu.se/picture-it/api/v1/images',
      endpoints: ['images', 'images/:id'],
      authorization_endpoints: ['images', 'images/:id'],
      rate_limit: {
        endpoints: ['images', 'images/:id'],
        requests: 100,
        timewindow_minutes: 10
      },
      required_fields: {
        data: 'image as base64 encoded string',
        contentType: ['image/gif', 'image/jpeg', 'image/png']
      },
      optional_fields: {
        description: 'string of minimum 1 and maximum 500 characters'
      },
      queries: {
        filter: {
          endpoints: ['images'],
          default: '*',
          example_query: '[base_url]?contentType=image/png,description=my+lovely+car'
        },
        sort: {
          endpoints: ['images'],
          default: 'createdAt',
          example_query: '[base_url]?sort=contentType,updatedAt'
        },
        fields: {
          endpoints: ['images'],
          default: '*',
          example_query: '[base_url]?fields=description,imageUrl'
        },
        skip: {
          endpoints: ['images'],
          default: 0,
          example_query: '[base_url]?skip=10'
        },
        limit: {
          endpoints: ['images'],
          default: 0,
          example_query: '[base_url]?limit=5'
        }
      },
      example_responses: [
        {
          method: 'GET',
          query: '[base_url]?contentType=image/jpeg&fields=description&limit=2',
          response: [
            {
              description: 'A lovely sunset',
              id: '622e1c7969c26b1387b375e5'
            },
            {
              description: 'Weekend in paris',
              id: '622e1c7469c26b1387b375e3'
            }
          ],
          status_code: 200
        },
        {
          method: 'GET',
          query: '[base_url]/622e1c7969c26b1387b375e5',
          response: {
            imageUrl: 'https://courselab.lnu.se/picture-it/images/public/622e1c7873c781a6c07a817f',
            description: 'A lovely sunset!',
            contentType: 'image/jpeg',
            updatedAt: '2022-03-13T16:31:53.462Z',
            createdAt: '2022-03-13T16:31:53.462Z',
            id: '622e1c7969c26b1387b375e5'
          },
          status_code: 200
        },
        {
          method: 'POST',
          query: '[base_url]',
          body: {
            data: '465asdasca5d4aedfDS45^Sda54wdsAsdasd45asdgsgjhr5a5a4ad>Sd4g5e...',
            contentType: 'image/jpeg',
            description: 'A night at the opera'
          },
          response: {
            imageUrl: 'https://courselab.lnu.se/picture-it/images/public/622e5efb73c781a6c07a821e',
            description: 'A night at the opera',
            contentType: 'image/jpeg',
            updatedAt: '2022-03-13T21:15:40.433Z',
            createdAt: '2022-03-13T21:15:40.433Z',
            id: '622e5efc8c9bde1ab7754fab'
          },
          status_code: 201
        },
        {
          method: 'PUT',
          query: '[base_url]/622e5efc8c9bde1ab7754fab',
          body: {
            data: '465asdasca5d4aedfDS45^Sda54wdsAsdasd45asdgsgjhr5a5a4ad>Sd4g5e...',
            contentType: 'image/png',
            description: 'A night at the royal opera'
          },
          response: {},
          status_code: 204
        },
        {
          method: 'PATCH',
          query: '[base_url]/622e5efc8c9bde1ab7754fab',
          body: {
            description: 'A night at the royal opera in Venice'
          },
          response: {},
          status_code: 204
        }
      ]
    }
  ]
}
