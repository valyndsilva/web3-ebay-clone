# Web3 - Ebay Clone ⚡

## Setting up NextJS and TailwindCSS:

```
npx create-next-app -e with-tailwindcss web3-ebay-clone
cd web3-ebay-clone
npm install @heroicons/react
npm run dev
```

## Setting up Thirdweb:

Got to https://portal.thirdweb.com/react

Install the SDK into your existing project:

```
npm install @thirdweb-dev/react @thirdweb-dev/sdk ethers
```

## Configure the ThirdwebProvider:

Update pages/\_app.tsx:

```
import "../styles/globals.css";
import type { AppProps } from "next/app";
import { ChainId, ThirdwebProvider } from "@thirdweb-dev/react";

function MyApp({ Component, pageProps }: AppProps) {
  return (
    <ThirdwebProvider desiredChainId={ChainId.Mumbai}>
      <Component {...pageProps} />
    </ThirdwebProvider>
  );
}

export default MyApp;

```

## Create a utils folder in the root to create useful functions

In utils create network.ts:

```
import { ChainId } from "@thirdweb-dev/react";

export default ChainId.Mumbai;
```

## Update pages/\_app.tsx:

```
import "../styles/globals.css";
import type { AppProps } from "next/app";
import { ChainId, ThirdwebProvider } from "@thirdweb-dev/react";
import network from "../utils/network";

function MyApp({ Component, pageProps }: AppProps) {
  return (
    <ThirdwebProvider desiredChainId={network}>
      <Component {...pageProps} />
    </ThirdwebProvider>
  );
}

export default MyApp;
```

## Update pages/index.tsx:

```
import Head from "next/head";

const Home = () => {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center py-2">
      <Head>
        <title>Web3 - Ebay Clone</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <h1>Web3 - Ebay Clone</h1>
    </div>
  );
};

export default Home;
```

## Create components folder in the root folder

### In components/Header.tsx:

Use tsrfce tab for the ts snippet in vscode.

```
import React from "react";

type Props = {};

function Header({}: Props) {
  return <div>Header</div>;
}

export default Header;

```

### Create components/index.tsx:

```
export { default as Header } from "./Header";

```

## Update pages/index.tsx:

```
import Head from "next/head";
import { Header } from "../components";

const Home = () => {
  return (
    <div className="">
      <Head>
        <title>Web3 - Ebay Clone</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <Header/>
    </div>
  );
};

export default Home;

```

## Update components/Header.tsx:

```
import React from "react";

type Props = {};

function Header({}: Props) {
  return <div>
    <nav>
        <div>
            <button className="connectWalletBtn">Connect your wallet</button>
        </div>
    </nav>
  </div>;
}

export default Header;

```

## Update styles/globas.css:

```
@tailwind base;
@tailwind components;
@tailwind utilities;

@layer components {
  .connectWalletBtn {
    @apply bg-blue-500 text-white font-bold py-2 px-4 rounded cursor-pointer;
  }
  .headerDiv {
    @apply flex items-center space-x-2 text-xs;
  }
  .headerLink {
    @apply hidden md:inline-flex cursor-pointer;
  }
  .link {
    @apply hover:text-blue-500 hover:underline cursor-pointer text-gray-600;
  }
}


```

## Implementing MetaMask Authentication and building the Header Component:

### Update components/Header.tsx:

```
import { useAddress, useDisconnect, useMetamask } from "@thirdweb-dev/react";
import Link from "next/link";
import React from "react";
import {
  BellIcon,
  ShoppingCartIcon,
  ChevronDownIcon,
  MagnifyingGlassIcon,
} from "@heroicons/react/24/outline";
import {
  HeartIcon,
} from "@heroicons/react/24/solid";
import Image from "next/image";

type Props = {};

function Header({}: Props) {
  const connectWithMetaMask = useMetamask();
  const disconnect = useDisconnect();
  const address = useAddress();

  return (
    <div className="max-w-6xl mx-auto p-2">
      <nav className="flex justify-between">
        <div className="headerDiv">
          {address ? (
            <div className="space-x-4">
              <button className="">
                Hi, {address.slice(0, 5) + "..." + address.slice(-4)}
              </button>
              <button className="connectWalletBtn" onClick={disconnect}>
                Logout
              </button>
            </div>
          ) : (
            <button className="connectWalletBtn" onClick={connectWithMetaMask}>
              Connect your wallet
            </button>
          )}
          <p className="headerLink"> Nectar</p>
          <p className="headerLink"> Daily Deals</p>
          <p className="headerLink">Brand Outlet</p>
          <p className="headerLink">Help & Contact</p>
        </div>

        <div className="headerDiv">
          <p className="headerLink">Sell</p>
          <p className="headerLink flex items-center space-x-1">
            <span>Watch List</span> <ChevronDownIcon className="h-4 w-3" />
          </p>
          <p className="headerLink flex items-center space-x-1">
            <span>My eBay</span> <ChevronDownIcon className="h-4 w-3" />
          </p>
          <Link
            href="/addItem"
            className="flex items-center hover:link  space-x-1"
          >
            <span>Add to inventory</span>
            <ChevronDownIcon className="h-4 w-3" />
          </Link>
          <BellIcon className="h-6 w-6" />
          <ShoppingCartIcon className="h-6 w-6" />
        </div>
      </nav>
      <hr className="mt-2" />
      <section className="flex items-center space-x-2 py-5">
        <div className="w-16 h-16 sm:w-28 md:w-44 curor-pointer flex-shrink-0">
          <Link href="/">
            <Image
              className="h-full w-full object-contain"
              src="/ebay.png"
              alt="Ebay Logo"
              width={100}
              height={100}
            />
          </Link>
        </div>
        <button className="hidden lg:flex items-center space-x-2 w-20">
          <p className="text-gray-600 text-sm">Shop by Category</p>
          <ChevronDownIcon className="h-4 flex-shrink-0" />
        </button>
        <div className="flex items-center space-x-2 px-2 md:px-5 py-2 border-black border-2 flex-1">
          <MagnifyingGlassIcon className="w-5 text-gray-400" />
          <input
            placeholder="Search for anything"
            type="text"
            className="flex-1 outline-none"
          />
        </div>
        <button className="hidden md:inline-flex bg-blue-600 text-white px-5 md:px-10 py-2 border-2 border-blue-600">
          Search
        </button>
        <Link href="/create">
          <button className="border-2 border-blue-600 px-5 md:px-10 py-2 text-blue-600 hover:bg-blue-600/50 hover:text-white cursor-pointer">
            List Item
          </button>
        </Link>
      </section>
      <hr />
      <section className="flex py-3 space-x-6 text-xs  whitespace-nowrap justify-center px-6">
        <p className="link">Home</p>
        <p className="link flex space-x-1">
          <HeartIcon className="w-4" />
          <span>Saved</span>
        </p>
        <p className="link">Home & Garden</p>
        <p className="link">Electronincs</p>
        <p className="link">Fashion</p>
        <p className="link hidden sm:inline">Sports & Leisure</p>
        <p className="link hidden md:inline">Health & Beauty</p>
        <p className="link hidden lg:inline">Toys</p>
        <p className="link hidden lg:inline">Motors</p>
        <p className="link hidden lg:inline">Home Entertainment</p>
        <p className="link hidden lg:inline">Collectables</p>
        <p className="link hidden xl:inline">Refurbished</p>
        <p className="link hidden xl:inline">Local</p>
        <p className="link xl:hidden flex items-center space-x-1">
          <span>More</span> <ChevronDownIcon className="h-4 flex-shrink-0" />
        </p>
      </section>
    </div>
  );
}

export default Header;
```

## Implementing Thirdweb, Adding Items and Listings:

### Setup NFT Collection:

Go to https://thirdweb.com/explore > NFT Collection > Deploy
Name: Ebay NFT Collection
Symbol: ENC
Network: Mumbai (MATIC)
Deploy Now
MetaMask prompt pops up > Deploy Proxy By Implem.. > Confirm > Contract successfully deployed

In the Explorer > NFTs > +Mint
Name:French Bulldog Artwork #1
Media: upload an image
Properties: trait:Spotlight Hex Color value:#DA828F
Advanced MetaData: Background Color:#FEF9EA
Mint NFT
MetaMask prompt pops up > Mint To.. > Confirm > NFT added

Add as many NFTs as needed into the collection.

### Setup NFT MarketPlace:

Go to https://thirdweb.com/explore > Marketplace > Deploy
Name: Ebay Marketplace
Network: Mumbai (MATIC)
Deploy Now
MetaMask prompt pops up > Deploy Proxy By Implem.. > Confirm > Contract successfully deployed

To create Direct Listing:
In the Explorer >Listings > +Create Listing
Select NFT: Choose one of your previously created NFTs
Listing Type: Direct
Listing Currency: MATIC(Polygon)
Listing Price: 0.000001
Create Listing > Confirm
Approve Token with no.. > Confirm
Create Listing > Confirm > NFT Listed successfully

