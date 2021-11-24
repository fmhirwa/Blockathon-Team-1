const accounts = require("./accounts");
const Stellar = require("stellar-sdk");
const { TimeoutInfinite } = require("stellar-base");

const server = new Stellar.Server("https://horizon-testnet.stellar.org");

const runTransaction = async (alicePubKey, aliceSecretKey, bobPubKey) => {

    const standardFee = await server.fetchBaseFee()

    const txOptions = {
        fee: standardFee,
        networkPassphrase: Stellar.Networks.TESTNET
    };

    const paymentToBob = {
        destination: bobPubKey,
        asset: Stellar.Asset.native(),
        amount: "100"
    };

    const aliceAccount = await server.loadAccount(alicePubKey);

    const transaction = new Stellar.TransactionBuilder(aliceAccount, txOptions)
        .addOperation(Stellar.Operation.payment(paymentToBob))
        .setTimeout(TimeoutInfinite)
        .build();

    transaction.sign(aliceSecretKey);

    await server.submitTransaction(transaction);
};

const [alice, bob] = accounts;

runTransaction(alice.publicKey,
    Stellar.Keypair.fromSecret(alice.secret), 
    bob.publicKey)
    .then(() => console.log("OK"))
    .catch(e => {
        console.log(e);
        throw e;
});
