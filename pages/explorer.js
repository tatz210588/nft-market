import React, { useEffect, useMemo, useState } from "react";
import Link from 'next/link';
import NFTCard from "../components/NFTCard";
import { CgWebsite } from "react-icons/cg";
import { AiOutlineInstagram, AiOutlineTwitter } from "react-icons/ai";
import { HiDotsVertical } from "react-icons/hi"
import { getConfigByChain } from "../config"
import NFT from "../artifacts/contracts/NFT.sol/NFT.json"
import NFTMarket from "../artifacts/contracts/NFTMarket.sol/NFTMarket.json"
import { ethers } from "ethers"
import axios from "axios";
import { css } from "@emotion/react";
import CircleLoader from "react-spinners/CircleLoader"
import { useWeb3 } from "@3rdweb/hooks";
import Web3Modal from "web3modal"





const style = {
    bannerImageContainer: `h-[30vh] w-screen overflow-hidden flex justify-center items-center`,
    bannerImage: `w-full object-cover`,
    wrapper: `relative`,
    container: `before:content-[''] before:bg-red-500 before:absolute before:top-0 before:left-0 before:right-0 before:bottom-0 before:bg-[url('https://lh3.googleusercontent.com/ujepnqpnL0nDQIHsWxlCXzyw4pf01yjz1Jmb4kAQHumJAPrSEj0-e3ABMZlZ1HEpJoqwOcY_kgnuJGzfXbd2Tijri66GXUtfN2MXQA=s250')] before:bg-cover before:bg-center before:bg-fixed before:opacity-100 before:blur`,
    contentWrapper: `flex relative flex-wrap items-center`,
    infoContainer: `w-screen px-4`,
    midRow: `w-full flex justify-center text-white`,
    endRow: `w-full flex justify-end text-white`,
    profileImg: `w-40 h-40 object-cover rounded-full border-2 border-[#202225] mt-[-6rem]`,
    socialIconsContainer: `flex text-3xl mb-[-2rem]`,
    socialIconsWrapper: `w-44 mt-[1rem]`,
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
    spinner: `w-full h-screen flex justify-center text-white mt-20 p-100 object-center`,
}
const override = css`
  margin: 0 auto;
  border-color: white;
`;

