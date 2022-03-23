import React, { useState, useEffect } from 'react'
import Router from 'next/router'
import { getTokenByChain } from "../assets/tokenConfig"
import { getConfigByChain } from '../config';
import { useWeb3 } from "@3rdweb/hooks";
import NFT from "../artifacts/contracts/NFT.sol/NFT.json"
import Web3Modal from "web3modal"
import { ethers } from 'ethers'
import BigNumber from "bignumber.js";
import { ellipseAddress } from '../components/utils';
import BeatLoader from "react-spinners/BeatLoader";


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
    accentedButton: ` relative text-lg font-semibold px-12 py-4 bg-[#2181e2] rounded-lg mr-5 text-white hover:bg-[#42a0ff] cursor-pointer`,
    button: ` relative text-lg font-semibold px-12 py-4 bg-[#363840] rounded-lg mr-5 text-[#e4e8ea] hover:bg-[#4c505c] cursor-pointer`,
    nftButton: `font-bold w-full mt-4 bg-pink-500 text-white text-lg rounded p-4 shadow-lg hover:bg-[#19a857] cursor-pointer`,
    dropDown: `font-bold w-full mt-4 bg-[#2181e2] text-white text-lg rounded p-4 shadow-lg cursor-pointer`,

}



const verifyOwner = () => {

    const { address, chainId } = useWeb3();
    //const chainName = getNetworkMetadata(chainId).chainName;
    //const chainId = "80001"
    const [balance, setBalance] = useState(0);
    const [formInput, updateFormInput] = useState({ destination: '' })
    const [wallet, setWallet] = useState('');
    const [selectedToken, setSelectedToken] = useState(getTokenByChain(chainId)[0])
    const [loadingState, setLoadingState] = useState(false)
    const [circle, setCircle] = useState(false)

    useEffect(() => {
        const web3Modal = new Web3Modal({
            network: "mainnet",
            cacheProvider: true,
        })
        const connection = await web3Modal.connect()
        const provider = new ethers.providers.Web3Provider(connection)
    },

        async function loadNFTBalance() {
            setLoadingState(false)
            const web3Modal = new Web3Modal({
                network: "mainnet",
                cacheProvider: true,
            })
            const connection = await web3Modal.connect()
            const provider = new ethers.providers.Web3Provider(connection)

            if (selectedToken.address != "0x000" && formInput.destination != '') {
                setCircle(true)
                const tokenContract = new ethers.Contract(selectedToken.address, NFT.abi, provider)
                let data;
                if (formInput.destination === "this") {
                    data = await tokenContract.balanceOf(address)
                } else {
                    setWallet(formInput.destination)
                    data = await tokenContract.balanceOf(formInput.destination)
                }
                const pow = new BigNumber('10').pow(new BigNumber(selectedToken.decimal))
                setBalance(web3BNToFloatString(data, pow, 0, BigNumber.ROUND_DOWN))
                setCircle(false)
                setLoadingState(true)
            } else {
                alert("Enter Valid details please!!")
            }

        }
    function web3BNToFloatString(
            bn,
            divideBy,
            decimals,
            roundingMode = BigNumber.ROUND_DOWN
        ) {
            const converted = new BigNumber(bn.toString())
            const divided = converted.div(divideBy)
            return divided.toFixed(decimals, roundingMode)
        }

    return (
        <div>

            <div className={style.wrapper}>
                <div className={style.container}>
                    <div className={style.contentWrapper}>

                        <div className={style.copyContainer}>
                            <div className={`${style.title} mt-1 p-1`}>
                                Verify Ownership of ERC20 Token or NFT !!
                            </div>

                            <div className={`mt-2 p-1`}>
                                <select className={style.dropDown} onChange={(e) => {
                                    setSelectedToken(getTokenByChain(chainId)[e.target.value])
                                    setLoadingState(false)
                                }}>
                                    {getTokenByChain(chainId).map((token, index) => (
                                        <option value={index} key={token.address}>{token.name}</option>
                                    ))}
                                </select>
                            </div>
                            <div className={`${style.searchBar} mt-2 p-1`}>
                                <input className={style.searchInput}
                                    placeholder='Enter Wallet Address'
                                    onChange={e => {
                                        updateFormInput({ ...formInput, destination: e.target.value })
                                        setLoadingState(false)
                                    }}
                                />
                            </div>



                            {circle === true ? (
                                <div className={style.midRow}>
                                    <BeatLoader className={style.midRow} color={'#ffffff'} loading={circle} size={15} />
                                    Verifying ownership on blockchain
                                </div>
                            ) : (
                                <div>
                                    {

                                        <div >

                                            <button onClick={() => { loadNFTBalance() }} className={style.nftButton}>Verify Ownership Now</button>
                                        </div>

                                    }

                                </div>
                            )}
                            {loadingState === true && (
                                <div className={`${style.description} mt-4 p-1`}>
                                    {formInput.destination === "this" ? ellipseAddress(address) : ellipseAddress(wallet)} is the proud owner of {balance} nos  {selectedToken.name}
                                </div>
                            )}

                        </div>

                    </div>
                </div>
            </div>
        </div >
    )



}

export default verifyOwner
