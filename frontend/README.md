# Multimodal Chatbot Frontend

This is a frontend page developed to test a multimodal chatbot.

## Features

- Display DB items in table format
- View detailed information for each item
- Upload text or images for chat
- Asynchronous output of chat content
- Rendering based on server response format

## Getting Started

### Requirements

1. Create a `.env.local` file in the root directory and add the server URL. Replace `your_server_url_here` with the actual URL of your server.

```sh
NEXT_PUBLIC_SERVER_HOST={your_server_url_here}
```

2. Install dependencies

```sh
npm install
# or
yarn install
```

### Development Server

Run the development server:

```sh
npm run dev
# or
yarn dev
```

Open [http://localhost:9500](http://localhost:9500) to view it in the browser.

### Production Server

Run the production build locally:

```sh
npm run build && npm run start
# or
yarn build && yarn start
```

Open [http://localhost:9500](http://localhost:9500) to view it in the browser.

### Docker Support

This project can also be run using [Docker](./Dockerfile).

1. Build the Docker image

```sh
docker build -t frontend .
```

2. Run the Docker container

```sh
docker run -p 9500:9500 frontend
```
