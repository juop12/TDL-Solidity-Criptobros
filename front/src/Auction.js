import React, { useEffect, useState } from 'react';
import './Auction.css';
import Moralis from 'moralis';
import axios from 'axios';

function Auction() {
  const [address, setAddress] = useState('');
  const [imageURL, setImageURL] = useState('');
  const [bid, setBid] = useState('');

  useEffect(() => {
    const fetchImage = async () => {
      try {
        const responseImage = await axios.post('https://api.defender.openzeppelin.com/autotasks/d1c6bf30-0112-43a9-9352-bc978df633ab/runs/webhook/16764d23-28d5-46ba-a418-c064f2089339/LT7R5XRK72KshopDm25Cos');
        const resultImage = JSON.parse(responseImage.data.result);
        const url = JSON.parse(resultImage.body.message);
        const responseIpfs = await axios.get(url);
        const image_url = responseIpfs.data.image;
        const trimmedString = image_url.split('://')[1];
        const concatenatedUrl = "https://ipfs.io/ipfs/" + trimmedString;
        setImageURL(concatenatedUrl);
      } catch (error) {
        console.error('Error getting image:', error);
      }
    };

    const fetchBid = async () => {
      try {
        const responseBid = await axios.post('https://api.defender.openzeppelin.com/autotasks/53727e70-9b63-4c3f-b08f-df347928bea7/runs/webhook/16764d23-28d5-46ba-a418-c064f2089339/MC9XoNL6zhuqeW5fTKFR4p');
        console.log(responseBid);
        const resultBid = JSON.parse(responseBid.data.result);
        const bidObject = JSON.parse(resultBid.body.message);
        //const bidString = JSON.stringify(bidObject);
        //setBid(bidString);
      } catch (error) {
        console.error('Error getting bid:', error);
      }
    };
    

    fetchImage();
    fetchBid();
  }, [bid]);

  const handleAddressChange = (event) => {
    setAddress(event.target.value);
  };

  const handleBidChange = (event) => {
    setBid(event.target.value);
  };

  return (
    <div className="auction-page">
      <div className="titleAuction">
        <span className="title-textAuction">Auction</span>
      </div>

      <div className="image-container-auction">
        {imageURL && <img src={imageURL} alt="Imagen" />}
      </div>

      <div className="max-bidder-display">
        MAX BIDDER:
        {bid && <span className="max-bidder">{bid}</span>}
      </div>

      <div className="balance-display">
        BALANCE:
        {/* Agrega aquí el código para mostrar el máximo postor */}
      </div>

      <div className="input-container">
        {/* Add a container for the address input field */}
        <input
          value={address}
          onChange={handleAddressChange}
          className="input-field"
          placeholder="Wallet Address"
        />
      </div>
      <div className="input-container">
        {/* Add a container for the address input field */}
        <input
          value={address}
          onChange={handleBidChange}
          className="input-field"
          placeholder="Bid Amount"
        />
      </div>

      <div className="button-container">
        <button className="big-button">
          Bid
        </button>
      </div>
    </div>
  );
}

export default Auction;
