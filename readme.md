# First time setup

* install nodejs
* install Yarn
* install Docker

```bash
yarn install
```

# Starting

## Start Local MongoDB

```bash
./start-db.sh
```

In first terminal start build process in watch mode:

```bash
yarn watch
```

In second terminal start an application:

```bash
yarn start
```

# API Browser

Open http://localhost:4000 to see Graphql Playground

## Sign in as a default user & run queries as one

1. Run `signIn` mutation in API Browser:

```graphql
mutation {
  signIn (email: "admin@example.com", password: "123456") {
    token
    result {
      success
      message
    }
  }
}
```

Copy received token to HTTP HEADERS section:

```json
{"Authorization": "<token-here>"}
```

Then you can run, for example, `me` query:

```graphql
{ me {
  id
  email
  role
}}
```
