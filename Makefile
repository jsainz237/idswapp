contracts/local/clear:
	rm -rf ignition/deployments/chain-1337

contracts/local/deploy/factory:
	npx hardhat ignition deploy ignition/modules/factory.ts --network localhost

contracts/local/deploy/account:
	npx hardhat ignition deploy ignition/modules/account.ts --network localhost

invoke/forward-email:
	DOCKER_HOST=unix:///Users/jessesainz/.docker/run/docker.sock sam local invoke --template lambdas/forward-email/template.yml -e lambdas/forward-email/events/email.notification.json