export const networkConfig = {
    "80001": [
        {
            nftmarketaddress: "0x64C7A240114D2B97958a1c2C5bB1EFB3bE0A294E",
            nftaddress: "0xC9d97264C1c63E88eFBBa4c22D5A422A5A4B607d",
            token_icon: "https://cryptologos.cc/logos/polygon-matic-logo.svg?v=022",
            alt: "MATIC",
            networkName: "Mumbai"
        },

    ],

    "4": [
        {
            nftmarketaddress: "0x3Ba1b8FBa10081c08F30e1e5682F4aB2Bc3cA368",
            nftaddress: "0xCaDEcBD43Ca04951a4513a16669F193925bC40F9",
            token_icon: "https://cryptologos.cc/logos/ethereum-eth-logo.svg?v=022",
            alt: "ETH",
            networkName: "Rinkeby"

        },
    ],
};

export const getConfigByChain = (chain) => networkConfig[chain];