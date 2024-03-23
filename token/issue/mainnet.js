const { UserSigner, UserVerifier } = require('@multiversx/sdk-wallet');
const { promises } = require('fs');
const { Transaction, Address, Account, TransactionWatcher, TransactionPayload } = require('@multiversx/sdk-core');
const { ApiNetworkProvider, ProxyNetworkProvider } = require("@multiversx/sdk-network-providers");

async function main() {
    const apiNetworkProvider = new ApiNetworkProvider("https://api.multiversx.com");
    const proxyNetworkProvider = new ProxyNetworkProvider("https://devnet-gateway.multiversx.com");

    const pemText = await promises.readFile("../wallet/wallet-owner.pem", { encoding: "utf8" });
    const signer = UserSigner.fromPem(pemText);

    const networkConfig = await apiNetworkProvider.getNetworkConfig();
    console.log("networkConfig.MinGasPrice = ", networkConfig.MinGasPrice);
    console.log("networkConfig.ChainID = ", networkConfig.ChainID);

    const senderAddress = Address.fromBech32("erd1wgmh8p8upvg4ys2lz35v904353c5vtkcyjhyp2v7sp72el7m0fpq6zmfed")
    const senderAccount = new Account(senderAddress)
    const senderOnNetwork = await apiNetworkProvider.getAccount(senderAddress)
    console.log("senderAccount = ", senderAccount)
    console.log("senderOnNetwork = ", senderOnNetwork)
    senderAccount.update(senderOnNetwork);
    console.log("senderAccount after update = ", senderAccount)
    console.log("Nonce = ", senderAccount.nonce)
    console.log("Balance = ", senderAccount.balance.toString())

    const receiverAddress = Address.fromBech32("erd1qqqqqqqqqqqqqqqpqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqzllls8a5w6u")

    const tx = new Transaction({
        value: 50000000000000000,
        gasLimit: 60000000,
        gasPrice: 1000000000,
        sender: senderAddress,
        receiver: receiverAddress,
        data: new TransactionPayload("issue" +
            "@426C75657370616465" +
            "@424C55" +
            "@108B2A2C28029094000000" +
            "@12"),
        chainID: networkConfig.ChainID,
        version: 1,
    });

    tx.setNonce(senderAccount.getNonceThenIncrement());

    const serializedTransaction = tx.serializeForSigning();
    const transactionSignature = await signer.sign(serializedTransaction);
    console.log("Transaction = ", tx.data.length());
    tx.applySignature(transactionSignature);

    console.log("Transaction = ", tx);
    console.log("Transaction signature", tx.getSignature().toString("hex"));
    console.log("Transaction hash", tx.getHash().toString());

    let txHash = await apiNetworkProvider.sendTransaction(tx);
    console.log("txHash = ", txHash)

    const watcher = new TransactionWatcher(apiNetworkProvider);
    const transactionOnNetwork = await watcher.awaitCompleted({ getHash: () => txHash });
    console.log(transactionOnNetwork);
}

main()
    .then(() => process.exit(0))
    .catch((error) => {
        console.error(error);
        process.exit(1);
    });