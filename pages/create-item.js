import { useEffect, useState } from "react";
import { ethers } from "ethers";
import { create as ipfsHttpClient } from "ipfs-http-client";
import { useRouter } from "next/router";
import Web3Modal from "web3modal";
import { getConfigByChain } from "../config"
import NFT from "../artifacts/contracts/NFT.sol/NFT.json"
import NFTMarket from "../artifacts/contracts/NFTMarket.sol/NFTMarket.json"
import { css } from "@emotion/react";
import RingLoader from "react-spinners/RingLoader";
import { useWeb3 } from "@3rdweb/hooks";



const client = ipfsHttpClient("https://ipfs.infura.io:5001/api/v0")

const style = {
    wrapper: `relative`,
    container: `before:content-[''] before:bg-red-500 before:absolute before:top-0 before:left-0 before:right-0 before:bottom-0 before:bg-[url('https://lh3.googleusercontent.com/ujepnqpnL0nDQIHsWxlCXzyw4pf01yjz1Jmb4kAQHumJAPrSEj0-e3ABMZlZ1HEpJoqwOcY_kgnuJGzfXbd2Tijri66GXUtfN2MXQA=s250')] before:bg-cover before:bg-center before:opacity-100 before:blur`,
    contentWrapper: `flex h-screen relative justify-center flex-wrap items-center`,
    center: ` h-screen relative justify-center flex-wrap items-center `,
    searchBar: `flex flex-1 mx-[0.8rem] w-max-[520px] items-center bg-[#363840] rounded-[0.8rem] hover:bg-[#757199]`,
    searchInput: `h-[2.6rem] w-full border-0 bg-transparent outline-0 ring-0 px-2 pl-0 text-[#e6e8eb] placeholder:text-[#8a939b]`,
    copyContainer: `w-1/2`,
    title: `relative text-white text-[46px] font-semibold`,
    midRow: `text-white`,
    description: `text-[#fff] container-[400px] text-2xl mt-[0.8rem] mb-[2.5rem]`,
    ctaContainer: `flex`,
    spinner: `w-full h-screen flex justify-center text-white mt-20 p-100 object-center`,
    accentedButton: ` relative text-lg font-semibold px-12 py-4 bg-[#2181e2] rounded-lg mr-5 text-white hover:bg-[#42a0ff] cursor-pointer`,
    button: ` relative text-lg font-semibold px-12 py-4 bg-[#363840] rounded-lg mr-5 text-[#e4e8ea] hover:bg-[#4c505c] cursor-pointer`,
    nftButton: `font-bold w-full mt-4 bg-pink-500 text-white text-lg rounded p-4 shadow-lg hover:bg-[#19a857] cursor-pointer`,

}



