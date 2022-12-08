import { UserCircleIcon } from "@heroicons/react/24/solid";
import {
  useAddress,
  MediaRenderer,
  useContract,
  useListing,
  useNetwork,
  useNetworkMismatch,
  useBuyNow,
  useMakeOffer,
  useOffers,
  useMakeBid,
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
  // Next JS Router hook to redirect to other pages and to grab the query from the URL (listingId)
  const router = useRouter();

  // De-construct listingId out of the router.query.
  // This means that if the user visits /listing/0 then the listingId will be 0.
  // If the user visits /listing/1 then the listingId will be 1.
  // We do some weird TypeScript casting, because Next.JS thinks listingId can be an array for some reason.
  const { listingId } = router.query as { listingId: string };

  // Store the bid amount the user entered into the bidding textbox
  const [bidAmount, setBidAmount] = useState("");

  // Initialize the marketplace contract
  const { contract: marketplaceContract } = useContract(
    process.env.NEXT_PUBLIC_MARKETPLACE_CONTRACT,
    "marketplace"
  );

  // useListing is used to get a specific listing from the marketplace
  const { data: listing, isLoading: isListingLoading } = useListing(
    marketplaceContract,
    listingId
  );
  console.log({ listing });

  const isNetworkMismatch = useNetworkMismatch();
  const [, switchNetwork] = useNetwork();

  ////////

  const address = useAddress();
  console.log({ address });
  const [minimumNextBid, setMinimumNextBid] = useState<{
    displayValue: string;
    symbol: string;
  }>();

  // Direct Listing Type:
  // useBuyNow() is used to buy out an auction listing from your marketplace contract.
  const { mutate: buyNow } = useBuyNow(marketplaceContract);
  // useMakeOffer is used to make an offer on direct or auction listing from your marketplace contract.
  const { mutate: makeOffer } = useMakeOffer(marketplaceContract);
  // useOffers is used to get all the offers for a listing
  const { data: offers } = useOffers(marketplaceContract, listingId);
  console.log({ offers });

  // Auction Listing Type:
  // useMakeBid is used to place a bid on an auction listing from your marketplace contract.
  const { mutate: makeBid } = useMakeBid(marketplaceContract);
  // Accept an offer on a direct listing from an offeror, will accept the latest offer by the given offeror.
  const { mutate: acceptOffer } =
    useAcceptDirectListingOffer(marketplaceContract);

  // For Auction ListingType
  useEffect(() => {
    if (!listingId || !marketplaceContract || !listing) return;
    if (listing.type === ListingType.Auction) {
      fetchMinimumNextBid();
    }
  }, [listingId, listing, marketplaceContract, bidAmount]);

  console.log(minimumNextBid);

  const fetchMinimumNextBid = async () => {
    if (!listingId || !marketplaceContract) return;
    const { displayValue, symbol } =
      await marketplaceContract.auction.getMinimumNextBid(listingId);
    console.log(displayValue, symbol);

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

    // Check if user on correct network. If not switch to correct network.
    if (isNetworkMismatch) {
      switchNetwork && switchNetwork(network);
      return;
    }
    if (!listingId || !marketplaceContract || !listing) return;

    buyNow(
      { id: listingId, buyAmount: 1, type: listing.type },

      {
        onSuccess(data, variables, context) {
          alert("NFT bought successfully!");
          toast.success("NFT bought successfully!");
          console.log("Success:", data, variables, context);
          router.replace("/");
        },
        onError(error, variables, context) {
          alert("ERROR: NFT  could not be bought!");
          toast.error("ERROR: NFT  could not be bought!");
          console.log("Error:", error, variables, context);
        },
      }
    );
  };

  // Creating A Bid / Offer
  const createBidOrOffer = async () => {
    try {
      // Check if user on correct network. If not switch to correct network.
      if (isNetworkMismatch) {
        switchNetwork && switchNetwork(network);
        return;
      }

      // If the listing type is a direct listing, then we can create an offer.
      if (listing?.type === ListingType.Direct) {
        console.log("Making Offer...");
        // if buyout price is equal to bid amount then trigger "Buy now".
        if (
          ethers.utils.parseEther(bidAmount).toString() ===
          listing.buyoutPrice.toString()
        ) {
          console.log("Buyout Price met, buying NFT...");
          alert("Buyout Price met, buying NFT...");
          buyNft();
          return;
        } else {
          // if buyout price is NOT equal to bid amount then trigger "make offer"
          console.log("Buyout Price not met, making offer...");
          alert("Buyout Price not met, making offer...");

          // Create an offer on a direct listing:
          makeOffer(
            {
              listingId: listingId, // The listing ID of the asset you want to offer on
              quantity: 1, // The quantity of tokens you want to receive for this offer
              pricePerToken: bidAmount, // The price you are willing to offer per token
            },
            {
              onSuccess(data, variables, context) {
                alert("Offer made successfully!");
                toast.success("Offer made successfully!");
                console.log("Success:", data, variables, context);
                setBidAmount("");
                router.replace("/");
              },
              onError(error, variables, context) {
                alert("ERROR: Offer  could not be made!");
                toast.error("ERROR: Offer  could not be made!");
                console.log("Error:", error, variables, context);
                router.replace("/");
              },
            }
          );
        }
      }

      // If the listing type is an auction listing, then we can create a bid.
      if (listing?.type === ListingType.Auction) {
        console.log("Making Bid...");
        // if buyout price is equal to bid amount then trigger "Buy now".
        if (
          ethers.utils.parseEther(bidAmount).toString() ===
          listing.buyoutPrice.toString()
        ) {
          console.log("Buyout Price met, buying NFT...");
          alert("Buyout Price met, buying NFT...");
          buyNft();
          return;
        } else {
          // if buyout price is NOT equal to bid amount then trigger "makeBid"
          console.log("Buyout Price not met, making bid...");
          alert("Buyout Price not met, making bid...");

          makeBid(
            {
              listingId: listingId,
              bid: bidAmount,
            },
            {
              onSuccess(data, variables, context) {
                alert("Bid made successfully!");
                toast.success("Bid made successfully!");
                console.log("Success:", data, variables, context);
                setBidAmount("");
                router.replace("/");
              },
              onError(error, variables, context) {
                alert("ERROR: Bid  could not be made!");
                toast.error("ERROR: Bid  could not be made!");
                console.log("Error:", error, variables, context);
                router.replace("/");
              },
            }
          );
        }
      }
    } catch (error) {
      console.error(error);
    }
  };

  if (isListingLoading)
    return (
      <div>
        <Header />
        <div className="text-center animate-pulse text-blue-500">
          <p>Loading Item...</p>
        </div>
      </div>
    );

  if (!listingId || !marketplaceContract) {
    return;
  }

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
                  <div className="flex items-center space-x-4">
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
                                // alert("Offer accepted successfully!");
                                toast.success("Offer accepted successfully!");
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
              value={bidAmount}
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
