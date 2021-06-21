![README%20md%2085bf836b4da649a0a7e57f147f2c5195/test.png](README%20md%2085bf836b4da649a0a7e57f147f2c5195/test.png)

# YUVASHIKSHA

                                               **Online examination system for universities**

## Features

- Hub for exams, valuation and result publication
- Monitoring through webcam images
- Flexible for any exam pattern such as MCQ's and other modes
- Manages to build an institution structure

## Prerequisites

- [Node JS](https://nodejs.org/)
- [MongoDB](https://www.mongodb.com/)

## Installation

Download the latest release from [here](https://github.com/thadathilsinan/yuvashiksha/releases).

```bash
git clone "https://github.com/thadathilsinan/yuvashiksha.git"
cd yuvashiksha
npm install
npm build
```

```bash
cd src/server
npm install
npm start
```

## Usage

1. Configure server file

/src/server/config.js

```jsx
{
  clientUrl: "http://localhost:3000", //YOUR STATIC SERVER URL,
  serverUrl: "http://localhost:4000", //YOUR NODE SERVER URL
	email: "example@gmail.com", //EMAIL ID FOR NOTIFICATION
	password: "password", //PASSWORD FOR EXAM ACCOUNT
	dbConnectionString: "connection-string", //MONGODB CONNECTION STRING
  adminUsername: "hello",//ADMIN USERNAME
  adminPassword: "1234567", //ADMIN PASSWORD
};
```

Use "app specific password" if two factor authentication is enabled in your gmail account and enable "less secure app" in google settings

2.  Configure client side

Configure the file /config.js before building the front-end

```jsx
{
  clientUrl: "http://localhost:3000", //YOUR STATIC SERVER URL,
  serverUrl: "http://localhost:4000", //YOUR NODE SERVER URL
};
```

## LICENSE

Distributed under the GPLv3 License. See `LICENSE` for more information.

## CONTACT

[Sinan](https://github.com/thadathilsinan) - [thadathilsinan@gmail.com](mailto:thadathilsinan@gmail.com) - @[sinan_thadathil](https://www.instagram.com/sinan_thadathil/)

Gladson saji - [gladsonsaji4@gmail.com](mailto:gladsonsaji4@gmail.com) - [@gladson_ms](https://www.linkedin.com/in/gladson-m-s-96b9171a5/)

Basil jiji - [basilgg24@gmail.com](mailto:basilgg24@gmail.com)

Project Link : [https://github.com/thadathilsinan/yuvashiksha.git](https://github.com/thadathilsinan/yuvashiksha.git)

## ACKNOWLEDGEMENTS

- [https://reactjs.org](https://reactjs.org/)
- [https://nodejs.org](https://nodejs.org/en/docs/)
- [https://www.npmjs.com](https://www.npmjs.com/)
- [https://stackoverflow.com](https://stackoverflow.com/)
