# basic_expressjs

The main features of the project include:
1. Roles and Permissions Management 
2. signIn and signUp Api 

# Installation

1. first should clone the repo
2. Open Terminal , and write : `npm i` after that create a `.env` file in the root directory
3. add environment variables :
`PORT` the port number that you want to start the api on
`USER` for login to database connection 
`PASSWORD` password of user for database connection 
`HOST` like `localHost`
`DATABASE` name of database 
`DIALECT` is "MYSQL"
`PORT_DB` port for connection with database mysql
`CHARSET` = "utf8mb4"
`COLLATE` = "utf8mb4_general_ci"
`TOKEN_KEY`  the private key to generate tokens for users
`JWT_EXPIRES_IN `  to generate a key for expires like  90d
`REFRESH_TOKEN_KEY`  the private key to generate  refreshTokens for users
`REFRESH_TOKEN_EXPIRES_IN `  to generate a key for expires like  90d

# Usage

in this api there is the following endpoints:
1. `POST` /auth/signup : to signUp a new account
   you will need to send the following  information as a json  
   full_name , gender , phoneNumber , username , password , role_id,customPermissions 
2. `POST` auth/login: to log in to your account
   you will need to send the following information as a json
    username, password 
3. `GET` /admin/role :  to get all in db
4. `POST` /admin/role/create : to create new role for this user  with title and text
5. `PUT` /admin/role/update/id: to update one of you role with the id
6. `DELETE` /admin/delete/id: to delete one of you role with the id


# Authentication

for the authentication I used json web token JWT ,  Bearer Token when you login or register an account you will get a token in the response header "authorization" use the same header to send the token with your requests for the notes

# created By :Eng.mohamad noor aldeeb ,Eng raed al masri
