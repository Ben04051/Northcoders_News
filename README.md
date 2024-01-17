# Northcoders News API

Link to the hosted site: https://northcoders-news-tn61.onrender.com

The minimum versions of Node.js and Postgres required are as follows:
- Node.js v21.1.0
- psql (PostgreSQL) 14.10

This project is a database for news articles that contains comments, topics and a user database. It features GET, POST, PATCH and DELETE requests that are detailed by adding the endpoint /api to the end of the link for the hosted version of the site.

To run the file locally, carry out the following steps:

- Clone the Repo and push the code to a new repository with the following commands:
   - git remote set-url origin YOUR_NEW_REPO_URL_HERE
   - git branch -M main
   - git push -u origin main

- Once cloned, the following git-ignored files will need to be added:
   - .env.test - contents: PGDATABASE=nc_news_test
   - .env.development - contents: PGDATABASE=nc_news

- Next, run npm install and then install the following packages with the following commands:
   - npm install 
   - npm install -D supertest
   - npm install express

- The scripts to create and seed the databases can be found in the package JSON, here are the terminal commands:
   - npm run setup-dbs (to create the databases)
   - npm run seed (to seed the databases)
   - npm run test (to run the test files)

Following this the setup will be complete.


