dep:
	npm install

build:
	npm run build 
	npm run pack
all:
	npm ci
	npm run all
# 	__tests__/verify-no-unstaged-changes.sh