export default function CreateItem() {
    const [fileUrl, setFileUrl] = useState(null);
    const [formInput, updateFormInput] = useState({ price: '', name: '', description: '' })
    const [loadingState, setLoadingState] = useState(false)
    const router = useRouter()

    const { chainId } = useWeb3()
    console.log("chain", chainId)

    async function onChange(e) {
        const file = e.target.files[0]
        setLoadingState(true)
        console.log(`File uploaded is: ${file}`)
        try {
            const added = await client.add(file, {
                progress: (prog) => console.log(`received: ${prog}`)
            })
            const url = `https://ipfs.infura.io/ipfs/${added.path}`
            setFileUrl(url)
            setLoadingState(false)
        } catch (e) {
            console.log(e)
        }
    }

    async function createMarket() {
        setLoadingState(true)
        const { name, description, price } = formInput

        if (!name || !description || !price || !fileUrl) return
        const data = JSON.stringify({
            name, description, image: fileUrl
        })
        console.log(data)
        try {
            const added = await client.add(data)
            const url = `https://ipfs.infura.io/ipfs/${added.path}`
            createSale(url)
            //setLoadingState(false)
        } catch (error) {
            console.log('Error uploading file: ', error)
        }

    }

    async function createSale(url) {
        const web3modal = new Web3Modal()
        const connection = await web3modal.connect()
        const provider = new ethers.providers.Web3Provider(connection)
        const signer = provider.getSigner()
        const network = await provider.getNetwork()
        let contract = new ethers.Contract(getConfigByChain(network.chainId)[0].nftaddress, NFT.abi, signer)
        let transaction = await contract.createToken(url)
        let tx = await transaction.wait()

        let event = tx.events[0]
        let value = event.args[2]
        let tokenId = value.toNumber()

        const price = ethers.utils.parseUnits(formInput.price, 'ether')
        contract = new ethers.Contract(getConfigByChain(network.chainId)[0].nftmarketaddress, NFTMarket.abi, signer)
        let listingPrice = await contract.getListingPrice()
        listingPrice = listingPrice.toString()
        transaction = await contract.createMarketItem(
            getConfigByChain(network.chainId)[0].nftaddress, tokenId, price, { value: listingPrice }
        )
        await transaction.wait()
        router.push('/explorer')
    }

    return (
        <div>

            <div className={style.wrapper}>
                <div className={style.container}>
                    <div className={style.contentWrapper}>
                        {!chainId ? (
                            <div className={style.spinner}>
                                <RingLoader className={style.spinner} color={'#ffffff'} size={50} />
                                <p><b>Click on the Connect Wallet button !!</b></p>

                            </div>
                        ) : (
                            <div className={style.copyContainer}>
                                <div className={`${style.title} mt-1 p-1`}>
                                    Create Your NFT !!
                                </div>

                                <div className={`${style.searchBar} mt-2 p-1`}>
                                    <input className={style.searchInput}
                                        placeholder='Collection Name' disabled
                                    //onChange={e => updateFormInput({ ...formInput, collectionName: e.target.value })}
                                    />
                                </div>
                                <div className={`${style.searchBar} mt-2 p-1`}>
                                    <input className={style.searchInput}
                                        placeholder='Collection Symbol' disabled
                                    //onChange={e => updateFormInput({ ...formInput, collectionSymbol: e.target.value })}
                                    />
                                </div>
                                <div className={`${style.searchBar} mt-2 p-1`}>
                                    <input className={style.searchInput}
                                        placeholder='Asset/NFT Name'
                                        onChange={e => updateFormInput({ ...formInput, name: e.target.value })}
                                    />
                                </div>
                                <div className={`${style.searchBar} mt-2 p-6`}>
                                    <textarea className={style.searchInput}
                                        placeholder='Asset Description'
                                        onChange={e => updateFormInput({ ...formInput, description: e.target.value })}
                                    />
                                </div>
                                <div className={`${style.searchBar} mt-2 p-1`}>
                                    <input className={style.searchInput}
                                        placeholder={`Asset Price in ${(!getConfigByChain(chainId) ? "" : getConfigByChain(chainId)[0].alt)}`}
                                        onChange={e => updateFormInput({ ...formInput, price: e.target.value })}
                                    />
                                </div>
                                <div className={`${style.searchBar} mt-2 p-1`}>
                                    <input className={style.searchInput}
                                        type="file"
                                        name="Asset"
                                        onChange={onChange}
                                    />
                                </div>
                            </div>
                        )}
                        {loadingState === true ? (
                            <div className={style.midRow}>
                                <RingLoader className={style.midRow} color={'#ffffff'} loading={loadingState} size={150} />
                                <p>NFT Creation in progress...</p>
                                <p>Verifying on Blockchain</p>
                                <p>Please Wait...✋🏻</p>
                            </div>
                        ) : (
                            <div>
                                {
                                    fileUrl && (
                                        <div >
                                            <img className="rounded mt-4" width="350" src={fileUrl} />
                                            <button onClick={createMarket} className={style.nftButton}>Create NFT Now !!</button>
                                        </div>
                                    )
                                }

                            </div>
                        )}



                    </div>
                </div>
            </div>
        </div >
    )
}