To create Auction Listing:
In the Explorer >Listings > +Create Listing
Select NFT: Choose one of your previously created NFTs
Listing Type: Auction
Listing Currency: MATIC(Polygon)
Buyout Price Per Token: 0.00001
Reserve Price Per Token: 0.000001
Create Listing > Confirm > NFT Listed successfully

Create a few direct and auction listings.

## Implementing Listings:

### Create a .env.local:

Copy the NFT Collection and Marketplace contract address from the Thirdweb Explorer and paste it into the .env.local file.

```
NEXT_PUBLIC_MARKETPLACE_CONTRACT=....
NEXT_PUBLIC_COLLECTION_CONTRACT=....
```

### Update styles/global.css:

```
@tailwind base;
@tailwind components;
@tailwind utilities;

@layer components {
  .connectWalletBtn {
    @apply bg-blue-500 text-white font-bold py-2 px-4 rounded cursor-pointer;
  }
  .headerDiv {
    @apply flex items-center space-x-2 text-xs;
  }
  .headerLink {
    @apply hidden md:inline-flex cursor-pointer;
  }
  .link {
    @apply hover:text-blue-500 hover:underline cursor-pointer text-gray-600;
  }
  .card{
  @apply border border-gray-200 rounded-md p-5 bg-gray-50 cursor-pointer hover:bg-gray-100
  }
}

```

### Open pages/index.tsx:

```
import Head from "next/head";
import { Header } from "../components";
import {
  useActiveListings,
  useContract,
  MediaRenderer,
} from "@thirdweb-dev/react";
import { ListingType } from "@thirdweb-dev/sdk";
import { ClockIcon, BanknotesIcon } from "@heroicons/react/24/outline";
const Home = () => {
  const { contract } = useContract(
    process.env.NEXT_PUBLIC_MARKETPLACE_CONTRACT,
    "marketplace"
  );
  const { data: listings, isLoading: loadingListings } =
    useActiveListings(contract);
  console.log(listings);
  return (
    <div className="">
      <Head>
        <title>Web3 - Ebay Clone</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <Header />
      <main className="max-w-6xl mx-auto py-2 px-6">
        {loadingListings ? (
          <p className="text-center animate-pulse text-blue-400">
            Loading listings...
          </p>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5 mx-auto">
            {listings?.map((listing) => (
              <div
                className="flex flex-col card hover:scale-105 transition-all duration-150 ease-out"
                key={listing.id}
              >
                <div className="flex flex-1 flex-col pb-2 items-center">
                  <MediaRenderer src={listing.asset.image} className="w-60" />
                </div>
                <div className="pt-2 space-y-4">
                  <div>
                    <h2 className="text-lg truncate">{listing.asset.name}</h2>
                    <hr />
                    <p className="truncate text-sm text-gray-600 mt-2">
                      {listing.asset.description}
                    </p>
                  </div>
                  <p>
                    <span className="font-bold mr-1">
                      {listing.buyoutCurrencyValuePerToken.displayValue}
                    </span>
                    {listing.buyoutCurrencyValuePerToken.symbol}
                  </p>
                  <div
                    className={`flex items-center space-x-1 justify-end text-xs border w-fit ml-auto p-2 rounded-lg text-white ${
                      listing.type === ListingType.Direct
                        ? "bg-blue-500"
                        : "bg-red-500"
                    }`}
                  >
                    <p>
                      {listing.type === ListingType.Direct
                        ? "Buy Now"
                        : "Auction"}
                    </p>
                    {listing.type === ListingType.Direct ? (
                      <BanknotesIcon className="h-4" />
                    ) : (
                      <ClockIcon className="h-4" />
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </main>
    </div>
  );
};

export default Home;

```

## Add Items to Marketplace / Minting NFTs:

### Update styles/global.css:

```
@tailwind base;
@tailwind components;
@tailwind utilities;

@layer components {
  .connectWalletBtn {
    @apply bg-blue-500 text-white font-bold py-2 px-4 rounded cursor-pointer;
  }
  .headerDiv {
    @apply flex items-center space-x-2 text-xs;
  }
  .headerLink {
    @apply hidden md:inline-flex cursor-pointer;
  }
  .link {
    @apply hover:text-blue-500 hover:underline cursor-pointer text-gray-600;
  }
  .card{
  @apply border border-gray-200 rounded-md p-5 bg-gray-50 cursor-pointer hover:bg-gray-100
  }
  .formField{
  @apply border-2 border-gray-300 bg-white h-10 px-5 pr-16 rounded-lg text-sm outline-none
  }
}

```

### In pages/addItem.tsx:

```
import React, { FormEvent, useState } from "react";
import { Header } from "../components";
import { useContract, useAddress } from "@thirdweb-dev/react";
import Image from "next/image";
import { useRouter } from "next/router";

type Props = {};

function addItem({}: Props) {
  const router = useRouter();
  const address = useAddress();
  const { contract } = useContract(
      process.env.NEXT_PUBLIC_COLLECTION_CONTRACT,
      "nft-collection"
      );
  // console.log(contract);
  // console.log(address);
  const [preview, setPreview] = useState<string>();
  const [image, setImage] = useState<File>();

  const mintNft = async (e: FormEvent<HTMLFormElement>) => {
      e.preventDefault();
   //   console.log("mintNft Clicked!");

      if (!contract || !address) return;
      if (!image) {
          alert("Please select an image!");
          return;
        }
        const target = e.target as typeof e.target & {
            name: { value: string };
            description: { value: string };
        };
        const metadata = {
            name: target.name.value,
            description: target.description.value,
            image: image,
        };

    try {
      const tx = await contract.mintTo(address, metadata);
      const receipt = tx.receipt; // transaction receipt
      const tokenId = tx.id; //id of NFT minted
      const nft = await tx.data(); //(optional) fetch details of minted NFT
      console.log(receipt, tokenId, nft);
      router.push("/");
    } catch (error) {
      console.error(error);
    }
  };
  return (
    <div>
      <Header />
      <main className="max-w-6xl mx-auto p-10 border">
        <h1 className="text-4xl font-bold">Add an item to the Marketplace</h1>
        <h2 className="text-xl font-semibold pt-5">Item Details</h2>
        <p className="pb-5">
          By adding an item to the marketplace, you're essentially Minting an
          NFT of the item into your wallet which we can then list for sale!
        </p>
        <div className="flex flex-col justify-center items-center md:flex-row md:space-x-5 pt-5">
          <Image
            className="border object-contain"
            src={preview || "/product-image-placeholder.png"}
            alt="product placeholder image"
            width={320}
            height={320}
          />
          <form
            onSubmit={mintNft}
            className="flex flex-col flex-1 p-2 space-y-2"
          >
            <label className="font-light">Name of Item</label>
            <input
              className="formField"
              placeholder="Name of Item..."
              type="text"
              name="name"
              id="name"
            />
            <label className="font-light">Description</label>
            <input
              className="formField"
              placeholder="Enter Description..."
              type="text"
              name="description"
              id="description"
            />
            <label className="font-light">Image of the Item</label>
            <input
              type="file"
              className="pb-5"
              onChange={(e) => {
                if (e.target.files?.[0])
                  setPreview(URL.createObjectURL(e.target.files[0]));
                setImage(e.target.files?.[0]);
              }}
            />
            <button
              type="submit"
              className="bg-blue-600 font-bold text-white rounded-full py-4 px-10 w-56 md:mt-auto mx-auto  md:ml-auto"
            >
              Add / Mint Item
            </button>
          </form>
        </div>
      </main>
    </div>
  );
}

export default addItem;


```

Once you add in the Name, Description, Image and click on Mint NFT it pushes it to the IPFS
MetaMask prompt opens > Confirm > Check in NFT Collection

## List An Item:

This feature let's you choose from the NFTs in your wallet and choose a type of listing(direct,auction)

Note: When an item is listed as an Auction type the listing is reserved and will removed from the available Nfts to list. It will only be available to list as a direct listing when the auction has ended.

### In pages/create.tsx:

