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
  appointments {
      id
      status
      startTime
      description
      issuer {
          email
      }
  }  
}}
```

# Create an appointment

( for receiver id provide valid user id)

```graphql
mutation {
  appointmentCreate(description: "test 1", receiver: "5fe4658a6b4dc07520e93079",
  startTime: "2020-12-24 12:30", endTime: "2020-12-24 12:45") {
    appointment {
      status
      id
      description
      startTime
      endTime
      receiver {
        id
        email
        created
      },
      issuer {
        id
        email
        created
      }
    }
    result {
      success
      message
    },
    errors {
      startTime
      endTime
      receiver
    }
  }
}
```

# List of appointments

```graphql
{ appointments {
  id
  status
  startTime  
}}
```

# Approving an appointment

```graphql
mutation {
  appointmentApprove(id: "5fe465d26b4dc07520e9307a") {
    result {
      success
      message
    }
    appointment {
      id
      status
    }
  }
}
```

( provide valid appointment id )

# Example: Getting related data


```graphql
{ me {
  id
  email
  role
  appointments {
    id
    status
    description
    receiver {
      appointments {
        id
        status
        startTime
        description
      }
    }
  }
}}
```
