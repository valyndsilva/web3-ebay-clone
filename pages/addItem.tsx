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
      description: target.description?.value,
      image: image,
    };

    const notification = toast.loading("Minting NFT...");

    try {
      const tx = await contract.mintTo(address, metadata);
      toast.success("NFT minted successfully!", {
        id: notification,
        duration: 6000,
      });
      const receipt = tx.receipt; // transaction receipt
      const tokenId = tx.id; //id of NFT minted
      const nft = await tx.data(); //(optional) fetch details of minted NFT
      console.log(receipt, tokenId, nft);
      router.push("/");
    } catch (error) {
      toast.error("NFT minting failed!", { id: notification, duration: 6000 });
      console.error(error);
    } finally {
      toast.dismiss(notification);
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