```
import React, { FormEvent, useState } from "react";
import { Header } from "../components";
import Image from "next/image";
import {
  useContract,
  useAddress,
  MediaRenderer,
  useNetwork,
  useNetworkMismatch,
  useOwnedNFTs,
  useCreateAuctionListing,
  useCreateDirectListing,
} from "@thirdweb-dev/react";
import { useRouter } from "next/router";
import { NFT, NATIVE_TOKEN_ADDRESS, NATIVE_TOKENS } from "@thirdweb-dev/sdk";
import network from "../utils/network";

type Props = {};

function create({}: Props) {
  const router = useRouter();
  const [selectedNft, setSelectedNft] = useState<NFT>();
  const address = useAddress();
  const { contract: marketplaceContract } = useContract(
    process.env.NEXT_PUBLIC_MARKETPLACE_CONTRACT,
    "marketplace"
  );
  const { contract: collectionContract } = useContract(
    process.env.NEXT_PUBLIC_COLLECTION_CONTRACT,
    "nft-collection"
  );
  //   console.log(contract);
  //   console.log("The Address is:", address);
  const ownedNfts = useOwnedNFTs(collectionContract, address);
  //   console.log(ownedNfts);
  // console.log(selectedNft);

  const networkMismatch = useNetworkMismatch();
  const [, switchNetwork] = useNetwork();

  const {
    mutate: createDirectListing,
    isLoading: isLoadingDirect,
    error: errorDirect,
  } = useCreateDirectListing(marketplaceContract);
  const {
    mutate: createAuctionListing,
    isLoading: isLoadingAuction,
    error: errorAuction,
  } = useCreateAuctionListing(marketplaceContract);

  // handleCreateListing is called when the form is submitted.
  // User has provided: contract address, token id, type of listing (either auction or direct), price of NFT.
  const handleCreateListing = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    // Check if user on correct network. If not switch to correct network.
    if (networkMismatch) {
      switchNetwork && switchNetwork(network);
      return;
    }
    if (!selectedNft) return;

    const target = e.target as typeof e.target & {
      elements: { listingType: { value: string }; price: { value: string } };
    };

    const { listingType, price } = target.elements;

    if (listingType.value === "directListing") {
      createDirectListing(
        {
          assetContractAddress: process.env.NEXT_PUBLIC_COLLECTION_CONTRACT!,
          tokenId: selectedNft.metadata.id,
          currencyContractAddress: NATIVE_TOKEN_ADDRESS,
          listingDurationInSeconds: 60 * 60 * 24 * 7, //1 week
          quantity: 1,
          buyoutPricePerToken: price.value,
          startTimestamp: new Date(),
        },
        {
          onSuccess(data, variables, context) {
            console.log("Success:", data, variables, context);
            router.push("/");
          },
          onError(error, variables, context) {
            console.log("Error:", error, variables, context);
            router.push("/");
          },
        }
      );
    }
    if (listingType.value === "auctionListing") {
      createAuctionListing(
        {
          assetContractAddress: process.env.NEXT_PUBLIC_COLLECTION_CONTRACT!,
          tokenId: selectedNft.metadata.id,
          currencyContractAddress: NATIVE_TOKEN_ADDRESS,
          listingDurationInSeconds: 60 * 60 * 24 * 7, //1 week
          quantity: 1,
          startTimestamp: new Date(),
          buyoutPricePerToken: price.value,
          reservePricePerToken: 0,
        },
        {
          onSuccess(data, variables, context) {
            console.log("Success:", data, variables, context);
            router.push("/");
          },
          onError(error, variables, context) {
            console.log("Error:", error, variables, context);
            router.push("/");
          },
        }
      );
    }
  };
  return (
    <div>
      <Header />
      <main className="max-w-6xl mx-auto p-10 border">
        <h1 className="text-4xl font-bold">List an Item</h1>
        <h2 className="text-xl font-semibold pt-5">
          Select an Item you would like to Sell
        </h2>
        <hr className="mb-5" />
        <p>Below you will find the NFT's you own in your wallet</p>
        <div className="flex overflow-x-scroll space-x-2 p-4">
          {ownedNfts?.data?.map((nft) => (
            <div
              key={nft.metadata.id}
              className={`flex flex-col space-y-2 card min-w-fit border-2 bg-gray-100 ${
                nft.metadata.id === selectedNft?.metadata.id
                  ? "border-black"
                  : "border-transparent"
              }`}
              onClick={() => setSelectedNft(nft)}
            >
              <MediaRenderer
                src={nft.metadata.image}
                className="h-48 rounded-lg"
              />
              <p className="text-lg truncate font-bold">{nft.metadata.name}</p>
              <p className="text-sm truncate">{nft.metadata.description}</p>
            </div>
          ))}
        </div>

        {selectedNft && (
          <form onSubmit={handleCreateListing}>
            <div className="flex flex-col p-10">
              <div className="grid grid-cols-2 gap-5">
                <label className="border-r font-light">
                  Direct Listing / Fixed Price
                </label>
                <input
                  type="radio"
                  name="listingType"
                  value="directListing"
                  className="ml-auto h-10 w-10"
                />
                <label className="border-r font-light">Auction</label>
                <input
                  type="radio"
                  name="listingType"
                  value="auctionListing"
                  className="ml-auto h-10 w-10"
                />

                <label className="border-r font-light">Price</label>
                <input
                  type="text"
                  className="bg-gray-100 p-5"
                  placeholder="0.05"
                  name="price"
                />
              </div>
              <button
                className="bg-blue-600 text-white rounded-lg p-4 mt-8"
                type="submit"
              >
                Create Listing
              </button>
            </div>
          </form>
        )}
      </main>
    </div>
  );
}

export default create;

```

To test click on "List and Item".
Create an auction / direct type listing.
Metamask prompt > Confirm
You should be re-directed to the homepage and should see the listed NFT.

## Payments & Bidding:

### Update the pages/index.tsx:

```
import Head from "next/head";
import { Header } from "../components";
import {
  useActiveListings,
  useContract,
  MediaRenderer,
} from "@thirdweb-dev/react";
import { ListingType } from "@thirdweb-dev/sdk";
import { ClockIcon, BanknotesIcon } from "@heroicons/react/24/outline";
import Link from "next/link";
const Home = () => {
  const { contract } = useContract(
    process.env.NEXT_PUBLIC_MARKETPLACE_CONTRACT,
    "marketplace"
  );
  const { data: listings, isLoading: loadingListings } =
    useActiveListings(contract);
  console.log(listings);
  return (
    <div className="">
      <Head>
        <title>Web3 - Ebay Clone</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <Header />
      <main className="max-w-6xl mx-auto py-2 px-6">
        {loadingListings ? (
          <p className="text-center animate-pulse text-blue-400">
            Loading listings...
          </p>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5 mx-auto">
            {listings?.map((listing) => (
             <Link
                href={`/listing/${listing.id}`}
                key={listing.id}
                className="flex flex-col card hover:scale-105 transition-all duration-150 ease-out"
              >
                <div>
                  <div className="flex flex-1 flex-col pb-2 items-center">
                    <MediaRenderer src={listing.asset.image} className="w-60" />
                  </div>
                  <div className="pt-2 space-y-4">
                    <div>
                      <h2 className="text-lg truncate">{listing.asset.name}</h2>
                      <hr />
                      <p className="truncate text-sm text-gray-600 mt-2">
                        {listing.asset.description}
                      </p>
                    </div>
                    <p>
                      <span className="font-bold mr-1">
                        {listing.buyoutCurrencyValuePerToken.displayValue}
                      </span>
                      {listing.buyoutCurrencyValuePerToken.symbol}
                    </p>
                    <div
                      className={`flex items-center space-x-1 justify-end text-xs border w-fit ml-auto p-2 rounded-lg text-white ${
                        listing.type === ListingType.Direct
                          ? "bg-blue-500"
                          : "bg-red-500"
                      }`}
                    >
                      <p>
                        {listing.type === ListingType.Direct
                          ? "Buy Now"
                          : "Auction"}
                      </p>
                      {listing.type === ListingType.Direct ? (
                        <BanknotesIcon className="h-4" />
                      ) : (
                        <ClockIcon className="h-4" />
                      )}
                    </div>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}
      </main>
    </div>
  );
};

export default Home;

```

### Install [React Countdown](https://www.npmjs.com/package/react-countdown):

```
npm install react-countdown --save
```

### Create pages/listing/[listingId].tsx:

