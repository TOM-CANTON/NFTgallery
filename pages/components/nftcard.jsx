import React, { useState } from 'react';

export const NFTCard = ({ nft }) => {

  const [copySuccess, setCopySuccess] = useState('');

  function copyToClipboard(e) {
    copyTextToClipboard();
    e.target.focus();
    setCopySuccess('Copied!');
  };

  async function copyTextToClipboard() {
    try {
      await navigator.clipboard.writeText(nft.contract.address);
      console.log('Text copied to clipboard');
    } catch (err) {
      console.error('Error in copying text: ', err);
    }
  }

  return (
    <div>
      <div>
        <img src={nft.media[0].gateway} ></img>
      </div>
      <div>
        <div>
          <h2>{nft.title}</h2>
          <p>Id: {nft.id.tokenId.substr(nft.id.tokenId.length - 4)}</p>
          <p>{`${nft.contract.address.substr(0, 4)}...${nft.contract.address.substr(nft.contract.address.length - 4)}`}</p>
          <button onClick={copyToClipboard}>Copy</button>
          <br />
          {copySuccess}
        </div>

        <div>
          <p>{nft.description?.substr(0, 150)}</p>
        </div>
        <div>
          <a target={"_blank"} href={`https://etherscan.io/token/${nft.contract.address}`}>View on etherscan</a>
        </div>
      </div>

    </div>
  )
}