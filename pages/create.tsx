import React, { FormEvent, useState } from "react";
import { Header } from "../components";
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
  // Next JS Router hook to redirect to other pages
  const router = useRouter();
  // Connect to our marketplace contract
  const { contract: marketplaceContract } = useContract(
    process.env.NEXT_PUBLIC_MARKETPLACE_CONTRACT,
    "marketplace"
  );
  // Hook for checking whether the connected wallet is on the correct network specified by the desiredChainId passed to the <ThirdwebProvider />.
  const isNetworkMismatched = useNetworkMismatch();
  // Hook for getting metadata about the network the current wallet is connected to and switching networks
  const [, switchNetwork] = useNetwork();

  const [selectedNft, setSelectedNft] = useState<NFT>();
  const address = useAddress();
  const { contract: collectionContract } = useContract(
    process.env.NEXT_PUBLIC_COLLECTION_CONTRACT,
    "nft-collection"
  );

  //   console.log("The Address is:", address);
  const ownedNfts = useOwnedNFTs(collectionContract, address);
  //   console.log(ownedNfts);
  // console.log(selectedNft);

  // Use this to create a new Direct Listing on your marketplace contract.
  const { mutate: createDirectListing } =
    useCreateDirectListing(marketplaceContract);
  // Use this to create a new Auction Listing on your marketplace contract.
  const { mutate: createAuctionListing } =
    useCreateAuctionListing(marketplaceContract);

  // handleCreateListing is called when the form is submitted.
  // User has provided: contract address, token id, type of listing (either auction or direct), price of NFT.
  const handleCreateListing = async (e: FormEvent<HTMLFormElement>) => {
    try {
      // Check if user on correct network. If not switch to correct network.
      if (isNetworkMismatched) {
        switchNetwork && switchNetwork(network);
        return;
      }

      // Prevent page from refreshing
      e.preventDefault();

      if (!selectedNft) return;

      const target = e.target as typeof e.target & {
        elements: { listingType: { value: string }; price: { value: string } };
      };
      // De-construct data from form submission
      const { listingType, price } = target.elements;

      // Depending on the type of listing selected, call the appropriate function:

      // For Direct Listings:
      const directListingData = {
        assetContractAddress: process.env.NEXT_PUBLIC_COLLECTION_CONTRACT!, // Contract Address of the NFT
        buyoutPricePerToken: price.value, // Maximum price, the auction will end immediately if a user pays this price.
        currencyContractAddress: NATIVE_TOKEN_ADDRESS, // NATIVE_TOKEN_ADDRESS is the crpyto curency that is native to the network. e.g. ETH, MATIC.
        listingDurationInSeconds: 60 * 60 * 24 * 7, // When the auction will be closed and no longer accept bids (1 Week)
        quantity: 1, // How many of the NFTs are being listed (useful for ERC 1155 tokens)
        startTimestamp: new Date(), // When the listing will start
        tokenId: selectedNft.metadata.id, // Token ID of the NFT.
      };

      if (listingType.value === "directListing") {
        createDirectListing(directListingData, {
          onSuccess(data, variables, context) {
            console.log("Success:", data, variables, context);
            alert("Direct Listing successfully created!");
            // If the transaction succeeds, take the user back to the homepage to view their listing!
            router.push("/");
          },
          onError(error, variables, context) {
            console.log("Error:", error, variables, context);
            alert("Error: Creating Direct Listing failed!");
            // If the transaction fails, take the user back to the homepage!
            router.push("/");
          },
        });
      }

      // For Auction Listings:
      const auctionListingData = {
        assetContractAddress: process.env.NEXT_PUBLIC_COLLECTION_CONTRACT!, // Contract Address of the NFT
        buyoutPricePerToken: price.value, // Maximum price, the auction will end immediately if a user pays this price.
        currencyContractAddress: NATIVE_TOKEN_ADDRESS, // NATIVE_TOKEN_ADDRESS is the crpyto curency that is native to the network. e.g. ETH, MATIC.
        listingDurationInSeconds: 60 * 60 * 24 * 7, // When the auction will be closed and no longer accept bids (1 Week)
        quantity: 1, // How many of the NFTs are being listed (useful for ERC 1155 tokens)
        reservePricePerToken: 0, // Minimum price, users cannot bid below this amount
        startTimestamp: new Date(), // When the listing will start
        tokenId: selectedNft.metadata.id, // Token ID of the NFT.
      };

      if (listingType.value === "auctionListing") {
        createAuctionListing(auctionListingData, {
          onSuccess(data, variables, context) {
            console.log("Success:", data, variables, context);
            alert("Auction Listing successfully created!");
            router.push("/");
          },
          onError(error, variables, context) {
            console.log("Error:", error, variables, context);
            alert("Error: Creating Auction Listing failed!");
            router.push("/");
          },
        });
      }
    } catch (error) {
      console.error(error);
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
              {/* Toggle between direct listing and auction listing */}
              <div className="grid grid-cols-2 gap-5">
                <label className="border-r font-light">
                  Direct Listing / Fixed Price
                </label>
                <input
                  type="radio"
                  name="listingType"
                  id="directListing"
                  value="directListing"
                  defaultChecked
                  className="ml-auto h-10 w-10"
                />
                <label className="border-r font-light">Auction</label>
                <input
                  type="radio"
                  name="listingType"
                  id="auctionListing"
                  value="auctionListing"
                  className="ml-auto h-10 w-10"
                />
                {/* Sale Price For Listing Field */}
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