```
import { UserCircleIcon } from "@heroicons/react/24/solid";
import {
  MediaRenderer,
  useContract,
  useListing,
  useNetwork,
  useNetworkMismatch,
  useBuyNow,
  useAddress,
  useMakeBid,
  useOffers,
  useMakeOffer,
} from "@thirdweb-dev/react";
import { ListingType } from "@thirdweb-dev/sdk";
import { useRouter } from "next/router";
import React, { useEffect, useState } from "react";
import { Header } from "../../components";
import Countdown from "react-countdown";
import network from "../../utils/network";

type Props = {};

function LisitingPage({}: Props) {
  const router = useRouter();
  const { listingId } = router.query as { listingId: string };
  const [bidAmount, setBidAmount] = useState("");
  const [minimumNextBid, setMinimumNextBid] = useState<{
    displayValue: string;
    symbol: string;
  }>();

  const networkMismatch = useNetworkMismatch();
  const [, switchNetwork] = useNetwork();

  const { contract: marketplaceContract } = useContract(
    process.env.NEXT_PUBLIC_MARKETPLACE_CONTRACT,
    "marketplace"
  );

  const { mutate: buyNow } = useBuyNow(marketplaceContract);

  const {
    data: listing,
    isLoading,
    error,
  } = useListing(marketplaceContract, listingId);

  useEffect(() => {
    if (!listingId || !marketplaceContract || !listing) return;
    if (listing.type === ListingType.Auction) {
      fetchMinimumNextBid();
    }
  }, [listingId, listing, marketplaceContract]);

  console.log(minimumNextBid);

  const fetchMinimumNextBid = async () => {
    if (!listingId || !marketplaceContract) return;
    const { displayValue, symbol } =
      await marketplaceContract.auction.getMinimumNextBid(listingId);
    setMinimumNextBid({
      displayValue: displayValue,
      symbol: symbol,
    });
  };

  const formatPlaceholder = () => {
    if (!listing) return;
    if (listing.type === ListingType.Direct) {
      return "Enter Offer Amount";
    }
    if (listing.type === ListingType.Auction) {
      // return "Enter Bid Amount";
      return Number(minimumNextBid?.displayValue) === 0
        ? "Enter Bid Amount"
        : `${minimumNextBid?.displayValue} ${minimumNextBid?.symbol} or more`;

      // Improve bid amount
    }
  };

  const buyNft = async () => {
    if (networkMismatch) {
      switchNetwork && switchNetwork(network);
      return;
    }
    if (!listingId || !marketplaceContract || !listing) return;
    await buyNow(
      { id: listingId, buyAmount: 1, type: listing.type },
      {
        onSuccess(data, variables, context) {
          alert("NFT bought successfully!");
          console.log("Success:", data, variables, context);
          router.replace("/");
        },
        onError(error, variables, context) {
          alert("ERROR: NFT  could not be bought!");
          console.log("Error:", error, variables, context);
        },
      }
    );
  };

  const createBidOrOffer = async () => {
    try {
      // Check if user on correct network. If not switch to correct network.
      if (networkMismatch) {
        switchNetwork && switchNetwork(network);
        return;
      }
      // Handle Direct Listing

      // Handle Auction Listing
      // If the user entered a bid amount that is equal to the buyout price it should trigger a buy now.


    } catch (error) {
      console.error(error);
    }
  };

  if (isLoading)
    return (
      <div>
        <Header />
        <div className="text-center animate-pulse text-blue-500">
          <p>Loading Item...</p>
        </div>
      </div>
    );

  if (!listing) {
    return <div>Listing not found!</div>;
  }

  return (
    <div>
      <Header />
      <main className="max-w-6xl mx-auto p-2 flex flex-col lg:flex-row space-y-10 space-x-5 pr-10">
        <div className="p-10 border mx-auto lg:mx-0 max-w-md lg:max-w-xl">
          <MediaRenderer src={listing.asset.image} />
        </div>
        <section className="flex-1 space-y-5 pb-20 lg:pb-0">
          <div>
            <h1 className="text-xl font-bold">{listing.asset.name}</h1>
            <p className="text-gray-600">{listing.asset.description}</p>
            <p className="flex items-center text-xs sm:text-base">
              <UserCircleIcon className="h-5" />
              <span className="font-bold pr-1">Seller:</span>
              {listing.sellerAddress}
            </p>
          </div>
          <div className="grid grid-cols-2 items-center py-2">
            <p className="font-bold">Listing Type:</p>
            <p>
              {listing.type === ListingType.Direct
                ? "Direct Listing"
                : "Auction Listing"}
            </p>
            <p className="font-bold">Buy it Now Price:</p>
            <p className="text-4xl font-bold">
              {listing.buyoutCurrencyValuePerToken.displayValue}{" "}
              {listing.buyoutCurrencyValuePerToken.symbol}
            </p>
            <button
              onClick={buyNft}
              className="col-start-2 mt-2 bg-blue-600 font-bold text-white rounded-full w-44 py-4 px-10"
            >
              Buy Now
            </button>
          </div>
          {/* If direct listing show offers here... */}
          <div className="grid grid-cols-2 space-y-2 items-center justify-end">
            <hr className="col-span-2" />
            <p className="col-span-2 font-bold">
              {listing.type === ListingType.Direct
                ? "Make an Offer"
                : "Bid on this Auction"}
            </p>
            {/* Remaining time on auction goes here... */}
            {listing.type === ListingType.Auction && (
              <>
                <p>Current Minimum Bid:</p>
                <p>
                  {minimumNextBid?.displayValue} {minimumNextBid?.symbol}{" "}
                </p>
                <p>Time Remaining:</p>
                <Countdown
                  date={Number(listing.endTimeInEpochSeconds.toString()) * 1000}
                />
              </>
            )}
            <input
              type="text"
              placeholder={formatPlaceholder()}
              className="border p-2 rounded-lg mr-5"
              onChange={(e) => setBidAmount(e.target.value)}
            />
            <button
              onClick={createBidOrOffer}
              className="bg-red-600 rounded-full text-white font-bold w-44 py-4 px-10"
            >
              {listing.type === ListingType.Direct ? "Offer" : "Bid"}
            </button>
          </div>
        </section>
      </main>
    </div>
  );
}

export default LisitingPage;

```

When you click on Buy Now button:
1.For a Direct listing: it triggers a "NewSale" event in the Thirdweb Events tab
2.For an Auction listing it triggers "NewOffer" + "AuctionClosed" events in the Thirdweb Events tab

## Make an Offer and Bidding:

### In pages/listing/[listingId].tsx:

```
import { UserCircleIcon } from "@heroicons/react/24/solid";
import {
  MediaRenderer,
  useContract,
  useListing,
  useNetwork,
  useNetworkMismatch,
  useBuyNow,
  useMakeOffer,
  useOffers,
  useMakeBid,
  useAddress,
} from "@thirdweb-dev/react";
import { ListingType } from "@thirdweb-dev/sdk";
import { useRouter } from "next/router";
import React, { useEffect, useState } from "react";
import { Header } from "../../components";
import Countdown from "react-countdown";
import network from "../../utils/network";
import { ethers } from "ethers";

type Props = {};

function LisitingPage({}: Props) {
  const router = useRouter();
  const { listingId } = router.query as { listingId: string };
  const [bidAmount, setBidAmount] = useState("");
  const [minimumNextBid, setMinimumNextBid] = useState<{
    displayValue: string;
    symbol: string;
  }>();

  const networkMismatch = useNetworkMismatch();
  const [, switchNetwork] = useNetwork();

  const { contract: marketplaceContract } = useContract(
    process.env.NEXT_PUBLIC_MARKETPLACE_CONTRACT,
    "marketplace"
  );

  const { mutate: buyNow } = useBuyNow(marketplaceContract);
  const { mutate: makeOffer } = useMakeOffer(marketplaceContract);
    const { data: offers } = useOffers(marketplaceContract, listingId);
  // console.log(offers);
  const { mutate: makeBid } = useMakeBid(marketplaceContract);

  const {
    data: listing,
    isLoading,
    error,
  } = useListing(marketplaceContract, listingId);

  useEffect(() => {
    if (!listingId || !marketplaceContract || !listing) return;
    if (listing.type === ListingType.Auction) {
      fetchMinimumNextBid();
    }
  }, [listingId, listing, marketplaceContract]);

  console.log(minimumNextBid);

  const fetchMinimumNextBid = async () => {
    if (!listingId || !marketplaceContract) return;
    const { displayValue, symbol } =
      await marketplaceContract.auction.getMinimumNextBid(listingId);
    setMinimumNextBid({
      displayValue: displayValue,
      symbol: symbol,
    });
  };

  const formatPlaceholder = () => {
    if (!listing) return;
    if (listing.type === ListingType.Direct) {
      return "Enter Offer Amount";
    }
    if (listing.type === ListingType.Auction) {
      // return "Enter Bid Amount";
      return Number(minimumNextBid?.displayValue) === 0
        ? "Enter Bid Amount"
        : `${minimumNextBid?.displayValue} ${minimumNextBid?.symbol} or more`;

      // Improve bid amount
    }
  };

  const buyNft = async () => {
    if (networkMismatch) {
      switchNetwork && switchNetwork(network);
      return;
    }
    if (!listingId || !marketplaceContract || !listing) return;
    await buyNow(
      { id: listingId, buyAmount: 1, type: listing.type },
      {
        onSuccess(data, variables, context) {
          alert("NFT bought successfully!");
          console.log("Success:", data, variables, context);
          router.replace("/");
        },
        onError(error, variables, context) {
          alert("ERROR: NFT  could not be bought!");
          console.log("Error:", error, variables, context);
        },
      }
    );
  };

  const createBidOrOffer = async () => {
    try {
      // Check if user on correct network. If not switch to correct network.
      if (networkMismatch) {
        switchNetwork && switchNetwork(network);
        return;
      }
      // Handle Direct Listing
      if (listing?.type === ListingType.Direct) {
        if (
          listing.buyoutPrice.toString() ===
          ethers.utils.parseEther(bidAmount).toString()
        ) {
          console.log("Buyout Price met, buying NFT...");
          buyNft();
          return;
        }
        console.log("Buyout Price not met, making offer...");
        await makeOffer(
          {
            quantity: 1,
            listingId: listingId,
            pricePerToken: bidAmount,
          },
          {
            onSuccess(data, variables, context) {
              alert("Offer made successfully!");
              console.log("Success:", data, variables, context);
              setBidAmount("");
            },
            onError(error, variables, context) {
              alert("ERROR: Offer  could not be made!");
              console.log("Error:", error, variables, context);
            },
          }
        );
      }
      // Handle Auction Listing
      // If the user entered a bid amount that is equal to the buyout price it should trigger a buy now.
      if (listing?.type === ListingType.Auction) {
        if (
          listing.buyoutPrice.toString() ===
          ethers.utils.parseEther(bidAmount).toString()
        ) {
          console.log("Buyout Price met, buying NFT...");
          buyNft();
          return;
        }
        console.log("Buyout Price not met, making bid...");
        await makeBid(
          {
            listingId: listingId,
            bid: bidAmount,
          },
          {
            onSuccess(data, variables, context) {
              alert("Bid made successfully!");
              console.log("Success:", data, variables, context);
              setBidAmount("");
            },
            onError(error, variables, context) {
              alert("ERROR: Bid  could not be made!");
              console.log("Error:", error, variables, context);
            },
          }
        );
      }
    } catch (error) {
      console.error(error);
    }
  };

  if (isLoading)
    return (
      <div>
        <Header />
        <div className="text-center animate-pulse text-blue-500">
          <p>Loading Item...</p>
        </div>
      </div>
    );

  if (!listing) {
    return <div>Listing not found!</div>;
  }

  return (
    <div>
      <Header />
      <main className="max-w-6xl mx-auto p-2 flex flex-col lg:flex-row space-y-10 space-x-5 pr-10">
        <div className="p-10 border mx-auto lg:mx-0 max-w-md lg:max-w-xl">
          <MediaRenderer src={listing.asset.image} />
        </div>
        <section className="flex-1 space-y-5 pb-20 lg:pb-0">
          <div>
            <h1 className="text-xl font-bold">{listing.asset.name}</h1>
            <p className="text-gray-600">{listing.asset.description}</p>
            <p className="flex items-center text-xs sm:text-base">
              <UserCircleIcon className="h-5" />
              <span className="font-bold pr-1">Seller:</span>
              {listing.sellerAddress}
            </p>
          </div>
          <div className="grid grid-cols-2 items-center py-2">
            <p className="font-bold">Listing Type:</p>
            <p>
              {listing.type === ListingType.Direct
                ? "Direct Listing"
                : "Auction Listing"}
            </p>
            <p className="font-bold">Buy it Now Price:</p>
            <p className="text-4xl font-bold">
              {listing.buyoutCurrencyValuePerToken.displayValue}{" "}
              {listing.buyoutCurrencyValuePerToken.symbol}
            </p>
            <button
              onClick={buyNft}
              className="col-start-2 mt-2 bg-blue-600 font-bold text-white rounded-full w-44 py-4 px-10"
            >
              Buy Now
            </button>
          </div>
          {/* If direct listing show offers here... */}
          <div className="grid grid-cols-2 space-y-2 items-center justify-end">
            <hr className="col-span-2" />
            <p className="col-span-2 font-bold">
              {listing.type === ListingType.Direct
                ? "Make an Offer"
                : "Bid on this Auction"}
            </p>
            {/* Remaining time on auction goes here... */}
            {listing.type === ListingType.Auction && (
              <>
                <p>Current Minimum Bid:</p>
                <p>
                  {minimumNextBid?.displayValue} {minimumNextBid?.symbol}{" "}
                </p>
                <p>Time Remaining:</p>
                <Countdown
                  date={Number(listing.endTimeInEpochSeconds.toString()) * 1000}
                />
              </>
            )}
            <input
              type="text"
              placeholder={formatPlaceholder()}
              className="border p-2 rounded-lg mr-5"
              onChange={(e) => setBidAmount(e.target.value)}
            />
            <button
              onClick={createBidOrOffer}
              className="bg-red-600 rounded-full text-white font-bold w-44 py-4 px-10"
            >
              {listing.type === ListingType.Direct ? "Offer" : "Bid"}
            </button>
          </div>
        </section>
      </main>
    </div>
  );
}

export default LisitingPage;

```

