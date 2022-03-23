import React from 'react'
import Router from 'next/router'
import Particle from "../components/Particle"

const style = {
    wrapper: `relative`,
    container: `before:content-[''] before:bg-red-500 before:absolute before:top-0 before:left-0 before:right-0 before:bottom-0 before:bg-[url('https://lh3.googleusercontent.com/ujepnqpnL0nDQIHsWxlCXzyw4pf01yjz1Jmb4kAQHumJAPrSEj0-e3ABMZlZ1HEpJoqwOcY_kgnuJGzfXbd2Tijri66GXUtfN2MXQA=s250')] before:bg-cover before:bg-center before:opacity-100 before:blur`,
    contentWrapper: `flex h-screen relative justify-center flex-wrap items-center`,
    copyContainer: `w-1/2`,
    title: `relative text-white text-[46px] font-semibold`,
    description: `text-[#8a939b] container-[400px] text-2xl mt-[0.8rem] mb-[2.5rem]`,
    ctaContainer: `flex`,
    accentedButton: ` relative text-lg font-semibold px-12 py-4 bg-[#2181e2] rounded-lg mr-5 text-white hover:bg-[#42a0ff] cursor-pointer`,
    button: ` relative text-lg font-semibold px-12 py-4 bg-[#363840] rounded-lg mr-5 text-[#e4e8ea] hover:bg-[#4c505c] cursor-pointer`,
    cardContainer: `rounded-[7rem]`,
    infoContainer: `h-20 bg-[#313338] p-4 rounded-b-lg flex items-center text-white`,
    author: `flex flex-col justify-center ml-4`,
    name: ``,
    infoIcon: `flex justify-end items-center flex-1 text-[#8a939b] text-3xl font-bold`,
}



const Hero = () => {

    return (
        <div className={style.wrapper}>

            <div className={style.container}>
                <div className={style.contentWrapper}>
                    <div className={style.copyContainer}>
                        <div className={style.title}>
                            Discover, collect and sell extraordinary NFTs
                        </div>
                        <div className={style.description}>
                            LoloNFT is the world&apos;s largest NFT Marketplace...
                        </div>
                        <div className={style.ctaContainer}>
                            <button className={style.accentedButton} onClick={() => {
                                Router.push({
                                    pathname: '/explorer'
                                })
                            }}>Explore</button>

                            <button className={style.button} onClick={() => { Router.push({ pathname: '/create-item' }) }}>Create</button>
                        </div>
                    </div>
                    <div className={style.cardContainer}>
                        <img
                            className="rounded-t-lg"
                            alt=""
                            src='https://lh3.googleusercontent.com/_CPbgpsd83rf2U-UFMDhTGAwbRgJYUg-6N6TwqVOeIkPfZhfts8WjTBbKqPLYVOaqUOR2GUUcjwy8YD1pA53qpJtzypLaAoe6wiZ0A=s550'
                        />
                        <div className={style.infoContainer}>
                            <img
                                className="h-[2.5rem] rounded-full"
                                src='https://lh3.googleusercontent.com/hKfUfZcOpvGfsNz4p6Pu9b2ckD4MRFcL-XbwPuZ2PwtOynFloE85nekShDqAZcN0JCFBAXPX_royc9Lx1k_gAJJmqJLyoPhnvjWi4g=s80'
                                alt=""
                            />
                            <div className={style.author}>
                                <div className={style.name}>Tatz</div>
                                <a className="text-[#1868b7]"
                                    href="https://opensea.io/assets/0x495f947276749ce646f68ac8c248420045cb7b5e/43617070992181872498657409852160512582181349889597339264956620564284712157185">
                                    Tathagat
                                </a>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default Hero
