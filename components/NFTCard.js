import React, { useEffect, useState } from 'react'
import Web3modal from 'web3modal'
import Router from 'next/router'
import { ethers } from "ethers"
import NFT from "../artifacts/contracts/NFT.sol/NFT.json"
import { getConfigByChain } from "../config"
import NFTMarket from "../artifacts/contracts/NFTMarket.sol/NFTMarket.json"
import Modal from 'react-modal'
import { ellipseAddress, ellipseAddressDetails, ellipseName, createUrltoken, createUrlAddress } from './utils'
import Web3Modal from 'web3modal'
import { useRouter } from "next/router";
import { useWeb3 } from "@3rdweb/hooks";
import axios from 'axios'

const modalStyle = {
    position: 'fixed',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%,-50%)',
    padding: '50px',
    zIndex: 1000,
    width: '50px'
}
const style = {
    wrapper: `bg-[#f4f4f6]  w-[20rem] h-[30rem] my-10 mx-5 rounded-2xl overflow-hidden `,
    modalWrapper: `bg-[#303339]  w-1/2 h-2/3 mr-auto ml-auto my-28 rounded-2xl p-2 overflow-hidden  relative`,
    modalListWrapper: `bg-[#303339]  w-1/3 h-1/2 mr-auto ml-auto my-28 rounded-2xl p-2 overflow-hidden  relative overflow-auto`,
    imgContainer: `h-2/3 w-full overflow-hidden flex justify-center items-center`,
    nftImg: `w-full object-cover`,
    details: `p-3`,
    info: `flex justify-between text-[#e4e8eb] drop-shadow-xl`,
    infoLeft: `flex-0.6 flex-wrap`,
    collectionName: `font-semibold text-sm text-[#8a939b]`,
    title: `relative text-white`,
    assetName: `font-bold text-lg mt-2 text-[#565759]`,
    infoRight: `flex-0.4 text-right`,
    priceTag: `font-semibold text-sm text-[#8a939b]`,
    priceValue: `flex items-center text-xl font-bold mt-2`,
    ethLogo: `h-5 mr-2`,
    likes: `text-[#8a939b] font-bold flex items-center w-full justify-end mt-3`,
    likeIcon: `text-xl mr-2`,
    nftButton: `font-bold w-full bg-pink-500 text-white text-lg rounded shadow-lg hover:bg-[#19a857] cursor-pointer`,
    searchBar: `flex flex-1 mx-[0.8rem] w-max-[520px] items-center bg-[#363840] rounded-[0.8rem] hover:bg-[#757199]`,
    searchInput: `h-[2.6rem] w-full border-0 bg-transparent outline-0 ring-0 px-2 pl-0 text-[#e6e8eb] placeholder:text-[#8a939b]`,

}