When you Make an Offer > Buyout price not met, making an offer > Metamask prompts > Confirm > Approve token spend > Confirm

When you Make a Bid > Buyout price not met, making a bid > Metamask prompts > Confirm > Approve token spend > Confirm

## Building the Offers UI for Direct Listings:

### In pages/listing/[listingId].tsx:

```
import { UserCircleIcon } from "@heroicons/react/24/solid";
import {
  MediaRenderer,
  useContract,
  useListing,
  useNetwork,
  useNetworkMismatch,
  useBuyNow,
  useMakeOffer,
  useOffers,
  useMakeBid,
  useAddress,
  useAcceptDirectListingOffer,
} from "@thirdweb-dev/react";
import { ListingType, NATIVE_TOKENS } from "@thirdweb-dev/sdk";
import { useRouter } from "next/router";
import React, { useEffect, useState } from "react";
import { Header } from "../../components";
import Countdown from "react-countdown";
import network from "../../utils/network";
import { ethers } from "ethers";

type Props = {};

function LisitingPage({}: Props) {
  const router = useRouter();
  const address = useAddress();

  const { listingId } = router.query as { listingId: string };
  const [bidAmount, setBidAmount] = useState("");
  const [minimumNextBid, setMinimumNextBid] = useState<{
    displayValue: string;
    symbol: string;
  }>();

  const networkMismatch = useNetworkMismatch();
  const [, switchNetwork] = useNetwork();

  const { contract: marketplaceContract } = useContract(
    process.env.NEXT_PUBLIC_MARKETPLACE_CONTRACT,
    "marketplace"
  );

  const { mutate: buyNow } = useBuyNow(marketplaceContract);
  const { mutate: makeOffer } = useMakeOffer(marketplaceContract);
  const { data: offers } = useOffers(marketplaceContract, listingId);
  // console.log(offers);
  const { mutate: makeBid } = useMakeBid(marketplaceContract);
  const { mutate: acceptOffer } =
    useAcceptDirectListingOffer(marketplaceContract);
  const {
    data: listing,
    isLoading,
    error,
  } = useListing(marketplaceContract, listingId);

  useEffect(() => {
    if (!listingId || !marketplaceContract || !listing) return;
    if (listing.type === ListingType.Auction) {
      fetchMinimumNextBid();
    }
  }, [listingId, listing, marketplaceContract]);

  console.log(minimumNextBid);

  const fetchMinimumNextBid = async () => {
    if (!listingId || !marketplaceContract) return;
    const { displayValue, symbol } =
      await marketplaceContract.auction.getMinimumNextBid(listingId);
    setMinimumNextBid({
      displayValue: displayValue,
      symbol: symbol,
    });
  };

  const formatPlaceholder = () => {
    if (!listing) return;
    if (listing.type === ListingType.Direct) {
      return "Enter Offer Amount";
    }
    if (listing.type === ListingType.Auction) {
      // return "Enter Bid Amount";
      return Number(minimumNextBid?.displayValue) === 0
        ? "Enter Bid Amount"
        : `${minimumNextBid?.displayValue} ${minimumNextBid?.symbol} or more`;

      // Improve bid amount
    }
  };

  const buyNft = async () => {
    if (networkMismatch) {
      switchNetwork && switchNetwork(network);
      return;
    }
    if (!listingId || !marketplaceContract || !listing) return;
    await buyNow(
      { id: listingId, buyAmount: 1, type: listing.type },
      {
        onSuccess(data, variables, context) {
          alert("NFT bought successfully!");
          console.log("Success:", data, variables, context);
          router.replace("/");
        },
        onError(error, variables, context) {
          alert("ERROR: NFT  could not be bought!");
          console.log("Error:", error, variables, context);
        },
      }
    );
  };

  const createBidOrOffer = async () => {
    try {
      // Check if user on correct network. If not switch to correct network.
      if (networkMismatch) {
        switchNetwork && switchNetwork(network);
        return;
      }
      // Handle Direct Listing
      if (listing?.type === ListingType.Direct) {
        if (
          listing.buyoutPrice.toString() ===
          ethers.utils.parseEther(bidAmount).toString()
        ) {
          console.log("Buyout Price met, buying NFT...");
          buyNft();
          return;
        }
        console.log("Buyout Price not met, making offer...");
        await makeOffer(
          {
            quantity: 1,
            listingId: listingId,
            pricePerToken: bidAmount,
          },
          {
            onSuccess(data, variables, context) {
              alert("Offer made successfully!");
              console.log("Success:", data, variables, context);
              setBidAmount("");
            },
            onError(error, variables, context) {
              alert("ERROR: Offer  could not be made!");
              console.log("Error:", error, variables, context);
            },
          }
        );
      }
      // Handle Auction Listing
      // If the user entered a bid amount that is equal to the buyout price it should trigger a buy now.
      if (listing?.type === ListingType.Auction) {
        if (
          listing.buyoutPrice.toString() ===
          ethers.utils.parseEther(bidAmount).toString()
        ) {
          console.log("Buyout Price met, buying NFT...");
          buyNft();
          return;
        }
        console.log("Buyout Price not met, making bid...");
        await makeBid(
          {
            listingId: listingId,
            bid: bidAmount,
          },
          {
            onSuccess(data, variables, context) {
              alert("Bid made successfully!");
              console.log("Success:", data, variables, context);
              setBidAmount("");
            },
            onError(error, variables, context) {
              alert("ERROR: Bid  could not be made!");
              console.log("Error:", error, variables, context);
            },
          }
        );
      }
    } catch (error) {
      console.error(error);
    }
  };

  if (isLoading)
    return (
      <div>
        <Header />
        <div className="text-center animate-pulse text-blue-500">
          <p>Loading Item...</p>
        </div>
      </div>
    );

  if (!listing) {
    return <div>Listing not found!</div>;
  }

  return (
    <div>
      <Header />
      <main className="max-w-6xl mx-auto p-2 flex flex-col lg:flex-row space-y-10 space-x-5 pr-10">
        <div className="p-10 border mx-auto lg:mx-0 max-w-md lg:max-w-xl">
          <MediaRenderer src={listing.asset.image} />
        </div>
        <section className="flex-1 space-y-5 pb-20 lg:pb-0">
          <div>
            <h1 className="text-xl font-bold">{listing.asset.name}</h1>
            <p className="text-gray-600">{listing.asset.description}</p>
            <p className="flex items-center text-xs sm:text-base">
              <UserCircleIcon className="h-5" />
              <span className="font-bold pr-1">Seller:</span>
              {listing.sellerAddress}
            </p>
          </div>
          <div className="grid grid-cols-2 items-center py-2">
            <p className="font-bold">Listing Type:</p>
            <p>
              {listing.type === ListingType.Direct
                ? "Direct Listing"
                : "Auction Listing"}
            </p>
            <p className="font-bold">Buy it Now Price:</p>
            <p className="text-4xl font-bold">
              {listing.buyoutCurrencyValuePerToken.displayValue}{" "}
              {listing.buyoutCurrencyValuePerToken.symbol}
            </p>
            <button
              onClick={buyNft}
              className="col-start-2 mt-2 bg-blue-600 font-bold text-white rounded-full w-44 py-4 px-10"
            >
              Buy Now
            </button>
          </div>
          {/* If direct listing show offers here... */}
          {listing.type === ListingType.Direct && offers && (
            <div className="grid grid-cols-2 gap-y-2">
              <p className="font-bold">Offers: </p>
              <p className="font-bold">
                {offers.length > 0 ? offers.length : 0}
              </p>
              {offers.map((offer) => (
                <>
                  <p className="flex items-center ml-5 text-sm italic">
                    <UserCircleIcon className="h-3 mr-2" />
                    {offer.offeror.slice(0, 5) +
                      "..." +
                      offer.offeror.slice(-5)}
                  </p>
                  <div>
                    <p
                      key={
                        offer.listingId +
                        offer.offeror +
                        offer.totalOfferAmount.toString()
                      }
                      className="text-sm italic"
                    >
                      {ethers.utils.formatEther(offer.totalOfferAmount)}{" "}
                      {NATIVE_TOKENS[network].symbol}
                    </p>
                    {listing.sellerAddress === address && (
                      <button
                        onClick={() =>
                          acceptOffer(
                            {
                              listingId,
                              addressOfOfferor: offer.offeror,
                            },
                            {
                              onSuccess(data, variables, context) {
                                alert("Offer accepted successfully!");
                                console.log(
                                  "Success:",
                                  data,
                                  variables,
                                  context
                                );
                                router.replace("/");
                              },
                              onError(error, variables, context) {
                                alert("ERROR: Offer could not be accepted!");
                                console.log(
                                  "Error:",
                                  error,
                                  variables,
                                  context
                                );
                              },
                            }
                          )
                        }
                        className="p-2 w-32 bg-red-500/50 rounded-lg font-bold text-xs cursor-pointer"
                      >
                        Accept Offer
                      </button>
                    )}
                  </div>
                </>
              ))}
            </div>
          )}

          <div className="grid grid-cols-2 space-y-2 items-center justify-end">
            <hr className="col-span-2" />
            <p className="col-span-2 font-bold">
              {listing.type === ListingType.Direct
                ? "Make an Offer"
                : "Bid on this Auction"}
            </p>
            {/* Remaining time on auction goes here... */}
            {listing.type === ListingType.Auction && (
              <>
                <p>Current Minimum Bid:</p>
                <p>
                  {minimumNextBid?.displayValue} {minimumNextBid?.symbol}{" "}
                </p>
                <p>Time Remaining:</p>
                <Countdown
                  date={Number(listing.endTimeInEpochSeconds.toString()) * 1000}
                />
              </>
            )}
            <input
              type="text"
              placeholder={formatPlaceholder()}
              className="border p-2 rounded-lg mr-5"
              onChange={(e) => setBidAmount(e.target.value)}
            />
            <button
              onClick={createBidOrOffer}
              className="bg-red-600 rounded-full text-white font-bold w-44 py-4 px-10"
            >
              {listing.type === ListingType.Direct ? "Offer" : "Bid"}
            </button>
          </div>
        </section>
      </main>
    </div>
  );
}

export default LisitingPage;

```

