 
 ### Generate secret key for backend
 node -e "console.log(require('crypto').randomBytes(32).toString('hex'))