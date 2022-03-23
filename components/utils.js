

export function ellipseAddress(address = '', width = 5) {
    if (!address) {
        return ''
    }
    return `${address.slice(0, width)}...${address.slice(-width)}`
}

export function ellipseAddressDetails(address = '', width = 11) {
    if (!address) {
        return ''
    }
    return `${address.slice(0, width)}...${address.slice(-width)}`
}

export function ellipseName(address = '', width = 6) {
    if (!address) {
        return ''
    }
    return `${address.slice(0, width)}...`
}

export function createUrltoken(address = '', chainId = '') {
    let baseUrl;
    if (chainId === 80001) {
        baseUrl = 'https://mumbai.polygonscan.com/token/'
    }
    if (chainId === 4) {
        baseUrl = 'https://rinkeby.etherscan.io/token/'
    }
    return `${baseUrl}${address}`
}

export function createUrlAddress(address = '', chainId = '') {
    let baseUrl;
    if (chainId === 80001) {
        baseUrl = 'https://mumbai.polygonscan.com/address/'
    }
    if (chainId === 4) {
        baseUrl = 'https://rinkeby.etherscan.io/address/'
    }
    return `${baseUrl}${address}`
}
