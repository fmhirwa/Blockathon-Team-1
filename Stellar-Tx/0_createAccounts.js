 const fs = require('fs');
 const Stellar = require("stellar-sdk");

 const filename = "accounts.json";

 fs.writeFileSync(
     filename,
     JSON.stringify(
         ["Alice", "Bob"].map(name => {
                 const pair = Stellar.Keypair.random()

                 return {
                     name,
                     secret: pair.secret(),
                     publicKey: pair.publicKey() 
                 };
        })
            
     )
 );