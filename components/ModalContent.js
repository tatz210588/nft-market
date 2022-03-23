import React from 'react'
import Web3modal from 'web3modal'
import Router from 'next/router'
import { ethers } from "ethers"
import NFT from "../artifacts/contracts/NFT.sol/NFT.json"
import { nftaddress, nftmarketaddress } from "../config"
import NFTMarket from "../artifacts/contracts/NFTMarket.sol/NFTMarket.json"

const style = {
    wrapper: `relative`,
    container: `before:content-[''] before:bg-red-500 before:absolute before:top-0 before:left-0 before:right-0 before:bottom-0 before:bg-[url('https://lh3.googleusercontent.com/ujepnqpnL0nDQIHsWxlCXzyw4pf01yjz1Jmb4kAQHumJAPrSEj0-e3ABMZlZ1HEpJoqwOcY_kgnuJGzfXbd2Tijri66GXUtfN2MXQA=s250')] before:bg-cover before:bg-center before:opacity-70 before:blur`,
    contentWrapper: `flex h-screen relative justify-center flex-wrap items-center`,
    center: ` h-screen relative justify-center flex-wrap items-center `,
    searchBar: `flex flex-1 mx-[0.8rem] w-max-[520px] items-center bg-[#363840] rounded-[0.8rem] hover:bg-[#757199]`,
    searchInput: `h-[2.6rem] w-full border-0 bg-transparent outline-0 ring-0 px-2 pl-0 text-[#e6e8eb] placeholder:text-[#8a939b]`,
    copyContainer: `w-1/2`,
    title: `relative text-white text-[46px] font-semibold`,
    //midRow: `text-white`,
    midRow: `w-full flex justify-center text-white`,
    description: `text-[#fff] container-[400px] text-2xl mt-[0.8rem] mb-[2.5rem]`,
    ctaContainer: `flex`,
    accentedButton: ` relative text-lg font-semibold px-12 py-4 bg-[#2181e2] rounded-lg mr-5 text-white hover:bg-[#42a0ff] cursor-pointer`,
    button: ` relative text-lg font-semibold px-12 py-4 bg-[#363840] rounded-lg mr-5 text-[#e4e8ea] hover:bg-[#4c505c] cursor-pointer`,
    nftButton: `font-bold w-full mt-4 bg-pink-500 text-white text-lg rounded p-4 shadow-lg hover:bg-[#19a857] cursor-pointer`,

}

const ModalContent = ({ nftItem, field1, field2, field3 }) => {


    return (
        <>
            <div className={`${style.title} w-full flex justify-center text-white`}>
                Enter Your Details
            </div>

            <div className={`${style.searchBar} mt-2 p-1`}>
                <input className={style.searchInput}
                    placeholder='Name'
                //onChange={e => updateFormInput({ ...formInput, name: e.target.value })}
                />
            </div>
            <div className={`${style.searchBar} mt-2 p-6`}>
                <textarea className={style.searchInput}
                    placeholder="Email"
                //onChange={e => updateFormInput({ ...formInput, description: e.target.value })}
                />
            </div>
            <div className={`${style.searchBar} mt-2 p-1`}>
                <input className={style.searchInput}
                    placeholder="Phone"
                // onChange={e => updateFormInput({ ...formInput, price: e.target.value })}
                />
            </div>

        </>

    )
}

export default ModalContent
