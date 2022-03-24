export const tokenConfig = {
    "80001": [

        {
            name: "---Select Your Token---",
            address: "0x000",
            symbol: "SELECT",
            decimal: 18
        },
        {
            name: "Monkey NFT Token",
            address: "0xC9d97264C1c63E88eFBBa4c22D5A422A5A4B607d",
            symbol: "METT",
            decimal: 0
        },
        {
            name: "Lolo Coins",
            address: "0x90179ba681708dC36C38828153130D5B7836b7D5",
            symbol: "lolo",
            decimal: 18
        }
    ],
};

export const getTokenByChain = (chain) => tokenConfig[chain];