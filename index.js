const request = require('request-promise');
const cheerio = require('cheerio');
const express = require('express');
const app = express();
const bodyParser = require('body-parser');

const PORT = process.env.PORT || 5000;

app.use(bodyParser.urlencoded({ extended: false }));

// parse application/json
app.use(bodyParser.json());

app.post('/api/get_data', async (req, res) => {
  const user_name = req.body.user_name;
  console.log(user_name);
  const user_data = await getuserDataJson(user_name);
  res.status(200).json(user_data);
});

const getuserDataJson = async USERNAME => {
  try {
    const BASE_URL = `https://www.instagram.com/${USERNAME}/`;
    let response = await request(BASE_URL, {
      accept:
        'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,image/apng,*/*;q=0.8',
      'accept-encoding': 'gzip, deflate, br',
      'accept-language':
        'en-US,en;q=0.9,fr;q=0.8,ro;q=0.7,ru;q=0.6,la;q=0.5,pt;q=0.4,de;q=0.3',
      'cache-control': 'max-age=0',
      'upgrade-insecure-requests': '100',
      'user-agent':
        'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_13_6) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/67.0.3396.99 Safari/537.36'
    });

    let $ = cheerio.load(response);

    let script = $('script')
      .eq(4)
      .html();

    let {
      entry_data: {
        ProfilePage: {
          [0]: {
            graphql: { user }
          }
        }
      }
    } = JSON.parse(/window\._sharedData = (.+);/g.exec(script)[1]);

    return user;
  } catch (err) {
    console.log('Service not avaliable at the moment...');
    console.log(err);
    return {};
  }
};

app.listen(PORT, () => {
  console.log(`Server running on PORT: ${PORT}`);
});