//Modal.setAppElement("#div")
const NFTCard = ({ nftItem }) => {

    const [modalisOpen, setmodalisOpen] = useState(false)
    const [modalListOpen, setModalListOpen] = useState(false)
    const [modalEditPrice, setModalEditPrice] = useState(false)
    const [loadingState, setLoadingState] = useState(false)
    const [formInput, updateFormInput] = useState({ price: '', destination: '' })
    const [formInputUserData, setformInputUserData] = useState({ name: '', email: '', phone: '' })
    const router = useRouter();
    const [modalDetails, setModalDetails] = useState(false);
    const [modalTransfer, setModalTransfer] = useState(false);
    const { address, chainId, getNetworkMetadata } = useWeb3();
    const nftaddress = getConfigByChain(chainId)[0].nftaddress

    console.log("useWeb3", getNetworkMetadata(chainId).chainName)

    async function buyNFT(nftItem) {

        if (formInputUserData.name === '' || formInputUserData.email === '' || formInputUserData.phone === '') {
            alert("Please fill your details first !!");
        } else {
            const web3modal = new Web3modal()
            const connection = await web3modal.connect()
            const provider = new ethers.providers.Web3Provider(connection)
            const signer = provider.getSigner()
            const network = await provider.getNetwork()

            /*const form = document.getElementById('my-form');
            form.addEventListener("submit", function (e) {
                console.log("hhh");
                e.preventDefault();
                const data = new FormData(form);
                const action = e.target.action;
                fetch(action, {
                    method: 'POST',
                    body: data,
                })
                    .then(() => {
                        alert("Success!");
                    })
            });*/

            const datas = {
                Name: formInputUserData.name,
                Email: formInputUserData.email,
                Ph: formInputUserData.phone,
                WalletAddress: address,
                Price: nftItem.price,
                Network: network.name,
                ChainID: network.chainId,
                NFTAddress: `${nftaddress}/${nftItem.tokenId}`,
                IPFS_Link: nftItem.image,
            }
            //https://api.sheetmonkey.io/form/vsjT2nG9o5JcB8FJP13hLr
            //https://sheet.best/api/sheets/8b0cd1d3-410e-48e6-b9a9-5f9430d905a4

            axios.post('https://api.sheetmonkey.io/form/vsjT2nG9o5JcB8FJP13hLr', datas).then((response) => {
                console.log(response);
            })


            const marketContract = new ethers.Contract(getConfigByChain(network.chainId)[0].nftmarketaddress, NFTMarket.abi, signer)
            const price = ethers.utils.parseUnits(nftItem.price.toString(), 'ether')
            console.log("price", nftItem.price)
            const transaction = await marketContract.createMarketSale(getConfigByChain(network.chainId)[0].nftaddress, nftItem.tokenId, { value: price })
            await transaction.wait()
            Router.push({ pathname: "/my-assets" })
        }
    }

    async function transferItem(nftItem) {
        const web3modal = new Web3Modal()
        const connection = await web3modal.connect()
        const provider = new ethers.providers.Web3Provider(connection)
        const signer = provider.getSigner()
        const network = await provider.getNetwork()

        const destination = formInput.destination
        let contract = new ethers.Contract(getConfigByChain(network.chainId)[0].nftmarketaddress, NFTMarket.abi, signer)
        let listingPrice = 0
        listingPrice = listingPrice.toString()
        const transactionListItem = await contract.transferItem(
            getConfigByChain(network.chainId)[0].nftaddress, nftItem.tokenId, destination
        )
        await transactionListItem.wait()
        router.push('/')
    }

    async function relistItem(nftItem) {
        const web3modal = new Web3Modal()
        const connection = await web3modal.connect()
        const provider = new ethers.providers.Web3Provider(connection)
        const signer = provider.getSigner()
        const network = await provider.getNetwork()


        const price = ethers.utils.parseUnits(formInput.price, 'ether')
        let contract = new ethers.Contract(getConfigByChain(network.chainId)[0].nftmarketaddress, NFTMarket.abi, signer)
        let listingPrice = await contract.getListingPrice()
        console.log(listingPrice)
        listingPrice = listingPrice.toString()
        const transactionListItem = await contract.listMarketItem(
            getConfigByChain(network.chainId)[0].nftaddress, nftItem.tokenId, price, { value: listingPrice }
        )
        await transactionListItem.wait()
        router.push('/explorer')
    }


    return (
        <div id="div" className={style.wrapper} >
            <Modal isOpen={modalTransfer} className={style.modalListWrapper}>
                <button className={` w-full flex justify-end text-white hover:text-[#fc1303]`} onClick={() => setModalTransfer(false)}>Close ❌</button>
                <div className={style.title}>
                    <br />
                    <p>Disclaimer:</p>
                    <p>Make sure to put exact Wallet Address in the box below.</p>
                    <p>Items sent to incorrect address will be lost and the</p>
                    <p>market place shall not be liable for this loss. </p>
                    <p></p>
                    <p></p><br />
                </div>

                <div className={`${style.searchBar} mt-2 p-1`}>
                    <input className={style.searchInput}
                        placeholder="Enter Destination Wallet Address"
                        onChange={e => updateFormInput({ ...formInput, destination: e.target.value })}
                    />
                </div>
                <button
                    className={style.nftButton}
                    onClick={() => transferItem(nftItem)}>Transfer
                </button>
            </Modal>
            <Modal isOpen={modalDetails} className={style.modalListWrapper}>
                <button className={` w-full flex justify-end text-white hover:text-[#fc1303]`} onClick={() => setModalDetails(false)}>Close ❌</button>
                <div className={`${style.title} w-full flex mt-8 text-white font-bold`}>
                    Seller:
                    <div className={`font-semibold text-sm ml-3 mt-0.5 text-[#8a939b]`}>
                        <u><a title='View On Blockchain Explorer' target='_blank' rel="noreferrer" href={createUrlAddress(nftItem.seller, chainId)}
                        >{ellipseAddressDetails(nftItem.seller)}       📝</a></u>
                    </div>
                </div>
                <div className={`${style.title} w-full flex mt-8 text-white font-bold`}>
                    Owner:
                    <div className={`font-semibold text-sm ml-3 mt-0.5 text-[#8a939b]`}>
                        <u><a title='View On Blockchain Explorer' target='_blank' rel="noreferrer" href={createUrlAddress(nftItem.owner, chainId)}>
                            {ellipseAddressDetails(nftItem.owner) === '0x000000000...00000000000' ? "Listed for sale(No Owner)" : ellipseAddressDetails(nftItem.owner)}       📝
                        </a></u>
                    </div>
                </div>
                <div className={`${style.title} w-full flex mt-8 text-white font-bold`}>
                    Creator:
                    <div className={`font-semibold text-sm ml-3 mt-0.5 text-[#8a939b]`}>
                        <u><a title='View On Blockchain Explorer' target="_blank" rel="noreferrer" href={createUrlAddress(nftItem.creator, chainId)}>{ellipseAddressDetails(nftItem.creator)}       📝</a></u>
                    </div>
                </div>
                <div className={`${style.title} w-full flex mt-8 text-white font-bold`}

                >
                    NFT Contract address:
                    <div className={`font-semibold text-sm ml-3 mt-0.5 text-[#8a939b]`}>
                        <u><a title='View On Blockchain Explorer' target="_blank" rel="noreferrer" href={createUrltoken(nftaddress, chainId)}>{ellipseAddressDetails(nftaddress)}       📝</a></u>
                    </div>
                </div>
                <div className={`${style.title} w-full flex mt-8 text-white font-bold`}>
                    Token ID:
                    <div className={`font-semibold text-sm ml-3 mt-0.5 text-[#8a939b]`}>
                        <u>{nftItem.tokenId}</u>
                    </div>
                </div>
            </Modal >

            <Modal isOpen={modalisOpen} className={style.modalWrapper}>
                <button className={` w-full flex justify-end text-white hover:text-[#fc1303]`} onClick={() => setmodalisOpen(false)}>Close ❌</button>
                <div className={`${style.title} w-full flex justify-center text-white font-bold`}>
                    Enter Your Details
                </div>
                {/*<form id="my-form" method='POST' action="https://api.sheetmonkey.io/form/vsjT2nG9o5JcB8FJP13hLr">*/}
                <div className={`${style.searchBar} mt-8 p-1`}>
                    <input className={style.searchInput} type="text" name='Name'
                        placeholder='Name' required
                        onChange={e => setformInputUserData({ ...formInputUserData, name: e.target.value })}
                    />
                </div>
                <div className={`${style.searchBar} mt-8 p-1`}>
                    <input className={style.searchInput} type="email" name='Email'
                        placeholder="Email" required
                        onChange={e => setformInputUserData({ ...formInputUserData, email: e.target.value })}
                    />
                </div>
                <div className={`${style.searchBar} mt-8 p-1`}>
                    <input className={style.searchInput} type="number" name='Ph'
                        placeholder="Phone" required
                        onChange={e => setformInputUserData({ ...formInputUserData, phone: e.target.value })}
                    />

                </div>
                <div className='invisible ...'>
                    <input name='WalletAddress' value={address} readOnly />
                    <input name='Price' value={nftItem.price} readOnly />
                    <input name='Network' value={getNetworkMetadata(chainId).chainName} readOnly />
                    <input name='ChainID' value={chainId} readOnly />
                    <input name='NFTAddress' value={`${nftaddress}/${nftItem.tokenId}`} readOnly />
                    <input name='IPFS_Link' value={nftItem.image} readOnly />
                </div>

                <button type="submit"
                    className={style.nftButton}
                    onClick={() => buyNFT(nftItem)}>OWN THIS NFT NOW for {nftItem.price} {getConfigByChain(chainId)[0].alt} !!
                </button>
                {/*</form>*/}
            </Modal>
            <Modal isOpen={modalEditPrice} className={style.modalWrapper}>
                <button className={` w-full flex justify-end text-white hover:text-[#fc1303]`} onClick={() => setModalEditPrice(false)}>Close ❌</button>
                <div className={`${style.title} w-full flex justify-center font-bold text-white`}>
                    Enter The Following Details:
                </div>

                <div className={`${style.searchBar} mt-2 p-1`}>
                    <input className={style.searchInput}
                        placeholder="Price"
                        onChange={e => updateFormInput({ ...formInput, price: e.target.value })}
                    />
                </div>
                <button
                    className={style.nftButton}
                    onClick={() => relistItem(nftItem)}>List Item</button>
            </Modal>
            <Modal isOpen={modalListOpen} className={style.modalListWrapper}>
                <button className={` w-full flex justify-end text-white hover:text-[#fc1303]`} onClick={() => setModalListOpen(false)}>Close ❌</button>
                <div className={style.title}>
                    <br />
                    <p>Disclaimer:</p>
                    <p>Are you sure you want to list this on the Marketplace for sale?</p>
                    <p>Items once listed on this marketplace cannot be delisted and shall</p>
                    <p>remain listed on the marketplace unless the item is purchased. </p>
                    <p></p>
                    <p></p><br />
                    <p><b><i>Do you still wish to continue?</i></b></p>
                </div>
                <div className='p-4 p-1 mr-16 grid grid-cols-2 gap-4'>
                    <button className={style.nftButton} onClick={() => {
                        setModalListOpen(false)
                        setModalEditPrice(true)
                    }}>Yes</button>
                    <button className={style.nftButton} onClick={() => setModalListOpen(false)}>No</button>
                </div>
            </Modal>

            <div className={style.imgContainer}>
                <img src={nftItem.image} alt={nftItem.name} className={style.nftImg} />
            </div>
            <div className={style.details}>
                <div className={style.info}>
                    <div className={style.infoLeft}>
                        <div className={style.assetName}>Name: {ellipseName(nftItem.name)}</div>
                        <div className={style.collectionName}> {ellipseAddress(nftItem.description)} </div>
                        <div className={`${style.collectionName} cursor-pointer`} onClick={() => { setModalDetails(true) }}> <u>Details</u> </div>


                    </div>

                    <div className={style.infoRight}>
                        <div className={style.priceTag}>Price</div>
                        <div className={style.priceValue}>
                            <img alt={getConfigByChain(chainId)[0].alt} className={style.ethLogo} src={getConfigByChain(chainId)[0].token_icon} />
                            {nftItem.price}
                        </div>
                    </div>

                </div>
                {window.location.pathname === '/explorer' ? (
                    <div className="p-4 bg-black mt-4 p-1">
                        <button className="w-full bg-pink-500 text-white font-bold  py-2 px-12 rounded" onClick={() => setmodalisOpen(true)}>BUY</button>
                    </div>
                ) : (window.location.pathname === '/my-assets' ? (
                    <div className=' mt-4 grid grid-cols-2 gap-6'>
                        <button className="w-full bg-pink-500 text-white font-bold  p-2 rounded" onClick={() => setModalListOpen(true)}>Sell</button>
                        <button className="w-full bg-pink-500 text-white font-bold p-2 rounded" onClick={() => setModalTransfer(true)} >Transfer</button>
                    </div>
                ) : (
                    Boolean(nftItem.sold) && (
                        <div className="p-4 bg-black mt-4 p-1">
                            <button className="w-full bg-green-500 text-white font-bold  py-2 px-12 rounded">Item Sold</button>
                        </div>
                    )
                )
                )}

            </div>
        </div >
    )
}

export default NFTCard
