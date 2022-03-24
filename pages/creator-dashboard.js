import { ethers } from 'ethers'
import { useEffect, useState } from 'react'
import axios from 'axios'
import Web3Modal from "web3modal"
import { getConfigByChain } from "../config"
import Market from '../artifacts/contracts/NFTMarket.sol/NFTMarket.json'
import NFT from '../artifacts/contracts/NFT.sol/NFT.json'
import NFTCard from "../components/NFTCard";
import { css } from "@emotion/react";
import CircleLoader from "react-spinners/CircleLoader";
import { CgWebsite } from "react-icons/cg";
import { AiOutlineInstagram, AiOutlineTwitter } from "react-icons/ai";
import { HiDotsVertical } from "react-icons/hi"
import Link from 'next/link'
import { useWeb3 } from '@3rdweb/hooks'



const style = {
    bannerImageContainer: `h-[20vh] w-screen overflow-hidden flex justify-center items-center`,
    wrapper: `relative`,
    container: `before:content-[''] before:bg-red-500 before:absolute before:top-0 before:left-0 before:right-0 before:bottom-0 before:bg-[url('../assets/4.jpg')] before:bg-cover before:bg-center before:bg-fixed before:opacity-100 before:blur`,

    contentWrapper: `flex relative  flex-wrap items-center`,
    infoContainer: `w-screen px-4`,
    midRow: `w-full flex justify-center text-white`,
    spinner: `w-full h-screen flex justify-center text-white mt-20 p-100 object-center`,
    endRow: `w-full flex justify-end text-white`,
    profileImg: `w-40 h-40 object-cover rounded-full border-2 border-[#202225] mt-[4rem]`,
    socialIconsContainer: `flex text-3xl mb-[-2rem]`,
    socialIconsWrapper: `w-44`,
    socialIconsContent: `flex container justify-between text-[1.4rem] border-2 rounded-lg px-2`,
    socialIcon: `my-2`,
    divider: `border-r-2`,
    title: `text-5xl font-bold mb-4`,
    createdBy: `text-lg mb-4`,
    statsContainer: `w-[44vw] flex justify-between py-4 border border-[#151b22] rounded-xl mb-4`,
    collectionStat: `w-1/4`,
    statValue: `text-3xl font-bold w-full flex items-center justify-center`,
    ethLogo: `h-6 mr-2`,
    statName: `text-lg w-full text-center mt-1`,
    description: `text-[#8a939b] text-xl w-max-1/4 flex-wrap mt-4`,
}

export default function CreatorDashboard() {
    const [nfts, setNfts] = useState([])
    const [sold, setSold] = useState([])
    const [loadingState, setLoadingState] = useState(true)
    const { address, chainId } = useWeb3()
    useEffect(() => {
        loadNFTs()
    }, [address, chainId])
    async function loadNFTs() {
        const web3Modal = new Web3Modal({
            network: "mainnet",
            cacheProvider: true,
        })
        const connection = await web3Modal.connect()
        const provider = new ethers.providers.Web3Provider(connection)
        const signer = provider.getSigner()
        const network = await provider.getNetwork()

        const marketContract = new ethers.Contract(getConfigByChain(network.chainId)[0].nftmarketaddress, Market.abi, signer)
        const tokenContract = new ethers.Contract(getConfigByChain(network.chainId)[0].nftaddress, NFT.abi, provider)
        const data = await marketContract.fetchItemsListed()

        const items = await Promise.all(data.map(async i => {
            const tokenUri = await tokenContract.tokenURI(i.tokenId)
            const meta = await axios.get(tokenUri)
            let price = ethers.utils.formatUnits(i.price.toString(), 'ether')
            let item = {
                price,
                tokenId: i.tokenId.toNumber(),
                seller: i.seller,
                owner: i.owner,
                creator: i.creator,
                sold: i.sold,
                image: meta.data.image,
                name: meta.data.name,
                description: meta.data.description,
            }
            return item
        }))
        /* create a filtered array of items that have been sold */
        const soldItems = items.filter(i => i.sold)
        setSold(soldItems)
        setNfts(items)
        setLoadingState(false)
    }
    return (
        <div className={style.wrapper}>
            <div className={style.container}>
                <div className={style.contentWrapper}>
                    {loadingState === true ? (
                        <div className={style.spinner}>
                            <CircleLoader className={style.spinner} color={'#ffffff'} loading={loadingState} size={150} />
                            Fetching Data From BlockChain...
                            Please Wait...✋🏻
                        </div>
                    ) : (!nfts.length ? (
                        <div className={`${style.spinner} text-5xl font-bold mb-4`}>NO ITEMS HAS BEEN LISTED !!

                        </div>
                    ) : (
                        <div className={`${style.infoContainer} mt-8`}>

                            <div className={style.endRow}>
                                <div className={style.socialIconsContainer}>
                                    <div className={style.socialIconsWrapper}>
                                        <div className={style.socialIconsContent}>
                                            <div className={style.socialIcon}>
                                                <CgWebsite />
                                            </div>
                                            <div className={style.divider} />
                                            <div className={style.socialIcon}>
                                                <AiOutlineInstagram />
                                            </div>
                                            <div className={style.divider} />
                                            <div className={style.socialIcon}>
                                                <AiOutlineTwitter />

                                            </div>
                                            <div className={style.divider} />
                                            <div className={style.socialIcon}>

                                                <HiDotsVertical onClick={() => { window.location.href = "http://google.com"; }} />

                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div className={style.midRow}>
                                <div className={style.title}>My Listings</div>
                            </div>

                        </div>
                    ))}
                    <div className="flex flex-wrap">
                        {nfts.map((nftItem, id) => (
                            <NFTCard key={id} nftItem={nftItem} />
                        ))}

                    </div>
                </div>
            </div></div>
    )
}