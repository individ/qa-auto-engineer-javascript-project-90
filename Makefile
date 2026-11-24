.PHONY: install start test lint

install:
	npm ci
	npx playwright install chromium

start:
	npm run dev

test:
	npm test

lint:
	npm run lint