Once the Listing Owner logs in and accepts the offer made the listing is taken off the marketplace and the NFT is transferred to the from the Owner's Wallet to the Buyer's Wallet.

## Add [React Hot Toast](https://www.npmjs.com/package/react-hot-toast) Notifications:

```
npm install react-hot-toast

```

### Add Toaster in pages/index.tsx:

```
import Head from "next/head";
import { Header } from "../components";
import {
  useActiveListings,
  useContract,
  MediaRenderer,
} from "@thirdweb-dev/react";
import { ListingType } from "@thirdweb-dev/sdk";
import { ClockIcon, BanknotesIcon } from "@heroicons/react/24/outline";
import Link from "next/link";
import { Toaster } from "react-hot-toast";

const Home = () => {
  const { contract } = useContract(
    process.env.NEXT_PUBLIC_MARKETPLACE_CONTRACT,
    "marketplace"
  );
  const { data: listings, isLoading: loadingListings } =
    useActiveListings(contract);
  console.log(listings);
  return (
    <div className="">
      <Head>
        <title>Web3 - Ebay Clone</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <Header />
      <Toaster />
      <main className="max-w-6xl mx-auto py-2 px-6">
        {loadingListings ? (
          <p className="text-center animate-pulse text-blue-400">
            Loading listings...
          </p>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5 mx-auto">
            {listings?.map((listing) => (
              <Link
                href={`/listing/${listing.id}`}
                key={listing.id}
                className="flex flex-col card hover:scale-105 transition-all duration-150 ease-out"
              >
                <div>
                  <div className="flex flex-1 flex-col pb-2 items-center">
                    <MediaRenderer src={listing.asset.image} className="w-60" />
                  </div>
                  <div className="pt-2 space-y-4">
                    <div>
                      <h2 className="text-lg truncate">{listing.asset.name}</h2>
                      <hr />
                      <p className="truncate text-sm text-gray-600 mt-2">
                        {listing.asset.description}
                      </p>
                    </div>
                    <p>
                      <span className="font-bold mr-1">
                        {listing.buyoutCurrencyValuePerToken.displayValue}
                      </span>
                      {listing.buyoutCurrencyValuePerToken.symbol}
                    </p>
                    <div
                      className={`flex items-center space-x-1 justify-end text-xs border w-fit ml-auto p-2 rounded-lg text-white ${
                        listing.type === ListingType.Direct
                          ? "bg-blue-500"
                          : "bg-red-500"
                      }`}
                    >
                      <p>
                        {listing.type === ListingType.Direct
                          ? "Buy Now"
                          : "Auction"}
                      </p>
                      {listing.type === ListingType.Direct ? (
                        <BanknotesIcon className="h-4" />
                      ) : (
                        <ClockIcon className="h-4" />
                      )}
                    </div>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}
      </main>
    </div>
  );
};

export default Home;

```

### In pages/listing/[listingId].tsx:

