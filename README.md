# IP Publisher
Publish the local server's ip to other subscribed services.

## Flow 
1. Run Ip Publisher in (ex.) ServerX that you want its dynamic ip to be published

1. Register from other services that depend on the dynamic ip of ServerX

1. Once ServerX's ip is changed, Ip Publisher publishes the new ip to subscribed services automatically. 

## How to Register
Login to server and get auth token
```
GET http://<server>/login
        body:
```
```json
{
	"username": "<username from .env file or environment variables>",
	"password": "<password from .env file or environment variables>"
}
```
Register for ip update with auth token
```
POST http://<server>/registrar
      header: Content-Type: application/json
      header: Authorization: Bearar <auth_token>
      body: 
```
```json
{
	"name": "My Application",
	"callbackUrl": "https://www.myotherapp.com/"
}
```
Check current domain
```
GET http://<server>/domain
        header: Authorization: Bearer <auth_token>
```

***
## Deployment
1. Copy _.env file to .env or add environment variables for those keys
1. Deploy a mongo server in the cloud, I am using https://mlab.com/, its free to use.
1. Get the mongo_url and add to .env or add as environment variable
1. Deploy the docker container with environment variables


***
## Contribute

1. Fork the project
1. Make some commits to improve the project.
1. Push this branch to your GitHub project.
1. Open a Pull Request on GitHub.
1. Discuss, and optionally continue committing.
