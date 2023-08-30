![Preview](preview.png)

An example full-stack app that runs on [Deta Space](https://deta.space/)!

The main components of the project are:

* `/src` - The JavaScript app which talks directly to Base.
* `Spacefile` - configuration for deploying this app to **Deta Space** 💫


## Development

1. Install [Node.js](https://nodejs.org/en/). Preferably LTS version.
2. Install and setup [Space CLI](https://deta.space/docs/en/build/reference/cli)
3. Create a new Space project:

```bash
space new
```

2. Install frontend and backend dependencies together:

```bash
npm install
```

3. Start app in development mode:

```bash
space dev
```

This will start a dev server to test your app locally. It automatically connects your app with Base and Drive


Refer to our [docs](https://deta.space/docs) for more information on Space development.

## Run it on Space

```sh
space push
```

## License

MIT