```
import { UserCircleIcon } from "@heroicons/react/24/solid";
import {
  MediaRenderer,
  useContract,
  useListing,
  useNetwork,
  useNetworkMismatch,
  useBuyNow,
  useMakeOffer,
  useOffers,
  useMakeBid,
  useAddress,
  useAcceptDirectListingOffer,
} from "@thirdweb-dev/react";
import { ListingType, NATIVE_TOKENS } from "@thirdweb-dev/sdk";
import { useRouter } from "next/router";
import React, { useEffect, useState } from "react";
import { Header } from "../../components";
import Countdown from "react-countdown";
import network from "../../utils/network";
import { ethers } from "ethers";
import toast from "react-hot-toast";
type Props = {};

function LisitingPage({}: Props) {
  const router = useRouter();
  const address = useAddress();

  const { listingId } = router.query as { listingId: string };
  const [bidAmount, setBidAmount] = useState("");
  const [minimumNextBid, setMinimumNextBid] = useState<{
    displayValue: string;
    symbol: string;
  }>();

  const networkMismatch = useNetworkMismatch();
  const [, switchNetwork] = useNetwork();

  const { contract: marketplaceContract } = useContract(
    process.env.NEXT_PUBLIC_MARKETPLACE_CONTRACT,
    "marketplace"
  );

  const { mutate: buyNow } = useBuyNow(marketplaceContract);
  const { mutate: makeOffer } = useMakeOffer(marketplaceContract);
  const { data: offers } = useOffers(marketplaceContract, listingId);
  // console.log(offers);
  const { mutate: makeBid } = useMakeBid(marketplaceContract);
  const { mutate: acceptOffer } =
    useAcceptDirectListingOffer(marketplaceContract);
  const {
    data: listing,
    isLoading,
    error,
  } = useListing(marketplaceContract, listingId);

  useEffect(() => {
    if (!listingId || !marketplaceContract || !listing) return;
    if (listing.type === ListingType.Auction) {
      fetchMinimumNextBid();
    }
  }, [listingId, listing, marketplaceContract]);

  console.log(minimumNextBid);

  const fetchMinimumNextBid = async () => {
    if (!listingId || !marketplaceContract) return;
    const { displayValue, symbol } =
      await marketplaceContract.auction.getMinimumNextBid(listingId);
    setMinimumNextBid({
      displayValue: displayValue,
      symbol: symbol,
    });
  };

  const formatPlaceholder = () => {
    if (!listing) return;
    if (listing.type === ListingType.Direct) {
      return "Enter Offer Amount";
    }
    if (listing.type === ListingType.Auction) {
      // return "Enter Bid Amount";
      return Number(minimumNextBid?.displayValue) === 0
        ? "Enter Bid Amount"
        : `${minimumNextBid?.displayValue} ${minimumNextBid?.symbol} or more`;

      // Improve bid amount
    }
  };

  const buyNft = async () => {
    toast("Buying NFT...");
    if (networkMismatch) {
      switchNetwork && switchNetwork(network);
      return;
    }
    if (!listingId || !marketplaceContract || !listing) return;
    await buyNow(
      { id: listingId, buyAmount: 1, type: listing.type },

      {
        onSuccess(data, variables, context) {
          // alert("NFT bought successfully!");
          toast.success("NFT bought successfully!");
          console.log("Success:", data, variables, context);
          router.replace("/");
        },
        onError(error, variables, context) {
          // alert("ERROR: NFT  could not be bought!");
          toast.error("ERROR: NFT  could not be bought!");
          console.log("Error:", error, variables, context);
        },
      }
    );
  };

  const createBidOrOffer = async () => {
    try {
      // Check if user on correct network. If not switch to correct network.
      if (networkMismatch) {
        switchNetwork && switchNetwork(network);
        return;
      }
      // Handle Direct Listing
      if (listing?.type === ListingType.Direct) {
        if (
          listing.buyoutPrice.toString() ===
          ethers.utils.parseEther(bidAmount).toString()
        ) {
          console.log("Buyout Price met, buying NFT...");
          toast("Buyout Price met, buying NFT...");
          buyNft();
          return;
        }
        console.log("Buyout Price not met, making offer...");
        toast("Buyout Price not met, making offer...");
        await makeOffer(
          {
            quantity: 1,
            listingId: listingId,
            pricePerToken: bidAmount,
          },
          {
            onSuccess(data, variables, context) {
              // alert("Offer made successfully!");
              toast.success("Offer made successfully!");
              console.log("Success:", data, variables, context);
              setBidAmount("");
            },
            onError(error, variables, context) {
              // alert("ERROR: Offer  could not be made!");
              toast.error("ERROR: Offer  could not be made!");
              console.log("Error:", error, variables, context);
            },
          }
        );
      }
      // Handle Auction Listing
      // If the user entered a bid amount that is equal to the buyout price it should trigger a buy now.
      if (listing?.type === ListingType.Auction) {
        if (
          listing.buyoutPrice.toString() ===
          ethers.utils.parseEther(bidAmount).toString()
        ) {
          console.log("Buyout Price met, buying NFT...");
          toast("Buyout Price met, buying NFT...");
          buyNft();
          return;
        }
        console.log("Buyout Price not met, making bid...");
        toast("Buyout Price not met, making bid...");
        await makeBid(
          {
            listingId: listingId,
            bid: bidAmount,
          },
          {
            onSuccess(data, variables, context) {
              // alert("Bid made successfully!");
              toast.success("Bid made successfully!");
              console.log("Success:", data, variables, context);
              setBidAmount("");
            },
            onError(error, variables, context) {
              // alert("ERROR: Bid  could not be made!");
              toast.error("ERROR: Bid  could not be made!");
              console.log("Error:", error, variables, context);
            },
          }
        );
      }
    } catch (error) {
      console.error(error);
    }
  };

  if (isLoading)
    return (
      <div>
        <Header />
        <div className="text-center animate-pulse text-blue-500">
          <p>Loading Item...</p>
        </div>
      </div>
    );

  if (!listing) {
    return <div>Listing not found!</div>;
  }

  return (
    <div>
      <Header />
      <main className="max-w-6xl mx-auto p-2 flex flex-col lg:flex-row space-y-10 space-x-5 pr-10">
        <div className="p-10 border mx-auto lg:mx-0 max-w-md lg:max-w-xl">
          <MediaRenderer src={listing.asset.image} />
        </div>
        <section className="flex-1 space-y-5 pb-20 lg:pb-0">
          <div>
            <h1 className="text-xl font-bold">{listing.asset.name}</h1>
            <p className="text-gray-600">{listing.asset.description}</p>
            <p className="flex items-center text-xs sm:text-base">
              <UserCircleIcon className="h-5" />
              <span className="font-bold pr-1">Seller:</span>
              {listing.sellerAddress}
            </p>
          </div>
          <div className="grid grid-cols-2 items-center py-2">
            <p className="font-bold">Listing Type:</p>
            <p>
              {listing.type === ListingType.Direct
                ? "Direct Listing"
                : "Auction Listing"}
            </p>
            <p className="font-bold">Buy it Now Price:</p>
            <p className="text-4xl font-bold">
              {listing.buyoutCurrencyValuePerToken.displayValue}{" "}
              {listing.buyoutCurrencyValuePerToken.symbol}
            </p>
            <button
              onClick={buyNft}
              className="col-start-2 mt-2 bg-blue-600 font-bold text-white rounded-full w-44 py-4 px-10"
            >
              Buy Now
            </button>
          </div>
          {/* If direct listing show offers here... */}
          {listing.type === ListingType.Direct && offers && (
            <div className="grid grid-cols-2 gap-y-2">
              <p className="font-bold">Offers: </p>
              <p className="font-bold">
                {offers.length > 0 ? offers.length : 0}
              </p>
              {offers.map((offer) => (
                <>
                  <p className="flex items-center ml-5 text-sm italic">
                    <UserCircleIcon className="h-3 mr-2" />
                    {offer.offeror.slice(0, 5) +
                      "..." +
                      offer.offeror.slice(-5)}
                  </p>
                  <div>
                    <p
                      key={
                        offer.listingId +
                        offer.offeror +
                        offer.totalOfferAmount.toString()
                      }
                      className="text-sm italic"
                    >
                      {ethers.utils.formatEther(offer.totalOfferAmount)}{" "}
                      {NATIVE_TOKENS[network].symbol}
                    </p>
                    {listing.sellerAddress === address && (
                      <button
                        onClick={() =>
                          acceptOffer(
                            {
                              listingId,
                              addressOfOfferor: offer.offeror,
                            },
                            {
                              onSuccess(data, variables, context) {
                                alert("Offer accepted successfully!");
                                // toast.success("Offer accepted successfully!");
                                console.log(
                                  "Success:",
                                  data,
                                  variables,
                                  context
                                );
                                router.replace("/");
                              },
                              onError(error, variables, context) {
                                // alert("ERROR: Offer could not be accepted!");
                                toast.error(
                                  "ERROR: Offer could not be accepted!"
                                );
                                console.log(
                                  "Error:",
                                  error,
                                  variables,
                                  context
                                );
                              },
                            }
                          )
                        }
                        className="p-2 w-32 bg-red-500/50 rounded-lg font-bold text-xs cursor-pointer"
                      >
                        Accept Offer
                      </button>
                    )}
                  </div>
                </>
              ))}
            </div>
          )}

          <div className="grid grid-cols-2 space-y-2 items-center justify-end">
            <hr className="col-span-2" />
            <p className="col-span-2 font-bold">
              {listing.type === ListingType.Direct
                ? "Make an Offer"
                : "Bid on this Auction"}
            </p>
            {/* Remaining time on auction goes here... */}
            {listing.type === ListingType.Auction && (
              <>
                <p>Current Minimum Bid:</p>
                <p>
                  {minimumNextBid?.displayValue} {minimumNextBid?.symbol}{" "}
                </p>
                <p>Time Remaining:</p>
                <Countdown
                  date={Number(listing.endTimeInEpochSeconds.toString()) * 1000}
                />
              </>
            )}
            <input
              type="text"
              placeholder={formatPlaceholder()}
              className="border p-2 rounded-lg mr-5"
              onChange={(e) => setBidAmount(e.target.value)}
            />
            <button
              onClick={createBidOrOffer}
              className="bg-red-600 rounded-full text-white font-bold w-44 py-4 px-10"
            >
              {listing.type === ListingType.Direct ? "Offer" : "Bid"}
            </button>
          </div>
        </section>
      </main>
    </div>
  );
}

export default LisitingPage;

```

