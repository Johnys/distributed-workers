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

### How execute dev environment with docker
In the root directory execute:
```
docker-compose -f docker-compose.dev.yml up --build
```
This compose create a postgres database exposed on port 5432 with user postgres and password 1234.
Here we are using nodemon to reload automatically the dev environment, so if you change any file inside src folder, the project will be reloaded.

### How execute dev environment without docker
For execute local without docker, you need running locally a postgres server and a nodejs 13.14.0
1. Create .env file with connection settings (See .env.example)
2. Execute those commands:
```
npm install
npm start
```
The project will show a chart bar with elements in the queue.

![monitor_de_itens](https://user-images.githubusercontent.com/3290510/94356764-6968b280-0068-11eb-9a40-4c61de6bd108.png)
