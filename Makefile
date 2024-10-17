contracts/deploy/local:
	@echo "Deploying contracts..."
	rm -rf ignition/deployments/chain-1337
	npx hardhat ignition deploy ignition/modules/idswapp.ts --network localhost