### In pages/create.tsx:

```
import React, { FormEvent, useState } from "react";
import { Header } from "../components";
import Image from "next/image";
import {
  useContract,
  useAddress,
  MediaRenderer,
  useNetwork,
  useNetworkMismatch,
  useOwnedNFTs,
  useCreateAuctionListing,
  useCreateDirectListing,
} from "@thirdweb-dev/react";
import { useRouter } from "next/router";
import { NFT, NATIVE_TOKEN_ADDRESS, NATIVE_TOKENS } from "@thirdweb-dev/sdk";
import network from "../utils/network";
import toast from "react-hot-toast";

type Props = {};

function create({}: Props) {
  const router = useRouter();
  const [selectedNft, setSelectedNft] = useState<NFT>();
  const address = useAddress();
  const { contract: marketplaceContract } = useContract(
    process.env.NEXT_PUBLIC_MARKETPLACE_CONTRACT,
    "marketplace"
  );
  const { contract: collectionContract } = useContract(
    process.env.NEXT_PUBLIC_COLLECTION_CONTRACT,
    "nft-collection"
  );
  //   console.log(contract);
  //   console.log("The Address is:", address);
  const ownedNfts = useOwnedNFTs(collectionContract, address);
  //   console.log(ownedNfts);
  // console.log(selectedNft);

  const networkMismatch = useNetworkMismatch();
  const [, switchNetwork] = useNetwork();

  const {
    mutate: createDirectListing,
    isLoading: isLoadingDirect,
    error: errorDirect,
  } = useCreateDirectListing(marketplaceContract);
  const {
    mutate: createAuctionListing,
    isLoading: isLoadingAuction,
    error: errorAuction,
  } = useCreateAuctionListing(marketplaceContract);

  // handleCreateListing is called when the form is submitted.
  // User has provided: contract address, token id, type of listing (either auction or direct), price of NFT.
  const handleCreateListing = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    // Check if user on correct network. If not switch to correct network.
    if (networkMismatch) {
      switchNetwork && switchNetwork(network);
      return;
    }
    if (!selectedNft) return;

    const target = e.target as typeof e.target & {
      elements: { listingType: { value: string }; price: { value: string } };
    };

    const { listingType, price } = target.elements;

    if (listingType.value === "directListing") {
      createDirectListing(
        {
          assetContractAddress: process.env.NEXT_PUBLIC_COLLECTION_CONTRACT!,
          tokenId: selectedNft.metadata.id,
          currencyContractAddress: NATIVE_TOKEN_ADDRESS,
          listingDurationInSeconds: 60 * 60 * 24 * 7, //1 week
          quantity: 1,
          buyoutPricePerToken: price.value,
          startTimestamp: new Date(),
        },
        {
          onSuccess(data, variables, context) {
            console.log("Success:", data, variables, context);
            toast.success("Direct Listing successfully created!");
            router.push("/");
          },
          onError(error, variables, context) {
            console.log("Error:", error, variables, context);
            toast.error("Error: Creating Direct Listing failed!");
            router.push("/");
          },
        }
      );
    }
    if (listingType.value === "auctionListing") {
      createAuctionListing(
        {
          assetContractAddress: process.env.NEXT_PUBLIC_COLLECTION_CONTRACT!,
          tokenId: selectedNft.metadata.id,
          currencyContractAddress: NATIVE_TOKEN_ADDRESS,
          listingDurationInSeconds: 60 * 60 * 24 * 7, //1 week
          quantity: 1,
          startTimestamp: new Date(),
          buyoutPricePerToken: price.value,
          reservePricePerToken: 0,
        },
        {
          onSuccess(data, variables, context) {
            console.log("Success:", data, variables, context);
            toast.success("Auction Listing successfully created!");
            router.push("/");
          },
          onError(error, variables, context) {
            console.log("Error:", error, variables, context);
            toast.error("Error: Creating Auction Listing failed!");
            router.push("/");
          },
        }
      );
    }
  };
  return (
    <div>
      <Header />
      <main className="max-w-6xl mx-auto p-10 border">
        <h1 className="text-4xl font-bold">List an Item</h1>
        <h2 className="text-xl font-semibold pt-5">
          Select an Item you would like to Sell
        </h2>
        <hr className="mb-5" />
        <p>Below you will find the NFT's you own in your wallet</p>
        <div className="flex overflow-x-scroll space-x-2 p-4">
          {ownedNfts?.data?.map((nft) => (
            <div
              key={nft.metadata.id}
              className={`flex flex-col space-y-2 card min-w-fit border-2 bg-gray-100 ${
                nft.metadata.id === selectedNft?.metadata.id
                  ? "border-black"
                  : "border-transparent"
              }`}
              onClick={() => setSelectedNft(nft)}
            >
              <MediaRenderer
                src={nft.metadata.image}
                className="h-48 rounded-lg"
              />
              <p className="text-lg truncate font-bold">{nft.metadata.name}</p>
              <p className="text-sm truncate">{nft.metadata.description}</p>
            </div>
          ))}
        </div>

        {selectedNft && (
          <form onSubmit={handleCreateListing}>
            <div className="flex flex-col p-10">
              <div className="grid grid-cols-2 gap-5">
                <label className="border-r font-light">
                  Direct Listing / Fixed Price
                </label>
                <input
                  type="radio"
                  name="listingType"
                  value="directListing"
                  className="ml-auto h-10 w-10"
                />
                <label className="border-r font-light">Auction</label>
                <input
                  type="radio"
                  name="listingType"
                  value="auctionListing"
                  className="ml-auto h-10 w-10"
                />

                <label className="border-r font-light">Price</label>
                <input
                  type="text"
                  className="bg-gray-100 p-5"
                  placeholder="0.05"
                  name="price"
                />
              </div>
              <button
                className="bg-blue-600 text-white rounded-lg p-4 mt-8"
                type="submit"
              >
                Create Listing
              </button>
            </div>
          </form>
        )}
      </main>
    </div>
  );
}

export default create;

```

### In pages/create.tsx:

```
import React, { FormEvent, useState } from "react";
import { Header } from "../components";
import { useContract, useAddress } from "@thirdweb-dev/react";
import Image from "next/image";
import { useRouter } from "next/router";
import toast from "react-hot-toast";

type Props = {};

function addItem({}: Props) {
  const router = useRouter();
  const address = useAddress();
  const { contract } = useContract(
    process.env.NEXT_PUBLIC_COLLECTION_CONTRACT,
    "nft-collection"
  );
  //   console.log(contract);
  //   console.log(address);
  const [preview, setPreview] = useState<string>();
  const [image, setImage] = useState<File>();

  const mintNft = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    // console.log("mintNft Clicked!");

    if (!contract || !address) return;
    if (!image) {
      alert("Please select an image!");
      return;
    }
    const target = e.target as typeof e.target & {
      name: { value: string };
      description: { value: string };
    };
    const metadata = {
      name: target.name.value,
      description: target.description.value,
      image: image,
    };

    try {
      toast("Minting NFT...");
      const tx = await contract.mintTo(address, metadata);
      const receipt = tx.receipt; // transaction receipt
      const tokenId = tx.id; //id of NFT minted
      const nft = await tx.data(); //(optional) fetch details of minted NFT
      console.log(receipt, tokenId, nft);
      toast.success("NFT minted successfully!");
      router.push("/");
    } catch (error) {
      console.error(error);
      toast.error("NFT minting failed!");
    }
  };
  return (
    <div>
      <Header />
      <main className="max-w-6xl mx-auto p-10 border">
        <h1 className="text-4xl font-bold">Add an item to the Marketplace</h1>
        <h2 className="text-xl font-semibold pt-5">Item Details</h2>
        <p className="pb-5">
          By adding an item to the marketplace, you're essentially Minting an
          NFT of the item into your wallet which we can then list for sale!
        </p>
        <div className="flex flex-col justify-center items-center md:flex-row md:space-x-5 pt-5">
          <Image
            className="border object-contain"
            src={preview || "/product-image-placeholder.png"}
            alt="product placeholder image"
            width={320}
            height={320}
          />
          <form
            onSubmit={mintNft}
            className="flex flex-col flex-1 p-2 space-y-2"
          >
            <label className="font-light">Name of Item</label>
            <input
              className="formField"
              placeholder="Name of Item..."
              type="text"
              name="name"
              id="name"
            />
            <label className="font-light">Description</label>
            <input
              className="formField"
              placeholder="Enter Description..."
              type="text"
              name="description"
              id="description"
            />
            <label className="font-light">Image of the Item</label>
            <input
              type="file"
              className="pb-5"
              onChange={(e) => {
                if (e.target.files?.[0])
                  setPreview(URL.createObjectURL(e.target.files[0]));
                setImage(e.target.files?.[0]);
              }}
            />
            <button
              type="submit"
              className="bg-blue-600 font-bold text-white rounded-full py-4 px-10 w-56 md:mt-auto mx-auto  md:ml-auto"
            >
              Add / Mint Item
            </button>
          </form>
        </div>
      </main>
    </div>
  );
}

export default addItem;

```
