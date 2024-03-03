### Starters
- Install dependencies
``sh
  npm i
``
- Start up the project
``sh
npm start
``


### Api configuration
- Add in the .env file
```
MONGO_URI="mongo_uri" // ya i have used mongodb
SECRET_KEY="jwt_secret_key"
TOKEN_LIFESPAN="10d"
CLIENT_ID="google_client_id" // to verify user
```

# Generate Secret key
```
 node -e "console.log(require('crypto').randomBytes(32).toString('hex'))
```

### Structure
- src
  - auth
  - controller // route controller functions
    - mutation // add,update,delete 
      - item.ts
    - query // get queries
      - item.ts
  - migrations
    - migrationScripts // where all the migrations files are created to perform migrations
    - script.ts //entrypoint for running migrations
  - graphql
    - index.ts
  - mongo // contains mongo schema and controllers
  - types 
  - utils // common functions


### run migrations
Note: runs only one migration at a time.
- Add your file under src/migration/migrationScripts
- cd  src/migration/
- run 
```
ts-node .\script.ts "path_to_migration_file" 'mongo_uri'
```
