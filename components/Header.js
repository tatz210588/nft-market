import React from "react";
import Image from "next/image";
import logo from "../assets/logo.png"
import Link from "next/link";
import { AiOutlineSearch } from "react-icons/ai"
import { CgProfile } from "react-icons/cg"
import { MdOutlineAccountBalanceWallet } from 'react-icons/md'
import { ConnectWallet } from "@3rdweb/react";
import { Fragment } from 'react'
import { Popover, Transition } from '@headlessui/react'
import {
    BookmarkAltIcon,
    CalendarIcon,
    ChartBarIcon,
    CursorClickIcon,
    MenuIcon,
    PhoneIcon,
    PlayIcon,
    ClipboardIcon,
    RefreshIcon,
    IdentificationIcon,
    ShieldCheckIcon,
    SupportIcon,
    ViewGridIcon,
    TagIcon,
    XIcon,
} from '@heroicons/react/outline'
import { ChevronDownIcon } from '@heroicons/react/solid'
//import { styles } from "react-native-circular-progress-indicator/src/circularProgressWithChild";

const solutions = [
    {
        name: 'My Collections',
        description: 'Find all the NFTs owned by me.',
        href: '/my-assets',
        icon: CalendarIcon,
    },
    {
        name: 'My Listings',
        description: 'A collection of all the NFTs put for sale by me',
        href: '/creator-dashboard',
        icon: ClipboardIcon,
    },
    {
        name: 'My Creations',
        description: "Find a wide list of NFTs created by me.",
        href: '/my-creations',
        icon: BookmarkAltIcon
    },
    {
        name: 'Validate Ownership',
        description: "Validate the ownership in a blockchain for ERC20 token/NFT.",
        href: '/verify-owner',
        icon: ViewGridIcon,
    },
]


const style = {
    wrapper: `bg-[#E6CF7C] w-screen px-[1.2rem] py-[0.8rem] flex `,
    logoContainer: `flex items-center cursor-pointer`,
    logoText: ` ml-[0.8rem] text-black font-semibold text-2xl`,
    searchBar: `flex flex-1 mx-[0.8rem] w-max-[520px] items-center bg-[#363840] rounded-[0.8rem] hover:bg-[#757199]`,
    searchIcon: `text-[#8a939b] mx-3 font-bold text-lg`,
    searchInput: `h-[2.6rem] w-full border-0 bg-transparent outline-0 ring-0 px-2 pl-0 text-[#e6e8eb] placeholder:text-[#8a939b]`,
    headerItems: ` flex items-center justify-end`,
    headerItem: `text-white px-4 font-bold text-[#000000] hover:text-[#81817c] cursor-pointer`,
    headerIcon: `text-[#8a939b] text-3xl font-black px-4 hover:text-white cursor-pointer focus:outline-none focus:border-white`,
}

const Header = () => {
    const [openMenu, setOpenMenu] = React.useState(false);
    const handleBtnClick = () => {
        setOpenMenu(!openMenu);
    };
    const closeMenu = () => {
        setOpenMenu(false);
    };

    return <div className={style.wrapper}>
        <Link href='/'>
            <div className={style.logoContainer}>
                <Image src={logo} height={40} width={40} />
                <div className={style.logoText}>LoloNFT</div>
            </div>
        </Link>
        <div className={style.searchBar}>
            <div className={style.searchIcon}>
                <AiOutlineSearch />
            </div>
            <input className={style.searchInput}
                placeholder='Search items, collections and accounts' />
        </div>
        <div className={style.headerItems}>
            <Link href='/'>
                <div className={style.headerItem}>Home</div>
            </Link>
            <Link href='/explorer'>
                <div className={style.headerItem}>Explore</div>
            </Link>
            <Link href='/create-item'>
                <div className={style.headerItem}>Create</div>
            </Link>
            <Popover.Group as="nav" className={style.headerIcon}>
                <Popover className="relative">
                    {({ open }) => (
                        <>
                            <Popover.Button><span><CgProfile /></span></Popover.Button>
                            <Transition
                                as={Fragment}
                                enter="transition ease-out duration-200"
                                enterFrom="opacity-0 translate-y-1"
                                enterTo="opacity-100 translate-y-0"
                                leave="transition ease-in duration-150"
                                leaveFrom="opacity-100 translate-y-0"
                                leaveTo="opacity-0 translate-y-1"
                            >
                                <Popover.Panel className="absolute z-10 -ml-4 mt-3 transform px-2 w-screen max-w-md sm:px-0 lg:ml-0 lg:left-1/2 lg:-translate-x-1/2">
                                    <div className="rounded-lg shadow-lg ring-1 ring-black ring-opacity-5 overflow-hidden">
                                        <div className="relative grid gap-6 bg-[#dfe8f7] px-5 py-6 sm:gap-8 sm:p-8">
                                            {solutions.map((item) => (
                                                <Link href={item.href}>
                                                    <div className="-m-3 p-3 flex items-start rounded-lg hover:bg-[#b6f7fc]">
                                                        <item.icon className="flex-shrink-0 h-6 w-6 text-indigo-600" aria-hidden="true" />
                                                        <div className="ml-4">
                                                            <p className="text-base font-medium text-gray-900">{item.name}</p>
                                                            <p className="mt-1 text-sm text-gray-500">{item.description}</p>
                                                        </div>
                                                    </div>
                                                </Link>
                                            ))}
                                        </div>

                                    </div>
                                </Popover.Panel>
                            </Transition>
                        </>
                    )}
                </Popover>
            </Popover.Group>
            <ConnectWallet />
        </div>
    </div>
}

export default Header