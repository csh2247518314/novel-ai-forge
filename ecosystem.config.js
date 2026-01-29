{
  "name": "novel-ai-forge",
  "script": "npm run start:prod",
  "cwd": "/var/www/novel-ai-forge",
  "instances": 2,
  "exec_mode": "cluster",
  "watch": false,
  "autorestart": true,
  "kill_timeout": 5000,
  "listen_timeout": 3000,
  "env": {
    "NODE_ENV": "production",
    "PORT": 3000
  }
}