const Explorer = () => {

    const [nfts, setNfts] = useState([])
    const [loadingState, setLoadingState] = useState(true)
    const { chainId, getNetworkMetadata } = useWeb3()
    console.log("useWeb3", getNetworkMetadata(chainId).chainName)

    useEffect(() => {
        console.log("loadingState", loadingState)
        loadNFTs()
    }, [chainId])

    async function loadNFTs() {
        const web3Modal = new Web3Modal({
            network: "mainnet",
            cacheProvider: true,
        })
        const connection = await web3Modal.connect()
        const provider = new ethers.providers.Web3Provider(connection)
        //const provider = new ethers.providers.JsonRpcProvider("https://rpc-mumbai.matic.today")
        const network = await provider.getNetwork()
        const tokenContract = new ethers.Contract(getConfigByChain(network.chainId)[0].nftaddress, NFT.abi, provider)
        const marketContract = new ethers.Contract(getConfigByChain(network.chainId)[0].nftmarketaddress, NFTMarket.abi, provider)
        const data = await marketContract.fetchMarketItems()

        const items = await Promise.all(data.map(async i => {
            const tokenUri = await tokenContract.tokenURI(i.tokenId)
            const meta = await axios.get(tokenUri)
            console.log(meta)
            console.log(tokenContract.address)
            let price = ethers.utils.formatUnits(i.price.toString(), 'ether')
            let item = {
                price,
                itemid: i.itemId.toNumber(),
                tokenId: i.tokenId.toNumber(),
                seller: i.seller,
                owner: i.owner,
                creator: i.creator,
                image: meta.data.image,
                name: meta.data.name,
                description: meta.data.description,
            }
            return item
        }))

        setNfts(items)
        setLoadingState(false)
        console.log("loadingState", loadingState)
    }


    return (
        <div className={style.wrapper}>
            <div className={style.container}>
                <div className={style.contentWrapper}>
                    {loadingState === true ? (
                        <div className={style.spinner}>
                            <CircleLoader className={style.spinner} color={'#ffffff'} loading={loadingState} size={150} />
                            <p><b>Fetching Data From BlockChain...</b></p>
                            <p><b>Please Wait...✋🏻</b></p>
                        </div>
                    ) : (!nfts.length ? (
                        <div className={`${style.spinner} text-5xl font-bold mb-4`}>No Item to sell !!

                        </div>
                    ) : (

                        <div className='overflow-hidden'>

                            <section className={style.bannerImageContainer}>
                                <img alt="banner" className={style.bannerImage} src={'https://lh3.googleusercontent.com/8_Xzpa7uYGUPn3JIue2JFOswcFACipW-7UR-4CqoNudCCetuf0c6stLFO0AL35_tWwxzJ3KI_ryHmaoJHz4fmnhyqEtrhEM0cu1BUSCyw-gnZCke1qNkRmgdCCAiAdSuU2v4DMj6qaPDB1iFigwgza4OkGlG72q-Vq6Lkem7O50j03U6MiUz4Gk7CWNF0LxGEjuuG7AP26SkVUrEb08wL_buX6SA62tDesO0kI_OVwC3H-R3nXrMFSeVHE98mRyYBzSF3o-rLUJe7wQ4ijzEV5ArCqYhDaSTVmfcEaJJdm-VPm2VX19CWcHXCxnFPXoJ7m8Gn09StXpqih0c966dN6X72L3rLK_-3XnNcQCLpbLvZ-y9Er4266Rj1ZDlpNu0jbClaMMdFv_ckcoVGqZJ7aIAhiERchNiuKV3TZUk8Ix-oj5Z1S1Scb3_BHGOZHJn-pgvnoXRbReIvjvpibZP2zzfkQ3GmbFre4OL-cjoz-c7mkmcNndmOID7o5kwZ8pk_uquFC_QMHxasLtmmS6Y2MILh3ehZH1MED0VZ8nJ-rZ4ak50aZHZp2fDG08vP5P9sGpSI0veFlLhcMmMXTWEjCeBPBhGrJ1DfA4wuzHJ9Ev22ytT8p1Hh5OY6LqFt7VPSDB2WIsBPB47DHblP6xddf73qS9JuQhOJdHx6zTm-lIk3kGXwd7xlw68JQMPjIeU0avH69pbRjBiDMm5sG0PJQA9HICFWyf3_4hjhwq3ILBVv1NpOSp4ZVjzhm_vocnpz8_zfyHfq6G-QfsvWyz9070M89IIxIaz-rcjo4Xp_a-C0omPNR9aHhCbRVFgUbibdkTE=w1548-h903-no?authuser=0'} />
                                {/*<div><Particle /></div>*/}
                            </section>

                            <section className={`${style.infoContainer} mt-8`}>
                                <div className={style.midRow}>
                                    <img alt="profile image" className={style.profileImg} src={'https://lh3.googleusercontent.com/ujepnqpnL0nDQIHsWxlCXzyw4pf01yjz1Jmb4kAQHumJAPrSEj0-e3ABMZlZ1HEpJoqwOcY_kgnuJGzfXbd2Tijri66GXUtfN2MXQA=s250'} />
                                </div>

                                <div className={style.midRow}>
                                    <div className={style.title}>Choose from Our Wide Range of Original Collections</div>
                                </div>
                            </section>
                        </div>))}
                    <div className="flex flex-wrap">
                        {nfts.map((nftItem, id) => (
                            <NFTCard key={id} nftItem={nftItem} />
                        ))}

                    </div>
                </div>
            </div></div>
    )
}

export default Explorer
