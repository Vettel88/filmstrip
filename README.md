# Filmstrip

## Deployment

logging into the CLI locally
```
$ heroku login
```
followed by logging in to heroku's container service
```
$ heroku container:login
```
and building/pushing the image
```
$ heroku container:push web -a filmstrip-app --arg
NODE_VERSION=8.16.1,INSTALL_MONGO=false,INSTALL_GRAPHICSMAGICK=false,INSTALL_PHANTOMJS=false
```
and then
```
$ heroku container:release web -a filmstrip-app
```

