# Assuming a node process is already runnig by pm2
git pull -f origin main:main
yarn
yarn run build
pm2 restart 0
