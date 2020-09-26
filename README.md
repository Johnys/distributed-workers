# Distributed Workers

##### Description
This distributed workers is a project that checks if urls are online.

##### Requirements to execute the project
1. docker
2. docker-compose

### How execute the project
In the root directory execute:
```
docker-compose up --build
```
This compose create a postgres database exposed on port 5432 with user postgres and password 1234.
There is a table called job inside workers scheme that contains all jobs.
To insert new jobs, there is a file called seed.sql with some examples.

### How execute tests
In the root directory execute:
```
docker-compose -f docker-compose.test.yml up --build --exit-code-from distributed-workers-test
```

### How execute dev environment
In the root directory execute:
```
docker-compose -f docker-compose.dev.yml up --build
```
This compose create a postgres database exposed on port 5432 with user postgres and password 1234.
Here we are using nodemon to reload automatically the dev environment, so if you change a file inside src folder, the project will be reloaded.
