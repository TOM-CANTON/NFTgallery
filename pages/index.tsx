import Head from 'next/head'
import Image from 'next/image'
import { useState, useEffect } from 'react'
import { NFTCard } from "./components/nftcard"

const Home = () => {
  const [wallet, setWalletAddress] = useState("");
  const [collection, setCollectionAddress] = useState("");
  const [NFTs, setNFTs] = useState([]);
  const [pages, setPages] = useState(0);
  const [loadPage, setLoadPage] = useState(1);
  const [nftChunk, setNftChunk] = useState([]);
  const [fetchForCollection, setFetchForCollection] = useState(false);

  const fetchNFTs = async () => {
    let nfts;
    console.log("fetching nfts");
    const api_key = "A8A1Oo_UTB9IN5oNHfAc2tAxdR4UVwfM"
    const baseURL = `https://eth-mainnet.alchemyapi.io/v2/${api_key}/getNFTs/`;

    if (!collection.length) {
      var requestOptions = {
        method: 'GET'
      };

      const fetchURL = `${baseURL}?owner=${wallet}`;

      nfts = await fetch(fetchURL, requestOptions).then(data => data.json())
    } else {
      console.log("fetching nfts for collection owned by address")
      const fetchURL = `${baseURL}?owner=${wallet}&contractAddresses%5B%5D=${collection}`;
      nfts = await fetch(fetchURL, requestOptions).then(data => data.json())
    }

    if (nfts) {
      console.log("nfts:", nfts)
      setNFTs(nfts.ownedNfts)
      setPages(0);
      setLoadPage(1);
    }
  }

  const fetchNFTsForCollection = async () => {
    if (collection.length) {
      var requestOptions = {
        method: 'GET'
      };
      const api_key = "A8A1Oo_UTB9IN5oNHfAc2tAxdR4UVwfM"
      const baseURL = `https://eth-mainnet.alchemyapi.io/v2/${api_key}/getNFTsForCollection/`;
      const fetchURL = `${baseURL}?contractAddress=${collection}&withMetadata=${"true"}`;
      const nfts = await fetch(fetchURL, requestOptions).then(data => data.json())
      if (nfts) {
        console.log("NFTs in collection:", nfts)
        setNFTs(nfts.nfts);
        setPages(0);
        setLoadPage(1);
      }
    }
  }

  useEffect(() => {
    const loadSelectedPageData = (page) => {
      console.log("-----------loadSelectedPageData--------------");
      let start = (page - 1) * 10;
      let end = start + 9;
      let nftChunk = NFTs.slice(start, end);
      console.log('----NFTS:', NFTs)
      console.log('----nftChunk:', nftChunk)
      setNftChunk(nftChunk);
      setPages(Math.ceil(NFTs.length / 10));
    }
    loadSelectedPageData(loadPage);
  }, [NFTs, loadPage]);


  return (
    <div>
      <div>
        <input disabled={fetchForCollection} onChange={(e)=>{setWalletAddress(e.target.value)}} value={wallet} type={"text"} placeholder="Add your wallet address"></input>
        <input onChange={(e)=>{setCollectionAddress(e.target.value)}} value={collection} type={"text"} placeholder="Add the collection address"></input>
        <label ><input onChange={(e)=>{setFetchForCollection(e.target.checked)}} type={"checkbox"} className="mr-2"></input>Fetch for collection</label>
        <button onClick={
          () => {
            if (fetchForCollection) {
              fetchNFTsForCollection()
            } else fetchNFTs()
          }
        }>Let's go! </button>
      </div>
      <div>
        {
          nftChunk.length && nftChunk.map((nft, i) => {
            return (
              <NFTCard key={i} nft={nft}></NFTCard>
            )
          })
        }
      </div>
      <div>
        {
          pages > 0 && (
            [...Array(pages)].map((elementInArray, index) => ( 
              (index+1) == loadPage ? (
                  <button  key={index} onClick={() => {setLoadPage(index+1)}}>{index+1}</button>
              ):(
                  <button  key={index} onClick={() => {setLoadPage(index+1)}}>{index+1}</button>
              )
              ))
          )
        }
      </div>
    </div>
  )
}

export default Home