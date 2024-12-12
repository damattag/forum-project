# How to run the project

## Install dependencies

```bash
npm install 
```

## Create a .env file

```bash
cp .env.example .env
```

Edit the .env file with your own values

### Generate a private key
openssl genrsa -out private_key.pem 2048

### Extract the public key from the private key
openssl rsa -in private_key.pem -pubout -out public_key.pem

### Set appropriate permissions for security
chmod 600 private_key.pem
chmod 644 public_key.pem